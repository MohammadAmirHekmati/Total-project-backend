import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { AdvertisePriceEnum } from '../../recipient/enums/advertise-price.enum';

export class UpdateOrderPriceDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  order_id:string

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  price:number

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  price_id:string

  @ApiProperty()
  @IsNotEmpty()
  status:AdvertisePriceEnum
}