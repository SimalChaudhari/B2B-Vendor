import { IsNotEmpty, IsOptional, IsInt, IsString } from 'class-validator';
import { ManyToOne } from 'typeorm';
import { City } from './city/city.entity';
import { State } from './state/state.entity';

export class CreateAddressDto {
    @IsString()
    @IsNotEmpty()
    user_id!: string;

    @IsString()
    @IsNotEmpty()
    street_address!: string;

    @ManyToOne(() => City, (city) => city.city_name)
    city!: City;

    @ManyToOne(() => State, (state) => state.state_name)
    state!: State;

    @IsString()
    @IsNotEmpty()
    zip_code!: string;

    @IsString()
    @IsNotEmpty()
    country!: string;
}

export class UpdateAddressDto {
    @IsOptional()
    @IsString()
    street_address?: string;

    @IsOptional()
    @ManyToOne(() => City, (city) => city.city_name)
    city?: City;

    @IsOptional()
    @ManyToOne(() => State, (state) => state.state_name)
    state?: State;

    @IsOptional()
    @IsString()
    zip_code?: string;

    @IsOptional()
    @IsString()
    country?: string;
}
