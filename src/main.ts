import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import helmet from 'helmet';
import { AppConfig } from '@config/app.config';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from '@common/filters/exception.filter';
import { setupSwagger } from '@config/swagger.config';

async function bootstrap() {
  console.info(`running as web`);

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  const config = app.get(ConfigService<AppConfig>);

  app.set('trust proxy', true);
  app.useLogger(app.get(Logger));
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          imgSrc: [`'self'`, 'data:', 'apollo-server-landing-page.cdn.apollographql.com'],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
          manifestSrc: [`'self'`, 'apollo-server-landing-page.cdn.apollographql.com'],
          frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
        },
      },
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());

  setupSwagger(app);

  const port = config.get('port', { infer: true })!;
  await app.listen(port);
}

bootstrap().catch(console.error);
