import { Body, Controller, Post, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PackingService } from '../services/packing.service';
import { CreatePackingDto } from '../dto/packing/create-packing.dto';
import { PackingEntity } from '../models/packing.entity';
import { IpControllGuard } from '../../auth/guard/ip.controll.guard';
import { ResponseOkInterceptor, ResponseOkSerialize } from '../../shared/utilities/response-ok.interceptor';

@ApiTags("Packing")
@ResponseOkSerialize()
@Controller("packing")
export class PackingController {
  constructor(private packingService:PackingService) {
  }

  @ApiOperation({summary:"Create Packing Type"})
  @UseGuards(IpControllGuard)
  @Post("create")
  async createPacking(@Body(ValidationPipe) createPackingDto:CreatePackingDto):Promise<PackingEntity>
  {
    return await this.packingService.createPacking(createPackingDto)
  }
}