import { Body, Controller, Post, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocationService } from '../services/location.service';
import { CreateLocationDto } from '../dto/location/create-location.dto';
import { LocationEntity } from '../models/location.entity';
import { IpControllGuard } from '../../auth/guard/ip.controll.guard';
import { ResponseOkInterceptor, ResponseOkSerialize } from '../../shared/utilities/response-ok.interceptor';

@ApiTags("Location")
@ResponseOkSerialize()
@Controller("location")
export class LocationController {
  constructor(private locationService:LocationService) {
  }

  @ApiOperation({summary:"Create Some Location"})
  @UseGuards(IpControllGuard)
  @Post("create")
  async createLocation(@Body(ValidationPipe) createLocationDto:CreateLocationDto):Promise<LocationEntity>
  {
    return await this.locationService.createLocation(createLocationDto)
  }
}