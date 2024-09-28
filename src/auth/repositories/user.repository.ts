import { EntityRepository, Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterUserDto } from '../dto/advertiser/register.user.dto';
import { PhoneVerifyCodeControllerEntity } from '../entities/phone-verify-code-controller.entity';
import { Response200, ResponseOk } from '../../shared/utilities/response-Ok.dto';

@Injectable()
@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity>{

}