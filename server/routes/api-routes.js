const request = require('../utils/request');
const apiUrl = require('./api-url');

function apiRoutes (app) {
  app.use(async (req, res, next) => {
    const { url, body, method, params } = req;

    // 如果前端 url 是以下值开头，则直接映射到后台对应的 url 上
    const prefix = url.match(/^(\/api)/g);

    if (prefix && prefix[0]) {
      // 替换掉前缀
      const dPrefixUrl = url.replace(prefix[0], '');

      const urlSplit = dPrefixUrl.split('/').filter(item => item);

      let actualUrl = apiUrl;

      urlSplit.forEach((item) => {
        if (actualUrl) {
          actualUrl = actualUrl[item];
        }
      });

      if (typeof actualUrl !== 'string') {
        next(new Error('无效的api接口'));
        return;
      }

      try {
        const data = await request(actualUrl, {
          method,
          body,
          params,
          req
        });
  
        res.json(data);
      } catch (err) {
        next(err);
      }
    } else {
      next();
    }
  });
}

module.exports = apiRoutes;
