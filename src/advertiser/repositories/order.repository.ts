import { EntityRepository, Repository } from 'typeorm';
import { OrderEntity } from '../models/order.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
@EntityRepository(OrderEntity)
export class OrderRepository extends Repository<OrderEntity>{

}