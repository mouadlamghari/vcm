import { Controller, Get, Query } from '@nestjs/common';
import axios from 'axios';

@Controller('repos')
export class ReposController {
  @Get()
  async getRepos(@Query('accessToken') accessToken: string) {
    try {
      const response = await axios.get('https://api.github.com/user/repos', {
        headers: {
          Authorization: `token ${accessToken}`,
        },
      });

      return response.data.map((e) => ({
        name: e.name,
        id: e.id,
        owner: e.owner.id,
      }));
    } catch (error) {
      console.error(error);
      throw new Error('Error retrieving repositories');
    }
  }
}
