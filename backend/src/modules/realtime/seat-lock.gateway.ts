import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/seat-lock',
})
export class SeatLockGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private userSockets = new Map<string, string[]>();

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      const existing = this.userSockets.get(userId) || [];
      existing.push(client.id);
      this.userSockets.set(userId, existing);
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, sockets] of this.userSockets.entries()) {
      const filtered = sockets.filter((s) => s !== client.id);
      if (filtered.length === 0) {
        this.userSockets.delete(userId);
      } else {
        this.userSockets.set(userId, filtered);
      }
    }
  }

  broadcastSeatLocked(showtimeId: string, seatIds: string[]) {
    this.server.to(`showtime:${showtimeId}`).emit('seats:locked', {
      showtimeId,
      seatIds,
      timestamp: new Date(),
    });
  }

  broadcastSeatReleased(showtimeId: string, seatIds: string[]) {
    this.server.to(`showtime:${showtimeId}`).emit('seats:released', {
      showtimeId,
      seatIds,
      timestamp: new Date(),
    });
  }

  broadcastBookingUpdate(booking: any) {
    this.server.emit('booking:update', booking);
  }

  @SubscribeMessage('join:showtime')
  handleJoinShowtime(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { showtimeId: string },
  ) {
    client.join(`showtime:${data.showtimeId}`);
    return { event: 'joined', data: { showtimeId: data.showtimeId } };
  }

  @SubscribeMessage('leave:showtime')
  handleLeaveShowtime(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { showtimeId: string },
  ) {
    client.leave(`showtime:${data.showtimeId}`);
    return { event: 'left', data: { showtimeId: data.showtimeId } };
  }
}
