import { Injectable } from '@nestjs/common';
import { WebClient } from '@slack/web-api';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SlackService {
  constructor(private readonly prisma: PrismaService) {
    this.client = new WebClient(process.env.SLACK_TOKEN);
  }

  client: WebClient;

  async send(message: string) {
    await this.client.chat.postMessage({
      channel: process.env.SLACK_CHANNEL,
      text: message,
    });
  }

  async reportUserCount() {
    const userCount = await this.prisma.user.count();
    this.send(`There are ${userCount} users registered.`);
  }
}
