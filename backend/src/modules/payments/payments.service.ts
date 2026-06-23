import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { generatePaymentRef, generateTicketRef } from '../../common/utils/generate-ref';
import { PaymentStatus, BookingStatus, TicketStatus } from '@prisma/client';
import * as qrcode from 'qrcode';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async processPayment(userId: string, dto: ProcessPaymentDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
      include: {
        bookingSeats: { include: { seat: true } },
        showtime: { include: { movie: true, hall: true, cinema: true } },
      },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.userId !== userId) {
      throw new BadRequestException('This booking does not belong to you');
    }
    if (booking.status !== 'PENDING') {
      throw new BadRequestException(`Booking is already ${booking.status}`);
    }

    const existingPayment = await this.prisma.payment.findUnique({
      where: { bookingId: booking.id },
    });
    if (existingPayment && existingPayment.status === 'PAID') {
      throw new ConflictException('Booking already paid');
    }

    const paymentRef = generatePaymentRef();

    const result = await this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          bookingId: booking.id,
          userId,
          amount: booking.finalAmount,
          paymentMethod: dto.paymentMethod,
          paymentRef,
          transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          status: 'PAID',
          paidAt: new Date(),
        },
      });

      await tx.booking.update({
        where: { id: booking.id },
        data: { status: 'CONFIRMED', paidAt: new Date() },
      });

      const ticketRef = generateTicketRef();
      const qrData = JSON.stringify({
        ticketRef,
        bookingRef: booking.bookingRef,
        movie: booking.showtime.movie.title,
        hall: booking.showtime.hall.name,
        cinema: booking.showtime.cinema.name,
        startTime: booking.showtime.startTime,
        seats: booking.bookingSeats.map((bs) => `${bs.seat.row}${bs.seat.column}`),
      });
      const qrImage = await qrcode.toDataURL(qrData);

      const ticket = await tx.ticket.create({
        data: {
          ticketRef,
          bookingId: booking.id,
          qrCode: qrImage,
          qrData,
          status: 'ACTIVE',
          expiresAt: booking.showtime.startTime,
        },
      });

      await tx.notification.create({
        data: {
          userId,
          type: 'BOOKING_CONFIRMATION',
          title: 'Booking Confirmed!',
          message: `Your booking ${booking.bookingRef} for ${booking.showtime.movie.title} is confirmed.`,
          data: { bookingId: booking.id, ticketRef: ticket.ticketRef },
        },
      });

      return { payment, ticket };
    });

    return result;
  }

  async findAll(query: { status?: string; userId?: string; page?: number; limit?: number }) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.userId) where.userId = query.userId;

    const [data, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        skip,
        take: limit,
        include: {
          booking: {
            include: {
              bookingSeats: { include: { seat: true } },
              showtime: { include: { movie: { select: { title: true } } } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.payment.count({ where }),
    ]);

    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const payment = await this.prisma.payment.findUnique({
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
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }

  async findByBooking(bookingId: string) {
    const payment = await this.prisma.payment.findUnique({
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
    if (!payment) throw new NotFoundException('Payment not found for this booking');
    return payment;
  }

  async refundPayment(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: { booking: true },
    });

    if (!payment) throw new NotFoundException('Payment not found');
    if (payment.status !== 'PAID') {
      throw new BadRequestException('Payment cannot be refunded');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id },
        data: { status: 'REFUNDED' },
      });

      await tx.booking.update({
        where: { id: payment.bookingId },
        data: { status: 'REFUNDED' },
      });

      await tx.ticket.updateMany({
        where: { bookingId: payment.bookingId },
        data: { status: 'REFUNDED' },
      });
    });

    return { message: 'Payment refunded successfully' };
  }
}
