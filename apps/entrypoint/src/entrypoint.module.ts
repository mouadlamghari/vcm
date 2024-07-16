import { MiddlewareConsumer, Module,RequestMethod } from '@nestjs/common';
import { EntrypointController } from './entrypoint.controller';
import { EntrypointService } from './entrypoint.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CommonModule } from '@app/common';
import { FallbackMiddleware } from './middleware/middleware';

@Module({
  imports: [
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
      CommonModule,
    ]),
  ],
  controllers: [EntrypointController],
  providers: [EntrypointService,CommonService],
})
export class EntrypointModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FallbackMiddleware)
    .forRoutes({ path: '*', method: RequestMethod.ALL});
  }
}
