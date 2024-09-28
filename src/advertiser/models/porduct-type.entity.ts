import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderEntity } from './order.entity';

@Entity()
export class ProductTypeEntity {
  @PrimaryGeneratedColumn("uuid")
  id:string

  @Column()
  name:string

  @CreateDateColumn({type:"timestamp"})
  createdAt:Date

  @UpdateDateColumn({type:"timestamp"})
  updatedAt:Date

  @OneToMany(()=>OrderEntity,x=>x.obj_product_type)
  @JoinColumn()
  obj_orders:OrderEntity
}