const express = require('express');
const router = express.Router();
const request = require('../utils/request');

router.get('/openid', async (req, res, next) => {
  const { query } = req;

  const { code, appId, appSecret } = query;

  try {
    /**
     * 获取 openid
     * https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/login.html
     * https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/login/auth.code2Session.html
     */
    const userInfo = await request(`https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`, {
      req
    });

    console.info(userInfo);

    res.json(userInfo);
  } catch (err) {
    next(err);
  }
});

router.get('/qd-openid', async (req, res, next) => {
  const { query } = req;

  const { siteId, code } = query;

  const appId = 'xxxx';
  const appSecret = 'xxxx';
  const siteName = '小程序测试站点';

  try {
    /**
     * 获取 openid
     * https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/login.html
     * https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/login/auth.code2Session.html
     */
    const userInfo = await request(`https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`, {
      req
    });

    console.info(userInfo);

    res.json({
      ...userInfo,
      unionid: 'unionid',
      siteName
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
