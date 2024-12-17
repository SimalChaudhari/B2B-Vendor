import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

let cachedServer: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.init();  // Initialize the NestJS app
  return app.getHttpAdapter().getInstance();
}

const server = async (req: any, res: any) => {
  if (!cachedServer) {
    cachedServer = await bootstrap();  // Lazy initialization on the first request
  }
  cachedServer(req, res);  // Pass request and response to the server instance
};

export default server;
