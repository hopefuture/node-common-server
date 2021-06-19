// 请求相关方法
const got = require('got');
const logger = require('./logger');
const {
  stringifyJSON,
  parseJSON
} = require('./perfect');

const config = require('../config');

const timeout = config.REQUEST_TIMEOUT;

/**
 * 记录接口耗时
 * @param start
 * @param url
 */
const logTimeUse = (start, url) => {
  const end = process.hrtime();
  logger.info(
    `[${url}] 耗时${(
      (end[0] - start[0]) * 1e3 +
      (end[1] - start[1]) * 1e-6
    ).toFixed(3)}ms`
  );
};

module.exports.logTimeUse = logTimeUse;

/**
 * 构建请求头部
 * @param req
 * @returns {{clientIp, cookie}}
 */
const buildHeader = req => {
  const {
    headers
  } = req;

  const _headers = {};

  if (headers.cookie) {
    _headers.cookie = headers.cookie;
  }

  // 把 user-agent 设置到 header 中
  _headers['user-agent'] = req.get('user-agent');
  _headers['content-type'] = headers['content-type'];

  return _headers;
};

/**
 * 格式化接口请求异常
 * @param url
 * @param err
 * @returns {Error}
 */
const formatRequestError = (url, err = {}, statusCode = '') => {
  let errMsg = '未知';
  let errCode = 'S0001';

  if (err && err.code === 'ETIMEDOUT') { // 处理超时的情况
    if (err.connect === true) {
      errMsg = `[连接超时(${timeout}ms)]`;
      errCode = 'S0002';
    } else {
      errMsg = `[响应超时(${timeout}ms)]`;
      errCode = 'S0003';
    }
  } else {
    errMsg = (err.error || '') + (err.message || '');
    if (statusCode === 404) {
      if (!errMsg) {
        errMsg = '无效的url或该url不存在';
      }
      errCode = 'S0404';
    } else if (statusCode === 500) {
      if (!errMsg) {
        errMsg = '服务端异常';
      }
      errCode = 'S0500';
    } else {
      if (!errMsg) {
        errMsg = '其他未知错误';
      }
      errCode = 'S0000';
    }
  }

  const error = new Error(
    `获取服务端接口异常, url: ${url}; 错误信息: ${errMsg}`
  );
  error.code = errCode;
  error.statusCode = statusCode;
  return error;
};

// 通用请求方法
async function request (url, options) {
  const {
    method = 'GET', body, req
  } = options;

  const headers = buildHeader(req);

  logger.info(
    `${method}请求; 地址: ${url}; 请求参数: ${stringifyJSON(body)}; 请求头: ${stringifyJSON(
      headers
    )}`
  );

  const start = process.hrtime();

  const gotOptions = { method };

  if (body) {
    gotOptions.body = stringifyJSON(body);
  }

  try {
    const response = await got(url, gotOptions);

    logTimeUse(start, url); // 记录接口耗时

    const {
      statusCode,
      body
    } = response || {};

    logger[statusCode === 200 ? 'info' : 'error'](`${method} 请求 url: ${url}; 请求状态码: ${statusCode}`);

    const resData = typeof body === 'string' ? body : stringifyJSON(body);

    if (resData) {
      logger[statusCode === 200 ? 'info' : 'error'](`=======返回数据========== \n ${resData}`);
    }

    // 200表示返回正常
    if (statusCode === 200) {
      return typeof body === 'string' ? parseJSON(body) : body;
    }

    throw formatRequestError(url, body, statusCode);
  } catch (error) {
    logTimeUse(start, url); // 记录接口耗时
    throw formatRequestError(url, error);
  }
}

module.exports = request;
