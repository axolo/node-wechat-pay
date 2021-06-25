# node-wechat

[Wechat Pay] v3 Node.js SDK.

## Install

```bash
yarn add @axolo/node-wechat-pay
```

## API

For more usage please issue.

### constructor(config = {})

> params

|    config     | required |                             description                             |
| ------------- | :------: | ------------------------------------------------------------------- |
| appId         |   yes    | wechat pay appid                                                    |
| mchId         |   yes    | wechat pay mchid                                                    |
| mchCert       |   yes    | wehcat pay merchant certificate                                     |
| mchCertKey    |   yes    | wehcat pay merchant certificate private key                         |
| mchCertSn     |   yes    | wechat pay merchant certificate serial number                       |
| apiV3Key      |   yes    | wechat pay api v3 secret key                                        |
| notifyUrl     |   yes    | [Wechat Pay Notify] callback url                                    |
| notifySuccess |          | [Wechat Pay Notify] need response `{ code: 'SUCCESS' }` event types |
| platformCert  |          | wehcat pay platform certificate                                     |
| currency      |          | default is `CNY`                                                    |
| appType       |          | mp = miniprogram                                                    |
| http          |          | HTTP Client, default is built-in [axios] instance                   |
| error         |          | class of Error, default is `WechatPayError`                         |
| logger        |          | function of logger, default is `console`                            |
| cache         |          | default is `{}`, it is reserved                                           |

> return

`Object` of `WechatPay` Node.js SDK instance.

### http(config)

http client for request wechat pay API.

> params

| param  | required |   description   |
| ------ | :------: | --------------- |
| config |   yes    | config of axios |

> return

`Promise` of wechat pay result as axios response.

### nonceStr()

> return

`String` of `nonce_str`, random string.

### timeStamp()

> return

`String` of `timestamp`, unix timestamp second.

### payRequest(payPackage, signType = 'RSA')

> params

|   param    | required |                 description                 |
| ---------- | :------: | ------------------------------------------- |
| payPackage |   yes    | package of wechat pay, like `prepay_id=***` |
| signType   |          | signType of wechat pay, default is `RSA`    |

> return

`Object` of wechat pay payment request

|   prop    |                 description                 |
| --------- | ------------------------------------------- |
| appId     | wehcat pay appid                            |
| timeStamp | timestamp, seconds                          |
| nonceStr  | nonce string                                |
| package   | package of wechat pay, like `prepay_id=***` |
| paySign   | base64 signature                            |
| signType  | signType of wechat pay, like `RSA`          |

### notify(data)

> params

| param | required |           description            |
| ----- | :------: | -------------------------------- |
| data  |   yes    | [Wechat Pay Notify] request body |

> return

`Object` of [Wechat Pay Notify] decrypt resource with response suggestion.

|   prop   |                   description                   |
| -------- | ----------------------------------------------- |
| resource | decrytp resource                                |
| response | response suggestion. like `{ code: 'SUCCESS' }` |

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
  notifyUrl: 'https://url-of-wechat-pay-notify',
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

- support upload
- test

> Yueming Fang

[Wechat Pay]: https://pay.weixin.qq.com/wiki/doc/apiv3/index.shtml
[Wechat Pay Notify]: https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_1_5.shtml
[axios]: https://github.com/axios/axios
