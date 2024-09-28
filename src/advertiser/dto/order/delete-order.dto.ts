import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteOrderDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  orderId:string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description:string
}