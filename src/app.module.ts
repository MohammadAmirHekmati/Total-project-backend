import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { AdvertiserModule } from './advertiser/advertiser.module';
import { RecipientModule } from './recipient/recipient.module';
import { AuthModule } from './auth/auth.module';
import { MyJwtModule } from './jwt/jwt.module';
import { SharedModule } from './shared/shared.module';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationVersionEntity } from './auth/entities/application.version.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfiguration } from './jwt/jwt.configuration';
import { JwtStrategy } from './auth/startegies/jwt.strategy';
import { LoggerMiddeware } from './shared/middlewares/logger.middeware';
import { ConfigurationModule } from './config/config.module';



@Module({
  imports: [DatabaseModule, AdvertiserModule, RecipientModule, AuthModule, MyJwtModule, SharedModule,TypeOrmModule.forFeature([ApplicationVersionEntity]),
  JwtModule.registerAsync({useClass:JwtConfiguration}),
  ConfigurationModule,
  ],
  controllers: [AppController],
  providers:[AppService,JwtModule,JwtStrategy]
})
export class AppModule {

}