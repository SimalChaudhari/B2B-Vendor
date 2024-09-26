// src/states/dto/create-state.dto.ts

import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStateDto {
    @IsNotEmpty()
    @IsString()
    state_name!: string;

}
