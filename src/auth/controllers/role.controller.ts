import { Body, Controller, Post, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoleService } from '../services/role.service';
import { CreateRoleDto } from '../dto/create-role.dto';
import { AssignRoleToUserDto } from '../dto/advertiser/assign-role-to-user.dto';
import { IpControllGuard } from '../guard/ip.controll.guard';
import { ResponseOkInterceptor, ResponseOkSerialize } from '../../shared/utilities/response-ok.interceptor';

@UseGuards(IpControllGuard)
@ApiTags("Role")
@ResponseOkSerialize()
@Controller("role")
export class RoleController {
  constructor(private roleService:RoleService) {
  }

  @Post("create")
  async createRole(@Body(ValidationPipe) createRoleDto:CreateRoleDto):Promise<any>
  {
    return await this.roleService.createRole(createRoleDto)
  }

  @Post("assign/role/user")
  async assignRoleToUser(@Body(ValidationPipe) assignRoleToUserDto:AssignRoleToUserDto):Promise<any>
  {
    return await this.roleService.assignRoleToUser(assignRoleToUserDto)
  }
}