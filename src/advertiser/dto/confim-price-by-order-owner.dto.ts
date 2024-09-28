import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ConfimPriceByOrderOwnerDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  order_id:string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  price_id:string
}