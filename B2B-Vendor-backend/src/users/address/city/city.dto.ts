// src/cities/dto/create-city.dto.ts

import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateCityDto {
    @IsNotEmpty()
    @IsString()
    city_name!: string;

    @IsNotEmpty()
    @IsString()
    state_id!: string; // Reference to State entity
}
