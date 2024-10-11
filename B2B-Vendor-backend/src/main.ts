import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from 'utils/http-exception.filter';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    // Enable CORS
    app.enableCors({
      origin: 'http://localhost:3030', // Replace with your frontend URL
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true, // Optional, if you need to include credentials
    });

    // Other configurations such as global pipes or filters can go here
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new HttpExceptionFilter());

    await app.listen(3000);
    console.log('Server is running on http://localhost:3000');
  } catch (error) {
    console.error('Error starting the server:', error);
    process.exit(1); // Exit the process with failure
  }
}

bootstrap();
