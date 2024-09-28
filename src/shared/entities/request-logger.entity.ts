import { Entity, PrimaryGeneratedColumn,Column, CreateDateColumn,UpdateDateColumn } from 'typeorm';

@Entity()
export class RequestLoggerEntity {
  @PrimaryGeneratedColumn()
  id:number

  @Column()
  route:string

  @Column({nullable:true})
  os:string

  @Column({nullable:true})
  browser:string

  @Column()
  method:string

  @Column()
  responseTime:string

  @CreateDateColumn()
  createdAt:Date

}