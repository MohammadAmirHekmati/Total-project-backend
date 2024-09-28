import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './startegies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { PhoneVerifyCodeControllerEntity } from './entities/phone-verify-code-controller.entity';
import { JwtConfiguration } from '../jwt/jwt.configuration';
import { RoleRepository } from './repositories/role.repository';
import { RoleController } from './controllers/role.controller';
import { RoleService } from './services/role.service';
import { UserCotroller } from './controllers/user.cotroller';
import { UserService } from './services/user.service';
import { OrderRepository } from '../advertiser/repositories/order.repository';
import { ForwarderRepository } from '../recipient/repositories/forwarder.repository';
import { AdvertisePriceRepository } from '../recipient/repositories/advertise-price.repository';
import { OrderService } from '../advertiser/services/order.service';
import { LocationRepository } from '../advertiser/repositories/location.repository';
import { CarTypeRepository } from '../advertiser/repositories/car-type.repository';
import { PackingRepository } from '../advertiser/repositories/packing.repository';
import { ProductTypeRepository } from '../advertiser/repositories/product-type.repository';
import { TypeWeightRepository } from '../advertiser/repositories/type-weight.repository';
import { CarFeatureRepository } from '../advertiser/repositories/car-feature.repository';

@Module({
  imports:[TypeOrmModule.forFeature([UserRepository,PhoneVerifyCodeControllerEntity,RoleRepository,OrderRepository,ForwarderRepository,AdvertisePriceRepository,OrderRepository,LocationRepository,CarTypeRepository,PackingRepository,ProductTypeRepository,TypeWeightRepository,CarFeatureRepository,ForwarderRepository,AdvertisePriceRepository]),
  JwtModule.registerAsync({useClass:JwtConfiguration})
  ],
  controllers:[AuthController,RoleController,UserCotroller],
  providers:[AuthService,JwtModule,JwtStrategy,RoleService,UserService,OrderService]
})
export class AuthModule {}
