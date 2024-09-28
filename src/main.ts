import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import {AdvertiserModule} from "./advertiser/advertiser.module";
import {RecipientModule} from "./recipient/recipient.module";
import * as basicAuth from "express-basic-auth"
import { SwaggerService } from './config/swagger/swagger.service';
export let app:INestApplication

async function bootstrap() {
  app= await NestFactory.create(AppModule,{cors:true});
  //App using  Use Global Pipe
    app.useGlobalPipes(new ValidationPipe())

  // App using basic express auth for swagger
    app.use(["/docs"],
      basicAuth({
        challenge:true,
        users:{"mohammad1153":"Amir11538832","masoud":"mahmoodzadeh"}}))

  //Initialize Swagger Module
  const swaggerService=app.get<SwaggerService>(SwaggerService)
  swaggerService.initializeSwagger(app)

  // App listening
  await app.listen(3805).then(()=>{
    console.log(`${AdvertiserModule.name} , ${RecipientModule.name}  Running on port 3805`)
  })
}
bootstrap();
