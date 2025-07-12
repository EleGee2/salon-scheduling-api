import { ConfigService } from '@nestjs/config';
import { IncomingMessage } from 'http';
import { LoggerModuleAsyncParams, Params } from 'nestjs-pino';
import { redactOptions, SerializedRequest, SerializedResponse } from 'pino';
import { AppConfig } from './app.config';
import { generateUUID } from '@common/utils';
import { UAParser } from 'my-ua-parser';
import { ServerResponse } from 'http';
import { Options } from 'pino-http';
import { Response } from 'express';

const extractPath = (url: string): string => {
  const match = url.match(/^[^?#]+/);
  return match ? match[0] : '';
};

const getReqLogMsg = (req: IncomingMessage) => `${req.method} ${extractPath(req.url!)}`;

const parseUserAgent = (ua: string) => {
  if (!ua) {
    return null;
  }

  const parsed = new UAParser(ua);

  return {
    browser: parsed.getBrowser(),
    device: parsed.getDevice(),
    os: parsed.getOS(),
  };
};

const serializers = {
  req: (req: SerializedRequest & { query: Record<string, string>; route: any }) => {
    const headers = req.headers || {};
    const rawUserAgent = headers['user-agent'];

    const logReqObj = {
      id: req.id,
      remoteAddress: req.remoteAddress,
      remotePort: req.remotePort,
      method: req.method,
      path: extractPath(req.url),
      url: req.url,
      headers: {
        host: headers.host,
        userAgent: rawUserAgent,
        accept: headers.accept,
        origin: headers.origin,
      },
      query: req.query,
      userAgent: parseUserAgent(rawUserAgent),
    };
    return logReqObj;
  },
  res: (res: SerializedResponse) => ({
    statusCode: res.statusCode,
    contentLength: Number(res?.headers['content-length']),
  }),
};

const generateRequestId = (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
  const existingID = req.id ?? req.headers['x-request-id'];
  if (existingID) {
    return existingID;
  }
  const id = generateUUID();
  res.setHeader('X-Request-Id', id);
  return id;
};

const redactionOpts: redactOptions = {
  paths: [
    'req.headers.authorization',
    'req.headers.Authorization',
    'req.headers["x-api-key"]',
    'headers.authorization',
    'headers.Authorization',
  ],
  censor: '***MASKED***',
};

const customLogLevel: Options['customLogLevel'] = (_, res, err) => {
  if (res.statusCode >= 400 && res.statusCode < 500) {
    return 'warn';
  }

  if (res.statusCode >= 500 || err) {
    return 'error';
  }

  return 'info';
};

export const getPinoConfig = (config: ConfigService<AppConfig>): Params => {
  const loggingConfig = config.get('logging', { infer: true })!;

  return {
    pinoHttp: {
      level: loggingConfig.level,
      formatters: { level: (label) => ({ level: label }) },
      redact: redactionOpts,
      customLogLevel,
      customSuccessMessage: getReqLogMsg,
      customErrorMessage: getReqLogMsg,
      autoLogging: loggingConfig.requestLoggerEnabled,
      serializers,
      genReqId: generateRequestId,
      quietReqLogger: true,
      customAttributeKeys: { reqId: 'requestId' },
      customProps: (_, res: Response) => ({
        context: 'RequestLogger',
        person: res.locals.person,
      }),
    },
  };
};

export const loggerModuleOpts: LoggerModuleAsyncParams = {
  inject: [ConfigService],
  useFactory: (c: ConfigService<AppConfig>) => getPinoConfig(c),
};
