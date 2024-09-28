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

@Entity({synchronize:true})
export class LocationEntity {
  @PrimaryGeneratedColumn("uuid")
  id:string

  @Column()
  name:string

  @CreateDateColumn({type:"timestamp"})
  createdAt:Date

  @UpdateDateColumn({type:"timestamp"})
  updatedAt:Date

  @Column({nullable:true})
  parent:string

  @OneToMany(()=>OrderEntity,x=>x.obj_origin_location)
  @JoinColumn()
  obj_order:OrderEntity[]
}