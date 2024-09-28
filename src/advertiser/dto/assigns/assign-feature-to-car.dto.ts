import { ApiProperty } from '@nestjs/swagger';

export class AssignFeatureToCarDto {
  @ApiProperty()
  car_id:string

  @ApiProperty()
  feature_id:string
}