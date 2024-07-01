import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { CommonModule } from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [ClientsModule.register([{
    name:'DEPLOY',
    transport:Transport.RMQ,
    options:{
      urls:['amqp://root:pass@rabbitmq:5672'],
      queue:'deployQueue',
      queueOptions:{
        durable:true
      }
    }
  }]),CommonModule],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
