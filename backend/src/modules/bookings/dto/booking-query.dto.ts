import { IsOptional, IsString, IsEnum } from 'class-validator';
import { BookingStatus } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class BookingQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  showtimeId?: string;

  @ApiPropertyOptional({ enum: BookingStatus })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;
}
