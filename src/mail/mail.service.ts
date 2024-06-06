import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { reservationObject } from 'src/court/entities/reservationObject.entity';

@Injectable()
export class MyMailerService {
  constructor(private readonly mailerService: MailerService) {}

  async sendUserConfirmation(user: any, subject: string, template: string) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: subject,
      template: template,
      context: {  // Dados a serem passados para o template
        name: user.name
      },
    });
  }

  async sendReservationAlert(email: string, subject: string, template: string, reservationObject : reservationObject) {
    await this.mailerService.sendMail({
      to: email,
      subject: subject,
      template: template,
      context: {  // Dados a serem passados para o template
        reservationObject: reservationObject
      },
    });
  }

  async sendReserveCanceled(email: string, subject: string, template: string, reservationObject) {
    await this.mailerService.sendMail({
      to: email,
      subject: subject,
      template: template,
      context: {  // Dados a serem passados para o template
        reservationObject
      },
    });
  }
}
