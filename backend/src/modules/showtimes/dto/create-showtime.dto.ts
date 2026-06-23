import {
  IsString,
  IsDateString,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateShowtimeDto {
  @ApiProperty()
  @IsString()
  movieId: string;

  @ApiProperty()
  @IsString()
  cinemaId: string;

  @ApiProperty()
  @IsString()
  hallId: string;

  @ApiProperty()
  @IsDateString()
  startTime: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  bufferMinutes?: number;
}
