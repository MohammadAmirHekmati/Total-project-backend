import { EntityRepository, Repository } from 'typeorm';
import { RoleEntity } from '../entities/role.entity';
import { ConflictException, Injectable } from '@nestjs/common';
import { Response200, ResponseOk } from '../../shared/utilities/response-Ok.dto';
import { CreateRoleDto } from '../dto/create-role.dto';

@Injectable()
@EntityRepository(RoleEntity)
export class RoleRepository extends Repository<RoleEntity>{

  async createRole(createRoleDto:CreateRoleDto):Promise<RoleEntity>
  {
    if (await this.findOne({where:{name:createRoleDto.name.toLowerCase()}}))
      throw new ConflictException(`Role Aleardy Exist`)

    const role=new RoleEntity()
    role.name=createRoleDto.name.toLowerCase()
    const data=await this.save(role)
    return data
  }
}