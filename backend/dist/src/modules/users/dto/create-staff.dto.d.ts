import { UserRole } from '@prisma/client';
export declare class CreateStaffDto {
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
    employeeId: string;
    position: string;
    cinemaId: string;
}
