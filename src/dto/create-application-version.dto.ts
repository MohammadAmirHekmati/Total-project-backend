import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateApplicationVersionDto {
  @IsNotEmpty()
  @ApiProperty()
  version:number

  @IsNotEmpty()
  @ApiProperty()
  description:string

  @IsNotEmpty()
  @ApiProperty()
  type:number
}