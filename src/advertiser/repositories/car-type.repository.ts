import { EntityRepository, Repository } from 'typeorm';
import { CarsTypeEntity } from '../models/cars-type.entity';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCarsTypeDto } from '../dto/cars-type/create-cars-type.dto';

@Injectable()
@EntityRepository(CarsTypeEntity)
export class CarTypeRepository extends Repository<CarsTypeEntity>{

  async createCarType(createCarsTypeDto:CreateCarsTypeDto):Promise<CarsTypeEntity>
  {
    const {name}=createCarsTypeDto
    if (await this.findOne({where:{name:name.toLowerCase()}}))
      throw new ConflictException()

    const carType=new CarsTypeEntity()
    carType.name=name.toLowerCase()
    const saved=await this.save(carType)
    return saved
  }

  async findCarTypeById(car_type_id:string):Promise<CarsTypeEntity>
  {
    const findCarType=await this.findOne({where:{id:car_type_id}})
    if (!findCarType)
      throw new NotFoundException()

    return findCarType
  }
}