# node-wechat

[Wechat Pay] v3 Node.js SDK.

## Install

```bash
yarn add @axolo/node-wechat-pay
```

## API

for more usage please see `src` and `test`.

### constructor(config)

|    config    | required |                    description                    |
| ------------ | :------: | ------------------------------------------------- |
| appId        |   yes    | wechat pay appid                                  |
| mchId        |   yes    | wechat pay mchid                                  |
| mchCertSn    |   yes    | wechat pay merchant certificate serial number     |
| mchCertKey   |   yes    | wehcat pay merchant certificate private key       |
| mchCert      |   yes    | wehcat pay merchant certificate                   |
| apiV3Key     |   yes    | wechat pay api v3 secret key                      |
| notifyUrl    |   yes    | [Wechat Pay Notify] callback url                  |
| platformCert |          | wehcat pay platform certificate                   |
| currency     |          | default is `CNY`                                  |
| appType      |          | mp = miniprogram                                  |
| http         |          | HTTP Client, default is built-in [axios] instance |
| error        |          | class of Error, default is `WechatPayError`       |
| logger       |          | fuction of logger, default is `console`           |
| cache        |          | default is memory                                 |

return a instance of `WechatPay` Node.js SDK.

### http(config)

| params |   description   |
| ------ | --------------- |
| config | config of axios |

return Promise of wechat pay result as axios response.

### nonceStr()

return `nonce_str`.

### timestamp()

return `timestamp`.

### notify(body)


| params |           description           |
| ------ | ------------------------------- |
| body   | [Wechat Pay Notify] request body |

return Promise of parse [Wechat Pay Notify].

## Example

```js
const fs = require('fs');
const WechatPay = require('@axolo/node-wechat-pay');

const wechatPay = new WechatPay({
  appType: 'mp',
  appId: 'wechat_pay_appid',
  mchId: 'wechat_pay_mchid',
  mchCertSn: 'wechat_pay_mch_cert_serial_no',
  mchCertKey: fs.readFileSync('wehcat_pay_mch_cert_private_key.pem'),
  mchCert: fs.readFileSync('wehcat_pay_mch_cert.pem'),
  apiV3Key: 'wechat_pay_api_v3_secret',
  notifyUrl: 'https://path-of-wechat-apy-notify',
});

wechatPay.http.get('/v3/certificates').then(res => {
  wechatPay.logger.log(res.data);
}).catch(err => {
  wechatPay.logger.error(err);
});
```

## Test

```bash
yarn test
```

## TODO

- test
- support upload file
- support notify callback

> Yueming Fang

[Wechat Pay]: https://pay.weixin.qq.com/wiki/doc/apiv3/index.shtml
[Wechat Pay Notify]: https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_1_5.shtml
[axios]: https://github.com/axios/axios
