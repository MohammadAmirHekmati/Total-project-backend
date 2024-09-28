import { ApiProperty } from '@nestjs/swagger';

export class CreateCarFeatureDto {

  @ApiProperty()
  name:string
}