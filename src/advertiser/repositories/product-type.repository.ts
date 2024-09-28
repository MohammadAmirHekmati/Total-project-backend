import { EntityRepository, Repository } from 'typeorm';
import { ProductTypeEntity } from '../models/porduct-type.entity';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductTypeDto } from '../dto/product-type/create-product-type.dto';

@Injectable()
@EntityRepository(ProductTypeEntity)
export class ProductTypeRepository extends Repository<ProductTypeEntity>{

  async createProductType(createProductTypeDto:CreateProductTypeDto):Promise<ProductTypeEntity>
  {
    const {name}=createProductTypeDto
    if (await this.findOne({where:{name:name.toLowerCase()}}))
      throw new ConflictException()

    const productType=new ProductTypeEntity()
    productType.name=name.toLowerCase()
    const saved=await this.save(productType)
    return saved
  }

  async findProductTypeById(product_type_id:string):Promise<ProductTypeEntity>
  {
    const findProductType=await this.findOne({where:{id:product_type_id}})
    if (!findProductType)
      throw new NotFoundException()

    return findProductType
  }
}