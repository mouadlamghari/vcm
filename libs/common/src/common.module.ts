import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { S3_SERVICE } from './s3.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports:[ConfigModule.forRoot()],
  providers: [CommonService,S3_SERVICE],
  exports: [S3_SERVICE,CommonService],
})
export class CommonModule {}
