import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class RoleEntity {
  @PrimaryGeneratedColumn("uuid")
  id:string

  @Column()
  name:string

  @CreateDateColumn()
  createdAt:Date

  @UpdateDateColumn()
  updatedAt:Date
}