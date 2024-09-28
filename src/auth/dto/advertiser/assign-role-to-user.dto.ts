import { ApiProperty } from '@nestjs/swagger';

export class AssignRoleToUserDto {
  @ApiProperty()
  user_id:string

  @ApiProperty()
  role_id:string
}