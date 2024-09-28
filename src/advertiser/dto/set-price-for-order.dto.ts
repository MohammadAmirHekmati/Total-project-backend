import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class SetPriceForOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  order_id:string

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  price:number
}