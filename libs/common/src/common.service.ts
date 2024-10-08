import { Inject, Injectable,HttpException, HttpStatus } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import * as fs from 'fs'
import { ConfigService } from "@nestjs/config";
import { InjectModel } from '@nestjs/mongoose';
import { Instance, InstanceDocument } from './schema/instance.schema';
import { Model } from 'mongoose';
import { User, UserDocument } from './schema/User.schema';
import { Repo, RepoDocument } from './schema/repo.schema';
@Injectable()
export class CommonService {
  constructor(
    @Inject('S3') private s3: S3,
    private configService: ConfigService,
    @InjectModel(Instance.name) private instanceModel: Model<InstanceDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Repo.name) private repoModel: Model<RepoDocument>,
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

  async getOrCreateUser(data: any) {
    const { githubId, username, avatarUrl, accessToken } = data;
    let user = await this.userModel.findOne({
      githubId,
    });
    if (!user) {
      user = await this.userModel.create({ ...data });
    }
    return user;
  }

  async createProject(data: any) {
    try {
      const project = await this.repoModel.create({
        repo: data.repo,
        owner: data.id,
      });
      return project;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
