import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingQueryDto } from './dto/booking-query.dto';
import { generateBookingRef, generateTicketRef, generatePaymentRef, generateOrderRef } from '../../common/utils/generate-ref';
import { SeatLockGateway } from '../realtime/seat-lock.gateway';
import { BookingStatus, PaymentStatus, TicketStatus, AuditAction } from '@prisma/client';
import * as qrcode from 'qrcode';

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
    private seatLockGateway: SeatLockGateway,
  ) {}

  async create(userId: string, dto: CreateBookingDto) {
    const showtime = await this.prisma.showtime.findUnique({
      where: { id: dto.showtimeId },
      include: { movie: true, hall: true },
    });

    if (!showtime) throw new NotFoundException('Showtime not found');
    if (showtime.status === 'CANCELLED' || showtime.status === 'FINISHED') {
      throw new BadRequestException('Showtime is no longer available');
    }
    if (new Date() > showtime.startTime) {
      throw new BadRequestException('Showtime has already started');
    }

    if (!dto.seatIds || dto.seatIds.length === 0) {
      throw new BadRequestException('At least one seat must be selected');
    }

    const seats = await this.prisma.seat.findMany({
      where: { id: { in: dto.seatIds }, hallId: showtime.hallId },
    });

    if (seats.length !== dto.seatIds.length) {
      throw new BadRequestException('Some seats not found in this hall');
    }

    const bookedSeatIds = (
      await this.prisma.bookingSeat.findMany({
        where: {
          booking: {
            showtimeId: dto.showtimeId,
            status: { in: ['PENDING', 'CONFIRMED'] },
          },
          seatId: { in: dto.seatIds },
        },
      })
    ).map((bs) => bs.seatId);

    if (bookedSeatIds.length > 0) {
      throw new ConflictException(`Seats ${bookedSeatIds.join(', ')} are already booked`);
    }

    const lockedSeats = await this.prisma.seatLock.findMany({
      where: {
        showtimeId: dto.showtimeId,
        seatId: { in: dto.seatIds },
        isActive: true,
        expiresAt: { gt: new Date() },
        userId: { not: userId },
      },
    });

    if (lockedSeats.length > 0) {
      throw new ConflictException('Some seats are locked by another user');
    }

    const baseAmount = seats.length * Number(showtime.price);
    let discountAmount = 0;

    if (dto.promotionCode) {
      const promotion = await this.prisma.promotion.findUnique({
        where: { code: dto.promotionCode },
      });

      if (!promotion || !promotion.isActive) {
        throw new BadRequestException('Invalid promotion code');
      }

      if (new Date() < promotion.startsAt || new Date() > promotion.expiresAt) {
        throw new BadRequestException('Promotion has expired');
      }

      if (promotion.usageLimit && promotion.usedCount >= promotion.usageLimit) {
        throw new BadRequestException('Promotion usage limit reached');
      }

      if (promotion.minAmount && baseAmount < Number(promotion.minAmount)) {
        throw new BadRequestException(`Minimum amount ${promotion.minAmount} not met`);
      }

      if (promotion.type === 'PERCENTAGE') {
        discountAmount = baseAmount * (Number(promotion.value) / 100);
        if (promotion.maxDiscount) {
          discountAmount = Math.min(discountAmount, Number(promotion.maxDiscount));
        }
      } else if (promotion.type === 'FIXED') {
        discountAmount = Number(promotion.value);
      }

      await this.prisma.promotion.update({
        where: { id: promotion.id },
        data: { usedCount: { increment: 1 } },
      });
    }

    const finalAmount = Math.max(0, baseAmount - discountAmount);

    const bookingRef = generateBookingRef();

    const booking = await this.prisma.$transaction(async (tx) => {
      const newBooking = await tx.booking.create({
        data: {
          bookingRef,
          userId,
          showtimeId: dto.showtimeId,
          totalAmount: baseAmount,
          discountAmount,
          finalAmount,
          status: 'PENDING',
          bookingSeats: {
            create: seats.map((seat) => ({
              seatId: seat.id,
              price: showtime.price,
            })),
          },
        },
        include: {
          bookingSeats: { include: { seat: true } },
          showtime: {
            include: { movie: true, hall: true, cinema: true },
          },
        },
      });

      await tx.seatLock.deleteMany({
        where: {
          showtimeId: dto.showtimeId,
          seatId: { in: dto.seatIds },
          userId,
        },
      });

      return newBooking;
    });

    this.seatLockGateway.broadcastSeatLocked(dto.showtimeId, dto.seatIds);
    this.seatLockGateway.broadcastBookingUpdate(booking);

    return booking;
  }

  async findAll(query: BookingQueryDto, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (query.userId) where.userId = query.userId;
    if (query.showtimeId) where.showtimeId = query.showtimeId;
    if (query.status) where.status = query.status;

    const [data, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        skip,
        take: limit,
        include: {
          bookingSeats: { include: { seat: true } },
          showtime: {
            include: { movie: { select: { title: true, posterUrl: true, duration: true } }, cinema: true, hall: true },
          },
          payment: true,
          ticket: true,
          promotion: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.booking.count({ where }),
    ]);

    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        bookingSeats: { include: { seat: true } },
        showtime: {
          include: { movie: true, cinema: true, hall: true },
        },
        payment: true,
        ticket: true,
        promotion: true,
        user: { select: { id: true, fullName: true, email: true, phone: true } },
      },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  async findByUser(userId: string, page = 1, limit = 10) {
    return this.findAll({ userId }, page, limit);
  }

  async findByReference(ref: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { bookingRef: ref },
      include: {
        bookingSeats: { include: { seat: true } },
        showtime: { include: { movie: true, cinema: true, hall: true } },
        payment: true,
        ticket: true,
        promotion: true,
      },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  async cancelBooking(id: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { payment: true },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.userId !== userId) {
      throw new BadRequestException('You can only cancel your own bookings');
    }
    if (booking.status === 'CANCELLED') {
      throw new BadRequestException('Booking is already cancelled');
    }
    if (booking.status === 'REFUNDED') {
      throw new BadRequestException('Booking has already been refunded');
    }
    if (booking.showtimeId && new Date() > (await this.prisma.showtime.findUnique({ where: { id: booking.showtimeId } }))?.startTime!) {
      throw new BadRequestException('Cannot cancel past showtime');
    }

    const updateData: any = { status: 'CANCELLED', cancelledAt: new Date() };

    if (booking.payment && booking.payment.status === 'PAID') {
      updateData.status = 'REFUNDED';
    }

    const updated = await this.prisma.booking.update({
      where: { id },
      data: updateData,
    });

    if (booking.payment && booking.payment.status === 'PAID') {
      await this.prisma.payment.update({
        where: { id: booking.payment.id },
        data: { status: 'REFUNDED' },
      });
    }

    const seatIds = (await this.prisma.bookingSeat.findMany({ where: { bookingId: id }, select: { seatId: true } })).map(bs => bs.seatId);
    this.seatLockGateway.broadcastSeatReleased(booking.showtimeId, seatIds);

    await this.prisma.auditLog.create({
      data: {
        userId,
        action: booking.payment?.status === 'PAID' ? AuditAction.REFUND : AuditAction.UPDATE,
        entity: 'Booking',
        entityId: id,
        oldValue: { status: booking.status },
        newValue: { status: updateData.status },
      },
    });

    return updated;
  }

  async getBookingSummary(userId: string) {
    const [totalBookings, activeBookings, cancelledBookings, totalSpent] = await Promise.all([
      this.prisma.booking.count({ where: { userId } }),
      this.prisma.booking.count({ where: { userId, status: 'CONFIRMED' } }),
      this.prisma.booking.count({ where: { userId, status: 'CANCELLED' } }),
      this.prisma.booking.aggregate({
        where: { userId, status: 'CONFIRMED' },
        _sum: { finalAmount: true },
      }),
    ]);

    return {
      totalBookings,
      activeBookings,
      cancelledBookings,
      totalSpent: totalSpent._sum.finalAmount || 0,
    };
  }
}
