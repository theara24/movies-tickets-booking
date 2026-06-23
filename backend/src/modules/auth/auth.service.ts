import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../database/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuditAction } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly MAX_FAILED_ATTEMPTS = 5;
  private readonly LOCK_DURATION_MS = 15 * 60 * 1000;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        fullName: dto.fullName,
        phone: dto.phone,
        role: dto.role || 'CUSTOMER',
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
      },
    });

    if (user.role === 'CUSTOMER') {
      await this.prisma.customer.create({
        data: { userId: user.id },
      });
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    await this.updateRefreshToken(user.id, tokens.refreshToken);

    await this.createAuditLog({
      userId: user.id,
      action: AuditAction.CREATE,
      entity: 'User',
      entityId: user.id,
    });

    return { user, ...tokens };
  }

  async login(dto: LoginDto, ip?: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new ForbiddenException('Account is deactivated');
    }

    if (user.isLocked) {
      if (user.lockUntil && user.lockUntil > new Date()) {
        throw new ForbiddenException(
          `Account locked until ${user.lockUntil.toISOString()}`,
        );
      }
      await this.prisma.user.update({
        where: { id: user.id },
        data: { isLocked: false, failedAttempts: 0, lockUntil: null },
      });
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      await this.handleFailedAttempt(user.id, user.failedAttempts);
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { failedAttempts: 0, lastLoginAt: new Date() },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    await this.createAuditLog({
      userId: user.id,
      action: AuditAction.LOGIN,
      entity: 'User',
      entityId: user.id,
      ip,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      ...tokens,
    };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access denied');
    }

    const rtMatches = refreshToken === user.refreshToken;
    if (!rtMatches) {
      throw new ForbiddenException('Invalid refresh token');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    await this.createAuditLog({
      userId,
      action: AuditAction.LOGOUT,
      entity: 'User',
      entityId: userId,
    });
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isOldPasswordValid = await bcrypt.compare(
      dto.oldPassword,
      user.password,
    );
    if (!isOldPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 12);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword, refreshToken: null },
    });

    return { message: 'Password changed successfully' };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { message: 'If the email exists, a reset link has been sent' };
    }

    const resetToken = this.jwtService.sign(
      { sub: user.id, email: user.email, type: 'reset_password' },
      { secret: this.configService.get('JWT_ACCESS_SECRET'), expiresIn: '15m' },
    );

    // In production, send email with reset token
    // For now, return token in response
    return { message: 'Reset link sent', resetToken };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
      });

      if (payload.type !== 'reset_password') {
        throw new BadRequestException('Invalid reset token');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);

      await this.prisma.user.update({
        where: { id: payload.sub },
        data: { password: hashedPassword, refreshToken: null },
      });

      return { message: 'Password reset successfully' };
    } catch {
      throw new BadRequestException('Invalid or expired reset token');
    }
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get('JWT_ACCESS_EXPIRES') || '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES') || '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }

  private async handleFailedAttempt(userId: string, currentAttempts: number) {
    const newAttempts = currentAttempts + 1;
    const updateData: any = { failedAttempts: newAttempts };

    if (newAttempts >= this.MAX_FAILED_ATTEMPTS) {
      updateData.isLocked = true;
      updateData.lockUntil = new Date(Date.now() + this.LOCK_DURATION_MS);
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
  }

  private async createAuditLog(data: {
    userId: string;
    action: AuditAction;
    entity: string;
    entityId: string;
    ip?: string;
  }) {
    await this.prisma.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        entity: data.entity,
        entityId: data.entityId,
        ip: data.ip,
      },
    });
  }
}
