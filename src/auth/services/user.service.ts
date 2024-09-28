import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Response200, ResponseOk } from '../../shared/utilities/response-Ok.dto';
import { AssignOrderToUserDto } from '../dto/advertiser/assign-order-to-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../repositories/user.repository';
import { OrderRepository } from '../../advertiser/repositories/order.repository';
import { UserStatusEnum } from '../enums/user.status';
import { OrderStatusEnum } from '../../advertiser/enums/order-status.enum';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserRepository) private userRepository:UserRepository,
              @InjectRepository(OrderRepository) private orderRepository:OrderRepository
              ) {
  }

  async assignOrderToUser(assignOrderToUserDto:AssignOrderToUserDto):Promise<Response200>
  {
    const findUser=await this.userRepository.findOne({where:{id:assignOrderToUserDto.user_id,status:UserStatusEnum.ACTIVE},relations:["obj_orders"]})
    if (!findUser)
      throw new NotFoundException(`There is no user for this ID`)

    const findOrder=await this.orderRepository.findOne({where:{id:assignOrderToUserDto.order_id,status:OrderStatusEnum.ACTIVE},relations:["obj_user"]})
    if (!findOrder)
      throw new NotFoundException(`There is no order for this ID`)

    const duplicateRelation=await findUser.obj_orders.find(x=>x.id==assignOrderToUserDto.order_id)
    if (duplicateRelation)
      throw new ConflictException(`This relatio aleardy exist`)

    findUser.obj_orders.push(findOrder)
    findOrder.obj_user=findUser
    try {
      const create=await this.userRepository.create(findUser)
      const data=await this.userRepository.save(findUser)
      const saved_order=await this.orderRepository.save(findOrder)

      return ResponseOk.getData(data)
    }
    catch (e) {
      console.log(e);
    }
  }
}