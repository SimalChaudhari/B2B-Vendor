import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import express from 'express';

const server = express();

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    // Get environment variables with fallback defaults
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3030';
    const port = process.env.PORT || 3000;

    // Enable CORS
    app.enableCors({
      origin: frontendUrl,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });

    console.log('CORS enabled for:', frontendUrl);

    // Start the server
    await app.listen(port);
    console.log(`Server is running on: http://localhost:${port}`);
  } catch (error:any) {
    console.error('Error starting the server:', error.message);
    process.exit(1); // Exit process on failure
  }
}

bootstrap();

export default server;
