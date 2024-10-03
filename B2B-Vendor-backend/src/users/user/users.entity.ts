import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Address } from 'users/address/addresses/addresses.entity';

export enum UserStatus {
    Active = 'Active',
    Suspended = 'Suspended',
}

export enum UserRole {
    Admin = 'Admin',
    Customer = 'Customer',
    Vendor = 'Vendor',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column({ unique: true })
    email!: string;

    @Column({ unique: true })
    mobile!: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    profile?: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.Customer,
    })
    role!: UserRole;

    @Column({
        type: 'enum',
        enum: UserStatus,
        default: UserStatus.Active,
    })
    status?: UserStatus;

    @Column({ nullable: true, type: 'varchar' })
    otp?: string | null;

    @Column({ nullable: true, type: 'timestamp' })
    otpExpires?: Date | null;

    @OneToMany(() => Address, (address) => address.user, { cascade: true })
    addresses!: Address[]; // A user can have multiple addresses

    @Column({ default: false })
    isDeleted!: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;
}
