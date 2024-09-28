import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CarTypeRepository } from '../repositories/car-type.repository';
import { CreateCarsTypeDto } from '../dto/cars-type/create-cars-type.dto';
import { CarsTypeEntity } from '../models/cars-type.entity';

@Injectable()
export class CarTypeService {
  constructor(@InjectRepository(CarTypeRepository) private carTypeRepository:CarTypeRepository) {
  }

  async createCarType(createCarsTypeDto:CreateCarsTypeDto):Promise<CarsTypeEntity>
  {
    return await this.carTypeRepository.createCarType(createCarsTypeDto)
  }

  async getAllCarTyes():Promise<CarsTypeEntity[]>
  {
    const carTypes=await this.carTypeRepository.find()
    return carTypes
  }


}