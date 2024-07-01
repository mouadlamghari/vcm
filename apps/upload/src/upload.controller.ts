import { Controller, Get } from '@nestjs/common';
import { UploadService } from './upload.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @EventPattern('upload')
  getHello(@Payload() data) {
    return this.uploadService.upload(data);
  }
}
