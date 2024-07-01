import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class EntrypointService {

  constructor(@Inject('UPLOAD') private RabbitClient: ClientProxy ){}

  deploy(url:string) {
    const id = this.generate(4);
    this.RabbitClient.emit('upload',{id,url});
    return id;
  }

  generate(length=5):string{
    const string = 'qwertyuiopasdfghjklzxcvbnm1234567890';
    const uniqueIdentifiant = string.split('').sort(()=>0.5-Math.random()).splice(0,length).join('');
    return uniqueIdentifiant;
}
}
