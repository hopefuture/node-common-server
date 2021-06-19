const express = require('express');
const router = express.Router();
const request = require('../utils/request');

/**
 * agentid: "1000053"
 * corpId: wwaf7c3acf722eb918
 * providerSecret: 6xj0g9wQo0_ctbAecBCCNBw5s9p6R2mry-CXoYyxXmYZgFMQXcYtEPMnQ_hIhpdH
 */
router.get('/config', async (req, res, next) => {
  try {
    /**
     * 获取access_token
     * https://work.weixin.qq.com/api/doc/90000/90135/91039
     * appId: wxa926dd031ed5fa79
     * appSecret: 670d8b8d64b1c9a54ef8ac003354368f
     */

    const accessToken = await request('https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=wwaf7c3acf722eb918&corpsecret=6xj0g9wQo0_ctbAecBCCNBw5s9p6R2mry-CXoYyxXmYZgFMQXcYtEPMnQ_hIhpdH', {
      req
    });

    console.info('accessToken', accessToken);

    const data = await request('https://qyapi.weixin.qq.com/cgi-bin/service/get_corp_token?suite_access_token=SUITE_ACCESS_TOKEN', {
      method: 'POST',
      body: {
        auth_corpid: 'wwaf7c3acf722eb918'
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
     * appId: wwaf7c3acf722eb918
     * appSecret: 6xj0g9wQo0_ctbAecBCCNBw5s9p6R2mry-CXoYyxXmYZgFMQXcYtEPMnQ_hIhpdH
     */

    const accessToken = await request('https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=wwaf7c3acf722eb918&corpsecret=6xj0g9wQo0_ctbAecBCCNBw5s9p6R2mry-CXoYyxXmYZgFMQXcYtEPMnQ_hIhpdH', {
      req
    });

    console.info('accessToken', accessToken);

    res.json(accessToken);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
