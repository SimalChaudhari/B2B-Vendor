declare module 'vercel-nest' {
    import { INestApplication } from '@nestjs/common';
    export function createHandler(app: INestApplication): any;
  }
  