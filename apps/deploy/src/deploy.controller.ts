import { Controller, Get } from '@nestjs/common';
import { DeployService } from './deploy.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class DeployController {
  constructor(private readonly deployService: DeployService) {}

  @EventPattern('deploy')
  deploy(@Payload() url:string){
    console.log('here',url)
    this.deployService.deploy(url)
  }
}
