import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  home() {
    return {
      application: 'Project Phoenix',
      version: '1.0.0',
      status: 'Running',
      description: 'AI-powered live streaming platform',
    };
  }

  @Get('health')
  health() {
    return {
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}