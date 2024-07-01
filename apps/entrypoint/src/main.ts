import { NestFactory } from '@nestjs/core';
import { EntrypointModule } from './entrypoint.module';

async function bootstrap() {
  const app = await NestFactory.create(EntrypointModule);
  await app.listen(5002);
}
bootstrap();
