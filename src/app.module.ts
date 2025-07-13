import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configModuleOpts } from '@config/app.config';
import { loggerModuleOpts } from '@config/logger.config';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigOpts } from '@config/orm.config';
import { ServiceModule } from './service/service.module';
import { StaffModule } from './staff/staff.module';
import { AppointmentModule } from './appointment/appointment.module';
import { AvailabilityModule } from './availability/availability.module';
import { WebhookModule } from './webhook/webhook.module';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOpts),
    LoggerModule.forRootAsync(loggerModuleOpts),
    TypeOrmModule.forRootAsync(TypeOrmConfigOpts),
    ServiceModule,
    StaffModule,
    AppointmentModule,
    AvailabilityModule,
    WebhookModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
