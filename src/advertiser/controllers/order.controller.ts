import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards, UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderService } from '../services/order.service';
import { CreateOrderDto } from '../dto/order/create-order.dto';
import { JwtGuard } from '../../auth/guard/jwt.guard';
import { UpdateOrderDto } from '../dto/order/update-order.dto';
import { SetPriceForOrderDto } from '../dto/set-price-for-order.dto';
import { Response200 } from '../../shared/utilities/response-Ok.dto';
import { UpdateOrderPriceDto } from '../dto/update-order-price.dto';
import { ConfimPriceByOrderOwnerDto } from '../dto/confim-price-by-order-owner.dto';
import { OrderStatusEnum } from '../enums/order-status.enum';
import { PaginationOptions } from '../../shared/dto/pagination.options';
import { OrdersSort } from '../../shared/types/custom-types';
import { UserByToken } from '../decoators/user-by.token';
import { PaginationAndLocationOptions } from '../../shared/dto/pagination-and-location.options';
import { DeleteOrderDto } from '../dto/order/delete-order.dto';
import { PaginatedOrders } from '../../shared/dto/paginated.orders';
import { OrderEntity } from '../models/order.entity';
import { ResponseOkInterceptor, ResponseOkSerialize } from '../../shared/utilities/response-ok.interceptor';

@ApiTags("Order")
@ResponseOkSerialize()
@Controller("order")
export class OrderController {
  constructor(private orderService:OrderService) {
  }

  @ApiOperation({summary:"Create an Advertise"})
  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard)
  @Post("create")
  async createOrder(@Body(ValidationPipe) createOrderDto:CreateOrderDto, @UserByToken() user:string):Promise<any>
  {
    return await this.orderService.createOrder(createOrderDto,user)
  }

  @ApiOperation({summary:"Update an Advertise"})
  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard)
  @Patch("update/:id")
  async updateOrder(@Body(ValidationPipe) updateOrderDto:UpdateOrderDto,@UserByToken() user:string,@Param("id") order_id:string):Promise<any>
  {
    return await this.orderService.updateOrder(updateOrderDto,order_id,user )
  }

  @ApiOperation({summary:"Delete an Advertise"})
  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard)
  @Patch("delete")
  async deleteOrderById(@Body(ValidationPipe) deleteOrderDto:DeleteOrderDto, @UserByToken() user:string):Promise<any>
  {
    return await this.orderService.deleteOrderById(deleteOrderDto,user)
  }

  @ApiOperation({summary:"Get a Advertiser Orders"})
  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard)
  @Post("get/user/orders")
  async getUserOrders(@Body(ValidationPipe) paginationOptions:PaginationOptions,@UserByToken() user:string):Promise<any>
  {
    return await this.orderService.getUserOrders(paginationOptions,user)
  }

  @ApiOperation({summary:"Forwarder can set price for advertise"})
  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard)
  @Post("set/price/order")
  async setPriceForOrder(@Body(ValidationPipe) setPriceForOrderDto:SetPriceForOrderDto,@UserByToken() user:string):Promise<any>
  {
    return await this.orderService.setPriceForOrder(setPriceForOrderDto, user)
  }

  @ApiOperation({summary:"Get all Prices for specific order"})
  @Get("get/prices/:id")
  async getOrderPrices(@Param("id") order_id:string):Promise<any>
  {
    return await this.orderService.getOrderPrices(order_id)
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard)  @ApiBearerAuth('access-token')
  @ApiOperation({summary:"Get advertises with status"})
  @Post("get/by/status/:status")
  async getOrdersByStatus(@Body(ValidationPipe) paginationOptions:PaginationOptions,@Param("status") status:OrderStatusEnum,@UserByToken() user:string):Promise<any>
  {
    return await this.orderService.getOrdersByStatus(paginationOptions,status,user)
  }

  @ApiOperation({summary:"Update price for specific order"})
  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard)
  @Post("update/order/price")
  async updateOrderPrice(@Body(ValidationPipe) updateOrderPriceDto:UpdateOrderPriceDto,@UserByToken() user:string):Promise<any>
  {
    return await this.orderService.updateOrderPrice(updateOrderPriceDto, user)
  }

  @ApiOperation({summary:"Advertiser can confirm a price for specefic order"})
  @Post("confirm/price")
  async confirmPriceByOrderOwner(@Body(ValidationPipe) confirmPriceByOrderOwnerDto:ConfimPriceByOrderOwnerDto):Promise<any>
  {
    return await this.orderService.confirmPriceByOrderOwner(confirmPriceByOrderOwnerDto)
  }

  @ApiOperation({summary:"All orders with status ACTIVE"})
  @Post("getall/status/active")
  async getOrderByStatusActive(@Body(ValidationPipe) paginationOptions:PaginationOptions):Promise<any>
  {
    return await this.orderService.getOrderByStatusActive(paginationOptions)
  }

  @ApiOperation({summary:"All advertises that forwarder set price with status"})
  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard)
  @Post("forwarder/by/status/:status")
  async getForwarderOrdersByStatus(@Body() paginationOptions:PaginationOptions,@Param("status") status:number,@UserByToken() user:string):Promise<any>
  {
    return await this.orderService.getForwarderOrdersByStatus(paginationOptions, status, user)
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard)
  @ApiOperation({summary:"Filter advertises by begin location"})
  @Post("by/begin/location")
  async getOrdersByBeginLocation(@Body(ValidationPipe) paginationOptions:PaginationAndLocationOptions,@UserByToken() user:string):Promise<any>
  {
    return await this.orderService.getOrdersByBeginLocation(paginationOptions,user)
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard)  @ApiBearerAuth('access-token')
  @ApiOperation({summary:"Filter advertises by destination location"})
  @Post("by/destination/location")
  async getOrderByDestinationLocation(@Body(ValidationPipe) paginationOptions:PaginationAndLocationOptions,@UserByToken() user:string):Promise<any>
  {
    return await this.orderService.getOrderByDestinationLocation(paginationOptions,user)
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard)
  @ApiOperation({summary:"Filter advertises by begin date"})
  @Post("by/begin/date/:date")
  async getOrderByBeginDate(@Body(ValidationPipe) paginationOptions:PaginationOptions,@Param("date") beginDate:number,@UserByToken() user:string):Promise<any>
  {
    return await this.orderService.getOrderByBeginDate(paginationOptions,beginDate,user)
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard)  @ApiBearerAuth('access-token')
  @ApiOperation({summary:"Filter advertises by completion date"})
  @Post("by/completion/date/:date")
  async getOrderByCompletionDate(@Body(ValidationPipe) paginationOptions:PaginationOptions ,@Param("date") completionDate:number,@UserByToken() user:string):Promise<any>
  {
    return await this.orderService.getOrderByCompletionDate(paginationOptions,completionDate,user)
  }

  @ApiOperation({summary:"Get specific order that forwarder set price and order is ACTIVE"})
  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard)
  @Get("forwarder/priced/:id")
  async getAForwarderOrder(@Param("id") orderId:string,@UserByToken() user:string):Promise<any>
  {
    return await this.orderService.getAForwarderOrder(orderId, user)
  }

  @ApiOperation({summary:"Get forwarder confirmed orders"})
  @ApiBearerAuth("access-token")
  @UseGuards(JwtGuard)
  @Post("forwarder/confirmed/orders")
  async getForwarderConfirmedOrder(@Body(ValidationPipe) paginationOptions:PaginationOptions,@UserByToken() user:string):Promise<any>
  {
    return await this.orderService.getForwarderConfirmedOrder(paginationOptions,user)
  }

  @ApiOperation({summary:"Get orders that forwarder has not priced yet"})
  @ApiBearerAuth("access-token")
  @UseGuards(JwtGuard)
  @Post("forwarder/that/dont/priced")
  async forwarderOrderThatForwarderHasentPrice(@Body() paginationOptions:PaginationOptions,@UserByToken() user:string):Promise<any>
  {
    return await this.orderService.forwarderOrderThatForwarderHasentPrice(paginationOptions,user)
  }
}