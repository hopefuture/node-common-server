/**
 * 页面路由配置
 */

const logger = require('../utils/logger');

/**
 * 设置通用的响应头,页面不缓存！！
 * @param res
 */
const setCommonHeader = function (res) {
  res.setHeader('cache-control', 'no-cache, no-store');
  res.setHeader('content-type', 'text/html; charset=UTF-8');
};

/**
 * 添加路由管理
 * @param app
 * @param options
 */
function addRoute (app) {
  app.get('/**', (req, res) => {
    setCommonHeader(res);
    res.render('index');
  });
  
  // 将所有 url 路径都渲染到 index.html
  app.get('*', (req, res, next) => {
    // 过滤掉静态资源
    if (/\.{1}(ico|png|jpg|gif|svg|js|css|map|json|xlsx)(\?.*|$)/.test(req.url)) {
      return next();
    }
    logger.info(`unknow resource,redirect to /,request url : ${req.url}`);
  
    res.redirect('/');
  });
}

module.exports = addRoute;
