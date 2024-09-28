import { BadRequestException, CanActivate, ExecutionContext } from '@nestjs/common';
import { endWith } from 'rxjs/operators';

export class IpControllGuard implements CanActivate{
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request=context.switchToHttp().getRequest();
    const ip=request.connection.remoteAddress;

    if (ip=='::1') {
      return true;
    }
  }

}