const path = require('path');

const express = require('express');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const hbs = require('hbs');
const cors = require('cors');
const logger = require('./utils/logger');
const apiRoutes = require('./routes/api-routes');
const pageRoutes = require('./routes/page-routes');
const wxRoutes = require('./routes/wx-routes');
const qywxRoutes = require('./routes/qywx-routes');

const app = express();

// view engine setup
app.engine('html', hbs.__express);
app.set('views', path.join(__dirname, '../public'));
app.set('view engine', 'html');

app.use(express.json());
/*
 * The extended option allows to choose between parsing the URL-encoded data with the querystring library (when false) or the qs library (when true).
 * https://www.npmjs.com/package/body-parser#extended
 */
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// http://expressjs.com/en/4x/api.html#express.static
// index 设为 false，表示不会定位到 index.html 文件
app.use(express.static(path.join(__dirname, '../public'), { index: false }));

// 设置接口允许跨域
app.use(cors(function (req, callback) {
  const { referer } = req.headers;
  // http://www.xxx.com:8080/xxx/yyy 匹配结果为 http://www.xxx.com:8080
  const origin = referer && referer.match(/https?:\/\/[^/]+/);
  const corsOptions = {
    origin: origin ? origin[0] : '*',
    credentials: true
  };
  callback(null, corsOptions);
}));

// 微信公共接口
app.use('/wx', wxRoutes);

// 企业微信公共接口
app.use('/qywx', qywxRoutes);

/*
 * 加载路由
 * 统一处理前端 api
 */
apiRoutes(app);

// 页面路由
pageRoutes(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  // 不处理 map 和 json 格式的数据
  if (/\.(map|json)$/.test(req.url)) {
    return next();
  }
  const err = new Error(`${req.url},Not Found`);
  err.status = 404;
  next(createError(err));
});

// 异步接口异常处理
app.use((err, req, res, next) => {
  const requestedWith = req.headers['x-requested-with'];

  // api 请求
  if (requestedWith === 'XMLHttpRequest') {
    if (err) {
      logger.error(`${req.url} =======错误==========  \n ${err.stack}`);
      const { code, statusCode } = err;

      return res.status(statusCode || 200).json({
        code: code || 'S0001',
        msg: err.message
      });
    }
  } else {
    next(err);
  }
});

// error handler
app.use(function (err, req, res) {
  logger.error(`${req.url} =======错误==========  \n ${err.stack}`);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
