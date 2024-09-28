import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CarFeatureRepository } from '../repositories/car-feature.repository';
import { CarsFeatureEntity } from '../models/cars.feature.entity';
import { CreateCarFeatureDto } from '../dto/cars-feature/create-car-feature.dto';
import { CarTypeRepository } from '../repositories/car-type.repository';
import { AssignFeatureToCarDto } from '../dto/assigns/assign-feature-to-car.dto';
import { tsconfigPathsBeforeHookFactory } from '@nestjs/cli/lib/compiler/hooks/tsconfig-paths.hook';
import { Response200, ResponseOk } from '../../shared/utilities/response-Ok.dto';

@Injectable()
export class CarFeatureService {
  constructor(@InjectRepository(CarFeatureRepository) private carFeatureRepository:CarFeatureRepository,
              @InjectRepository(CarTypeRepository) private carTypeRepository:CarTypeRepository
              ) {
  }

  async createCarFeature(createCarFeatureDto:CreateCarFeatureDto):Promise<CarsFeatureEntity>
  {
    return await this.carFeatureRepository.createCarFeature(createCarFeatureDto)
  }

  async assignFeatureToCar(assignFeatureToCarDto:AssignFeatureToCarDto):Promise<Object>
  {
    const findCar=await this.carTypeRepository.findOne({where:{id:assignFeatureToCarDto.car_id},relations:["obj_cars_feature"]})
    if (!findCar)
      throw new NotFoundException(`Car not exist`)

    const findFeature=await this.carFeatureRepository.findOne({where:{id:assignFeatureToCarDto.feature_id},relations:["obj_car_type"]})
    if (!findFeature)
      throw new NotFoundException(`Feature not exist`)

    const duplicateRelation=findCar.obj_cars_feature.find(x=>x.id==assignFeatureToCarDto.feature_id)
    if (duplicateRelation)
      throw new ConflictException(`Relation aleardy exist`)

    findCar.obj_cars_feature.push(findFeature)
    findFeature.obj_car_type=findCar
    const saved_car=await this.carTypeRepository.save(findCar)
    const saved_feature=await this.carFeatureRepository.save(findFeature)
    const data= {status: 'Relation was succesfully' }
    return data
  }

  async getAllCarFeatures():Promise<CarsFeatureEntity[]>
  {
    const findCarFeatures=await this.carFeatureRepository.find({relations:["obj_car_type"]})
    const findCarFeatureObjCarType=findCarFeatures.filter(x=>x.obj_car_type)
    return findCarFeatures
  }
}