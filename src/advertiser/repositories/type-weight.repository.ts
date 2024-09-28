import { EntityRepository, Repository } from 'typeorm';
import { TypeWeightEntity } from '../models/type-weight.entity';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTypeWeightDto } from '../dto/type-weight/create-type-weight.dto';

@Injectable()
@EntityRepository(TypeWeightEntity)
export class TypeWeightRepository extends Repository<TypeWeightEntity>{

  async createTypeWeight(createTypeWeightDto:CreateTypeWeightDto):Promise<TypeWeightEntity>
  {
    const {name}=createTypeWeightDto
    if (await this.findOne({where:{name:name.toLowerCase()}}))
      throw new ConflictException()

    const typeWeight=new TypeWeightEntity()
    typeWeight.name=name.toLowerCase()
    const saved=await this.save(typeWeight)
    return saved
  }

  async findTypeWeightById(type_weight_id:string):Promise<TypeWeightEntity>
  {
    const findTypeWeight=await this.findOne({where:{id:type_weight_id}})
    if (!findTypeWeight)
      throw new NotFoundException()

    return findTypeWeight
  }
}