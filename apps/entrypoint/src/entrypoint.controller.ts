import { Body, Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { EntrypointService } from './entrypoint.service';
import createUpdate from './dto/upload.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller()
export class EntrypointController {
  constructor(private readonly entrypointService: EntrypointService) {}

  @UseGuards(AuthGuard('github'))
  @Post('/deploy')
  deploy(@Req() req: Request, @Body() uploadBody: createUpdate){
    const user = req?.user;
    return this.entrypointService.deploy(UploadBody.repoUrl,user);
  }
  @Post('/web')
  web(){
    console.log('hihihihihihihihih')
  }
}
