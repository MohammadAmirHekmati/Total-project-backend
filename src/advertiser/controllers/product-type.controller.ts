import { Body, Controller, Post, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductTypeService } from '../services/product-type.service';
import { CreateProductTypeDto } from '../dto/product-type/create-product-type.dto';
import { ProductTypeEntity } from '../models/porduct-type.entity';
import { IpControllGuard } from '../../auth/guard/ip.controll.guard';
import { ResponseOkInterceptor, ResponseOkSerialize } from '../../shared/utilities/response-ok.interceptor';

@ApiTags("Product Type")
@ResponseOkSerialize()
@Controller("product/type")
export class ProductTypeController {
  constructor(private productTypeService:ProductTypeService) {
  }

  @ApiOperation({summary:"Create Product Types"})
  @UseGuards(IpControllGuard)
  @Post("create")
  async createProductType(@Body(ValidationPipe) createProductTypeDto:CreateProductTypeDto):Promise<ProductTypeEntity>
  {
    return await this.productTypeService.createProductType(createProductTypeDto)
  }
}