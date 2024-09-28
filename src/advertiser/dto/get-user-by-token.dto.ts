import { RoleEntity } from '../../auth/entities/role.entity';

export class GetUserByTokenDto {
  userRole: RoleEntity[]
  userId?: string
  id?:string
  forwarderId?:string
  iat:number
  exp: number
}