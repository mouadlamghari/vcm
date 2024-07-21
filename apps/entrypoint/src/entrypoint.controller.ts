import { Body, Controller, Get, Post } from '@nestjs/common';
import { EntrypointService } from './entrypoint.service';
import createUpdate from './dto/upload.dto';

@Controller()
export class EntrypointController {
  constructor(private readonly entrypointService: EntrypointService) {}

  @Post('/deploy')
  deploy(@Body() UploadBody:createUpdate){
    console.log('deploying')
    return this.entrypointService.deploy(UploadBody.repoUrl);
  }
  @Post('/web')
  deploy(){
    console.log('hihihihihihihihih')
  }
}
