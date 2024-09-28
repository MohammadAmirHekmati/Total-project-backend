import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeWeightRepository } from '../repositories/type-weight.repository';
import { CreateTypeWeightDto } from '../dto/type-weight/create-type-weight.dto';
import { TypeWeightEntity } from '../models/type-weight.entity';

@Injectable()
export class TypeWeightService {
  constructor(@InjectRepository(TypeWeightRepository) private typeWeightRepository:TypeWeightRepository) {
  }

  async createTypeWeight(createTypeWeightDto:CreateTypeWeightDto):Promise<TypeWeightEntity>
  {
    return await this.typeWeightRepository.createTypeWeight(createTypeWeightDto)
  }

  async getAllTypeWeights():Promise<TypeWeightEntity[]>
  {
    const typeWeights=await this.typeWeightRepository.find()
    return typeWeights
  }
}