import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import _ from 'lodash';
import {TOKEN} from '../config';
import type2data, {fakerData} from './_type2data';

/**
 * 创建响应消息
 * @param {any} data
 * @param {Array} fields
 */

export const createRes = {
  success: (data = null, fields = []) => ({
    code: 1,
    errorMsg: '',
    data: fields.length > 0 ? pick(data, fields) : data,
  }),
  error: (errorMsg = '', code = 0) => ({
    code,
    errorMsg,
    data: null,
  }),
};

/**
 * 生成token
 * @param {Object} ctx
 */

export const createToken = (data) => {
  return 'Bearer ' + jwt.sign(
      data,
      TOKEN.FPX,
      {expiresIn: TOKEN.LIFE_TIME},
  );
};

/**
 * 从ctx中获取token
 * @param {Object} ctx
 */

export const getCtxToken = (ctx) => {
  const ctxCookie = ctx.cookies.get(TOKEN.NAME);
  const token = ctxCookie && ctxCookie.replace('Bearer ', '');
  return token;
};

/**
 * 解析token
 * @param {String} token
 */

export const parseToken = (token) => {
  return jwt.verify(token, TOKEN.FPX);
};

/**
 * 筛选数据
 * @param {Object | Array} data
 * @param {Array} fields
 */

export const pick = (data, fields) => {
  if (data instanceof Array) {
    return data.map((item) => _.pick(item, fields));
  }
  if (typeof data === 'object') {
    return _.pick(data, fields);
  }
  return data;
};

/**
 * 加密字符串
 * @param String str
 */

export const bhash = (str) => {
  return bcrypt.hashSync(str, 8);
};

/**
 * 对比原字符串与经过加密的字符串是否相同
 * @param String str
 * @param String hash
 */

export const bcompare = (str, hash) => {
  return bcrypt.compareSync(str, hash);
};

/**
 * 列表转树
 * @param {Array} list
 */

export const listToTree = (list = []) => {
  const res = [];
  list.forEach((item) => {
    if (!item.parentId) {
      res.push(item);
    } else {
      const parent = list.find((node) => node._id == item.parentId);
      parent.children = parent.children || [];
      parent.children.push(item);
    }
  });
  return res;
};

/**
 * 根据模板生成data
 * @param {Array} schemas
 * @param {String} template
 * @param {Number} count
 * @param {Array} skip
 * @returns
 */

export const render = (schemas = [], template = '', count = 0, skip = []) => {
  const result = [];
  for (let i = 0; i < count; i ++) {
    // 处理schemas
    const schemaData = {};
    for (let j = 0; j < schemas.length; j ++) {
      const item = schemas[j];
      if (skip.includes(item.type)) continue;
      schemaData[item.name] = type2data(
          item.type,
          item.fakerMethod,
          i + 1,
      );
    }
    // 处理template
    let tempData = {};
    if (template) {
      const text = template.replace(
          /\{\{(.*?)\}\}/g,
          (match, key) => fakerData(key.trim()),
      );
      tempData = JSON.parse(text);
    }

    // 合并
    const data = Object.assign(schemaData, tempData);

    result.push(data);
  }
  return result;
};

/**
 * 生成min到max的随机整数
 * @param {Number} min
 * @param {Number} max
 * @returns
 */

export const getRandomInt = (min = 0, max = 1) => {
  return Math.floor(Math.random() * (max - min) + min);
};

/**
 * 获取随机头像
 * @returns
 */

export const getRandomAvatar = () => {
  return `http://cdn.bayuechuqi.com/easymock/avatar${getRandomInt(1, 37)}.png`;
};

/**
 * 封装用户自定义的返回值
 * @param {String} response
 * @param {Object} origin
 */

export const renderRes = (response, origin) => {
  let text;
  try {
    JSON.parse(response);
    text = response
        .replace(
            /\{\{([a-z]{1,}\.[a-zA-Z]{1,})\}\}/g,
            (match, key) => fakerData(key.trim()),
        )
        .replace(/"\{\{(mockData)\}\}"/g, JSON.stringify(origin.mockData))
        .replace(/"\{\{(count)\}\}"/g, JSON.stringify(origin.count));
  } catch (err) {
    text = response.replace(
        /\{\{(.*?)\}\}/g,
        (match, key) => JSON.stringify(origin[key.trim()]),
    );
  }

  try {
    text = JSON.parse(text);
  } catch (err) {}

  return text;
};
