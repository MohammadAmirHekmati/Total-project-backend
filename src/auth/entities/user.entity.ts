import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserStatusEnum } from '../enums/user.status';
import { RoleEntity } from './role.entity';
import { OrderEntity } from '../../advertiser/models/order.entity';

@Entity()
export class UserEntity {

  @PrimaryGeneratedColumn("uuid")
  id:string

  @Column()
  firstname:string

  @Column()
  lastname:string

  @Column()
  phone:string

  @Column("enum",{enum:UserStatusEnum,default:UserStatusEnum.ACTIVE})
  status:UserStatusEnum

  @Column({nullable:true})
  fcmToken:string

  @ManyToMany(()=>RoleEntity, {nullable:true,cascade:true,onDelete:"CASCADE"})
  @JoinTable()
  obj_roles:RoleEntity[]

  @OneToMany(()=>OrderEntity,x=>x.obj_user)
  @JoinColumn()
  obj_orders:OrderEntity[]
}