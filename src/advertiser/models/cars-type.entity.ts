import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn, OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CarsFeatureEntity } from './cars.feature.entity';
import { OrderEntity } from './order.entity';

@Entity()
export class CarsTypeEntity {
  @PrimaryGeneratedColumn("uuid")
  id:string

  @Column()
  name:string

  @CreateDateColumn({type:"timestamp"})
  createdAt:Date

  @UpdateDateColumn({type:"timestamp"})
  updatedAt:Date

  @OneToMany(()=>OrderEntity,x=>x.obj_cars_type)
  @JoinColumn()
  obj_orders:OrderEntity[]

  @OneToMany(()=>CarsFeatureEntity,x=>x.obj_car_type)
  @JoinColumn()
  obj_cars_feature:CarsFeatureEntity[]
}