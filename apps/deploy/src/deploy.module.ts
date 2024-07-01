import { Module } from '@nestjs/common';
import { DeployController } from './deploy.controller';
import { DeployService } from './deploy.service';
import { CommonModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [CommonModule,ConfigModule.forRoot()],
  controllers: [DeployController],
  providers: [DeployService],
})
export class DeployModule {}
