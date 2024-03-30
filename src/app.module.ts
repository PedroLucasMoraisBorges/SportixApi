import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserController } from './user/user.controller';
import { AuthController } from './auth/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { CourtModule } from './court/court.module';

@Module({
  imports: [JwtModule, UserModule, PrismaModule, AuthModule, CourtModule],
  controllers: [AppController, UserController, AuthController],
  providers: [
    {
      provide : APP_GUARD,
      useClass : JwtAuthGuard
    }
  ],
})
export class AppModule {}
