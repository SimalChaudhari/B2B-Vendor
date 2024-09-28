import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from 'utils/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.useGlobalPipes(new ValidationPipe({
  //   whitelist: true, // Automatically strip non-whitelisted properties
  //   forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are found
  //   transform: true, // Automatically transform payloads to DTO instances
  // }));

  // app.useGlobalPipes(new ValidationPipe({ transform: true }));
  // app.useGlobalFilters(new HttpExceptionFilter()); // Apply the filter

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:3030', // Replace with your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Optional, if you need to include credentials
  });
  await app.listen(3000);
}
bootstrap();