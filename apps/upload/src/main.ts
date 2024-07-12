import { NestFactory } from '@nestjs/core';
import { UploadModule } from './upload.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(UploadModule,{
    transport:Transport.RMQ,
      options:{
        urls:['amqp://root:pass@rabbitmq:5672'],
        queue:'uploadQueue',
        queueOptions: {
          durable: true,
        },
      },
        logger: ['log', 'error', 'warn', 'debug', 'verbose'], 
  });
  await app.listen();
}
bootstrap();
