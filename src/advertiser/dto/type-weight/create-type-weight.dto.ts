import { ApiProperty } from '@nestjs/swagger';

export class CreateTypeWeightDto {
  @ApiProperty()
  name:string
}