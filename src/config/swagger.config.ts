import { NestExpressApplication } from '@nestjs/platform-express';
import { ApiProperty, DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export class BaseResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;
}

class Paging {
  @ApiProperty()
  page: number;

  @ApiProperty()
  pages: number;

  @ApiProperty()
  size: number;

  @ApiProperty()
  total: number;
}

class ResponseMeta {
  @ApiProperty({ type: Paging })
  paging?: Paging | null;
}

export class PaginatedResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty()
  meta: ResponseMeta;
}

export const setupSwagger = (app: NestExpressApplication) => {
  const config = new DocumentBuilder()
    .setTitle('mira core api')
    .setDescription('pos for ambitious businesses')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [BaseResponseDto, PaginatedResponseDto],
    operationIdFactory: (_, mk) => mk,
  });
  SwaggerModule.setup('docs', app, document);
};
