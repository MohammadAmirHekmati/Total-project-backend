import { ApiProperty } from '@nestjs/swagger';

export class AppVersionDto {
  @ApiProperty()
  type:number

  @ApiProperty()
  version:number
}