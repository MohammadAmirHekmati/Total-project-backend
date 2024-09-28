import {
  Body,
  Controller,
  ExecutionContext,
  Get,
  NotFoundException,
  Post, Req,
  Res,
  UseGuards, UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateApplicationVersionDto } from './dto/create-application-version.dto';
import { AppVersionDto } from './app-version.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IpControllGuard } from './auth/guard/ip.controll.guard';
import { JwtGuard } from './auth/guard/jwt.guard';
import { ResponseOkInterceptor, ResponseOkSerialize } from './shared/utilities/response-ok.interceptor';


@ApiTags("app")
@Controller()
export class AppController {
  constructor(private appService:AppService) {
  }

  @ApiOperation({summary:"Say Hello to API Server"})
  @UseGuards(IpControllGuard)
  @ResponseOkSerialize()
  @Get()
  apiTest(): Object {
    return {checkup:"API is OK"}
  }

  @ApiOperation({summary:"Create apk app version"})
  @UseGuards(IpControllGuard)
  @Post("version/create")
  async createApplicationVersion(@Body(ValidationPipe) createApplicationVersionDto:CreateApplicationVersionDto):Promise<any>
  {
    return await this.appService.createApplicationVersion(createApplicationVersionDto)
  }

  @ApiOperation({summary:"Checking the app that user is playing"})
  @ResponseOkSerialize()
  @Post("check/app/version")
  async checkAppVersion(@Body() appVersionDto:AppVersionDto):Promise<any>
  {
    return await this.appService.checkAppVersion(appVersionDto)
  }

  @ApiOperation({summary:"Download the new App version"})
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @Get("download/app/version")
  async downloadThisUrl(@Req() req):Promise<any>
  {
    return await this.appService.downloadThisUrl(req)
  }

  @ApiOperation({summary:"Check app versions for forwarder "})
  @Post("check/forwarder/app/version")
  async checkForwarderAppVersion(@Body() appVersionDto:AppVersionDto):Promise<any>
  {
    return await this.appService.checkForwarderAppVersion(appVersionDto)
  }

  @ApiOperation({summary:"Download the new version of forwarder app"})
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @Get("download/forwarder/app")
  async downloadForwarderApp(@Req() req):Promise<any>
  {
    return await this.appService.downloadForwarderApp(req)
  }
}
