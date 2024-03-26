import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  
  @Injectable()
  export class LocalAuthGuard extends AuthGuard('local') {
    canActivate(context: ExecutionContext) {
      return super.canActivate(context);
    }
  
    handleRequest(error, user) {
      if (error || !user) {
        throw new UnauthorizedException(error?.message);
      }
  
      return user;
    }
  }