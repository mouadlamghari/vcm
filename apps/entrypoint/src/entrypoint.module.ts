import { Module } from '@nestjs/common';
import { EntrypointController } from './entrypoint.controller';
import { EntrypointService } from './entrypoint.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [ClientsModule.register([
    {
      name:'UPLOAD',
      transport:Transport.RMQ,
      options:{
        urls:['amqp://root:pass@rabbitmq:5672'],
        queue:'uploadQueue',
        queueOptions: {
          durable: true,
        },
      }
    }
  ])],
  controllers: [EntrypointController],
  providers: [EntrypointService],
})
export class EntrypointModule {}
