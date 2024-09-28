import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import swaggerConfiguration from "./swagger/configuration"
import { SwaggerService } from './swagger/swagger.service';

@Module({
  imports:[ConfigModule.forRoot({
    load:[swaggerConfiguration]
  })],
  providers:[SwaggerService,ConfigService]
})
export class ConfigurationModule {}
