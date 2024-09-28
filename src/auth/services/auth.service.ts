import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PhoneVerifyCodeControllerEntity } from '../entities/phone-verify-code-controller.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from '../dto/advertiser/register.user.dto';
import { UserRepository } from '../repositories/user.repository';
import { Response200, ResponseOk } from '../../shared/utilities/response-Ok.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginResponse } from '../interfaces/login.response';
import { SendSmsResponse } from '../interfaces/send.sms.response';
import { CheckOtpResponse } from '../interfaces/check-otp.response';
import { UserEntity } from '../entities/user.entity';
import { RoleRepository } from '../repositories/role.repository';
import { RoleService } from './role.service';
import { AssignRoleToUserDto } from '../dto/advertiser/assign-role-to-user.dto';
import { RegisterCheckOtpResponse } from '../interfaces/register-check-otp.response';
import { CheckOtpDto } from '../dto/check.otp.dto';
import { RegisterResponse } from '../interfaces/register.response';
import { SmsPannelDto } from '../dto/sms-pannel.dto';
import axios, { AxiosRequestConfig } from 'axios';
import { ForwarderRegisterDto } from '../dto/forwarder/forwarder.register.dto';
import { ForwarderRepository } from '../../recipient/repositories/forwarder.repository';
import { ForwarderEntity } from '../../recipient/entities/forwarder.entity';
import { AssignRoleToForwarderDto } from '../dto/assign-role-to-forwarder.dto';
import { ForwarderStatusEnum } from '../../recipient/enums/forwarder-status.enum';
import { UserStatusEnum } from '../enums/user.status';
import { OrderService } from '../../advertiser/services/order.service';
import { UpdateAdvertiserProfileDto } from '../dto/advertiser/update-advertiser-profile.dto';
import { ForwarderUpdateProfileDto } from '../dto/forwarder/forwarder-update-profile.dto';
import stream from 'node:stream';
import { UserFcmTokenDto } from '../dto/user-fcm-token.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService:JwtService,
              private orderService:OrderService,
              @InjectRepository(PhoneVerifyCodeControllerEntity) private phoneVerifyCodeControllerRepository:Repository<PhoneVerifyCodeControllerEntity>,
              @InjectRepository(UserRepository) private userRepository:UserRepository,
              @InjectRepository(RoleRepository) private roleRepository:RoleRepository,
              @InjectRepository(ForwarderRepository) private forwarderRepository:ForwarderRepository,
              private roleService:RoleService) {}

  async smsPannel(smsPannelDto:SmsPannelDto):Promise<void>
  {
    let data=
      {
        "op":"pattern",
        "user": "hampa724",
        "pass": "860936217",
        "fromNum": "3000505",
        "toNum":`${smsPannelDto.phone}`,
        "patternCode":"etrh176i6n" ,
        "inputData": [ { "verification-code" : `${smsPannelDto.code}`}]
      }

    const config:AxiosRequestConfig= {
      method: 'POST',
      headers: {
        'accept': "application/json",
        'Content-Type': "application/json"  },
      data: JSON.stringify(data),
      url : 'http://ippanel.com/api/select' ,
    }

    axios(config)
  }

  async forwarderAleardyExist(mobile:string):Promise<boolean>
  {
    const findForwarder=await this.forwarderRepository.findOne({where:{mobile:mobile,status:ForwarderStatusEnum.ACTIVE}})
    if (findForwarder)
      return true

    if (!findForwarder)
      return false
  }

  async isAdvertiserRegistered(phone:string):Promise<boolean>
  {
    const findAdvertiser=await this.userRepository.findOne({where:{phone:phone,status:UserStatusEnum.ACTIVE}})
    if (findAdvertiser)
      return true

    if (!findAdvertiser)
      return false
  }

  async dumpRandomNumber():Promise<string>
  {
    const min=1000
    const max=9000
    const randomNumber=Math.ceil( Math.random()*(max-min)+min)
    return randomNumber.toString()
  }

  async userFcmToken(user:string,userFcmTokenDto:UserFcmTokenDto):Promise<Object>
  {
    if (userFcmTokenDto.app==1)
    {
      const findAdvertiser=await this.userRepository.findOne({where:{id:user}})
      findAdvertiser.fcmToken=userFcmTokenDto.fcmToken
      const save=await this.userRepository.save(findAdvertiser)
    }
    if (userFcmTokenDto.app==2)
    {
      const findForwarder=await this.forwarderRepository.findOne({where:{id:user}})
      findForwarder.fcmToken=userFcmTokenDto.fcmToken
      const save=await this.forwarderRepository.save(findForwarder)
    }
      // const status=true
    return ResponseOk.getData({status:true})
  }

    // Send SMS For user and say advertiser is regestered or not
  async sendSms(phone:string):Promise<SendSmsResponse>
  {
    const isAdvertiserRegistered=await this.isAdvertiserRegistered(phone)
    const getRandomNumber=await this.dumpRandomNumber()
    const findNumber=await this.phoneVerifyCodeControllerRepository.findOne({where:{phone:phone}})

    if (!findNumber)
    {
      const phoneAndVerifyCode=new PhoneVerifyCodeControllerEntity()
      phoneAndVerifyCode.phone=phone
      phoneAndVerifyCode.verify_code=getRandomNumber
      const save=await this.phoneVerifyCodeControllerRepository.save(phoneAndVerifyCode)
      const smsPannelDto:SmsPannelDto=
        {
          phone:phone,
          code:getRandomNumber
        }
      const sendSms=await this.smsPannel(smsPannelDto)
      const data:SendSmsResponse=
        {
          status:"OK",
          registered:isAdvertiserRegistered
        }
      return data
    }
      else if (findNumber)
       {
        findNumber.verify_code=getRandomNumber
        const saved=this.phoneVerifyCodeControllerRepository.save(findNumber)
         const smsPannelDto:SmsPannelDto=
           {
             phone:phone,
             code:getRandomNumber
           }
           const sendSms=await this.smsPannel(smsPannelDto)
         const data:SendSmsResponse=
           {
             status:"OK",
             registered:isAdvertiserRegistered
           }
        return data
       }
  }

  async checkOtp(checkOtpDto:CheckOtpDto):Promise<RegisterCheckOtpResponse>
  {
    const {otpCode,phone}=checkOtpDto
      let status:boolean
    const date=new Date()
    const currentMinute=date.getUTCMinutes()
    const currentHour=date.getUTCHours()
    const findPhone=await this.phoneVerifyCodeControllerRepository.findOne({where:{phone}})
    if (!findPhone)
      throw new BadRequestException()

    const phoneUpdateAt=findPhone.updatedAt
    const updateAtMinute=phoneUpdateAt.getUTCMinutes()
    const updateAtHour=phoneUpdateAt.getUTCHours()
    if (currentMinute-2>=updateAtMinute && currentHour==updateAtHour)
    {
      const newStatus=status=false
     const data:RegisterCheckOtpResponse=
       {
         status:newStatus,
         token:""
       }
      return data
    }

    if (findPhone.verify_code!==otpCode)
    {
      const newStatus=status=false
      const data:RegisterCheckOtpResponse=
        {
          status:newStatus,
          token:""
        }
      return data
    }
    const payload={phone,otpCode}
    const token=await this.jwtService.sign(payload)
    const newStatus=status=true
    const data:RegisterCheckOtpResponse={
      status:newStatus,
      token:token
    }
    return data
  }

  async registerUser(registerUserDto:RegisterUserDto):Promise<RegisterResponse>
  {
    if (await this.userRepository.findOne({where:{phone:registerUserDto.phone}}))
      throw new ConflictException()

    const findRole=await this.roleRepository.findOne({where:{name:"advertiser"}})

    const user=new UserEntity()
    user.firstname=registerUserDto.firstname
    user.lastname=registerUserDto.lastname
    user.phone=registerUserDto.phone
    const userSaved:UserEntity=await this.userRepository.save(registerUserDto)

    const assignRoleToUserDto:AssignRoleToUserDto=
      {
        role_id:findRole.id,
        user_id:userSaved.id
      }
    const assign=await this.roleService.assignRoleToUser(assignRoleToUserDto)
    const assignResult:UserEntity=assign
    const {id,obj_roles}=assignResult
    const payload={id,obj_roles}
    const token=await this.jwtService.sign(payload,{expiresIn:"24h"})
    const data:RegisterResponse=
      {
        token:token
      }
    return data
  }

  async sendSmsLogin(phone:string):Promise<SendSmsResponse>
  {
    const findPhone=await this.userRepository.findOne({where:{phone:phone}})
    if (!findPhone)
      throw new NotFoundException(`There is no user for this phone number`)

    return await this.sendSms(phone)
  }

  async userLogin(checkOtpDto:CheckOtpDto):Promise<LoginResponse>
  {
    const {otpCode,phone}=checkOtpDto
    const user=await this.userRepository.findOne({where:{phone:phone},relations:["obj_roles"]})
        const userRole=user.obj_roles
          const userId=user.id

    const checkOtp=await this.checkOtp(checkOtpDto)
      const checkOtpResult:RegisterCheckOtpResponse=checkOtp

      const payload={userRole,userId}
      const token=await this.jwtService.sign(payload,{expiresIn:"24h"})

    const data:LoginResponse=
      {
        token:token,
        otpStatus:checkOtpResult.status
      }

      return data
  }

  async getAdvetiserInformation(user:string):Promise<UserEntity>
  {
    const getAdvertiserId=user

    const findAdvertiser=await this.userRepository.findOne({where:{id:getAdvertiserId}})
    if (!findAdvertiser)
      throw new NotFoundException(`Advertiser Not Found`)

    const data=findAdvertiser

    return data
  }

  async updateAdvertiserProfile(updateAdvertiserProfileDto:UpdateAdvertiserProfileDto,user:string):Promise<UserEntity>
  {
    const findAdvertiserId=user

    const findAdvertiser=await this.userRepository.findOne({where:{id:findAdvertiserId}})
    if (!findAdvertiser)
      throw new NotFoundException(`Advertiser Not Found`)

    findAdvertiser.firstname=updateAdvertiserProfileDto.firstname
    findAdvertiser.lastname=updateAdvertiserProfileDto.lastname
    findAdvertiser.phone=updateAdvertiserProfileDto.phone
    const data=await this.userRepository.save(findAdvertiser)
    return data
  }

  async forwarderSendSms(mobile:string):Promise<SendSmsResponse>
  {
    const isForwarderRegistered=await this.forwarderAleardyExist(mobile)

    const randomNumber=await this.dumpRandomNumber()
    const findNumber=await this.phoneVerifyCodeControllerRepository.findOne({where:{phone:mobile}})
    if (!findNumber)
    {
      const verifyPhoneNumber=new PhoneVerifyCodeControllerEntity()
      verifyPhoneNumber.phone=mobile
      verifyPhoneNumber.verify_code=randomNumber
      const save=await this.phoneVerifyCodeControllerRepository.save(verifyPhoneNumber)
      const smsPannelDto:SmsPannelDto=
        {
          phone:mobile,
          code:randomNumber
        }
        const sendSms=await this.smsPannel(smsPannelDto)
      const data:SendSmsResponse=
        {
          status:"OK",
          registered:isForwarderRegistered
        }
        return data
    }
    else if (findNumber)
    {
      findNumber.verify_code=randomNumber
      const save=await this.phoneVerifyCodeControllerRepository.save(findNumber)
      const smsPannelDto:SmsPannelDto=
        {
          phone:mobile,
          code:randomNumber
        }
        const sendSms=await this.smsPannel(smsPannelDto)
      const data:SendSmsResponse=
        {
          status:"OK",
          registered:isForwarderRegistered
        }
        return data
    }
  }

  async forwarderCheckOtp(checkOtpDto:CheckOtpDto):Promise<RegisterCheckOtpResponse>
  {
    const {otpCode,phone}=checkOtpDto
    let status:boolean
    const date=new Date()
    const currentMinute=date.getUTCMinutes()
    const currentHour=date.getUTCHours()
    const findPhone=await this.phoneVerifyCodeControllerRepository.findOne({where:{phone}})
    if (!findPhone)
      throw new BadRequestException()

    const phoneUpdateAt=findPhone.updatedAt
    const updateAtMinute=phoneUpdateAt.getUTCMinutes()
    const updateAtHour=phoneUpdateAt.getUTCHours()
    if (currentMinute-2>=updateAtMinute && currentHour==updateAtHour)
    {
      const newStatus=status=false
      const data:RegisterCheckOtpResponse=
        {
          status:newStatus,
          token:""
        }
      return data
    }

    if (findPhone.verify_code!==otpCode)
    {
      const newStatus=status=false
      const data:RegisterCheckOtpResponse=
        {
          status:newStatus,
          token:""
        }
      return data
    }
    const payload={phone,otpCode}
    const token=await this.jwtService.sign(payload)
    const newStatus=status=true
    const data:RegisterCheckOtpResponse={
      status:newStatus,
      token:token
    }
    return data
  }

  async forwarderRegister(forwarderRegisterDto:ForwarderRegisterDto):Promise<RegisterResponse>
  {
    if (await this.forwarderRepository.findOne({where:{mobile:forwarderRegisterDto.phone}}))
      throw new ConflictException(`Your number registered before`)

    const findForwarderRole=await this.roleRepository.findOne({where:{name:"forwarder"}})

    const forwarder=new ForwarderEntity()
    forwarder.mobile=forwarderRegisterDto.phone
    forwarder.firstname=forwarderRegisterDto.firstname
    forwarder.lastname=forwarderRegisterDto.lastname
    const saved=await this.forwarderRepository.save(forwarder)

    const assignRoleToForwarderDto:AssignRoleToForwarderDto=
      {
        role_id:findForwarderRole.id,
        forwarder_id:saved.id
      }
      const assignRoleToForwarder=await this.assignRoleToForwarder(assignRoleToForwarderDto)

    const {id,obj_roles}=assignRoleToForwarder
    const payload={id,obj_roles}
    const token=await this.jwtService.sign(payload,{expiresIn:"24h"})
    const data:RegisterResponse=
      {
        token:token
      }

    return data
  }

  async forwarderSendSmsLogin(mobile:string):Promise<SendSmsResponse>
  {
    const isForwarderRegistered=await this.forwarderAleardyExist(mobile)
      if (isForwarderRegistered==false)
        throw new NotFoundException(`Forwarder Not Registered Yet`)

    const getRandomNumber=await this.dumpRandomNumber()
    const findNumber=await this.phoneVerifyCodeControllerRepository.findOne({where:{phone:mobile}})

    if (!findNumber)
    {
      const phoneAndVerifyCode=new PhoneVerifyCodeControllerEntity()
      phoneAndVerifyCode.phone=mobile
      phoneAndVerifyCode.verify_code=getRandomNumber
      const save=await this.phoneVerifyCodeControllerRepository.save(phoneAndVerifyCode)
      const smsPannelDto:SmsPannelDto= {phone:mobile,code:getRandomNumber}
      const sendSms=await this.smsPannel(smsPannelDto)
      const data:SendSmsResponse= {status:"OK", registered:isForwarderRegistered}
      return data
    }

    else if (findNumber)
    {
      findNumber.verify_code=getRandomNumber
      const saved=this.phoneVerifyCodeControllerRepository.save(findNumber)
      const smsPannelDto:SmsPannelDto={phone:mobile,code:getRandomNumber}
      const sendSms=await this.smsPannel(smsPannelDto)
      const data:SendSmsResponse={status:"OK",registered:isForwarderRegistered}
      return data
    }
  }

  async forwarderLogin(checkOtpDto:CheckOtpDto):Promise<LoginResponse>
  {
    const {phone,otpCode}=checkOtpDto
    const forwarder=await this.forwarderRepository.findOne({where:{mobile:phone},relations:["obj_roles"]})
    const userRole=forwarder.obj_roles
    const forwarderId=forwarder.id

    const checkOtp=await this.checkOtp(checkOtpDto)
    const checkOtpResult:RegisterCheckOtpResponse=checkOtp

    const payload={userRole,forwarderId}
    const token=await this.jwtService.sign(payload,{expiresIn:"24h"})
    const data:LoginResponse=
      {
        token:token,
        otpStatus:checkOtpResult.status
      }

      return data
  }

  async getForwarderInformation(user:string):Promise<ForwarderEntity>
  {
    const forwarderId=user
    const findForwarder=await this.forwarderRepository.findOne({where:{id:forwarderId}})
    if (!findForwarder)
      throw new NotFoundException(`Forwarder Not Found`)

    const data=findForwarder
    return data
  }

  async updateForwarderProfile(forwarderUpdateProfileDto:ForwarderUpdateProfileDto,user:string):Promise<ForwarderEntity>
  {
    const findForwarderId=user
    const findForwarder=await this.forwarderRepository.findOne({where:{id:findForwarderId}})

    if (!findForwarder)
      throw new NotFoundException(`Forwarder Not Found`)

    findForwarder.firstname=forwarderUpdateProfileDto.firstname
    findForwarder.lastname=forwarderUpdateProfileDto.lastname
    findForwarder.mobile=forwarderUpdateProfileDto.mobile
    const data=await this.forwarderRepository.save(findForwarder)

    return data
  }

  async assignRoleToForwarder(assignRoleToForwarderDto:AssignRoleToForwarderDto):Promise<ForwarderEntity>
  {
    const findForwarder=await this.forwarderRepository.findOne({where:{id:assignRoleToForwarderDto.forwarder_id},relations:["obj_roles"]})
    if (!findForwarder)
      throw new NotFoundException(`User Not Found`)

    const findRole=await this.roleRepository.findOne({where:{id:assignRoleToForwarderDto.role_id}})
    if (!findRole)
      throw new NotFoundException(`Role NotFound`)

    const duplicateRelation=findForwarder.obj_roles.find(x=>x.id=assignRoleToForwarderDto.role_id)
    if (duplicateRelation)
      throw new ConflictException(`Relation Aleardy Exist`)

    findForwarder.obj_roles.push(findRole)
    const save=await this.forwarderRepository.save(findForwarder)
    return findForwarder
  }
}