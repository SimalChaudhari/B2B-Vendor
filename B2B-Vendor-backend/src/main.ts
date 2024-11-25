import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createHandler } from 'vercel-nest';
import { INestApplication } from '@nestjs/common';

let app: INestApplication;

async function bootstrap() {
  try {
    // Create the NestJS application
    app = await NestFactory.create(AppModule);

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3030';
    const port = process.env.PORT || 3000;

    // Enable CORS
    app.enableCors({
      origin: frontendUrl,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });

    // No need to listen on a port for serverless environments like Vercel
    console.log(`NestJS application initialized.`);
  } catch (error) {
    console.error('Error starting the server:', error);
    process.exit(1); // Exit the process with failure
  }
}

// Bootstrap the application and assign the handler for Vercel
bootstrap().then(() => {
  // Export the Vercel handler after app initialization
  module.exports.handler = createHandler(app);
});
