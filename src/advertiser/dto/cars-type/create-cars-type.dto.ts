import { ApiProperty } from '@nestjs/swagger';

export class CreateCarsTypeDto {
  @ApiProperty()
  name:string
}