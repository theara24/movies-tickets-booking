import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieQueryDto } from './dto/movie-query.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RbacGuard } from '../../common/guards/rbac.guard';
import { Public } from '../../common/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.ADMIN, UserRole.CINEMA_MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a movie' })
  create(@Body() dto: CreateMovieDto) {
    return this.moviesService.create(dto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all movies' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(
    @Query() query: MovieQueryDto,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.moviesService.findAll(
      query,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
    );
  }

  @Public()
  @Get('now-showing')
  @ApiOperation({ summary: 'Get now showing movies' })
  getNowShowing(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.moviesService.getNowShowing(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Public()
  @Get('coming-soon')
  @ApiOperation({ summary: 'Get coming soon movies' })
  getComingSoon(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.moviesService.getComingSoon(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get movie by ID' })
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.ADMIN, UserRole.CINEMA_MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a movie' })
  update(@Param('id') id: string, @Body() dto: UpdateMovieDto) {
    return this.moviesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Archive a movie' })
  remove(@Param('id') id: string) {
    return this.moviesService.remove(id);
  }
}
