import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { OrdersSort } from '../types/custom-types';


export class PaginationOptions {
  @ApiProperty()
  @IsNotEmpty()
  limit:number

  @ApiProperty()
  @IsNotEmpty()
  page:number

  @ApiProperty()
  @IsNotEmpty()
  orderBy:OrdersSort

}