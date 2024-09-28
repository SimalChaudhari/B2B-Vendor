// src/states/states.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStateDto } from './state.dto';
import { State } from './state.entity';

@Injectable()
export class StatesService {
    constructor(
        @InjectRepository(State)
        private statesRepository: Repository<State>
    ) { }

    async create(createStateDto: CreateStateDto): Promise<State> {
        const existingState = await this.statesRepository.findOne({
            where: { state_name: createStateDto.state_name }, // Adjust this based on how you identify a state
        });

        if (existingState) {
            throw new NotFoundException(`State '${createStateDto.state_name}' already exists.`);
        }
        const state = this.statesRepository.create(createStateDto);
        return this.statesRepository.save(state);
    }

    async findAll(): Promise<State[]> {
        return this.statesRepository.find();
    }

    async findOne(id: string): Promise<State> {
        const state = await this.statesRepository.findOneBy({ id });
        if (!state) {
            throw new NotFoundException(`State with ID ${id} not found`);
        }
        return state;
    }

    async update(id: string, updateStateDto: CreateStateDto): Promise<State> {
        await this.statesRepository.update(id, updateStateDto);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        await this.statesRepository.delete(id);
    }
}
