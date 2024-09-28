import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';


@Entity()
export class PhoneVerifyCodeControllerEntity {

  @PrimaryGeneratedColumn("uuid")
  id:string

  @Column({nullable:true})
  phone:string

  @Column({nullable:true})
  verify_code:string

  @CreateDateColumn()
  createdAt:Date

  @UpdateDateColumn()
  updatedAt:Date

}