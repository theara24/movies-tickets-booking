import { Module } from '@nestjs/common';
import { SeatLockGateway } from './seat-lock.gateway';
import { SeatLockService } from './seat-lock.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [SeatLockGateway, SeatLockService],
  exports: [SeatLockGateway, SeatLockService],
})
export class RealtimeModule {}
