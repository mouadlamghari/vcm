// src/auth/github.strategy.ts
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { Injectable } from '@nestjs/common';
import { CommonService } from '@app/common';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private commonService: CommonService) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://infinitehost.online/auth/github/callback',
      scope: ['repo', 'read:org'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function,
  ) {
    const { id: githubId, username, emails, photos } = profile;
    const data = {
      githubId,
      username,
      accessToken,
      avatarUrl: photos[0].value,
    };
    const user = await this.commonService.getOrCreateUser(data);
    done(null, user);
  }
}
