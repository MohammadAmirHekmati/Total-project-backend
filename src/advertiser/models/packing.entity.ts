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
export class PackingEntity {
  @PrimaryGeneratedColumn("uuid")
  id:string

  @Column()
  name:string

  @CreateDateColumn({type:"timestamp"})
  createdAt:Date

  @UpdateDateColumn({type:"timestamp"})
  updatedAt:Date

  @OneToMany(()=>OrderEntity,x=>x.obj_packing)
  @JoinColumn()
  obj_orders:OrderEntity[]
}