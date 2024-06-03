import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import * as cors from 'cors'; // Importa o módulo cors
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
import { MailModule } from './mail/mail.module';
import { MyMailerService } from './mail/mail.service';
import { DashBoardModule } from './dashboard/dashboard.module';

@Module({
  imports: [JwtModule, UserModule, PrismaModule, AuthModule, CourtModule, MailModule, DashBoardModule],
  controllers: [AppController, UserController, AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    MyMailerService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cors({
      origin: 'http://localhost:5173', // ou a origem específica da sua aplicação Angular
      credentials: true // permitir credenciais
    })).forRoutes('*'); // Aplica o middleware de CORS a todas as rotas
  }
}
