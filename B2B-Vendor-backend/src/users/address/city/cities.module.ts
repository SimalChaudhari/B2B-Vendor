// src/cities/cities.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitiesController } from './cities.controller';
import { CitiesService } from './cities.service';
import { City } from './city.entity';
import { State } from '../state/state.entity';

@Module({
    imports: [TypeOrmModule.forFeature([City, State])],
    controllers: [CitiesController],
    providers: [CitiesService],
})
export class CitiesModule {}
