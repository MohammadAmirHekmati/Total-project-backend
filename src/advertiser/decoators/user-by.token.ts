import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { GetUserByTokenDto } from '../dto/get-user-by-token.dto';

export const UserByToken=createParamDecorator(
  (data:any,ctx:ExecutionContext)=>{
      const request=ctx.switchToHttp().getRequest()
        const user:GetUserByTokenDto=request.user
    if (user.id)
      return user.id;

    if (user.userId)
      return user.userId;

    if (user.forwarderId)
      return user.forwarderId;

    else
      throw new UnauthorizedException()


  }

)