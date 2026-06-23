import { IsString, IsInt, IsEnum } from 'class-validator';
import { SeatType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSeatDto {
  @ApiProperty()
  @IsString()
  hallId: string;

  @ApiProperty()
  @IsString()
  row: string;

  @ApiProperty()
  @IsString()
  column: string;

  @ApiProperty()
  @IsInt()
  number: number;

  @ApiProperty({ enum: SeatType })
  @IsEnum(SeatType)
  type: SeatType;
}
