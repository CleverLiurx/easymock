import User from './user';
import Project from './project';
import Resource from './resource';
import Data from './data';
import Mail from './mail';

const fieldsTable = {
  user: ['_id', 'name', 'email', 'avatar'],
};

export {
  fieldsTable,
  User,
  Project,
  Resource,
  Data,
  Mail,
};
