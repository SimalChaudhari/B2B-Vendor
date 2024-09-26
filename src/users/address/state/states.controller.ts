// src/states/states.controller.ts

import { Controller, Post, Get, Body, Param, Patch, Delete } from '@nestjs/common';
import { StatesService } from './states.service';
import { CreateStateDto } from './state.dto';
import { State } from './state.entity';

@Controller('states')
export class StatesController {
    constructor(private readonly statesService: StatesService) {}

    @Post('create')
    async create(@Body() createStateDto: CreateStateDto): Promise<State> {
        return this.statesService.create(createStateDto);
    }

    @Get()
    async findAll(): Promise<State[]> {
        return this.statesService.findAll();
    }

    @Get('get/:id')
    async findOne(@Param('id') id: string): Promise<State> {
        return this.statesService.findOne(id);
    }

    @Patch('update/:id')
    async update(@Param('id') id: string, @Body() updateStateDto: CreateStateDto): Promise<State> {
        return this.statesService.update(id, updateStateDto);
    }

    @Delete('delete/:id')
    async remove(@Param('id') id: string): Promise<void> {
        return this.statesService.remove(id);
    }
}
