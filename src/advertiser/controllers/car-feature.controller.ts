import { Body, Controller, Post, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CarFeatureService } from '../services/car-feature.service';
import { CreateCarFeatureDto } from '../dto/cars-feature/create-car-feature.dto';
import { CarsFeatureEntity } from '../models/cars.feature.entity';
import { IpControllGuard } from '../../auth/guard/ip.controll.guard';
import { AssignFeatureToCarDto } from '../dto/assigns/assign-feature-to-car.dto';
import { Response200 } from '../../shared/utilities/response-Ok.dto';
import { ResponseOkInterceptor, ResponseOkSerialize } from '../../shared/utilities/response-ok.interceptor';

@ApiTags("Car Feature")
@ResponseOkSerialize()
@Controller("car/feature")
export class CarFeatureController {
  constructor(private carFeatureService:CarFeatureService) {
  }

  @ApiOperation({summary:"Create and Car Feature"})
  @UseGuards(IpControllGuard)
  @Post("create")
  async createCarFeature(@Body(ValidationPipe) createCarFeatureDto:CreateCarFeatureDto):Promise<CarsFeatureEntity>
  {
    return await this.carFeatureService.createCarFeature(createCarFeatureDto)
  }

  // @UseGuards(IpControllGuard)
  @ApiOperation({summary:"Assign Car Feature to Car"})
  @Post("assign/to/car")
  async assignFeatureToCar(@Body(ValidationPipe) assignFeatureToCarDto:AssignFeatureToCarDto):Promise<any>
  {
    return await this.carFeatureService.assignFeatureToCar(assignFeatureToCarDto)
  }
}