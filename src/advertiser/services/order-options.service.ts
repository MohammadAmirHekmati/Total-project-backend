import { Injectable } from '@nestjs/common';
import { CarTypeService } from './car-type.service';
import { LocationService } from './location.service';
import { PackingService } from './packing.service';
import { ProductTypeService } from './product-type.service';
import { TypeWeightService } from './type-weight.service';
import { Response200, ResponseOk } from '../../shared/utilities/response-Ok.dto';
import { AllOrderOptionsResponse } from '../interfaces/all-order-options.response';
import { CarFeatureService } from './car-feature.service';

@Injectable()
export class OrderOptionsService {
  constructor(private carTypeSerrvice:CarTypeService,
              private locationService:LocationService,
              private packingService:PackingService,
              private productTypesService:ProductTypeService,
              private typeWeightService:TypeWeightService,
              private carFeatureService:CarFeatureService
              ) {}

              async getAllOrderOptions():Promise<AllOrderOptionsResponse>
              {
                const carTypes=await this.carTypeSerrvice.getAllCarTyes()
                const locations=await this.locationService.getAllLocations()
                const packings=await this.packingService.getAllPackigs()
                const productTypes=await this.productTypesService.getAllProductTypes()
                const typeWeights=await this.typeWeightService.getAllTypeWeights()
                const carFeatures=await this.carFeatureService.getAllCarFeatures()
                const data:AllOrderOptionsResponse=
                  {
                    carTypes:carTypes,
                    carFeatures:carFeatures,
                    locations:locations,
                    packings:packings,
                    productTypes:productTypes,
                    typeWeights:typeWeights
                  }
                  return data
              }


}