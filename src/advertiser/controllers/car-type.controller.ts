import { Body, Controller, Post, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CarTypeService } from '../services/car-type.service';
import { CreateCarsTypeDto } from '../dto/cars-type/create-cars-type.dto';
import { CarsTypeEntity } from '../models/cars-type.entity';
import { IpControllGuard } from '../../auth/guard/ip.controll.guard';
import { ResponseOkInterceptor, ResponseOkSerialize } from '../../shared/utilities/response-ok.interceptor';

@ApiTags("Car Type")
@ResponseOkSerialize()
@Controller("car/type")
export class CarTypeController {
  constructor(private carTypeService:CarTypeService) {
  }

  @ApiOperation({summary:"Create Car "})
  @UseGuards(IpControllGuard)
  @Post("create")
  async createCarType(@Body(ValidationPipe) createCarsTypeDto:CreateCarsTypeDto):Promise<CarsTypeEntity>
  {
    return await this.carTypeService.createCarType(createCarsTypeDto)
  }
}