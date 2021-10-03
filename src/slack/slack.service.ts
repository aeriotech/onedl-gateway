import { Injectable, Logger } from '@nestjs/common';
import { WebClient } from '@slack/web-api';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SlackService {
  private client: WebClient;
  private logger: Logger = new Logger(SlackService.name);

  constructor(private readonly prisma: PrismaService) {
    this.client = new WebClient(process.env.SLACK_TOKEN);
  }

  async send(message: string) {
    try {
      await this.client.chat.postMessage({
        channel: process.env.SLACK_CHANNEL,
        text: message,
      });
    } catch (e) {
      this.logger.error(e);
    }
  }

  async reportUserCount() {
    const userCount = await this.prisma.user.count();
    try {
      await this.send(`There are ${userCount} users registered.`);
    } catch (e) {
      this.logger.error(e);
    }
  }
}
