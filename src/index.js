'use strict';

const crypto = require('crypto');
const axios = require('axios');
const { nanoid } = require('nanoid');
const WechatPayError = require('./error');

class WechatPay {
  constructor(config) {
    this.config = {
      baseUrl: 'https://api.mch.weixin.qq.com/v3',
      contentType: 'application/json',
      logger: console,
      error: WechatPayError,
      http: axios,
      ...config,
    };
    this.logger = this.config.logger;
    this.error = this.config.error;
    this.http = this.config.http;
    this.http.defaults.baseURL = this.config.baseUrl;
    this.http.defaults.headers.post['Content-Type'] = this.config.contentType;
  }

  /**
   * **返回随机字符串**
   *
   * 生成器默认为`nanoid`，可在配置中自定义
   *
   * @see https://github.com/ai/nanoid
   * @return {string} 随机字符串
   * @memberof WechatPay
   */
  nonceStr() {
    return nanoid();
  }

  /**
   * **参数排序**
   *
   * @see https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=4_3
   * @param {object} data 参数对象（乱序）
   * @param {object} key 商户平台设置的密钥key
   * @return {string} 规定格式的签名字串
   * @memberof WechatPay
   */
  stringSignTemp(data, key) {
    const sa = Object.keys(data).sort().map(k => (data[k] && [ k, data[k] ].join('=')));
    const sak = [ ...sa, [ 'key', key ].join('=') ];
    return sak.join('&');
  }

  /**
   * **获取带签名的参数**
   *
   * @see https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=4_3
   * @see https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=20_1
   * @param {object} params 请求参数
   * @param {string} [type='md5'] 请求参数
   * @return {string} 签名字符串
   * @memberof WechatPay
   */
  sign(params, type = 'MD5') {
    const { mchKey } = this.config;
    const stringSignTemp = this.stringSignTemp(params, mchKey);
    switch (type) {
      default:
      case 'MD5': {
        const hash = crypto.createHash(type).update(stringSignTemp, 'utf8').digest('hex');
        const sign = hash.toUpperCase();
        return sign;
      }
      case 'HMAC-SHA256': {
        const hmac = crypto.createHmac('sha256', mchKey).update(stringSignTemp, 'utf8').digest('hex');
        const sign = hmac.toUpperCase();
        return sign;
      }
    }
  }

  /**
   * **处理支付结果通知**
   *
   * @see https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_7&index=8
   * @param {string} body 微信支付结果通知，通常以`XML`格式`POST`方法发送
   * @return {object} 带响应信息的处理结果，其中`response`需以`XML`格式响应给微信支付
   * @memberof WechatPay
   */
  async callback(body) {
    const { xml } = this;
    const result = await xml.parser(body);
    const { result_code, return_code } = result;
    if (result_code === 'SUCCESS' && return_code === 'SUCCESS') {
      const resultSign = result.sign;
      delete result.sign;
      const checkSign = this.sign(result, result.sign_type);
      if (checkSign !== resultSign) {
        return {
          return_code: 'FAIL',
          return_msg: 'INVALID_SIGN',
          out_trade_no: result.out_trade_no,
        };
      }
      const response = await xml.builder({ return_code: 'SUCCESS' });
      return { ...result, sign: resultSign, response };
    }
    return result;
  }
}

module.exports = WechatPay;
