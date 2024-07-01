import { NestFactory } from '@nestjs/core';
import { DeployModule } from './deploy.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(DeployModule,
    {
      transport:Transport.RMQ,
        options:{
          urls:['amqp://root:pass@rabbitmq:5672'],
          queue:'deployQueue',
          queueOptions: {
            durable: true,
          },
        },
  });
  await app.listen();
}
bootstrap();
