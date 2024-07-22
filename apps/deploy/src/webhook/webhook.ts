// src/webhooks/webhooks.controller.ts
import { Controller, Post, Body, Query, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { Octokit } from 'octokit';
import fetch from 'node-fetch';

@Controller('webhooks')
export class WebhooksController {
  @Post('create')
  async createWebhook(
    @Query('accessToken') accessToken: string,
    @Query('repo') repo: string,
    @Query('owner') owner: string,
  ) {
    const url = `https://api.github.com/repos/${owner}/${repo}/hooks`;
    const data = {
      name: 'web',
      active: true,
      events: ['push', 'pull_request'],
      config: {
        url: 'http://infinitehost.online/web',
        content_type: 'json',
        insecure_ssl: '0',
      },
    };
    const headers = {
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      Authorization: `token ${accessToken}`,
      'User-Agent': 'axios/1.7.2',
      'X-GitHub-Api-Version': '2022-11-28',
    };

    try {
      const response = await axios.post(url, data, { headers });
      console.log('Webhook created successfully:', response.data);
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error('Error creating webhook:', error.response.data);
        throw new HttpException(
          `Error creating webhook: ${error.response.data.message}`,
          error.response.status
        );
      } else {
        console.error('Error creating webhook:', error.message);
        throw new HttpException(
          `Error creating webhook: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  
  }

  @Post('handle')
  handleWebhook(@Body() body) {
    // Handle the webhook payload
    console.log('Received webhook event:', body);
  }
}
