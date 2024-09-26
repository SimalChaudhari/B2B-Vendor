// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module'; // Adjust the path as necessary
import { UserModule } from 'users/users.module';
import { AddressesModule } from 'users/address/addresses.module';
import { StatesModule } from 'users/address/state/states.module';
import { CitiesModule } from 'users/address/city/cities.module';


@Module({
  imports: [
  TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: 5432,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Set to false in production
    }),
    AuthModule,
    UserModule,
    AddressesModule,
    StatesModule,
    CitiesModule
  ],
})
export class AppModule { }
