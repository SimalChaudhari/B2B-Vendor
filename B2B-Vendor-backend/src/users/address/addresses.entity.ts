import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { City } from './city/city.entity';
import { State } from './state/state.entity';

@Entity('addresses')
export class Address {
    @PrimaryGeneratedColumn('uuid') // Use 'uuid' to generate alphanumeric IDs
    id!: string; // Unique identifier for each address.

    @Column('uuid')
    user_id!: string; // Foreign key referencing the user.

    @Column({ type: 'varchar', length: 255 })
    street_address!: string; // Street address.

    @ManyToOne(() => City, { nullable: false })
    city!: City; // Reference to the City entity.

    @ManyToOne(() => State, { nullable: false })
    state!: State; // Reference to the State entity.

    @Column({ type: 'varchar', length: 10 })
    zip_code!: string; // Zip or postal code.

    @Column({ type: 'varchar', length: 100 })
    country!: string; // Country.

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at!: Date; // When the address was added.

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at!: Date; // When the address information was last updated.
}
