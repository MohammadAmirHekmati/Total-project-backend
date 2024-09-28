import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddeware } from './middlewares/logger.middeware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestLoggerEntity } from './entities/request-logger.entity';

@Module({
  imports:[TypeOrmModule.forFeature([RequestLoggerEntity])]
})
export class SharedModule implements NestModule{
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(LoggerMiddeware)
      .forRoutes("*")
  }
}
