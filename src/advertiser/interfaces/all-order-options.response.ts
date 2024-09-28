import { CarsTypeEntity } from '../models/cars-type.entity';
import { LocationEntity } from '../models/location.entity';
import { PackingEntity } from '../models/packing.entity';
import { ProductTypeEntity } from '../models/porduct-type.entity';
import { TypeWeightEntity } from '../models/type-weight.entity';
import { CarsFeatureEntity } from '../models/cars.feature.entity';

export class AllOrderOptionsResponse {
  carTypes:CarsTypeEntity[]
  locations:LocationEntity[]
  packings:PackingEntity[]
  productTypes:ProductTypeEntity[]
  typeWeights:TypeWeightEntity[]
  carFeatures:CarsFeatureEntity[]
}