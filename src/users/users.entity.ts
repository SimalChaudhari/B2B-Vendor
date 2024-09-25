// src/auth/auth.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// Enum for user status
export enum UserStatus {
    Active = 'Active',
    Suspended = 'Suspended',
}

// Enum for user role
export enum UserRole {
    Admin = 'Admin',
    Customer = 'Customer',
    Vendor = 'Vendor',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id!: string; // User ID

    @Column()
    firstName!: string; // User's first name

    @Column()
    lastName!: string; // User's last name

    @Column({ unique: true })
    email!: string; // User's email address (must be unique)

    @Column({ unique: true })
    mobile!: string; // User's mobile number (must be unique)

    @Column({ nullable: true })
    otp?: string; // Optional One-Time Password for authentication

    @Column({ nullable: true })
    otpExpires?: Date; // Optional expiration date for the OTP

    @Column({
        type: 'enum', // Use enum type in the database
        enum: UserRole, // Reference the UserRole enum
        default: UserRole.Customer, // Default role is Customer
    })
    role!: UserRole; // User's role, must be one of the enum values

    @Column({
        type: 'enum', // Use enum type in the database
        enum: UserStatus, // Reference the UserStatus enum
        default: UserStatus.Active, // Default status is Active
    })
    status?: UserStatus; // User's status, must be one of the enum values
}
