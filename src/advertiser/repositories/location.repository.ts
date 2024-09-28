import { EntityRepository, Repository } from 'typeorm';
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CarsTypeEntity } from '../models/cars-type.entity';
import { LocationEntity } from '../models/location.entity';
import { CreateLocationDto } from '../dto/location/create-location.dto';

@Injectable()
@EntityRepository(LocationEntity)
export class LocationRepository extends Repository<LocationEntity>{

  async createLocation(createLocationDto:CreateLocationDto):Promise<LocationEntity>
  {
    const {name,parent}=createLocationDto
    if (await this.findOne({where:{name:name.toLowerCase(),parent:parent}}))
      throw new ConflictException()

    const location=new LocationEntity()
    location.name=name.toLowerCase()
    location.parent=parent
    const saved=await this.save(location)
    return saved
  }

  async findOriginLocationById(origin_location_id:string):Promise<LocationEntity>
  {
    const findLoctaion=await this.findOne({where:{id:origin_location_id}})
    if (!findLoctaion)
      throw new NotFoundException()

    return findLoctaion
  }

  async findDistinationLocatinById(destination_location_id:string):Promise<LocationEntity>
  {
    const findLocation=await this.findOne({where:{id:destination_location_id}})
    if (!findLocation)
      throw new NotFoundException()

    return findLocation
  }

  async findOriginCountryById(countryId:string):Promise<LocationEntity>
  {
    const findCountry=await this.findOne({where:{id:countryId}})
    if (!findCountry)
      throw new NotFoundException()

    return findCountry
  }

  async findDestinationCountry(countryId:string):Promise<LocationEntity>
  {
    const findCountry=await this.findOne({where:{id:countryId}})
    if (!findCountry)
      throw new NotFoundException()

    return findCountry
  }
}