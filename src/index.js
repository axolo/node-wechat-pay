'use strict';

const crypto = require('crypto');
const axios = require('axios');
const { nanoid } = require('nanoid');
const WechatPayError = require('./error');

class WechatPay {
  /**
   * **构造函数**
   *
   * 需要配置的参数如下：
   *
   * - appId: 微信支付应用ID
   * - mchId: 微信支付商户ID
   * - mchCertSn: 微信支付商户证书序列号
   * - mchCertKey: 微信支付商户证书私钥
   * - apiV3Key: 微信支付APIv3密钥
   * - notifyUrl: 微信通知回调URL
   * - notifySuccess: 微信通知需响应成功的通知类型列表
   *
   * @see https://pay.weixin.qq.com/wiki/doc/apiv3/index.shtml
   * @param {object} [config={}] 说明如上
   * @memberof WechatPay
   */
  constructor(config = {}) {
    // 配置请求客户端
    const baseURL = config.baseURL || 'https://api.mch.weixin.qq.com';
    const http = axios.create({ baseURL });
    http.defaults.headers.post['Content-Type'] = 'application/json';
    http.interceptors.request.use(httpConfig => {
      const { method, url, data } = httpConfig;
      const authorization = this.authorization({ method: method.toUpperCase(), url, data });
      httpConfig.headers.Authorization = authorization;
      return httpConfig;
    }, error => {
      return Promise.reject(error);
    });
    http.interceptors.response.use(response => {
      // return response?.data || response;
      return response;
    }, error => {
      if (error.isAxiosError) {
        const { data } = error.response;
        const err = new this.Error(data.message, data);
        return Promise.reject(err);
      }
      return Promise.reject(error);
    });
    // 配置需要响应为成功的通知类型
    const notifySuccess = [
      'TRANSACTION.SUCCESS', // 支付成功
      'REFUND.SUCCESS', // 退款成功
      'REFUND.ABNORMAL', // 退款异常
      'REFUND.CLOSED', // 退款关闭
    ].concat(config.notifySuccess).filter(i => i); // 自定义类型
    // 合并配置
    this.config = {
      Error: WechatPayError, // 错误
      logger: console, // 日志
      cache: {}, // 缓存
      authorizationSchema: 'WECHATPAY2-SHA256-RSA2048',
      signAlgorithm: 'RSA-SHA256', // sha256WithRSAEncryption
      signEncode: 'base64',
      baseURL,
      notifySuccess,
      http,
      ...config,
    };
    // 定义属性
    this.Error = this.config.Error;
    this.logger = this.config.logger;
    this.http = this.config.http;
    this.cache = this.config.cache;
  }

  /**
   * **随机串**
   *
   * 签名生成所需的随机串
   *
   * @see https://pay.weixin.qq.com/wiki/doc/apiv3/wechatpay/wechatpay4_0.shtml
   * @return {string} 随机字符串
   * @memberof WechatPay
   */
  nonceStr() {
    return nanoid();
  }

  /**
   * **时间戳**
   *
   * 签名生成所需的时间戳
   *
   * @see https://pay.weixin.qq.com/wiki/doc/apiv3/wechatpay/wechatpay4_0.shtml
   * @return {string} 时间戳（以秒为单位的unix时间戳）
   * @memberof WechatPay
   */
  timeStamp() {
    return Math.round(Date.now() / 1000).toString();
  }

  /**
   * **生成签名**
   *
   * @see https://pay.weixin.qq.com/wiki/doc/apiv3/wechatpay/wechatpay4_0.shtml
   * @param {string} data 明文字符串
   * @param {string} privateKey 私钥
   * @return {string} 签名字符串
   * @memberof WechatPay
   */
  createSign(data, privateKey) {
    const { signAlgorithm, signEncode } = this.config;
    const sign = crypto.createSign(signAlgorithm).update(data).end();
    return sign.sign(privateKey).toString(signEncode);
  }

  /**
   * **验证签名**
   *
   * @see https://pay.weixin.qq.com/wiki/doc/apiv3/wechatpay/wechatpay4_0.shtml
   * @param {string} data 签名数据
   * @param {string} sign 验签密钥
   * @param {string} publicKey 验签公钥
   * @return {boolean} 验签结果
   * @memberof WechatPay
   */
  verifySign(data, sign, publicKey) {
    const { signAlgorithm, signEncode } = this.config;
    const verify = crypto.createVerify(signAlgorithm).update(data).end();
    return verify.verify(publicKey, Buffer.from(sign, signEncode));
  }

  /**
   * **签名数据**
   *
   * @see https://pay.weixin.qq.com/wiki/doc/apiv3/wechatpay/wechatpay4_0.shtml
   * @see https://pay.weixin.qq.com/wiki/doc/apiv3/wechatpay/wechatpay7_1.shtml
   * @param {object} params 签名参数
   * @return {object} 签名结果，签名、随机串、时间戳
   * @memberof WechatPay
   */
  signature(params) {
    const { method, url, data } = params;
    const dataRaw = (data && data instanceof Object) ? JSON.stringify(data) : '';
    // TODO: upload file meta json, like
    // if ([ 'POST', 'PUT', 'PATCH' ].includes(method)) {
    //   let metaRaw = (meta && meta instanceof Object) ? JSON.stringify(meta) : '';
    //   if (url.endsWith('upload')) {
    //     let result = JSON.parse(JSON.stringify(pm.request.body.formdata));
    //     for (let i in result) {
    //       if (result[i].key === 'meta') {
    //         data = result[i].value;
    //       }
    //     }
    //   }
    // }
    const { mchCertKey } = this.config;
    const nonce_str = this.nonceStr();
    const timestamp = this.timeStamp();
    const plain = `${method}\n${url}\n${timestamp}\n${nonce_str}\n${dataRaw}\n`;
    const signature = this.createSign(plain, mchCertKey);
    return { signature, nonce_str, timestamp };
  }

  /**
   * **请求的授权HTTP头**
   *
   * @see https://pay.weixin.qq.com/wiki/doc/apiv3/wechatpay/wechatpay4_0.shtml
   * @param {object} params 请求参数
   * @return {string} 请求头
   * @memberof WechatPay
   */
  authorization(params) {
    const { mchId: mchid, authorizationSchema, mchCertSn: serial_no } = this.config;
    const sign = this.signature(params);
    const { signature, nonce_str, timestamp } = sign;
    const authorization = `${authorizationSchema} `
      + `mchid="${mchid}",`
      + `nonce_str="${nonce_str}",`
      + `timestamp="${timestamp}",`
      + `serial_no="${serial_no}",`
      + `signature="${signature}"`;
    return authorization;
  }

  /**
   * **请求支付参数**
   *
   * 获取所需的参数，如微信小程序的`wx.requestPayment(OBJECT)`
   *
   * @param {string} payPackage 订单详情扩展字符串
   * @param {string} [signType='RSA'] 签名方式
   * @return {object} 请求支付所需要的参数
   * @memberof WechatPay
   */
  payRequest(payPackage, signType = 'RSA') {
    const { appId, mchCertKey } = this.config;
    const nonceStr = this.nonceStr();
    const timeStamp = this.timeStamp();
    const plain = `${appId}\n${timeStamp}\n${nonceStr}\n${payPackage}\n`;
    const paySign = this.createSign(plain, mchCertKey);
    const sign = { appId, timeStamp, nonceStr, package: payPackage, signType, paySign };
    return sign;
  }

  /**
   * **解密通知**
   *
   * @param {object} resource 加密的通知资源
   * @return {object} 解密后的通知资源
   * @memberof WechatPay
   */
  decryptNotify(resource) {
    const { apiV3Key } = this.config;
    const { ciphertext, associated_data, nonce } = resource;
    const cipher = Buffer.from(ciphertext, 'base64');
    // 解密ciphertext，AEAD_AES_256_GCM算法
    const authTag = cipher.slice(cipher.length - 16); // Tag长度16
    const data = cipher.slice(0, cipher.length - 16);
    const decipher = crypto.createDecipheriv('AES-256-GCM', apiV3Key, nonce);
    decipher.setAuthTag(authTag);
    decipher.setAAD(Buffer.from(associated_data));
    const decoded = decipher.update(data, undefined, 'utf8');
    decipher.final();
    return JSON.parse(decoded);
  }

  /**
   * **处理支付结果通知**
   *
   * @see https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_1_5.shtml
   * @see https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_1_11.shtml
   * @param {string} data 微信结果通知
   * @return {object} 解密通知（带建议的响应信息）
   * @memberof WechatPay
   */
  notify(data) {
    const { resource, event_type } = data;
    const { notifySuccess } = this.config;
    const code = notifySuccess.some(i => i === event_type) ? 'SUCCESS' : event_type;
    const message = event_type;
    data.response = { code, message };
    data.resource = this.decryptNotify(resource);
    return data;
  }
}

module.exports = WechatPay;
