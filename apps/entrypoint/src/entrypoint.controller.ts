import { Body, Controller, Get, Post } from '@nestjs/common';
import { EntrypointService } from './entrypoint.service';
import createUpdate from './dto/upload.dto';

@Controller()
export class EntrypointController {
  constructor(private readonly entrypointService: EntrypointService) {}

  @Post('/deploy/instance/')
  deploy(@Body() UploadBody:createUpdate){
    return this.entrypointService.deploy(UploadBody.repoUrl);
  }
}
