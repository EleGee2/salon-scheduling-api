import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configModuleOpts } from '@config/app.config';
import { loggerModuleOpts } from '@config/logger.config';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigOpts } from '@config/orm.config';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOpts),
    LoggerModule.forRootAsync(loggerModuleOpts),
    TypeOrmModule.forRootAsync(TypeOrmConfigOpts),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
