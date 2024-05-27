import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { join } from 'path';

@Injectable()
export class MyMailerService {
  constructor(private readonly mailerService: MailerService) {}

  async sendUserConfirmation(user: any, subject: string, template: string) {
    console.log(join(process.cwd(), 'src', 'mail', 'templates'))
    await this.mailerService.sendMail({
      to: user.email,
      subject: subject,
      template: template,
      context: {  // Dados a serem passados para o template
        name: user.name
      },
    });
  }
}
