const fs = require('fs');
const path = require('path');
const { createLogger, format, transports } = require('winston');
const localIp = require('ip');

const { combine, printf, colorize, timestamp } = format;

// 自定义打印格式
const printfFormat = printf(({ level, message, location, timestamp }) => {
  const ip = localIp.address();
  return `${timestamp} [${ip}_${process.pid}] ${level} ${location} - ${message}`;
});

let packageJson;
try {
  packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json')));
} catch (e) {
  packageJson = {};
}

// 打印选项
const options = {
  // 定义日志级别
  levels: { error: 0, warning: 1, notice: 2, info: 3, debug: 4 },
  transports: []
};

if (process.env.NODE_ENV === 'production') {
  options.format = combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    printfFormat
  );
  options.transports.push(new transports.Console({
    // 生产环境打印 info 级别以上（包含 info）
    level: 'info'
  }));
} else {
  // 开发环境，设置上颜色
  options.format = combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    printfFormat
  );
  
  // 设置打印 debug 以上级别的日志（包含 debug）
  options.transports.push(new transports.Console({
    // 生产环境打印 info 级别以上（包含 info）
    level: 'debug'
  }));
}

const logger = createLogger(options);

/**
 * 获取打印日志对应文件路径和行号
 * @param depth
 * @param appName
 * @returns {string} 如：bin_www_91_21
 * @private
 */
const _getCallerFile = function (depth, appName) {
  return _getPositionFromStack((
    new Error()
  ).stack.replace(/\\/g, '/'), depth, appName);
};

/**
 * 获取日志调用位置
 * 样本数据：
 * @param stack
 * @param depth
 * @param appName
 * @returns {string}如：bin_www_91_21
 */
const _getPositionFromStack = function (stack, depth, appName) {
  let firstIndex = stack.indexOf('\n', 5); // 定位到Error后面的换行符
  
  if (isNaN(depth) || depth < 0) depth = 1;
  depth += 1;
  
  while (depth--) { // 往下找3个换行符
    firstIndex = stack.indexOf('\n', firstIndex + 1);
    if (firstIndex < 0) { // 如果日志堆栈不足3行，定位到最后一行的上一个换行符
      firstIndex = stack.lastIndexOf('\n', stack.length);
      break;
    }
  }
  
  let secondIndex = stack.indexOf('\n', firstIndex + 1); // 定位firstIndex后面的一个换行符
  if (secondIndex < 0) {
    secondIndex = stack.length;
  }
  
  if (appName) { // 在后面寻找appName所在位置
    let _temp = stack.indexOf(appName, firstIndex);
    if (_temp === -1) {
      _temp = stack.indexOf('(', firstIndex);
    }
    firstIndex = _temp;
  } else {
    firstIndex = stack.indexOf('(', firstIndex);
  }
  
  firstIndex = Math.max(stack.indexOf('/', firstIndex), firstIndex) + 1;// 查找appName结束的位置
  
  const closestQuo = stack.indexOf(')', firstIndex);
  if (closestQuo < secondIndex) {
    secondIndex = closestQuo;
  }
  stack = stack.substring(firstIndex, secondIndex);
  
  return stack ? stack.replace(/\//g, '.').replace(/:|-/g, '_') : stack;
};

const log = function (level, msg) {
  const logInfo = {
    location: _getCallerFile(2, process.env.appName || packageJson.name || undefined)
  };
  
  logger.log(level, msg, logInfo);
};

// error: 0, warn: 1, notice: 2, info: 3, debug: 4
module.exports = {
  error: function (msg) {
    log('error', msg);
  },
  warn: function (msg) {
    log('warn', msg);
  },
  notice: function (msg) {
    log('notice', msg);
  },
  info: function (msg) {
    log('info', msg);
  },
  debug: function (msg) {
    log('debug', msg);
  },
  profile: function (tag) {
    logger.profile(tag, {
      location: _getCallerFile(2, process.env.appName || undefined)
    });
  }
};
