import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

export class JwtConfiguration implements JwtOptionsFactory{
  createJwtOptions(): Promise<JwtModuleOptions> | JwtModuleOptions {
    const options:JwtModuleOptions=
      {
        secret:"Abc12345678",
      }
      return options
  }

}