import { Inject, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import * as fs from 'fs'
import { ConfigService } from "@nestjs/config";

@Injectable()
export class CommonService {

    constructor( @Inject('S3') private s3 : S3,private configService : ConfigService ){}

    getAllFiles(path:string){
        let filesPaths = []
        const files = fs.readdirSync(path)
        files.forEach(filename=>{
            const filePath = `${path}/${filename}`
            if(fs.statSync(filePath).isDirectory()){
               filesPaths = filesPaths.concat(...this.getAllFiles(filePath))
            }
            else{
                filesPaths.push(filePath)
            }
        })
        return filesPaths
      }

      async uplodFile(file:string){
        const fileBody = fs.readFileSync(file)
        const item =   await this.s3.upload({
            Body:fileBody,
            Key: file,
            Bucket:this.configService.get('BUCKET'),
        }).promise()
        return item
      }
}
