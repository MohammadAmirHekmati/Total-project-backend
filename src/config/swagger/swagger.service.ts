import { INestApplication, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { app } from '../../main';

@Injectable()
export class SwaggerService {
  constructor(private configService:ConfigService)
  {}

  get title():string
  {
    return this.configService.get<string>("swagger.title")
  }

  get description():string
  {
    return this.configService.get<string>("swagger.description")
  }

  get version():string
  {
    return this.configService.get<string>("swagger.version")
  }

  get tag():string
  {
    return this.configService.get<string>("swagger.tag")
  }

  get authOptionsType():string
  {
    return this.configService.get<string>("swagger.AuthOptionsType")
  }

  get authOptionsScheme():string
  {
    return this.configService.get<string>("swagger.authOptionsScheme")
  }

  get authOptionsFormat():string
  {
    return this.configService.get<string>("swagger.authOptionsFormat")
  }

  get authOptionsIn():string
  {
    return this.configService.get<string>("swagger.authOptionsIn")
  }

  get bearerAuthName():string
  {
    return this.configService.get<string>("swagger.bearerAuthName")
  }

  get prefix():string
  {
    return this.configService.get<string>("swagger.prefix")
  }

  initializeSwagger(app:INestApplication)
  {
    // Swagger Options and create
    const config = new DocumentBuilder()
      .setTitle(this.title)
      .setDescription(this.description)
      .setVersion(this.version)
      .addTag(this.tag)
      .addBearerAuth({type:"http",scheme:this.authOptionsScheme,bearerFormat:this.authOptionsFormat,in:this.authOptionsIn},
        this.bearerAuthName)
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(this.prefix, app, document);
  }
}