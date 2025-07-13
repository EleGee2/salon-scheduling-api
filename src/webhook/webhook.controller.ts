import { Controller, Post, Body, Logger } from '@nestjs/common';

@Controller('webhooks')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  @Post('appointments')
  handleAppointmentWebhook(@Body() payload: any) {
    this.logger.log('Received appointment webhook payload:');
    this.logger.log(JSON.stringify(payload, null, 2));

    return { status: 'received' };
  }
}
