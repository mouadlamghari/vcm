import { CommonService } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { spawn } from 'child_process';
import * as path from 'path'
import { ConfigService } from "@nestjs/config";

type commandType = {
  installCommand?:string | null,
  buildCommand?:string | null
} 

@Injectable()
export class DeployService {

  constructor(@Inject('S3') private s3:S3, private commonService : CommonService,private configService : ConfigService){}

  async deploy(folder:string){
    try{
        const command = await this.getFolder(folder);
        await  this.copyDist(folder)
    }catch(err){
        console.log(err.message,'error')
    }
}

  async getFolder(folder:string){
      return  new Promise(async (resolve,reject)=>{
        try {
            const Key = (`${folder}/vcm.json`)
            const file = await this.s3.getObject({Bucket:this.configService.get('BUCKET')  ,Key}).promise()
            const config = (file.Body.toString())
            const  command : commandType = JSON.parse(config)
            await this.InstallAndBuild(folder,command)
            resolve(command)
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}

async InstallAndBuild(pathFolder:string,command:commandType){
    const fullPath = path.resolve(pathFolder);
    await this.runCommand(command?.installCommand||'npm install', fullPath);
    await this.runCommand(command?.buildCommand||'npm run build', fullPath);
}


 runCommand(command: string, cwd: string): Promise<void> {
    return new Promise((resolve, reject) => {

        const [cmd, ...args] = command.split(' ');
        const child = spawn(cmd, args, { cwd, shell: true });
        
        child.stdout.on('data', (data) => {
            console.log(`${data}`);
        });

        child.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        child.on('error', (err) => {
            console.error('Error:', err);
            reject(err);
        });

        child.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Command failed with exit code ${code}`));
            } else {
                resolve();
            }
        });
    });
}

async copyDist(folder:string){
    folder = path.basename(folder);
    const folderPath = `uploded/${folder}/dist`;
   const files =  this.commonService.getAllFiles(folderPath)
   files.forEach((file)=>{
    this.commonService.uplodFile(file)
   })
}

}
