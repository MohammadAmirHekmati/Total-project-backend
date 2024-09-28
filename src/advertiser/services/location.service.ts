import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocationRepository } from '../repositories/location.repository';
import { CreateLocationDto } from '../dto/location/create-location.dto';
import { LocationEntity } from '../models/location.entity';

@Injectable()
export class LocationService {
  constructor(@InjectRepository(LocationRepository) private locationRepository:LocationRepository) {
  }

  async createLocation(createLocationDto:CreateLocationDto):Promise<LocationEntity>
  {
    return await this.locationRepository.createLocation(createLocationDto)
  }

  async getAllLocations():Promise<LocationEntity[]>
  {
    const locations=await this.locationRepository.find()
    return locations
  }
}