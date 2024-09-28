import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplicationVersionEntity } from './auth/entities/application.version.entity';
import { Repository } from 'typeorm';
import { CreateApplicationVersionDto } from './dto/create-application-version.dto';
import { AppVersionDto } from './app-version.dto';
import * as fs from "fs"
import { Response200, ResponseOk } from './shared/utilities/response-Ok.dto';
import { createReadStream } from 'fs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppService {
  constructor(private jwtService:JwtService,
              @InjectRepository(ApplicationVersionEntity) private applicationVersionRepository:Repository<ApplicationVersionEntity>) {
  }

  async createApplicationVersion(createApplicationVersionDto:CreateApplicationVersionDto):Promise<void>
  {
      const applicationVersionEntity=new ApplicationVersionEntity()
      applicationVersionEntity.type=createApplicationVersionDto.type
      applicationVersionEntity.description=createApplicationVersionDto.description
      applicationVersionEntity.version=createApplicationVersionDto.version
      const saved=await this.applicationVersionRepository.save(applicationVersionEntity)
  }

  async checkAppVersion(appVersionDto:AppVersionDto):Promise<SentApp>
  {
    const findAppVersion=await this.applicationVersionRepository.find({where:{type:appVersionDto.type}})
    if (!findAppVersion)
      throw new NotFoundException(`Application Not Found`)

      const applicationVersion:ApplicationVersionEntity=findAppVersion[findAppVersion.length-1]

    if (applicationVersion.version>appVersionDto.version)
    {
      const appState=fs.statSync(process.cwd()+`/apps/android/totalAdvertiser_v${appVersionDto.version}.apk`)
        const appSize=appState.size
      const appVersion=applicationVersion.version
      const payload={appVersion}
      const token=await this.jwtService.sign(payload,{expiresIn:"12h"})
      const data:SentApp=
        {
          size:appSize,
          token:token,
          isForce:applicationVersion.isforce,
          link:`download/app/version`,
          isUpdate:true,
          description:applicationVersion.description,
          version:applicationVersion.version
        }
        return data
    }
    else
    {
        const data:SentApp=
          {
            size:0,
            isForce:applicationVersion.isforce,
            link:"",
            isUpdate:false,
            description:applicationVersion.description,
            version:applicationVersion.version,
            token:""
          }
      return data
    }
  }

  async downloadThisUrl(req):Promise<any>
  {
    const path:Token=req.user

    const file=createReadStream(process.cwd()+`/apps/android/totalAdvertiser_v${path.appVersion}.apk`)
    return new StreamableFile(file)
  }

  async checkForwarderAppVersion(appVersionDto:AppVersionDto):Promise<Response200> {
    const findAppVersion = await this.applicationVersionRepository.find({ where: { type: appVersionDto.type } })
    if (!findAppVersion)
      throw new NotFoundException(`Application Not Found`)

    const applicationVersion: ApplicationVersionEntity = findAppVersion[findAppVersion.length - 1]

    if (applicationVersion.version > appVersionDto.version) {
      const appState = fs.statSync(process.cwd() + `/apps/android/totalForwarder_v${appVersionDto.version}.apk`)
      const appSize = appState.size
      const appVersion = applicationVersion.version
      const payload = { appVersion }
      const token = await this.jwtService.sign(payload, { expiresIn: "12h" })
      const data: SentApp =
        {
          size: appSize,
          token: token,
          isForce: applicationVersion.isforce,
          link: `download/forwarder/app`,
          isUpdate: true,
          description: applicationVersion.description,
          version: applicationVersion.version
        }
      return ResponseOk.getData(data)
    }
    else
    {
      const data:SentApp=
        {
          size:0,
          isForce:applicationVersion.isforce,
          link:"",
          isUpdate:false,
          description:applicationVersion.description,
          version:applicationVersion.version,
          token:""
        }
      return ResponseOk.getData(data)
    }
  }

  async downloadForwarderApp(req):Promise<any>
  {
    const path:Token=req.user
    const file=createReadStream(process.cwd()+`/apps/android/totalForwarder_v${path.appVersion}.apk`)
    return new StreamableFile(file)
  }
}

class SentApp {
  version:number
  isUpdate:boolean
  isForce:boolean
  link:string
  description:string
  token:string
  size:number
}

class Token {
  appVersion:number
  iat:number
  exp:number
}