import { Logger, NestMiddleware } from '@nestjs/common';
import {Request} from "express"
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestLoggerEntity } from '../entities/request-logger.entity';
import { UserAgentParserInterface } from '../interfaces/user-agent-parser.interface';
const parser=require("ua-parser-js")

export class LoggerMiddeware implements NestMiddleware{
  constructor(@InjectRepository(RequestLoggerEntity) private readonly requestLoggerRepo:Repository<RequestLoggerEntity>)
  {}
    logger=new Logger()
 use(req: Request, res: any, next: () => void): any {
    const startTime=new Date().getTime()
    req.on("end",async ()=>{
      const endTime=new Date().getTime()
      const userAgent:UserAgentParserInterface=parser(req.get("user-agent"))
      const responseTime=endTime-startTime
      const requestLogger=new RequestLoggerEntity()
      requestLogger.responseTime=`${responseTime} ms`
        requestLogger.browser=userAgent.browser.name
        requestLogger.os=userAgent.os.name
      requestLogger.route=req.path
      requestLogger.method=req.method
      const createInstance=await this.requestLoggerRepo.create(requestLogger)
      const save=await this.requestLoggerRepo.save(createInstance)
      this.logger.warn(`New Request route: ${save.route}  method: ${save.method}  OS: ${save.os}  browser: ${save.browser}  Response Time: ${save.responseTime}`)
    })
   next()
  }

}