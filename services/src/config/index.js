const isDev = process.env.NODE_ENV === 'development';

export const TOKEN = {
  NAME: 'easy_mock_ticket',
  LIFE_TIME: 3600 * 24,
  FPX: 'EASY_MOCK_1996',
};

export const MAIL_AUTH = {
  user: 'yourmail@example.com',
  pass: 'xxxxxxxxxxxxxx',
};

export const MONGODB_CONNECT_KEY =
  isDev ?
    'mongodb://username:password@81270.0.01:27017/dbname' :
    'mongodb://username:password@81270.0.01:27017/dbname';
