# node-wechat

[Wechat Pay] Node.js SDK.

## Install

```bash
yarn add @axolo/node-wechat-pay
```

## API

please see `src` and `test` for more api usage.

### constructor(config)

> params

|      config       | required |                description                 |
| ----------------- | :------: | ------------------------------------------ |
| appId             |   yes    | Wechat App Id                              |
| mchId             |   yes    | Wechat Merchant Id                         |
| mchKey            |   yes    | Wechat Merchant Key                        |
| subAppid          |          | Wechat Sub App Id                          |
| subMchId          |          | Wechat Sub Merchant Key                    |
| notifyUrl         |          | [Wechat Pay Event] notify url              |
| returnCode        |          | [Wechat Pay] return code                   |
| xml.parser        |          | [xml2js] Options                           |
| xml.builder       |          | [xml2js] Options for the Builder           |
| error             |          | throw error settings                       |
| logger            |          | logger settings, use [log4js]              |
| axios             |          | HTTP Client, use [axios]                   |
| nonceStr          |          | Generator of nonceStr, default to [nanoid] |
| baseUrl           |          | base URL of Wechat Pay API                 |
| mchCert           |          | Wechat Merchant certificate                |
| mchCertPrivateKey |          | Wechat Merchant certificate private key    |
| mchEventKey       |          | [Wechat Pay Event] APIv3 key               |

> return

A instance of `WechatPay` OpenAPI Node.js SDK.

### execute(api, options)

| params  |             description              |
| ------- | ------------------------------------ |
| api     | String of wehcat pay without baseUrl |
| options | config of [axios] with api data      |

> return

Promise of Wechat Pay API response.

### callback(body)


| params |              description               |
| ------ | -------------------------------------- |
| body   | xml of [Wechat Pay Event] request body |

> return

Promise of parse [Wechat Pay Event].

## Example

```js
const WechatPay = require('@axolo/node-wechat-pay');
const wechatPay = new WechatPay({ appid: 'wx2421b1c4370ec43b', mchId: '10000100', mchKey: 'KEY' });

const body = `<xml>
  <appid><![CDATA[wx2421b1c4370ec43b]]></appid>
  <attach><![CDATA[支付测试]]></attach>
  <bank_type><![CDATA[CFT]]></bank_type>
  <fee_type><![CDATA[CNY]]></fee_type>
  <is_subscribe><![CDATA[Y]]></is_subscribe>
  <mch_id><![CDATA[10000100]]></mch_id>
  <nonce_str><![CDATA[5d2b6c2a8db53831f7eda20af46e531c]]></nonce_str>
  <openid><![CDATA[oUpF8uMEb4qRXf22hE3X68TekukE]]></openid>
  <out_trade_no><![CDATA[1409811653]]></out_trade_no>
  <result_code><![CDATA[SUCCESS]]></result_code>
  <return_code><![CDATA[SUCCESS]]></return_code>
  <sign><![CDATA[B552ED6B279343CB493C5DD0D78AB241]]></sign>
  <time_end><![CDATA[20140903131540]]></time_end>
  <total_fee>1</total_fee>
  <coupon_fee><![CDATA[10]]></coupon_fee>
  <coupon_count><![CDATA[1]]></coupon_count>
  <coupon_type><![CDATA[CASH]]></coupon_type>
  <coupon_id><![CDATA[10000]]></coupon_id>
  <coupon_fee><![CDATA[100]]></coupon_fee>
  <trade_type><![CDATA[JSAPI]]></trade_type>
  <transaction_id><![CDATA[1004400740201409030005092168]]></transaction_id>
</xml>`;

wechatPay.callback(body).then(result => {
  console.log(result);
  // response `result.response` to wechat pay callback with xml type
}).catch(error => {
  console.log(error);
});
```

## Test

```bash
yarn test ./test/unifiedorder.test.js      # test unifiedorder
```

**TIP**: Please create `.env` and `.env.test` in project root before test.

### .env

see https://pay.weixin.qq.com/wiki/doc/api/jsapi_sl.php?chapter=9_1

```ini
appId = APP_ID
mchId = MCH_ID
mchKey = MCH_KEY
# subAppid = SUB_APP_ID
# subMchId = SUB_MCH_ID
mchCert = MCH_CRET
mchCertPrivateKey = MCH_CERT_PRIVATE_KEY
mchEventKey = MCH_EVENT_KEY
```

## TODO

- test: Assertion Testing with Mocha or Jest.

> Yueming Fang

[Wechat Pay]: https://pay.weixin.qq.com/wiki/doc/api/index.html
[Wechat Pay Event]: https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_7&index=8
[axios]: https://github.com/axios/axios
[log4js]: https://log4js-node.github.io/log4js-node
[xml2js]: https://github.com/Leonidas-from-XIV/node-xml2js
[nanoid]: https://github.com/ai/nanoid
