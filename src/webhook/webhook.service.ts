import { AppConfig } from '@config/app.config';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AppointmentArg } from './types';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);
  private readonly webhookUrl: string | undefined;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService<AppConfig>,
  ) {
    this.webhookUrl = this.configService.get('webhook', { infer: true })?.url;
  }

  /**
   * Sends a webhook notification for a new appointment.
   * @param data - The newly appointment data.
   */
  async sendNewAppointmentWebhook(data: AppointmentArg): Promise<void> {
    if (!this.webhookUrl) {
      this.logger.warn('WEBHOOK_URL is not configured. Skipping webhook....');
      return;
    }

    const payload = {
      event: 'appointment.created',
      timestamp: new Date().toISOString(),
      data: {
        appointmentId: data.id,
        staffId: data.staffId,
        serviceId: data.serviceId,
        serviceName: data.serviceName,
        startTime: data.startTime,
        endTime: data.endTime,
      },
    };

    try {
      this.logger.log(`sending webhook to ${this.webhookUrl} for appointment #${data.id}`);
      await firstValueFrom(
        this.httpService.post(this.webhookUrl, payload, {
          headers: { 'Content-Type': 'application/json' },
        }),
      );
      this.logger.log(`successfully sent webhook for appointment #${data.id}`);
    } catch (error) {
      this.logger.error(
        `failed to send webhook for appointment #${data.id}: ${error.message}`,
        error.stack,
      );
    }
  }
}
