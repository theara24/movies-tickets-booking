import { IsOptional, IsString, IsEnum } from 'class-validator';
import { MovieStatus } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class MovieQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: MovieStatus })
  @IsOptional()
  @IsEnum(MovieStatus)
  status?: MovieStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  genreId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  language?: string;
}
