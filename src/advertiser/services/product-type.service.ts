import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductTypeRepository } from '../repositories/product-type.repository';
import { CreateProductTypeDto } from '../dto/product-type/create-product-type.dto';
import { ProductTypeEntity } from '../models/porduct-type.entity';

@Injectable()
export class ProductTypeService {
  constructor(@InjectRepository(ProductTypeRepository) private productTypeRepository:ProductTypeRepository) {
  }

  async createProductType(createProductTypeDto:CreateProductTypeDto):Promise<ProductTypeEntity>
  {
    return await this.productTypeRepository.createProductType(createProductTypeDto)
  }

  async getAllProductTypes():Promise<ProductTypeEntity[]>
  {
    const getAllProductTypes=await this.productTypeRepository.find()
    return getAllProductTypes
  }

}