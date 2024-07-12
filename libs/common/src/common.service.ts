import { Inject, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import * as fs from 'fs'
import { ConfigService } from "@nestjs/config";
import { InjectModel } from '@nestjs/mongoose';
import { Instance, InstanceDocument } from './schema/instance.schema';
import { Model } from 'mongoose';

@Injectable()
export class CommonService {
  constructor(
    @Inject('S3') private s3: S3,
    private configService: ConfigService,
    @InjectModel(Instance.name) private instanceModel: Model<InstanceDocument>,
  ) {}

  getAllFiles(path: string) {
    let filesPaths = [];
    const files = fs.readdirSync(path);
    files.forEach((filename) => {
      const filePath = `${path}/${filename}`;
      if (fs.statSync(filePath).isDirectory()) {
        filesPaths = filesPaths.concat(...this.getAllFiles(filePath));
      } else {
        filesPaths.push(filePath);
      }
    });
    return filesPaths;
  }

  async uplodFile(file: string) {
    console.log('BUCKET --------------------',this.configService.get('BUCKET'))
    const fileBody = fs.readFileSync(file);
    const item = await this.s3
      .upload({
        Body: fileBody,
        Key: file,
        Bucket: this.configService.get('BUCKET'),
      })
      .promise();
    return item;
  }

  async findOne(search: string) {
    const item = await this.instanceModel.findOne({
      $or: [
        {
          domain: search,
        },
        { subdomain: search },
      ],
    });
    return item;
  }

  async getObject(Bucket: string, Key: string) {
    const content = this.s3
      .getObject({
        Bucket,
        Key,
      })
      .promise();
    return content;
  }

  async create(project: string, subdomain: string) {
    await this.instanceModel.create({ project, subdomain });
  }
}
