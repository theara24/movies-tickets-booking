"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBookingRef = generateBookingRef;
exports.generatePaymentRef = generatePaymentRef;
exports.generateTicketRef = generateTicketRef;
exports.generateOrderRef = generateOrderRef;
const uuid_1 = require("uuid");
function generateBookingRef() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = (0, uuid_1.v4)().substring(0, 6).toUpperCase();
    return `BK-${timestamp}-${random}`;
}
function generatePaymentRef() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = (0, uuid_1.v4)().substring(0, 6).toUpperCase();
    return `PAY-${timestamp}-${random}`;
}
function generateTicketRef() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = (0, uuid_1.v4)().substring(0, 6).toUpperCase();
    return `TKT-${timestamp}-${random}`;
}
function generateOrderRef() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = (0, uuid_1.v4)().substring(0, 6).toUpperCase();
    return `ORD-${timestamp}-${random}`;
}
//# sourceMappingURL=generate-ref.js.map