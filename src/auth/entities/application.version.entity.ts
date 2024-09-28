import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ApplicationVersionEntity {
  @PrimaryGeneratedColumn("uuid")
  id:string

  @Column()
  version:number

  @Column()
  description:string

  @Column()
  type:number

  @Column({default:false})
  isforce:boolean
}