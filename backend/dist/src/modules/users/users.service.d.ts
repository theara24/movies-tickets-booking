import { PrismaService } from '../../database/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateStaffDto } from './dto/create-staff.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number): Promise<{
        data: {
            id: string;
            email: string;
            phone: string | null;
            fullName: string;
            isActive: boolean;
            isLocked: boolean;
            lastLoginAt: Date | null;
            role: import(".prisma/client").$Enums.UserRole;
            createdAt: Date;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        id: string;
        email: string;
        phone: string | null;
        fullName: string;
        avatar: string | null;
        isActive: boolean;
        isLocked: boolean;
        lastLoginAt: Date | null;
        role: import(".prisma/client").$Enums.UserRole;
        createdAt: Date;
        customer: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            dob: Date | null;
            gender: import(".prisma/client").$Enums.Gender | null;
            points: number;
            tier: string;
        } | null;
        staff: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            cinemaId: string | null;
            employeeId: string;
            position: string;
            salary: import("@prisma/client/runtime/library").Decimal;
            hireDate: Date;
        } | null;
    }>;
    update(id: string, dto: UpdateUserDto, actorId: string): Promise<{
        id: string;
        email: string;
        phone: string | null;
        fullName: string;
        isActive: boolean;
        role: import(".prisma/client").$Enums.UserRole;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    createStaff(dto: CreateStaffDto): Promise<{
        id: string;
        email: string;
        fullName: string;
        role: import(".prisma/client").$Enums.UserRole;
    }>;
    getProfile(userId: string): Promise<{
        id: string;
        email: string;
        phone: string | null;
        fullName: string;
        avatar: string | null;
        lastLoginAt: Date | null;
        role: import(".prisma/client").$Enums.UserRole;
        createdAt: Date;
        customer: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            dob: Date | null;
            gender: import(".prisma/client").$Enums.Gender | null;
            points: number;
            tier: string;
        } | null;
        staff: ({
            cinema: {
                id: string;
                email: string | null;
                phone: string | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                slug: string;
                address: string;
                city: string;
                imageUrl: string | null;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            cinemaId: string | null;
            employeeId: string;
            position: string;
            salary: import("@prisma/client/runtime/library").Decimal;
            hireDate: Date;
        }) | null;
    }>;
}
