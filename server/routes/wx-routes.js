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

  // TODO 根据 siteId 返回 appId、 appSecret 和 apn

  const appId = 'wx322e3789a2130b92';
  const appSecret = '989e33a45151b6ff973fa0f24facaa11';
  const apn = '小程序测试站点';

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
      apn
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
