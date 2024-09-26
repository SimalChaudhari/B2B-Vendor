// src/cities/cities.controller.ts

import { Controller, Post, Get, Body, Param, Patch, Delete } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CreateCityDto } from './city.dto';
import { City } from './city.entity';

@Controller('cities')
export class CitiesController {
    constructor(private readonly citiesService: CitiesService) { }

    @Post('create')
    async create(@Body() createCityDto: CreateCityDto): Promise<City> {
        return this.citiesService.create(createCityDto);
    }

    @Get()
    async findAll(): Promise<City[]> {
        return this.citiesService.findAll();
    }

    @Get('get/:id')
    async findOne(@Param('id') id: string): Promise<City> {
        return this.citiesService.findOne(id);
    }

    @Patch('update/:id')
    async update(@Param('id') id: string, @Body() updateCityDto: CreateCityDto): Promise<City> {
        return this.citiesService.update(id, updateCityDto);
    }

    @Delete('delete/:id')
    async remove(@Param('id') id: string): Promise<void> {
        return this.citiesService.remove(id);
    }
}
