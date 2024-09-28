import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CarsTypeEntity } from './cars-type.entity';
import { OrderEntity } from './order.entity';

@Entity()
export class CarsFeatureEntity {
  @PrimaryGeneratedColumn("uuid")
  id:string

  @Column()
  name:string

  @CreateDateColumn({type:"timestamp"})
  createdAt:Date

  @UpdateDateColumn({type:"timestamp"})
  updatedAt:Date

  @ManyToOne(()=>CarsTypeEntity,x=>x.obj_cars_feature)
  @JoinColumn()
  obj_car_type:CarsTypeEntity

  @OneToMany(()=>OrderEntity,x=>x.obj_car_feature)
  @JoinColumn()
  obj_orders:OrderEntity[]
}