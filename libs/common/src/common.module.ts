import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { S3_SERVICE } from './s3.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Instance, InstanceSchema } from './schema/instance.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: Instance.name, schema: InstanceSchema }]),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: `{configService.get<string>('MONGO_URL')}`,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [CommonService, S3_SERVICE],
  exports: [S3_SERVICE, CommonService],
})
  
export class CommonModule {}
