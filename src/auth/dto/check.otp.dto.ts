import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CheckOtpDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(4,4)
  otpCode:string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(11,11)
  phone:string
}