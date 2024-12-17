import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
   
    const app = await NestFactory.create(AppModule);
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`Server is running on: http://localhost:${port}`); // Log the port

  } catch (error) {
    process.exit(1); // Exit the process with failure
  }
}
bootstrap();

