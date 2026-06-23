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
import { CinemasService } from './cinemas.service';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { UpdateCinemaDto } from './dto/update-cinema.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RbacGuard } from '../../common/guards/rbac.guard';
import { Public } from '../../common/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Cinemas')
@Controller('cinemas')
export class CinemasController {
  constructor(private cinemasService: CinemasService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a cinema branch' })
  create(@Body() dto: CreateCinemaDto) {
    return this.cinemasService.create(dto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all cinemas' })
  findAll() {
    return this.cinemasService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get cinema by ID' })
  findOne(@Param('id') id: string) {
    return this.cinemasService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.ADMIN, UserRole.CINEMA_MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update cinema' })
  update(@Param('id') id: string, @Body() dto: UpdateCinemaDto) {
    return this.cinemasService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deactivate cinema' })
  remove(@Param('id') id: string) {
    return this.cinemasService.remove(id);
  }
}
