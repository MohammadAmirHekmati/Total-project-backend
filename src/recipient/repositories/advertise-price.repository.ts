import { EntityRepository, Repository } from 'typeorm';
import { AdvertisePriceEntity } from '../entities/advertise-price.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
@EntityRepository(AdvertisePriceEntity)
export class AdvertisePriceRepository extends Repository<AdvertisePriceEntity>{

}