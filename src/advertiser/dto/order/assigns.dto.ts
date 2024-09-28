import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AssignsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  origin_location_id:string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  destination_location_id:string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  type_weight_id:string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  product_type_id:string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  packing_id:string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  car_type_id:string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  car_feature_id:string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  origin_country_id:string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  destination_country_id:string
}