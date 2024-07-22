import { MiddlewareConsumer, Module,RequestMethod } from '@nestjs/common';
import { EntrypointController } from './entrypoint.controller';
import { EntrypointService } from './entrypoint.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CommonModule ,CommonService} from '@app/common';
import { FallbackMiddleware } from './middleware/middleware';
import { PassportModule } from '@nestjs/passport';
import { GitHubStrategy } from './strategy/github.strategy';
import { ReposController } from './repo/repo';
import { WebhooksController } from './webhook/webhook';
@Module({
  imports: [
    CommonModule,
    PassportModule,
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
  controllers: [EntrypointController,ReposController,WebhooksController],
  providers: [EntrypointService,GitHubStrategy],
})
  
export class EntrypointModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FallbackMiddleware)
    .forRoutes({ path: '*', method: RequestMethod.ALL});
  }
}
