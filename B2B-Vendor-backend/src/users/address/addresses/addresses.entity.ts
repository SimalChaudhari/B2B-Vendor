import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../user/users.entity';

@Entity('addresses')
export class Address {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 255 })
    street_address!: string;

    @Column({ type: 'varchar', length: 255 })
    city!: string;

    @Column({ type: 'varchar', length: 255 })
    state!: string;

    @Column({ type: 'varchar', length: 10 })
    zip_code!: string;

    @Column({ type: 'varchar', length: 100 })
    country!: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at!: Date;

    @ManyToOne(() => User, (user) => user.addresses)
    user!: User; // TypeORM will automatically create a `userId` foreign key.
}
