// src/auth/auth.controller.ts
import { Controller, Get, Req, UseGuards, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubLogin() {
    // initiates the GitHub OAuth2 login flow
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Req() req, @Res() res) {
    // handles the GitHub OAuth2 callback
    res.cookie('access_token', req.user.accessToken, {
      httpOnly: true,    // Prevent JavaScript from accessing the cookie
      secure: true,      // Use HTTPS in production
      sameSite: 'lax',   // Protect against CSRF
      maxAge: 3600000,   // 1 hour expiry
    });
  
    res.redirect('/home');

    // res.redirect(`/home`);
  }
}
