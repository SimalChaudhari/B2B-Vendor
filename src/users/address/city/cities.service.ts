// src/cities/cities.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCityDto } from './city.dto';
import { City } from './city.entity';
import { State } from '../state/state.entity';

@Injectable()
export class CitiesService {
    constructor(
        @InjectRepository(City)
        private citiesRepository: Repository<City>,
        @InjectRepository(State)
        private statesRepository: Repository<State>
    ) { }

    async create(createCityDto: CreateCityDto): Promise<City> {
        const state = await this.statesRepository.findOneBy({ id: createCityDto.state_id });
        if (!state) {
            throw new Error('State not found');
        }

        const city = this.citiesRepository.create({ ...createCityDto, state });
        return this.citiesRepository.save(city);
    }

    async findAll(): Promise<City[]> {
        return this.citiesRepository.find({ relations: ['state'] }); // Load state relation
    }

    async findOne(id: string): Promise<City> {
        const city = await this.citiesRepository.findOne({
            where: { id },
            relations: ['state']
        });
        if (!city) {
            throw new NotFoundException(`City with ID ${id} not found`);
        }
        return city;
    }

    async update(id: string, updateCityDto: CreateCityDto): Promise<City> {
        const city = await this.findOne(id);
        if (!city) {
            throw new Error('City not found');
        }

        await this.citiesRepository.update(id, updateCityDto);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        await this.citiesRepository.delete(id);
    }
}
