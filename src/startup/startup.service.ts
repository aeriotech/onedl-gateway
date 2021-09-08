import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class StartupService implements OnModuleInit {
  onModuleInit() {
    process.send('ready');
  }
}
