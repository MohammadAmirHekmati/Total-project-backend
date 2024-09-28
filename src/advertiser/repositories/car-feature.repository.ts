import { EntityRepository, Repository } from 'typeorm';
import { CarsFeatureEntity } from '../models/cars.feature.entity';
import { CreateCarFeatureDto } from '../dto/cars-feature/create-car-feature.dto';
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CarsTypeEntity } from '../models/cars-type.entity';

@Injectable()
@EntityRepository(CarsFeatureEntity)
export class CarFeatureRepository extends Repository<CarsFeatureEntity>{

  async createCarFeature(createCarFeatureDto:CreateCarFeatureDto):Promise<CarsFeatureEntity>
  {
    const {name}=createCarFeatureDto
    if (await this.findOne({where:{name:name.toLowerCase()}}))
      throw new ConflictException(`Feature Aleardy Exist`)

    const carFeature=new CarsFeatureEntity()
    carFeature.name=name.toLowerCase()
    const savedCarFeature=await this.save(carFeature)
    return savedCarFeature
  }

  async findCarFeatureById(car_feature_id:string):Promise<CarsFeatureEntity>
  {
    const findCarFeature=await this.findOne({where:{id:car_feature_id}})
    if (!findCarFeature)
      throw new NotFoundException(`Car Feature Not Found`)

    return findCarFeature
  }
}