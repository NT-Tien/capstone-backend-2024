import * as nodemailer from 'nodemailer';

export type EmailPayload = {
  from: string;
  to: string;
  subject: string;
  html: string;
  mail_key: string;
};

export class SenderEmailService {
  async sendEmail(payload: EmailPayload): Promise<any> {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: payload.from,
        pass: payload.mail_key,
      },
    });

    const mailOptions = {
      from: payload.from,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    };

    transporter.sendMail(mailOptions, function (error: any, info: any) {
      if (error) {
        console.error(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
}
