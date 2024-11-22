import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    // Get environment variables with fallback defaults
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3030';
    const port = process.env.PORT || 6000;

    // Enable CORS
    app.enableCors({
      origin: frontendUrl,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });

    await app.listen(port);

  } catch (error) {
    console.error('Error starting the server:', error);
    process.exit(1); // Exit the process with failure
  }
}

bootstrap();
