import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class SeatLockGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private userSockets;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    broadcastSeatLocked(showtimeId: string, seatIds: string[]): void;
    broadcastSeatReleased(showtimeId: string, seatIds: string[]): void;
    broadcastBookingUpdate(booking: any): void;
    handleJoinShowtime(client: Socket, data: {
        showtimeId: string;
    }): {
        event: string;
        data: {
            showtimeId: string;
        };
    };
    handleLeaveShowtime(client: Socket, data: {
        showtimeId: string;
    }): {
        event: string;
        data: {
            showtimeId: string;
        };
    };
}
