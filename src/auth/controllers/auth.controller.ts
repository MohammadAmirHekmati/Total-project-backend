import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { RegisterUserDto } from '../dto/advertiser/register.user.dto';
import { JwtGuard } from '../guard/jwt.guard';
import { CheckOtpDto } from '../dto/check.otp.dto';
import { ForwarderRegisterDto } from '../dto/forwarder/forwarder.register.dto';
import { UpdateAdvertiserProfileDto } from '../dto/advertiser/update-advertiser-profile.dto';
import { ForwarderUpdateProfileDto } from '../dto/forwarder/forwarder-update-profile.dto';
import { UserByToken } from '../../advertiser/decoators/user-by.token';
import { UserFcmTokenDto } from '../dto/user-fcm-token.dto';
import { ResponseOkInterceptor, ResponseOkSerialize } from '../../shared/utilities/response-ok.interceptor';

@ApiTags("Auth")
@ResponseOkSerialize()
@Controller("auth")
export class AuthController {
  constructor(private authService:AuthService) {
  }

  @ApiOperation({summary:"Set FCM Token for specific User "})
  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard)
  @Post("fcm/token")
  async userFcmToken(@UserByToken() user:string,@Body() userFcmTokenDto:UserFcmTokenDto):Promise<any>
  {
      return await this.authService.userFcmToken(user, userFcmTokenDto)
  }

  @ApiOperation({summary:"Send SMS for Advertiser App"})
  @Get("advertiser/verify/phone/:phone")
  async sendSms(@Param("phone") phone:string):Promise<any>
  {
    return await this.authService.sendSms(phone)
  }

  @ApiOperation({summary:"Advertiser Check OTP Code"})
  @Post("advertiser/check/otp")
  async checkOtp(@Body(ValidationPipe) checkOtpDto:CheckOtpDto):Promise<any>
  {
    return await this.authService.checkOtp(checkOtpDto)
  }

  @ApiOperation({summary:"Advertiser Register Account "})
  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard)
  @Post("advertiser/register")
  async registerUser(@Body(ValidationPipe) registerUserDto:RegisterUserDto):Promise<any>
  {
    return await this.authService.registerUser(registerUserDto)
  }

  @ApiOperation({summary:"Advertiser Send SMS for Login"})
  @Get("advertiser/send/sms/login/:phone")
  async sendSmsLogin(@Param("phone") phone:string):Promise<any>
  {
    return await this.authService.sendSmsLogin(phone)
  }

  @ApiOperation({summary:"Advertiser check OTP code and Login"})
  @Post("advertiser/login")
  async loginUser(@Body(ValidationPipe) checkOtpDto:CheckOtpDto):Promise<any>
  {
    return await this.authService.userLogin(checkOtpDto)
  }

  @ApiOperation({summary:"Get a specific Advertiser information "})
  @ApiBearerAuth("access-token")
  @UseGuards(JwtGuard)
  @Get("advertiser/info")
  async getAdvetiserInformation(@UserByToken() user:string):Promise<any>
  {
    return await this.authService.getAdvetiserInformation(user)
  }

  @ApiOperation({summary:"Advertiser Update Profile"})
  @ApiBearerAuth("access-token")
  @UseGuards(JwtGuard)
  @Patch("advertiser/update/profile")
  async updateAdvertiserProfile(@Body(ValidationPipe) updateAdvertiserProfileDto:UpdateAdvertiserProfileDto,@UserByToken() user:string):Promise<any>
  {
    return await this.authService.updateAdvertiserProfile(updateAdvertiserProfileDto, user)
  }

  @ApiOperation({summary:"Forwarder Send SMS"})
  @Get("forwarder/verify/mobile/:mobile")
  async forwarderSendSms(@Param("mobile") mobile:string):Promise<any>
  {
    return await this.authService.forwarderSendSms(mobile)
  }

  @ApiOperation({summary:"Forwarder Check OTP code"})
  @Post("forwarder/check/otp")
  async forwarderCheckOtp(@Body(ValidationPipe) checkOtpDto:CheckOtpDto):Promise<any>
  {
    return await this.authService.forwarderCheckOtp(checkOtpDto)
  }

  @ApiOperation({summary:"Forwarder Register Account"})
  @ApiBearerAuth("access-token")
  @UseGuards(JwtGuard)
  @Post("forwarder/register")
  async forwarderRegister(@Body(ValidationPipe) forwarderRegisterDto:ForwarderRegisterDto):Promise<any>
  {
    return await this.authService.forwarderRegister(forwarderRegisterDto)
  }

  @ApiOperation({summary:"Send SMS Forwarder for login"})
  @Get("forwarder/send/sms/login/:mobile")
  async forwarderSendSmsLogin(@Param("mobile") mobile:string):Promise<any>
  {
    return await this.authService.forwarderSendSmsLogin(mobile)
  }

  @ApiOperation({summary:"Forwarder Check OTP code and Login"})
  @Post("forwarder/login")
  async forwarderLogin(@Body(ValidationPipe) checkOtpDto:CheckOtpDto):Promise<any>
  {
    return await this.authService.forwarderLogin(checkOtpDto)
  }

  @ApiOperation({summary:"Get a specific Forwarder Information"})
  @ApiBearerAuth("access-token")
  @UseGuards(JwtGuard)
  @Get("forwarder/info")
  async getForwarderInformation(@UserByToken() user:string):Promise<any>
  {
    return await this.authService.getForwarderInformation(user)
  }

  @ApiOperation({summary:"Forwarder Update Profile"})
  @ApiBearerAuth("access-token")
  @UseGuards(JwtGuard)
  @Patch("forwarder/update/profile")
  async updateForwarderProfile(@Body(ValidationPipe) forwarderUpdateProfileDto:ForwarderUpdateProfileDto,@UserByToken() user:string):Promise<any>
  {
    return await this.authService.updateForwarderProfile(forwarderUpdateProfileDto, user)
  }
}