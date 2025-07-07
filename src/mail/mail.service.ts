import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    console.log('📧 MailService instancié');
    console.log('✅ SMTP_USER:', this.configService.get('SMTP_USER'));
    console.log('✅ SMTP_PASS:', this.configService.get('SMTP_PASS'));


    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: Number(this.configService.get<string>('SMTP_PORT')),
      secure: false, // true pour port 465
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });

    console.log('📡 Transporteur Nodemailer créé avec succès');
  }

  async sendVerificationEmail(email: string, code: string) {
    const html = `
      <p>Voici votre code de vérification YokaChat :</p>
      <h2 style="font-size: 24px; letter-spacing: 2px;">${code}</h2>
      <p>Ce code est valable pendant 10 minutes.</p>
    `;
  
    await this.transporter.sendMail({
      from: `"YokaChat" <${this.configService.get('SMTP_USER')}>`,
      to: email,
      subject: 'Votre code de vérification YokaChat',
      html,
    });
  }  
}
