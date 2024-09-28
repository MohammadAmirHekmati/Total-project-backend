import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserStatusEnum } from '../../auth/enums/user.status';
import { ForwarderStatusEnum } from '../enums/forwarder-status.enum';
import { RoleEntity } from '../../auth/entities/role.entity';
import { AdvertisePriceEntity } from './advertise-price.entity';

@Entity()
export class ForwarderEntity {
  @PrimaryGeneratedColumn("uuid")
  id:string

  @Column()
  firstname:string

  @Column()
  lastname:string

  @Column()
  mobile:string

  @Column({nullable:true})
  fcmToken:string

  @Column("enum",{enum:ForwarderStatusEnum,default:ForwarderStatusEnum.ACTIVE})
  status:ForwarderStatusEnum

  @ManyToMany(()=>RoleEntity,{nullable:true,cascade:true,onDelete:"CASCADE"})
  @JoinTable()
  obj_roles:RoleEntity[]

  @OneToMany(()=>AdvertisePriceEntity,x=>x.obj_forwarder)
  @JoinColumn()
  obj_advertise_price:AdvertisePriceEntity[]
}