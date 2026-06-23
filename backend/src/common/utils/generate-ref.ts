import { v4 as uuidv4 } from 'uuid';

export function generateBookingRef(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = uuidv4().substring(0, 6).toUpperCase();
  return `BK-${timestamp}-${random}`;
}

export function generatePaymentRef(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = uuidv4().substring(0, 6).toUpperCase();
  return `PAY-${timestamp}-${random}`;
}

export function generateTicketRef(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = uuidv4().substring(0, 6).toUpperCase();
  return `TKT-${timestamp}-${random}`;
}

export function generateOrderRef(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = uuidv4().substring(0, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}
