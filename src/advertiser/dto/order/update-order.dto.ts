import { ApiProperty } from '@nestjs/swagger';
import { AssignsDto } from './assigns.dto';
import { IsNotEmpty, IsNumber, IsObject, IsString, Validate } from 'class-validator';
import { CustomCheckCount } from '../../../shared/validations/custom-check-count';
import { CustomCheckWeight } from '../../../shared/validations/custom-check.weight';

export class UpdateOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Validate(CustomCheckCount)
  count:number

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Validate(CustomCheckWeight)
  weight:number

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  costumer_name:string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  costumer_phone:string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description:string

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  begin_date:number

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  completion_date:number

  @ApiProperty()
  @IsNotEmpty()
  @IsObject()
  assigns_id:AssignsDto
}