import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PackingRepository } from '../repositories/packing.repository';
import { CreatePackingDto } from '../dto/packing/create-packing.dto';
import { PackingEntity } from '../models/packing.entity';

@Injectable()
export class PackingService {
  constructor(@InjectRepository(PackingRepository) private packingRepository:PackingRepository) {
  }

  async createPacking(createPackingDto:CreatePackingDto):Promise<PackingEntity>
  {
    return await this.packingRepository.createPacking(createPackingDto)
  }

  async getAllPackigs():Promise<PackingEntity[]>
  {
    const packings=await this.packingRepository.find()
    return packings
  }
}