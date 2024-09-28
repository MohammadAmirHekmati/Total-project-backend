import { Body, Controller, Post, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TypeWeightService } from '../services/type-weight.service';
import { CreateTypeWeightDto } from '../dto/type-weight/create-type-weight.dto';
import { TypeWeightEntity } from '../models/type-weight.entity';
import { IpControllGuard } from '../../auth/guard/ip.controll.guard';
import { ResponseOkInterceptor, ResponseOkSerialize } from '../../shared/utilities/response-ok.interceptor';

@ApiTags("Weight Type")
@ResponseOkSerialize()
@Controller("weight/type")
export class TypeWeightController {
  constructor(private typeWeightService:TypeWeightService) {
  }

  @ApiOperation({summary:"Create Weight Types"})
  @UseGuards(IpControllGuard)
  @Post("create")
  async createTypeWeight(@Body(ValidationPipe) createTypeWeightDto:CreateTypeWeightDto):Promise<TypeWeightEntity>
  {
    return await this.typeWeightService.createTypeWeight(createTypeWeightDto)
  }
}