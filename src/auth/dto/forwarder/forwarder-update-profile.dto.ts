import { Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export class ForwarderUpdateProfileDto {
  @ApiProperty()
  firstname:string

  @ApiProperty()
  lastname:string

  @ApiProperty()
  mobile:string
}