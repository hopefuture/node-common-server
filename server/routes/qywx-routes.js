const express = require('express');
const router = express.Router();
const request = require('../utils/request');

/**
 * agentid: "xxx"
 * corpId: xxxx
 * providerSecret: xxxxx
 */
router.get('/config', async (req, res, next) => {
  try {
    /**
     * 获取access_token
     * https://work.weixin.qq.com/api/doc/90000/90135/91039
     * appId: xxxx
     * appSecret: xxx
     */

    const accessToken = await request('https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=xxx&corpsecret=xxx', {
      req
    });

    console.info('accessToken', accessToken);

    const data = await request('https://qyapi.weixin.qq.com/cgi-bin/service/get_corp_token?suite_access_token=SUITE_ACCESS_TOKEN', {
      method: 'POST',
      body: {
        auth_corpid: 'xxx'
      },
      req
    });

    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.get('/gettoken', async (req, res, next) => {
  try {
    /**
     * 获取 access_token
     * https://work.weixin.qq.com/api/doc/10013#%E7%AC%AC%E4%B8%89%E6%AD%A5%EF%BC%9A%E8%8E%B7%E5%8F%96access_token
     * appId: xxxx
     * appSecret: xxxx
     */

    const accessToken = await request('https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=xxxx&corpsecret=xxxx', {
      req
    });

    console.info('accessToken', accessToken);

    res.json(accessToken);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
