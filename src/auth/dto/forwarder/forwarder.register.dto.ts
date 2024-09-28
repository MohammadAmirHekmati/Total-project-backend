import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ForwarderRegisterDto {
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
  phone:string
}