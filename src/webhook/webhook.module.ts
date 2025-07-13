import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  exports: [WebhookService],
  controllers: [WebhookController],
  providers: [WebhookService],
  imports: [HttpModule, ConfigModule],
})
export class WebhookModule {}
