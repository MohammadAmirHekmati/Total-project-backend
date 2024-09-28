import { ApiProperty } from '@nestjs/swagger';

export class CreatePackingDto {
  @ApiProperty()
  name:string
}