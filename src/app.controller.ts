import { Controller, Get } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { SuccessResponseObject } from '@common/utils/http';

@Controller()
export class AppController {
  @ApiExcludeEndpoint()
  @Get()
  root(): SuccessResponseObject<null> {
    return new SuccessResponseObject('salon scheduling api', null);
  }
}
