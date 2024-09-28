import { Module } from '@nestjs/common';
import { CarFeatureController } from './controllers/car-feature.controller';
import { CarTypeController } from './controllers/car-type.controller';
import { LocationController } from './controllers/location.controller';
import { OrderController } from './controllers/order.controller';
import { PackingController } from './controllers/packing.controller';
import { ProductTypeController } from './controllers/product-type.controller';
import { TypeWeightController } from './controllers/type-weight.controller';
import { CarFeatureService } from './services/car-feature.service';
import { CarTypeService } from './services/car-type.service';
import { LocationService } from './services/location.service';
import { OrderService } from './services/order.service';
import { PackingService } from './services/packing.service';
import { ProductTypeService } from './services/product-type.service';
import { TypeWeightService } from './services/type-weight.service';
import { CarFeatureRepository } from './repositories/car-feature.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarTypeRepository } from './repositories/car-type.repository';
import { LocationRepository } from './repositories/location.repository';
import { OrderRepository } from './repositories/order.repository';
import { PackingRepository } from './repositories/packing.repository';
import { ProductTypeRepository } from './repositories/product-type.repository';
import { TypeWeightRepository } from './repositories/type-weight.repository';
import { OrderOptionsService } from './services/order-options.service';
import { OrderOptionsController } from './controllers/order-options.controller';
import { UserRepository } from '../auth/repositories/user.repository';
import { UserService } from '../auth/services/user.service';
import { ForwarderRepository } from '../recipient/repositories/forwarder.repository';
import { AdvertisePriceRepository } from '../recipient/repositories/advertise-price.repository';

@Module({
  controllers:[CarFeatureController,CarTypeController,LocationController,OrderController,PackingController,ProductTypeController,TypeWeightController,OrderOptionsController],
  providers:[CarFeatureService,CarTypeService,LocationService,OrderService,PackingService,ProductTypeService,TypeWeightService,OrderOptionsService,UserService],
  imports:[TypeOrmModule.forFeature([ForwarderRepository,AdvertisePriceRepository,CarFeatureRepository,CarTypeRepository,LocationRepository,OrderRepository,PackingRepository,ProductTypeRepository,UserRepository,TypeWeightRepository,])]
})
export class AdvertiserModule {}
