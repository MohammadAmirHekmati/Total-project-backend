import { ApiProperty } from '@nestjs/swagger';

export class UpdateAdvertiserProfileDto {

  @ApiProperty()
  firstname:string

  @ApiProperty()
  lastname:string

  @ApiProperty()
  phone:string
}