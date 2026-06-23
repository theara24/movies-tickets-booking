import { IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { SeatType, SeatStatus } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSeatDto {
  @ApiPropertyOptional({ enum: SeatType })
  @IsOptional()
  @IsEnum(SeatType)
  type?: SeatType;

  @ApiPropertyOptional({ enum: SeatStatus })
  @IsOptional()
  @IsEnum(SeatStatus)
  status?: SeatStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
