import { IsString, IsInt, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateHallDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  cinemaId: string;

  @ApiProperty()
  @IsInt()
  rows: number;

  @ApiProperty()
  @IsInt()
  columns: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  capacity?: number;
}
