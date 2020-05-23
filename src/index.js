'use strict';

const crypto = require('crypto');
const axios = require('axios');
const deepmerge = require('deepmerge');
const { nanoid } = require('nanoid');
const WechatPayError = require('./error');
const WechatPayLogger = require('./logger');
const Xml = require('./xml');

class WechatPay {
  constructor(config) {
    const defaultConfig = {
      baseUrl: 'https://api.mch.weixin.qq.com',
      xml: {
        parser: {
          explicitArray: false,
          explicitRoot: false,
        },
        builder: {
          rootName: 'xml',
          headless: true,
          renderOpts: { pretty: false },
        },
      },
      error: {
        name: 'WechatPayError',
      },
      returnCode: {
        success: 'SUCCESS',
        fail: 'FAIL',
      },
      axios,
      nonceStr: nanoid,
    };
    this.config = deepmerge(defaultConfig, config);
    this.xml = new Xml(this.config.xml);
    this.logger = new WechatPayLogger(this.config.logger);
    this.error = WechatPayError;
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
    return this.config.nonceStr();
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
   * **请求微信支付API**
   *
   * @see https://github.com/axios/axios
   * @param {string} api API接口路径，如：/pay/unifiedorder
   * @param {object} options 参数，与`axios`配置一致
   * @return {object} 响应，JSON格式，与微信支付返回XML格式数据一致
   * @memberof WechatPay
   */
  async execute(api, options) {
    const { xml, config } = this;
    const { baseUrl } = config;
    const sign = this.sign(options.data);
    const data = await xml.builder({ ...options.data, sign });
    const { data: res } = await config.axios({
      ...options,
      url: baseUrl + api,
      method: 'POST',
      headers: { 'Content-Type': 'text/xml' },
      data,
    });
    const result = await xml.parser(res);
    return result;
  }
}

module.exports = WechatPay;
