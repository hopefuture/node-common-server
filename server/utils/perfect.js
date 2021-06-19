const logger = require('./logger');

// 格式化 json 数据
module.exports.parseJSON = str => {
  if (!str) {
    return {};
  }
  try {
    return JSON.parse(str);
  } catch (e) {
    logger.warn(`JSON 格式不正确：${e.message}`);
    return {};
  }
};

// 把 json 数据转换为字符串
module.exports.stringifyJSON = (json, space = 2) => {
  try {
    return JSON.stringify(json ?? '', null, space);
  } catch (e) {
    logger.warn(`JSON 格式不正确：${e.message}`);
    return '';
  }
};

// 首字母大写
module.exports.upperFirstLetter = str => {
  if (!str) {
    return '';
  }
  return str[0].toUpperCase() + str.substring(1);
};
