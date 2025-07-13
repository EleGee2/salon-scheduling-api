import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    const validApiKey = this.configService.get<string>('API_KEY');
    if (!validApiKey) {
      throw new UnauthorizedException('Server configuration error.');
    }

    // "faux" authentication check
    if (apiKey === validApiKey) {
      return true;
    }

    throw new UnauthorizedException('Invalid or missing API Key');
  }
}
