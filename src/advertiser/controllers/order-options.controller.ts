import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrderOptionsService } from '../services/order-options.service';
import { ResponseOkInterceptor, ResponseOkSerialize } from '../../shared/utilities/response-ok.interceptor';

@ApiTags("Order Options")
@ResponseOkSerialize()
@Controller("order/option")
export class OrderOptionsController {
  constructor(private allService:OrderOptionsService) {
  }

  @ApiOperation({summary:"Get all Order Options"})
  @Get("get/all")
  async getAllOrderOptions():Promise<any>
  {
    return await this.allService.getAllOrderOptions()
  }
}