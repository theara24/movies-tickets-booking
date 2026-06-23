import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from './common/decorators/public.decorator';

@ApiTags('Health')
@Controller()
export class AppController {
  @Public()
  @Get()
  @ApiOperation({ summary: 'Health check' })
  getHealth() {
    return {
      success: true,
      message: 'CinePremium API is running',
      data: {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
      },
    };
  }
}
