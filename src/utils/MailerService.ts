import config from '../config';

const hbs = require('nodemailer-express-handlebars');

export default class MailerService {
  configEmail: any;
  GmailTransport: any;

  constructor() {
    this.GmailTransport = config.MAIL.GmailTransport;

    console.log('///////////////////////////////////////////////////////////');
    console.log('///////////////////////////////////////////////////////////');
    console.log('///////////////////////////////////////////////////////////');
    console.log('envia a', this.GmailTransport);

    this.GmailTransport.verify((err: any, success: any) => {
      if (err) {
        console.error(err);
      }
    });

    config.MAIL.ViewOption(this.GmailTransport, hbs);
    this.configEmail = {
      from: `${config.PROJECT} <${config.EMAIL}>`,
      to: '',
      subject: `- ${config.PROJECT}`,
      template: '',
      context: {}
    };
  }

  public async SendWelcomeEmail(user: any) {
    const HelperOptions = {
      ...this.configEmail,
      subject: `Activa tu cuenta ${this.configEmail.subject}`,
      template: 'activation',
      to: user.email,
      context: {
        name: user.fullName,
        email: user.email,
        activationLink: `${config.BASE_URL}/api/auth/confirm-email/${user.uid}`
      }
    };
    await this.sendEmail(HelperOptions);
  }

  public async SendRecoveryEmail(data: any) {
    const HelperOptions = {
      ...this.configEmail,
      subject: `Recuperaci�n de contrase�a ${this.configEmail.subject}`,
      template: 'recovery',
      to: data.user.email,
      context: {
        name: data.user.fullName,
        email: data.user.email,
        code: data.code
      }
    };
    await this.sendEmail(HelperOptions);
  }

  public async ticketSupportEmail(
    userName: string,
    email: string,
    message: string,
    anio: string
  ) {
    const HelperOptions = {
      ...this.configEmail,
      subject: `KPMG - Ticket de soporte`,
      template: 'support_ticket',
      to: 'CO-DLHelpdesk@kpmg.com',
      // to: 'CO-DLHelpdesk@kpmg.com',
      context: {
        userName,
        email,
        message,
        anio
      }
    };
    await this.sendEmail(HelperOptions);
  }

  public async reservationEmail(
    title: string,
    message: string,
    numberReservation: string,
    fullName: string,
    userEmail: string,
    anio: string,
    office: string,
    building: string,
    officeType: string,
    floor: string,
    time: string
  ) {
    const HelperOptions = {
      ...this.configEmail,
      subject: title,
      template: 'reservation',
      to: userEmail,
      context: {
        title,
        numberReservation,
        fullName,
        message,
        anio,
        office,
        building,
        officeType,
        floor,
        time
      }
    };

    console.log('///////////////////////////////////////////////////////////');
    console.log('///////////////////////////////////////////////////////////');
    console.log('///////////////////////////////////////////////////////////');
    console.log('envia email de reservacion', this.GmailTransport);
    await this.sendEmail(HelperOptions);
  }

  private async sendEmail(HelperOptions: any) {
    await this.GmailTransport.sendMail(
      HelperOptions,
      (error: any, info: any) => {
        if (error) {
          // eslint-disable-next-line no-console
          console.log(error);
        }
        if (info) {
          // eslint-disable-next-line no-console
          console.log(info);
        }
      }
    );
  }
}
