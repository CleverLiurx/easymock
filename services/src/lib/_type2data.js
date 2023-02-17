import {faker} from '@faker-js/faker/locale/zh_CN';

export const fakerData = (method) => {
  const funcStr = `return function fn(faker){return faker.${method}()}`;
  const run = new Function(funcStr);
  return run()(faker);
};


export default (type, fakerMethod, idx) => {
  let result = '';
  switch (type) {
    case 'Faker.js':
      result = fakerData(fakerMethod);
      break;
    case 'Object ID':
      result = String(idx);
      break;
    case 'String':
      result = `string ${idx}`;
      break;
    case 'Number':
      result = parseInt(Math.random() * 100);
      break;
    case 'Boolean':
      result = Math.random() > 0.5;
      break;
    case 'Object':
      result = {};
      break;
    case 'Array':
      result = [];
      break;
    case 'Date':
      result = +new Date();
      break;
    default:
      result = 'Unkonw Type';
  }
  return result;
};
