import { CommonService } from '@app/common';
import { Injectable, NestMiddleware, HttpStatus, Inject } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { Request, Response, NextFunction } from 'express';
import * as mime from 'mime-types';
import * as path from 'path';

@Injectable()
export class FallbackMiddleware implements NestMiddleware {
  constructor(private commonService: CommonService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (!req.originalUrl.match('/deploy/instance')) {
      const { hostname } = req;
      const instance = await this.commonService.findOne(hostname);
      const reqPath = req.path;
      const contentType = mime.lookup(reqPath);

      const object = await this.commonService.getObject(
        'vcm',
        `${instance.project}/vcm.json`,
      );
      const json = JSON.parse(object.Body.toString());

      const isRouteMatch = json.routes.some((route) =>
        new RegExp(route.src).test(req.originalUrl),
      );

      if (isRouteMatch) {
        const content = await this.commonService.getObject(
          'vcm',
          path.join(`uploded/${instance.project}/dist`, 'index.html'),
        );
        res.set('Content-Type', 'text/html');
        return res.send(content.Body);
      } else {
        const content = await this.commonService.getObject(
          'vcm',
          `uploded/${instance.project}/dist${reqPath}`,
        );
        res.set('Content-Type', contentType || '');
        return res.send(content.Body);
      }
    }
    next();
  }
}