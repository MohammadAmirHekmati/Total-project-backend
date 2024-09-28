import { EntityRepository, Repository } from 'typeorm';
import { PackingEntity } from '../models/packing.entity';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CarsTypeEntity } from '../models/cars-type.entity';
import { CreatePackingDto } from '../dto/packing/create-packing.dto';

@Injectable()
@EntityRepository(PackingEntity)
export class PackingRepository extends Repository<PackingEntity>{

  async createPacking(createPackingDto:CreatePackingDto):Promise<PackingEntity>
  {
    const {name}=createPackingDto
    if (await this.findOne({where:{name:name.toLowerCase()}}))
      throw new ConflictException()

    const packing=new PackingEntity()
    packing.name=name.toLowerCase()
    const saved=await this.save(packing)
    return saved
  }

  async findPackingById(packing_id:string):Promise<PackingEntity>
  {
    const findPacking=await this.findOne({where:{id:packing_id}})
    if (!findPacking)
      throw new NotFoundException()

    return findPacking
  }
}