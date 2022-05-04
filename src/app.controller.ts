import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  startOrder() {
    this.appService.setOrder();

    return 'ok';
  }
}
