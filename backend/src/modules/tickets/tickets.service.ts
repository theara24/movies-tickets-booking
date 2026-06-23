import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { TicketStatus } from '@prisma/client';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  async findByUser(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.ticket.findMany({
        where: { booking: { userId } },
        skip,
        take: limit,
        include: {
          booking: {
            include: {
              bookingSeats: { include: { seat: true } },
              showtime: {
                include: { movie: { select: { title: true, posterUrl: true, duration: true } }, cinema: true, hall: true },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.ticket.count({ where: { booking: { userId } } }),
    ]);

    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findByReference(ticketRef: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { ticketRef },
      include: {
        booking: {
          include: {
            bookingSeats: { include: { seat: true } },
            showtime: { include: { movie: true, cinema: true, hall: true } },
            user: { select: { fullName: true, email: true } },
          },
        },
      },
    });
    if (!ticket) throw new NotFoundException('Ticket not found');
    return ticket;
  }

  async findOne(id: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: {
        booking: {
          include: {
            bookingSeats: { include: { seat: true } },
            showtime: { include: { movie: true, cinema: true, hall: true } },
            user: { select: { fullName: true, email: true } },
          },
        },
      },
    });
    if (!ticket) throw new NotFoundException('Ticket not found');
    return ticket;
  }

  async validateTicket(ticketRef: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { ticketRef },
      include: {
        booking: {
          include: {
            bookingSeats: { include: { seat: true } },
            showtime: { include: { movie: true, cinema: true, hall: true } },
          },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    if (ticket.status === TicketStatus.USED) {
      throw new BadRequestException('Ticket has already been used');
    }

    if (ticket.status === TicketStatus.EXPIRED) {
      throw new BadRequestException('Ticket has expired');
    }

    if (ticket.status === TicketStatus.REFUNDED) {
      throw new BadRequestException('Ticket has been refunded');
    }

    if (new Date() > ticket.expiresAt) {
      await this.prisma.ticket.update({
        where: { id: ticket.id },
        data: { status: TicketStatus.EXPIRED },
      });
      throw new BadRequestException('Ticket has expired');
    }

    return {
      valid: true,
      ticket,
      message: 'Ticket is valid',
    };
  }

  async scanTicket(ticketRef: string, scannedBy: string) {
    const validation = await this.validateTicket(ticketRef);

    const ticket = await this.prisma.ticket.update({
      where: { id: validation.ticket.id },
      data: {
        status: TicketStatus.USED,
        usedAt: new Date(),
        scannedBy,
      },
    });

    return { message: 'Ticket scanned successfully', ticket };
  }

  async getTicketByBooking(bookingId: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { bookingId },
      include: {
        booking: {
          include: {
            bookingSeats: { include: { seat: true } },
            showtime: { include: { movie: true, cinema: true, hall: true } },
          },
        },
      },
    });
    if (!ticket) throw new NotFoundException('Ticket not found for this booking');
    return ticket;
  }
}
