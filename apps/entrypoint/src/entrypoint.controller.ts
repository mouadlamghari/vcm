import { Body, Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { EntrypointService } from './entrypoint.service';
import createUpdate from './dto/upload.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import {GithubAuthGuard} from './Guard/GithubAuthGuard.guard'

@Controller()
export class EntrypointController {
  constructor(private readonly entrypointService: EntrypointService) {}

  @UseGuards(GithubAuthGuard)
  @Post('/deploy')
  deploy(@Req() req: any, @Body() uploadBody: createUpdate){
    const user = req?.user;
    return this.entrypointService.deploy(uploadBody.repoUrl,user);
  }
  @Post('/web')
  web(){
    console.log('hihihihihihihihih')
  }
}
