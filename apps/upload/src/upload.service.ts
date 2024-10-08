import { HttpException, HttpStatus, Inject, Injectable,Logger } from '@nestjs/common';
import simpleGit from 'simple-git';
import * as fs from 'fs';
import * as path from 'path';
import { S3 } from 'aws-sdk';
import { ClientProxy } from '@nestjs/microservices';
import { CommonService } from '@app/common';
@Injectable()
export class UploadService {

   private readonly logger = new Logger(UploadService.name); // Create a logger instance

  constructor( private commonService : CommonService,@Inject('DEPLOY') private rabbitClient : ClientProxy ){}

  async upload(data) {
         this.logger.log(`Starting upload for repo: ${data.url} with id: ${data.id}`);
    const files = await this.getRepoFiles(data.url,data.id);
    const configFileExists =  files.find(e=>path.basename(e)==='vcm.json')
     
    if(!configFileExists){
        await fs.rm(`uploded/${data.id}`,{recursive:true,force:true},(err)=>{
          throw Error(err.message);
        })
        throw new HttpException(
            {status:406,message:'the vcm config file does not exists'}
            ,HttpStatus.NOT_ACCEPTABLE)
    }
           this.logger.log(`Uploading file: ${files}`);
    await Promise.all(files.map(async(file)=>await this.commonService.uplodFile(file)))
    .then((e)=>{
      this.commonService.createProject({owner:data.user.username,repo:data.url})
      this.rabbitClient.emit('deploy',`uploded/${data?.id}`)})
       return 'Hello World!';
  }

  async getRepoFiles(url:string,id){
    const git =  simpleGit()
    const path =`uploded/${id}`
    await git.clone(url,path)
    const files = this.commonService.getAllFiles(path)
    return files    
  }




}
