import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { Client, TextChannel, MessageEmbed } from 'discord.js';
import { UserService } from 'src/user/user.service';

@Injectable()
export class DiscordService {
  private logger: Logger = new Logger('DiscordService');
  private client: Client;

  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {
    this.client = new Client({ intents: ['GUILDS'] });

    this.client.on('ready', async () => {
      this.logger.log('Discord client ready');
      await this.fetchLogChannel();
    });

    this.client.login(process.env.DISCORD_TOKEN);
  }

  private async fetchLogChannel() {
    return (await this.client.channels.fetch(
      process.env.DISCORD_LOG_CHANNEL_ID,
    )) as TextChannel;
  }

  async log(message: string) {
    const channel = await this.fetchLogChannel();
    return await channel.send(message);
  }

  async logUserEmbed(userId: number) {
    const user = await this.userService.getUser({ id: userId });
    const channel = await this.fetchLogChannel();
    const embed = new MessageEmbed()
      .addField('Username', user.username, true)
      .addField('Email', user.email)
      .addField('First name', user.profile.firstName)
      .addField('Last name', user.profile.lastName);

    return await channel.send({ embeds: [embed] });
  }
}
