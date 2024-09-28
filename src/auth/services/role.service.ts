import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleRepository } from '../repositories/role.repository';
import { CreateRoleDto } from '../dto/create-role.dto';
import { Response200, ResponseOk } from '../../shared/utilities/response-Ok.dto';
import { RoleEntity } from '../entities/role.entity';
import { create } from 'domain';
import { AssignRoleToUserDto } from '../dto/advertiser/assign-role-to-user.dto';
import { UserRepository } from '../repositories/user.repository';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class RoleService {
  constructor(@InjectRepository(RoleRepository) private roleRepository:RoleRepository,
              @InjectRepository(UserRepository) private userRepository:UserRepository
              ) {
  }

  async createRole(createRoleDto:CreateRoleDto):Promise<RoleEntity>
  {
    return await this.roleRepository.createRole(createRoleDto)
  }

  async assignRoleToUser(assignRoleToUserDto:AssignRoleToUserDto):Promise<UserEntity>
  {
    const findUser=await this.userRepository.findOne({where:{id:assignRoleToUserDto.user_id},relations:["obj_roles"]})
    if (!findUser)
      throw new NotFoundException(`User Not Found`)

    const findRole=await this.roleRepository.findOne({where:{id:assignRoleToUserDto.role_id}})
    if (!findRole)
      throw new NotFoundException(`Role Not Found`)

    const duplicateRelation=findUser.obj_roles.find(x=>x.id==assignRoleToUserDto.role_id)
    if (duplicateRelation)
      throw new ConflictException(`Relation aleardy exist`)

    findUser.obj_roles.push(findRole)
    const data=await this.userRepository.save(findUser)
    return data
  }
}