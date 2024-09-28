import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UserFcmTokenDto {
  @ApiProperty()
  @IsNumber()
  app:number

  @ApiProperty()
  @IsString()
  fcmToken:string
}