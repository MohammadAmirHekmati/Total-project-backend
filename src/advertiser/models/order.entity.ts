import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderStatusEnum } from '../enums/order-status.enum';
import { LocationEntity } from './location.entity';
import { TypeWeightEntity } from './type-weight.entity';
import { ProductTypeEntity } from './porduct-type.entity';
import { PackingEntity } from './packing.entity';
import { CarsTypeEntity } from './cars-type.entity';
import { UserEntity } from '../../auth/entities/user.entity';
import { CarsFeatureEntity } from './cars.feature.entity';
import { AdvertisePriceEntity } from '../../recipient/entities/advertise-price.entity';
import { BadRequestException } from '@nestjs/common';

@Entity()
export class OrderEntity {
  @PrimaryGeneratedColumn("uuid")
  id:string

  @Column()
  count:number

  @Column()
  weight:number

  @Column()
  costumer_name:string

  @Column({nullable:true})
  costumer_phone:string

  @Column("enum",{enum:OrderStatusEnum,default:OrderStatusEnum.ACTIVE})
  status:OrderStatusEnum

  @Column({nullable:true})
  inActiveReason:string

  @Column({nullable:true})
  description:string

  @Column({nullable:true})
  begin_date:number

  @Column({nullable:true})
  completion_date:number

  @CreateDateColumn({type:"timestamp"})
  createdAt:Date

  @UpdateDateColumn({type:"timestamp"})
  updatedAt:Date

  @ManyToOne(()=>LocationEntity,x=>x.obj_order)
  @JoinColumn({name:"Start-Country"})
  obj_origin_country:LocationEntity

  @ManyToOne(()=>LocationEntity,x=>x.obj_order)
  @JoinColumn()
  obj_destination_country:LocationEntity

  @ManyToOne(()=>LocationEntity,x=>x.obj_order)
  @JoinColumn({name:"Start-location-with-order"})
  obj_origin_location:LocationEntity

  @ManyToOne(()=>LocationEntity,x=>x.obj_order)
  @JoinColumn({name:"destination-location-with-order"})
  obj_destination_location:LocationEntity

  @ManyToOne(()=>TypeWeightEntity,x=>x.obj_orders)
  @JoinColumn({name:"type-weight-with-order"})
  obj_type_weight:TypeWeightEntity

  @ManyToOne(()=>ProductTypeEntity,x=>x.obj_orders)
  @JoinColumn({name:"product-type-with-order"})
  obj_product_type:ProductTypeEntity

  @ManyToOne(()=>PackingEntity,x=>x.obj_orders)
  @JoinColumn({name:"packing-with-order"})
  obj_packing:PackingEntity

  @ManyToOne(()=>CarsTypeEntity,x=>x.obj_orders)
  @JoinColumn({name:"car-type-with-order"})
  obj_cars_type:CarsTypeEntity

  @ManyToOne(()=>CarsFeatureEntity,x=>x.obj_orders)
  @JoinColumn({name:"car-feature-with-order"})
  obj_car_feature:CarsFeatureEntity

  @ManyToOne(()=>UserEntity,x=>x.obj_orders)
  @JoinColumn()
  obj_user:UserEntity

  @OneToMany(()=>AdvertisePriceEntity,x=>x.obj_order)
  @JoinTable({name:"prices-with-order"})
  obj_advertise_price:AdvertisePriceEntity[]

  @BeforeInsert()
  async checkCompletionDateAndBeginDate()
  {
    if (this.completion_date<=this.begin_date)
      throw new BadRequestException(`Completion date Cant be even or lower than begin date`)
  }

  @BeforeInsert()
  async checkOriginAndDestinationLocation()
  {
    if (this.obj_destination_location.id==this.obj_origin_location.id)
      throw new BadRequestException(`Locations cant be like each other`);
  }
  @BeforeInsert()
  async checkCount()
  {
    if (this.count<=0)
      throw new BadRequestException(`Count Cant be lower or equal 0`)
  }

  @BeforeInsert()
  async checkWeight()
  {
    if (this.weight<=0)
      throw new BadRequestException(`Weight cant be lower or equal 0`)
  }

  @BeforeInsert()
  async checkOriginAndOriginCountryMatch()
  {
    const originCity=this.obj_origin_location
    const originCountry=this.obj_origin_country
    if (originCity.parent!==originCountry.id)
      throw new BadRequestException(`Your Origin Chosen city should be for the chosen country`)
  }

  @BeforeInsert()
  async checkDestinationAndDestinationCountryMatch()
  {
    const destinationCity=this.obj_destination_location
    const destinationCountry=this.obj_destination_country
    if (destinationCity.parent!==destinationCountry.id)
      throw new BadRequestException(`Your Destination Chosen city should be for the chosen country`)
  }

  @BeforeUpdate()
  async checkOrderStatus()
  {
    const orderStatus=this.status
    if (orderStatus==OrderStatusEnum.INACTIVE)
      throw new BadRequestException(`Order Status Is InActive`)
  }

  @BeforeUpdate()
  async checkBeginAndCompletionDate()
  {
    if (this.completion_date<=this.begin_date)
      throw new BadRequestException(`Completion date Cant be even or lower than begin date`)
  }
}