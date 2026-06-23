import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { GenresService } from './genres.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RbacGuard } from '../../common/guards/rbac.guard';
import { Public } from '../../common/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Genres')
@Controller('genres')
export class GenresController {
  constructor(private genresService: GenresService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a genre' })
  create(@Body() dto: CreateGenreDto) {
    return this.genresService.create(dto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all genres' })
  findAll() {
    return this.genresService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get genre by ID' })
  findOne(@Param('id') id: string) {
    return this.genresService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a genre' })
  update(@Param('id') id: string, @Body() dto: UpdateGenreDto) {
    return this.genresService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a genre' })
  remove(@Param('id') id: string) {
    return this.genresService.remove(id);
  }
}
