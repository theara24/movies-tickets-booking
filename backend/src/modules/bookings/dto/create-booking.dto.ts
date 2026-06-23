import { IsString, IsArray, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty()
  @IsString()
  showtimeId: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  seatIds: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  promotionCode?: string;
}
