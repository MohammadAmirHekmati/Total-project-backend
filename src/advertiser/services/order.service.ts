import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderRepository } from '../repositories/order.repository';
import { OrderEntity } from '../models/order.entity';
import { LocationRepository } from '../repositories/location.repository';
import { CreateOrderDto } from '../dto/order/create-order.dto';
import { CarTypeRepository } from '../repositories/car-type.repository';
import { PackingRepository } from '../repositories/packing.repository';
import { ProductTypeRepository } from '../repositories/product-type.repository';
import { TypeWeightRepository } from '../repositories/type-weight.repository';
import { Response200, ResponseOk } from '../../shared/utilities/response-Ok.dto';
import { OrderStatusEnum } from '../enums/order-status.enum';
import { UserRepository } from '../../auth/repositories/user.repository';
import { UserStatusEnum } from '../../auth/enums/user.status';
import { UserService } from '../../auth/services/user.service';
import { UpdateOrderDto } from '../dto/order/update-order.dto';
import { CarFeatureRepository } from '../repositories/car-feature.repository';
import { SetPriceForOrderDto } from '../dto/set-price-for-order.dto';
import { ForwarderRepository } from '../../recipient/repositories/forwarder.repository';
import { ForwarderStatusEnum } from '../../recipient/enums/forwarder-status.enum';
import { AdvertisePriceEntity } from '../../recipient/entities/advertise-price.entity';
import { AdvertisePriceRepository } from '../../recipient/repositories/advertise-price.repository';
import { SavedPriceResponse } from '../interfaces/saved-price.response';
import { UpdateOrderPriceDto } from '../dto/update-order-price.dto';
import { AdvertisePriceEnum } from '../../recipient/enums/advertise-price.enum';
import { ConfimPriceByOrderOwnerDto } from '../dto/confim-price-by-order-owner.dto';
import { PaginationOptions } from '../../shared/dto/pagination.options';
import { PaginatedOrders } from '../../shared/dto/paginated.orders';
import { PaginationAndLocationOptions } from '../../shared/dto/pagination-and-location.options';
import { DeleteOrderDto } from '../dto/order/delete-order.dto';
import { In } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(private userService:UserService,
    @InjectRepository(OrderRepository) private orderRepository:OrderRepository,
              @InjectRepository(LocationRepository) private locationRepository:LocationRepository,
              @InjectRepository(CarTypeRepository) private carTypeRepository:CarTypeRepository,
              @InjectRepository(PackingRepository) private packingRepository:PackingRepository,
              @InjectRepository(ProductTypeRepository) private productTypeRepository:ProductTypeRepository,
              @InjectRepository(TypeWeightRepository) private typeWeightRepository:TypeWeightRepository,
              @InjectRepository(UserRepository) private userRepository:UserRepository,
              @InjectRepository(CarFeatureRepository) private carFeatureRepository:CarFeatureRepository,
              @InjectRepository(ForwarderRepository) private forwarderRepository:ForwarderRepository,
              @InjectRepository(AdvertisePriceRepository) private advertisePriceRepository:AdvertisePriceRepository) {}

  async calculateDifferenceBetweenTwoDate(begin_date:number,completion_date:number):Promise<void>
  {
    if (completion_date<=begin_date)
      throw new BadRequestException(`Begin Date Cant be lower than Completion Date`);
  }

  async createOrder(createOrderDto:CreateOrderDto,user:string):Promise<OrderEntity>
  {
    const {begin_date,completion_date}=createOrderDto;
    const {car_type_id,destination_location_id,origin_location_id,packing_id,product_type_id,type_weight_id,car_feature_id,destination_country_id,origin_country_id}=createOrderDto.assigns_id;


    const userId:string=user
    const findUser=await this.userRepository.findOne({where:{id:userId},relations:["obj_orders"]});

    if (findUser.status==UserStatusEnum.BLOCK)
      throw new ForbiddenException(`User is blocked...!`);

    const order=new OrderEntity();
    order.costumer_name=createOrderDto.costumer_name;
    order.costumer_phone=createOrderDto.costumer_phone;
    order.begin_date=createOrderDto.begin_date;
    order.completion_date=createOrderDto.completion_date;
    order.weight=createOrderDto.weight;
    order.count=createOrderDto.count;
    order.description=createOrderDto.description;
    order.obj_cars_type=await this.carTypeRepository.findCarTypeById(car_type_id);
    order.obj_origin_location= await this.locationRepository.findOriginLocationById(origin_location_id);
    order.obj_packing=await this.packingRepository.findPackingById(packing_id);
    order.obj_product_type=await this.productTypeRepository.findProductTypeById(product_type_id);
    order.obj_destination_location=await this.locationRepository.findDistinationLocatinById(destination_location_id);
    order.obj_type_weight=await this.typeWeightRepository.findTypeWeightById(type_weight_id);
    order.obj_car_feature=await this.carFeatureRepository.findCarFeatureById(car_feature_id);
    order.obj_origin_country=await this.locationRepository.findOriginCountryById(origin_country_id)
    order.obj_destination_country=await this.locationRepository.findDestinationCountry(destination_country_id)
    const create=await this.orderRepository.create(order);
    const data=await this.orderRepository.save(create);

    findUser.obj_orders.push(data)
    const findOrder=await this.orderRepository.findOne({where:{id:data.id},relations:
        ['obj_origin_location','obj_destination_location','obj_type_weight','obj_product_type','obj_packing','obj_cars_type','obj_car_feature','obj_user',"obj_origin_country","obj_destination_country"]
    })
    findOrder.obj_user=findUser
    const saveOrder=await this.orderRepository.save(findOrder)
    delete saveOrder.obj_user
    return saveOrder
  }

  async deleteOrderById(deleteOrderDto:DeleteOrderDto,user:string):Promise<void>
  {
    const userId=user
    const findUser=await this.userRepository.findOne({where:{id:userId,status:UserStatusEnum.ACTIVE},relations:['obj_orders']});
    const userOrders:OrderEntity[]=findUser.obj_orders;

    const findOrder=await this.orderRepository.findOne({where:{id:deleteOrderDto.orderId}});
    const findOrderId:string=findOrder.id;

    if (!findOrder)
      throw new NotFoundException(`There is no User for this ID`);

    if (findOrder.status==OrderStatusEnum.INACTIVE)
      throw new BadRequestException(`Order aleardy is InActive`);

    const orderExistInUserOrder=userOrders.some(x=>x.id=findOrderId);
    if (orderExistInUserOrder==false)
      throw new BadRequestException(`This Order Is Not For This User`);

    findOrder.status=OrderStatusEnum.INACTIVE;
    findOrder.inActiveReason=deleteOrderDto.description
    const save=await this.orderRepository.save(findOrder);
  }

  async getUserOrders(paginationOptions:PaginationOptions,user:string):Promise<PaginatedOrders>
  {
    const {limit,page,orderBy}=paginationOptions
    const skip=(page-1)*limit
    const take=limit

    const userId=user
    const findUser=await this.userRepository.findOne({where:{id:userId},relations:['obj_orders']});

    if (!findUser)
      throw new NotFoundException(`User Not Found`);

    if (findUser.status==UserStatusEnum.BLOCK)
      throw new BadRequestException(`User is Block`);

    const findOrder=await this.orderRepository.find({order:{createdAt:orderBy},where:{obj_user:findUser},relations:
        ['obj_origin_location','obj_destination_location','obj_type_weight','obj_product_type','obj_packing','obj_cars_type',"obj_car_feature"]
      ,skip:skip,take:take});

    const total=await this.orderRepository.count({where:{obj_user:findUser},relations:
        ['obj_origin_location','obj_destination_location','obj_type_weight','obj_product_type','obj_packing','obj_cars_type',"obj_car_feature"]});

    const result:PaginatedOrders=
      {
        data:findOrder,
        limit:limit,
        page:page,
        total:total
      }

    const data=result;
    return  data
  }

  async updateOrder(updateOrderDto:UpdateOrderDto,order_id:string,user:string):Promise<OrderEntity>
  {
    const userId=user
    const {destination_location_id,type_weight_id,product_type_id,packing_id,origin_location_id,car_type_id,car_feature_id,destination_country_id,origin_country_id}=updateOrderDto.assigns_id;
    const findOrder=await this.orderRepository.findOne({where:{id:order_id},relations:['obj_origin_location','obj_destination_location','obj_type_weight','obj_product_type','obj_packing','obj_cars_type','obj_car_feature','obj_user']});
    if (!findOrder)
      throw new NotFoundException(`Order Not found`)

    const ownerOfOrderId:string=findOrder.obj_user.id;
    if (ownerOfOrderId!==userId)
      throw new ForbiddenException(`You cant change another user order`);

    // await this.calculateDifferenceBetweenTwoDate(updateOrderDto.begin_date,updateOrderDto.completion_date)

    findOrder.count=updateOrderDto.count;
    findOrder.weight=updateOrderDto.weight;
    findOrder.costumer_name=updateOrderDto.costumer_name;
    findOrder.costumer_phone=updateOrderDto.costumer_phone;
    findOrder.description=updateOrderDto.description;
    findOrder.begin_date=updateOrderDto.begin_date
    findOrder.completion_date=updateOrderDto.completion_date
    findOrder.obj_origin_location=await this.locationRepository.findOriginLocationById(origin_location_id);
    findOrder.obj_destination_location=await this.locationRepository.findDistinationLocatinById(destination_location_id);
    findOrder.obj_type_weight=await this.typeWeightRepository.findTypeWeightById(type_weight_id);
    findOrder.obj_product_type=await this.productTypeRepository.findProductTypeById(product_type_id);
    findOrder.obj_packing=await this.packingRepository.findPackingById(packing_id);
    findOrder.obj_cars_type=await this.carTypeRepository.findCarTypeById(car_type_id);
    findOrder.obj_car_feature=await this.carFeatureRepository.findCarFeatureById(car_feature_id);
    findOrder.obj_origin_country=await this.locationRepository.findOriginCountryById(origin_country_id)
    findOrder.obj_destination_country=await this.locationRepository.findDestinationCountry(destination_country_id)
    const orderInstance=await this.orderRepository.create(findOrder)
    const data=await this.orderRepository.save(orderInstance);
    return data
  }

  async setPriceForOrder(setPriceForOrderDto:SetPriceForOrderDto,user:string):Promise<SavedPriceResponse>
  {
    const forwarderId=user
    const findForwarder=await this.forwarderRepository.findOne({where:{id:forwarderId},relations:['obj_advertise_price']});
    if (!findForwarder)
      throw new NotFoundException(`Forwarder Not Found`);

    const findOrder=await this.orderRepository.findOne({where:{id:setPriceForOrderDto.order_id},relations:['obj_advertise_price']});
    if (!findOrder)
      throw new NotFoundException(`Order Not Found`);

    const duplicateAdPrice=await this.advertisePriceRepository.findOne({where:{obj_order:findOrder,obj_forwarder:findForwarder,status:AdvertisePriceEnum.ACTIVE}});
    if (duplicateAdPrice)
      throw new ConflictException(`You cant set price again`);

    const price=new AdvertisePriceEntity();
    price.price=setPriceForOrderDto.price;
    price.obj_order=findOrder;
    price.obj_forwarder=findForwarder;
    const createInstance=await this.advertisePriceRepository.create(price)
    const save_price=await this.advertisePriceRepository.save(createInstance);
    const data:SavedPriceResponse= { status:'OK' }
    return data
  }

  async getOrderPrices(order_id:string):Promise<AdvertisePriceEntity[]>
  {
    const findOrder=await this.orderRepository.findOne({where:{id:order_id},relations:['obj_advertise_price']});
    if (!findOrder)
      throw new NotFoundException(`Order Not Found`);
    // const orderPrices=findOrder.obj_advertise_price

    const findOrderPrices=await this.advertisePriceRepository.find({where:{obj_order:findOrder,status:AdvertisePriceEnum.ACTIVE},relations:['obj_forwarder']});

    // const findOrderPrices=await this.advertisePriceRepository.find({where:
    //     [
    //       {obj_order:findOrder},
    //       {status:0},
    //       {status:2}
    //   ],relations:['obj_forwarder']});
    const data=findOrderPrices;

    // const data:AdvertisePriceEntity[]=orderPrices
    return data
  }

  async getOrdersByStatus(paginationOptions:PaginationOptions,status:OrderStatusEnum,user:string):Promise<PaginatedOrders>
  {
    const {limit,page,orderBy}=paginationOptions
    const skip=(page-1)*limit
    const take=limit
      const findUser=await this.userRepository.findOne({where:{id:user}})

    if (status==OrderStatusEnum.INACTIVE)
    {
      const findOrderWithStatus=await this.orderRepository.find({order:{createdAt:orderBy},where:{obj_user:findUser,status:status},relations:['obj_origin_location','obj_destination_location','obj_type_weight',
          'obj_product_type','obj_packing','obj_cars_type','obj_car_feature'],take:take,skip:skip});

      const total=await this.orderRepository.count({order:{createdAt:orderBy},where:{status:status},relations:['obj_origin_location','obj_destination_location','obj_type_weight',
          'obj_product_type','obj_packing','obj_cars_type','obj_car_feature']});

      const result:PaginatedOrders=
        {
          total:total,
          page:page,
          limit:limit,
          data:findOrderWithStatus
        }

      const data=result;
      return data
    }
    else if (status==OrderStatusEnum.ACTIVE)
    {
      const findOrderWithStatus=await this.orderRepository.find({order:{createdAt:orderBy},where:{obj_user:findUser,status:In([OrderStatusEnum.CONFIRMED,OrderStatusEnum.ACTIVE])},relations:['obj_origin_location','obj_destination_location','obj_type_weight',
          'obj_product_type','obj_packing','obj_cars_type','obj_car_feature'],take:take,skip:skip});

      const total=await this.orderRepository.count({order:{createdAt:orderBy},where:{status:status},relations:['obj_origin_location','obj_destination_location','obj_type_weight',
          'obj_product_type','obj_packing','obj_cars_type','obj_car_feature']});

      const result:PaginatedOrders=
        {
          total:total,
          page:page,
          limit:limit,
          data:findOrderWithStatus
        }

      const data=result;
      return data
    }
  }

  async updateOrderPrice(updateOrderPriceDto:UpdateOrderPriceDto,user:string):Promise<AdvertisePriceEntity>
  {
    const forwarderId=user
      const findForwarder=await this.forwarderRepository.findOne({where:{id:forwarderId}});
          if (!findForwarder)
            throw new NotFoundException(`Forwarder Not Found`);

    const findOrder=await this.orderRepository.findOne({where:{id:updateOrderPriceDto.order_id}});
    if (!findOrder)
      throw new NotFoundException(`Order Not Found`);

    if (findOrder.status==OrderStatusEnum.INACTIVE)
      throw new ForbiddenException(`You cant change price for a InActive Order`);

    const findPrice=await this.advertisePriceRepository.findOne({where:{id:updateOrderPriceDto.price_id},relations:["obj_forwarder"]});
    if (!findPrice)
      throw new NotFoundException(`Price Not Found`);

    if (findPrice.status==AdvertisePriceEnum.INACTIVE)
      throw new BadRequestException(`You Desabled Your Price`);

    if (findPrice.obj_forwarder.id!==findForwarder.id)
      throw new ForbiddenException(`You cant Change another user price`);

    findPrice.price=updateOrderPriceDto.price;
    findPrice.status=updateOrderPriceDto.status
    const data=await this.advertisePriceRepository.save(findPrice);

    return data
  }

  async confirmPriceByOrderOwner(confirmPriceByOrderOwnerDto:ConfimPriceByOrderOwnerDto):Promise<Object>
  {
    const findOrder=await this.orderRepository.findOne({where:{id:confirmPriceByOrderOwnerDto.order_id}});
    if (!findOrder)
      throw new NotFoundException(`Order Not Found`);

    if (findOrder.status==OrderStatusEnum.INACTIVE || findOrder.status==OrderStatusEnum.CONFIRMED)
      throw new BadRequestException(`You cant confirm this order`);

    const findAdvetisePrice=await this.advertisePriceRepository.findOne({where:{id:confirmPriceByOrderOwnerDto.price_id}});
    if (!findAdvetisePrice)
      throw new NotFoundException(`Advertise Price Not Found`);

    if (findAdvetisePrice.status==AdvertisePriceEnum.CONFIRMED || findAdvetisePrice.status==AdvertisePriceEnum.INACTIVE)
      throw new BadRequestException(`You cant confirm order with this price`);

    findOrder.status=OrderStatusEnum.CONFIRMED;
    findAdvetisePrice.status=AdvertisePriceEnum.CONFIRMED;
    const save_order=await this.orderRepository.save(findOrder);
    const save_advertiser_price=await this.advertisePriceRepository.save(findAdvetisePrice);

    const data= { status:'Price Confirmed' }
    return data
  }

  async getOrderByStatusActive(paginationOptions:PaginationOptions):Promise<PaginatedOrders>
  {
    const {limit,page,orderBy}=paginationOptions
    const skip=(page-1)*limit
    const take=limit

    const findOrderByStatusActive=await this.orderRepository.find({order:{createdAt:orderBy},where:{status:OrderStatusEnum.ACTIVE},relations:['obj_origin_location','obj_destination_location','obj_type_weight',
        'obj_product_type','obj_packing','obj_cars_type','obj_car_feature'],take:take,skip:skip});

    const total=await this.orderRepository.count({order:{createdAt:orderBy},where:{status:OrderStatusEnum.ACTIVE},relations:['obj_origin_location','obj_destination_location','obj_type_weight',
        'obj_product_type','obj_packing','obj_cars_type','obj_car_feature'],take:take,skip:skip});

    const result:PaginatedOrders=
      {
        data:findOrderByStatusActive,
        limit:limit,
        page:page,
        total:total
      }

    // const connection:Connection=getConnection()
    // const queryRunner:QueryRunner=connection.createQueryRunner()
    // await queryRunner.connect()
    //
    // const findOrderByStatusActive=await queryRunner.manager.find(OrderEntity,{where:{status:OrderStatusEnum.ACTIVE}})
    // await queryRunner.release()

    // const findOrderByStatusActive=await this.orderRepository.createQueryBuilder()
    //   .select("orderentity")
    //   .from(OrderEntity,"orderentity")
    //   .where("orderentity.status= :status",{status:OrderStatusEnum.ACTIVE})
    //   .getMany()

    const data=result;
    return data
  }

  async getForwarderOrdersByStatus(paginationOptions:PaginationOptions,status:number,user:string):Promise<PaginatedOrders>
  {

    const {limit,orderBy,page}=paginationOptions
    const skip=(page-1)*limit
    const take=limit
    const data:OrderEntity[]=[]
    const findForwarder=await this.forwarderRepository.findOne({where:{id:user},relations:["obj_advertise_price"]})

    const find=await this.advertisePriceRepository.find({order:{createdAt:orderBy},where:{status:status,obj_forwarder:findForwarder},
      relations:["obj_order"],skip:skip,take:take})

    const total=await this.advertisePriceRepository.count({order:{createdAt:orderBy},where:{status:status,obj_forwarder:findForwarder},
      relations:["obj_order"],skip:skip,take:take})

    for (let element of find) {
      const findOrder=await this.orderRepository.findOne({where:{id:element.obj_order.id},
        relations:['obj_origin_location','obj_destination_location','obj_type_weight','obj_product_type','obj_packing','obj_cars_type','obj_car_feature','obj_user']})
      data.push(findOrder)
    }

    const paginatedOrders:PaginatedOrders=
      {
        total:total,
        page:page,
        limit:limit,
        data:data
      }

       return paginatedOrders
  }

  async getOrdersByBeginLocation(paginationOptions:PaginationAndLocationOptions,user:string):Promise<PaginatedOrders>
  {
    const {limit,orderBy,page}=paginationOptions
    const skip=(page-1)*limit
    const take=limit
      const findUser=await this.userRepository.findOne({where:{id:user}})
    if (paginationOptions.cityId && paginationOptions.countryId)
    {
      const findBeginLocation=await this.locationRepository.findOne({where:{id:paginationOptions.cityId}});
      if (!findBeginLocation)
        throw new NotFoundException(`Location NotFound`);

      const findOrdersByLocation=await this.orderRepository.find({order:{createdAt:orderBy},where:{obj_user:findUser,obj_origin_location:findBeginLocation,status:In([OrderStatusEnum.ACTIVE,OrderStatusEnum.CONFIRMED])},relations:
          ['obj_origin_location','obj_destination_location','obj_type_weight',
          'obj_product_type','obj_packing','obj_cars_type','obj_car_feature'],skip:skip,take:take});
      if (findOrdersByLocation.length<0)
        throw new NotFoundException(`There is no active order for this location`);

      const result:PaginatedOrders=
        {
          total:findOrdersByLocation.length,
          page:page,
          limit:limit,
          data:findOrdersByLocation
        }
      const data=result;
      return data
    }

    else if ( paginationOptions.countryId && !paginationOptions.cityId)
    {
      const findBeginLocation=await this.locationRepository.findOne({where:{id:paginationOptions.countryId}});
      if (!findBeginLocation)
        throw new NotFoundException(`Location NotFound`);

      const findOrdersByLocation=await this.orderRepository.find({order:{createdAt:orderBy},where:{obj_user:findUser,obj_origin_country:findBeginLocation,status:In([OrderStatusEnum.ACTIVE,OrderStatusEnum.CONFIRMED])},
        relations:['obj_origin_location','obj_destination_location','obj_type_weight',
          'obj_product_type','obj_packing','obj_cars_type','obj_car_feature'],skip:skip,take:take});
      if (findOrdersByLocation.length<0)
        throw new NotFoundException(`There is no active order for this location`);

      const result:PaginatedOrders=
        {
          total:findOrdersByLocation.length,
          page:page,
          limit:limit,
          data:findOrdersByLocation
        }
      const data=result;
      return data
    }
  }

  async getOrderByDestinationLocation(paginationOptions:PaginationAndLocationOptions,user:string):Promise<PaginatedOrders>
  {
    const {limit,orderBy,page}=paginationOptions
    const skip=(page-1)*limit
    const take=limit
    const findUser=await this.userRepository.findOne({where:{id:user}})
    if (paginationOptions.cityId && paginationOptions.countryId)
    {
      const findDestinationLocation=await this.locationRepository.findOne({where:{id:paginationOptions.cityId}});
      if (!findDestinationLocation)
        throw new NotFoundException(`Destination location not found`);

      const findOrderWithDestinationLocation=await this.orderRepository.find({order:{createdAt:orderBy},where:{obj_user:findUser,obj_destination_location:findDestinationLocation,status:In([OrderStatusEnum.ACTIVE,OrderStatusEnum.CONFIRMED])},
        relations:['obj_origin_location','obj_destination_location','obj_type_weight',
          'obj_product_type','obj_packing','obj_cars_type','obj_car_feature'],skip:skip,take:take});
      if (findOrderWithDestinationLocation.length<0)
        throw new NotFoundException(`There is no active order with this destination location`);

      const result:PaginatedOrders=
        {
          data:findOrderWithDestinationLocation,
          limit:limit,
          page:page,
          total:findOrderWithDestinationLocation.length
        }
      const data=result;
      return data
    }
      else if (!paginationOptions.cityId)
    {
      const findDestinationLocation=await this.locationRepository.findOne({where:{id:paginationOptions.countryId}});
      if (!findDestinationLocation)
        throw new NotFoundException(`Destination location not found`);

      const findOrderWithDestinationLocation=await this.orderRepository.find({order:{createdAt:orderBy},where:{obj_user:findUser,obj_destination_country:findDestinationLocation,status:In([OrderStatusEnum.ACTIVE,OrderStatusEnum.CONFIRMED])},
        relations:['obj_origin_location','obj_destination_location','obj_type_weight',
          'obj_product_type','obj_packing','obj_cars_type','obj_car_feature'],skip:skip,take:take});
      if (findOrderWithDestinationLocation.length<0)
        throw new NotFoundException(`There is no active order with this destination location`);

      const result:PaginatedOrders=
        {
          data:findOrderWithDestinationLocation,
          limit:limit,
          page:page,
          total:findOrderWithDestinationLocation.length
        }
      const data=result;
      return data
    }
  }

  async getOrderByBeginDate(paginationOptions:PaginationOptions,beginDate:number,user:string):Promise<PaginatedOrders>
  {

    const {limit,orderBy,page}=paginationOptions
    const skip=(page-1)*limit
    const take=limit
const findUser=await this.userRepository.findOne({where:{id:user}})
    const findOrder=await this.orderRepository.find({order:{createdAt:orderBy},where:{obj_user:findUser,begin_date:beginDate,status:In([OrderStatusEnum.ACTIVE,OrderStatusEnum.CONFIRMED])},relations:['obj_origin_location','obj_destination_location','obj_type_weight',
        'obj_product_type','obj_packing','obj_cars_type','obj_car_feature'],take:take,skip:skip});
    if (findOrder.length<0)
      throw new NotFoundException(`There is no Active Orders for this time`);

    const result:PaginatedOrders=
      {
        total:findOrder.length,
        page:page,
        limit:limit,
        data:findOrder
      }
    const data=result;
    return data
  }

  async getOrderByCompletionDate(paginationOptions:PaginationOptions,completionDate:number,user:string):Promise<PaginatedOrders>
  {
    const {limit,orderBy,page}=paginationOptions
    const skip=(page-1)*limit
    const take=limit
    const findUser=await this.userRepository.findOne({where:{id:user}})
    const findOrders=await this.orderRepository.find({order:{createdAt:orderBy},where:{obj_user:findUser,completion_date:completionDate,status:In([OrderStatusEnum.ACTIVE,OrderStatusEnum.CONFIRMED])},relations:['obj_origin_location','obj_destination_location','obj_type_weight',
        'obj_product_type','obj_packing','obj_cars_type','obj_car_feature'],skip:skip,take:take});
    if (findOrders.length<0)
      throw new NotFoundException(`There is no Active Order for this completion date`);

    const result:PaginatedOrders=
      {
        data:findOrders,
        limit:limit,
        page:page,
        total:findOrders.length
      }

    const data=result;
    return data
  }

  async getAForwarderOrder(orderId:string,user:string):Promise<Object>
  {
    const forwarderId=user
      const findForwarder=await this.forwarderRepository.findOne({where:{id:forwarderId},relations:['obj_advertise_price']});
    const forwarderAdvertisePrice=findForwarder.obj_advertise_price;

    const findOrder=await this.orderRepository.findOne({where:{id:orderId},relations:['obj_advertise_price']});
    const orderAdvertisePrice=findOrder.obj_advertise_price;

    for (let orderAdvertisePriceElement of orderAdvertisePrice)
    {
      for (let forwarderAdertisePriceElement of forwarderAdvertisePrice) {
        if (orderAdvertisePriceElement.id==forwarderAdertisePriceElement.id /* && forwarderAdertisePriceElement.status==AdvertisePriceEnum.ACTIVE && forwarderAdertisePriceElement.status==AdvertisePriceEnum.CONFIRMED */ )
        {
          const data= { status: true, data:forwarderAdertisePriceElement}
          return data
        }
        }
    }

    const data= { status:false, data:{} }
    return data
}

  async getForwarderConfirmedOrder(paginationOptions:PaginationOptions,user:string):Promise<PaginatedOrders>
  {
     const {limit,orderBy,page}=paginationOptions
     const skip=(page-1)*limit
     const take=limit
      const data:OrderEntity[]=[]
    const findForwarder=await this.forwarderRepository.findOne({where:{id:user},relations:["obj_advertise_price"]})
    // const forwaderConfirmedPrice=findForwarder.obj_advertise_price.filter(x=>x.status==AdvertisePriceEnum.CONFIRMED)

    const find=await this.advertisePriceRepository.find({order:{createdAt:orderBy},where:{status:AdvertisePriceEnum.CONFIRMED,obj_forwarder:findForwarder},
      relations:["obj_order"],skip:skip,take:take})

      const total=await this.advertisePriceRepository.count({order:{createdAt:orderBy},where:{status:AdvertisePriceEnum.CONFIRMED,obj_forwarder:findForwarder},
        relations:["obj_order"],skip:skip,take:take})

    for (let element of find) {
      const findOrder=await this.orderRepository.findOne({where:{id:element.obj_order.id},
        relations:['obj_origin_location','obj_destination_location','obj_type_weight','obj_product_type','obj_packing','obj_cars_type','obj_car_feature','obj_user']})
      data.push(findOrder)
    }

    const paginatedOrders:PaginatedOrders=
      {
        total:total,
        page:page,
        limit:limit,
        data:data
      }
    // for (let element of forwaderConfirmedPrice) {
    //   const findOrders=await this.orderRepository.findOne({where:{obj_advertise_price:element,status:OrderStatusEnum.CONFIRMED}})
    //
    // }

    return paginatedOrders


    //
    // const findForwarder=await this.forwarderRepository.findOne({where:{id:user}})
    // const forwarderId = findForwarder.id
    //
    //   const id=OrderStatusEnum.CONFIRMED
    // const query =
    //   createQueryBuilder('order_entity', 'o')
    //     .innerJoin('advertise_price_entity', 'p', 'o.id=p.objOrderId')
    //     .innerJoin('forwarder_entity', 'f', 'f.id=p.objForwarderId')
    //     .where('o.status=:id', {id})
    //     .andWhere('f.id=:forwarderId', {forwarderId})
    //     .orderBy("o.createdAt",orderBy)
    //     .skip(skip)
    //     .take(take)
    //     .loadAllRelationIds({relations:["obj_origin_country","obj_destination_country","obj_origin_location","obj_destination_location",
    //       "obj_type_weight","obj_product_type","obj_packing","obj_cars_type","obj_car_feature"],disableMixedMap:true})
    //
    // const result = await query.getMany();
    //
    //
    //
    //   return ResponseOk.getData(result)

  }

  async forwarderOrderThatForwarderHasentPrice(paginationOptions:PaginationOptions,user:string):Promise<PaginatedOrders>
  {
    const {limit,orderBy,page}=paginationOptions
    const skip=(page-1)*limit
    const take=limit

    const findForwarder=await this.forwarderRepository.findOne({where:{id:user},relations:["obj_advertise_price"]})
    const forwarderAdvertise=findForwarder.obj_advertise_price
    if (forwarderAdvertise.length==0)
    {
      const findOrders=await this.orderRepository.find({take:take,skip:skip,order:{createdAt:orderBy},relations:['obj_origin_location','obj_destination_location','obj_type_weight',
          'obj_product_type','obj_packing','obj_cars_type','obj_car_feature']})
      const total=await this.orderRepository.count({take:take,skip:skip,order:{createdAt:orderBy}})
      const paginatedOrders:PaginatedOrders=
        {
          data:findOrders,
          limit:limit,
          page:page,
          total:total
        }
        return paginatedOrders
    }

    const finOrders=await this.orderRepository.find({relations:['obj_origin_location','obj_destination_location','obj_type_weight',
        'obj_product_type','obj_packing','obj_cars_type','obj_car_feature']})
      let result:OrderEntity[]=[]
    for (let element of forwarderAdvertise) {
      const findForwarderOrder=await this.advertisePriceRepository.findOne({where:{id:element.id},relations:["obj_order"]})
      const forwarderOrder=findForwarderOrder.obj_order
      result=finOrders.filter(x=>x.id!==forwarderOrder.id)
    }
    const paginated=result.slice((page-1)*limit,page*limit)
    const paginatedOrders:PaginatedOrders=
      {
        total:result.length,
        page:page,
        limit:limit,
        data:paginated
      }
    return paginatedOrders
  }
}