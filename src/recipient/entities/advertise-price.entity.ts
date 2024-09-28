import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AdvertisePriceEnum } from '../enums/advertise-price.enum';
import { ForwarderEntity } from './forwarder.entity';
import { OrderEntity } from '../../advertiser/models/order.entity';
import { OrderStatusEnum } from '../../advertiser/enums/order-status.enum';
import { BadRequestException } from '@nestjs/common';
import { ForwarderStatusEnum } from '../enums/forwarder-status.enum';

@Entity()
export class AdvertisePriceEntity {
  @PrimaryGeneratedColumn("uuid")
  id:string

  @Column()
  price:number

  @Column("enum",{enum:AdvertisePriceEnum,default:AdvertisePriceEnum.ACTIVE})
  status:AdvertisePriceEnum

  @ManyToOne(()=>ForwarderEntity,x=>x.obj_advertise_price)
  @JoinColumn()
  obj_forwarder:ForwarderEntity

  @ManyToOne(()=>OrderEntity,x=>x.obj_advertise_price)
  @JoinTable()
  obj_order:OrderEntity
  
  @CreateDateColumn()
  createdAt:Date

  @BeforeInsert()
  async checkOrderStatus()
  {
    const order=this.obj_order
    if (order.status==OrderStatusEnum.INACTIVE )
      throw new BadRequestException(`Order is InActive`)

    if (order.status==OrderStatusEnum.CONFIRMED)
      throw new BadRequestException(`Order Is Confirmed`)
  }

  @BeforeInsert()
  async checkForwarderStatus()
  {
    const forwarder=this.obj_forwarder
    if (forwarder.status==ForwarderStatusEnum.INACTIVE)
      throw new BadRequestException(`You're Account Is InActive`)
  }
}