import nodemailer from 'nodemailer';
import {MAIL_AUTH} from '../config';

const transporter = nodemailer.createTransport({
  host: 'smtp.163.com',
  pool: true,
  secure: true,
  auth: {...MAIL_AUTH},
});

transporter.verify(function(error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log('Mailer is ready');
  }
});

const createReceiver = (to, code) => ({
  from: 'EasyMock<easymock@163.com>',
  to,
  subject: 'EasyMock验证码',
  text: `您的验证码是：${code}`,
});

export default (to, code) => new Promise((resolve, reject) => {
  const receiver = createReceiver(to, code);
  transporter.sendMail(receiver, (error, info) => {
    if (error) {
      reject(error);
      return;
    }
    resolve();
  });
});


