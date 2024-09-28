import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class RegisterUserDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstname:string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastname:string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(11,11)
  phone:string
}