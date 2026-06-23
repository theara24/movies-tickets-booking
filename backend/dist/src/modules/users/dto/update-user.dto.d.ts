import { UserRole } from '@prisma/client';
export declare class UpdateUserDto {
    email?: string;
    fullName?: string;
    phone?: string;
    role?: UserRole;
}
