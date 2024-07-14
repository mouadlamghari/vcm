import { CommonService } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { spawn } from 'child_process';
import * as path from 'path'
import { ConfigService } from "@nestjs/config";
import {
  ChangeResourceRecordSetsCommand,
  ChangeResourceRecordSetsCommandInput,
  Route53Client,
} from '@aws-sdk/client-route-53';
import * as AWS from 'aws-sdk';

type commandType = {
  installCommand?: string | null;
  buildCommand?: string | null;
};

@Injectable()
export class DeployService {
  private readonly route53Client: Route53Client;

  constructor(
    @Inject('S3') private s3: S3,
    private commonService: CommonService,
    private configService: ConfigService,
  ) {
    console.log(this.configService.get<string>('REGION'));
    this.route53 = new AWS.Route53({
      region: this.configService.get<string>('REGION'),
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
    });
  }

  async deploy(folder: string) {
    try {
      const command = await this.getFolder(folder);
      await this.copyDist(folder);
      const id = folder.split('/')[0];
      this.commonService.create(
        id,
        `${id}/${this.configService.get('domain')}`,
      );
      await this.addSubdomain(this.configService.get('domain'), id);
    } catch (err) {
      console.log(err.message, 'error');
    }
  }

  async getFolder(folder: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const Key = `${folder}/vcm.json`;
        const file = await this.s3
          .getObject({ Bucket: this.configService.get('BUCKET'), Key })
          .promise();
        const config = file.Body.toString();
        const command: commandType = JSON.parse(config);
        await this.InstallAndBuild(folder, command);
        resolve(command);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  async InstallAndBuild(pathFolder: string, command: commandType) {
    const fullPath = path.resolve(pathFolder);
    await this.runCommand(command?.installCommand || 'npm install', fullPath);
    await this.runCommand(command?.buildCommand || 'npm run build', fullPath);
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

  async copyDist(folder: string) {
    folder = path.basename(folder);
    const folderPath = `uploded/${folder}/dist`;
    const files = this.commonService.getAllFiles(folderPath);
    files.forEach((file) => {
      this.commonService.uplodFile(file);
    });
  }

  async addSubdomain(domain, subdomain) {
    const hostedZoneId = this.configService.get<string>(
      'ROUTE53_HOSTED_ZONE_ID',
    );
    const ipAddress = this.configService.get('ipAddress');

    const params: ChangeResourceRecordSetsCommandInput = {
      HostedZoneId: hostedZoneId,
      ChangeBatch: {
        Changes: [
          {
            Action: 'CREATE',
            ResourceRecordSet: {
              Name: `${subdomain}.${domain}`,
              Type: 'A',
              TTL: 300,
              ResourceRecords: [
                {
                  Value: ipAddress,
                },
              ],
            },
          },
        ],
      },
    };
   // const command = new ChangeResourceRecordSetsCommand(params);
    try {
      const response = await this.route53.changeResourceRecordSets(params).promise();
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
