import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { OrdersSort } from '../types/custom-types';

export class PaginationAndLocationOptions {
  @ApiProperty()
  @IsNotEmpty()
  limit:number

  @ApiProperty()
  @IsNotEmpty()
  page:number

  @ApiProperty()
  @IsNotEmpty()
  orderBy:OrdersSort

  @ApiProperty()
  @IsNotEmpty()
  countryId:string

  @ApiProperty()
  cityId:string
}