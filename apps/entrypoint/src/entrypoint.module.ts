import { MiddlewareConsumer, Module,RequestMethod } from '@nestjs/common';
import { EntrypointController } from './entrypoint.controller';
import { EntrypointService } from './entrypoint.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CommonModule ,CommonService} from '@app/common';
import { FallbackMiddleware } from './middleware/middleware';

@Module({
  imports: [
    CommonModule,
    ClientsModule.register([
      {
        name: 'UPLOAD',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://root:pass@rabbitmq:5672'],
          queue: 'uploadQueue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [EntrypointController],
  providers: [EntrypointService],
})
  
export class EntrypointModule {
  configure(consumer: MiddlewareConsumer) {
    console.log('Applying FallbackMiddleware');
    consumer.apply(FallbackMiddleware)
    .forRoutes({ path: '*', method: RequestMethod.ALL});
  }
}
