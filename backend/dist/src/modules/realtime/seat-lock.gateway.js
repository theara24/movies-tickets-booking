"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeatLockGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
let SeatLockGateway = class SeatLockGateway {
    server;
    userSockets = new Map();
    handleConnection(client) {
        const userId = client.handshake.query.userId;
        if (userId) {
            const existing = this.userSockets.get(userId) || [];
            existing.push(client.id);
            this.userSockets.set(userId, existing);
        }
    }
    handleDisconnect(client) {
        for (const [userId, sockets] of this.userSockets.entries()) {
            const filtered = sockets.filter((s) => s !== client.id);
            if (filtered.length === 0) {
                this.userSockets.delete(userId);
            }
            else {
                this.userSockets.set(userId, filtered);
            }
        }
    }
    broadcastSeatLocked(showtimeId, seatIds) {
        this.server.to(`showtime:${showtimeId}`).emit('seats:locked', {
            showtimeId,
            seatIds,
            timestamp: new Date(),
        });
    }
    broadcastSeatReleased(showtimeId, seatIds) {
        this.server.to(`showtime:${showtimeId}`).emit('seats:released', {
            showtimeId,
            seatIds,
            timestamp: new Date(),
        });
    }
    broadcastBookingUpdate(booking) {
        this.server.emit('booking:update', booking);
    }
    handleJoinShowtime(client, data) {
        client.join(`showtime:${data.showtimeId}`);
        return { event: 'joined', data: { showtimeId: data.showtimeId } };
    }
    handleLeaveShowtime(client, data) {
        client.leave(`showtime:${data.showtimeId}`);
        return { event: 'left', data: { showtimeId: data.showtimeId } };
    }
};
exports.SeatLockGateway = SeatLockGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], SeatLockGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join:showtime'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], SeatLockGateway.prototype, "handleJoinShowtime", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave:showtime'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], SeatLockGateway.prototype, "handleLeaveShowtime", null);
exports.SeatLockGateway = SeatLockGateway = __decorate([
    (0, common_1.Injectable)(),
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
            credentials: true,
        },
        namespace: '/seat-lock',
    })
], SeatLockGateway);
//# sourceMappingURL=seat-lock.gateway.js.map