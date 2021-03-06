/* eslint-disable no-process-env */
const nodemailer = require('nodemailer');
const DotenvFlow = require('dotenv-flow');

DotenvFlow.config({path: './environment'});

export const GmailTransport = nodemailer.createTransport({
  service: process.env.GMAIL_SERVICE_NAME,
  host: process.env.GMAIL_SERVICE_HOST,
  secure: process.env.GMAIL_SERVICE_SECURE,
  port: process.env.GMAIL_SERVICE_PORT,
  auth: {
    user: process.env.GMAIL_USER_NAME,
    pass: process.env.GMAIL_USER_PASSWORD
  }
});

export const SMTPTransport = nodemailer.createTransport({
  host: process.env.SMTP_SERVICE_HOST,
  port: process.env.SMTP_SERVICE_PORT,
  secure: process.env.SMTP_SERVICE_SECURE,
  debug: true,
  auth: {
    user: process.env.SMTP_USER_NAME,
    pass: process.env.SMTP_USER_PASSWORD
  }
});

const handlebarOptions = {
  viewEngine: {
    extName: '.hbs',
    partialsDir:
      process.env.ENV === 'local' ? 'src/resources/views' : '/resources/views',
    layoutsDir:
      process.env.ENV === 'local' ? 'src/resources/views' : '/resources/views',
    defaultLayout: ''
  },
  viewPath:
    process.env.ENV === 'local' ? 'src/resources/views' : '/resources/views',
  extName: '.hbs'
};

export const ViewOption = (transport: any, hbs: any) => {
  transport.use('compile', hbs(handlebarOptions));
};
