# node-wechat

[Wechat Pay] v3 Node.js SDK.

## Install

```bash
yarn add @axolo/node-wechat-pay
```

## API

For more usage, please see `src` and `test`.

### constructor(config)

> params

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
| cache        |          | default is `{}`                                   |

> return

`Object` of `WechatPay` Node.js SDK instance.

### http(config)

> params

| param  | required |   description   |
| ------ | :------: | --------------- |
| config |   yes    | config of axios |

> return

`Promise` of wechat pay result as axios response.

### nonceStr()

> return

`String` of `nonce_str`.

### timeStamp()

> return

`String` of `timestamp`.

### paySign(payPackage, signType = 'RSA')

> params

|   param    | required |                description                |
| ---------- | :------: | ----------------------------------------- |
| payPackage |   yes    | package of wechat pay, as `prepay_id=***` |
| signType   |          | signType of wechat pay, default is `RSA`  |

> return

`Object` of wechat pay sign

|   prop    |                 description                 |
| --------- | ------------------------------------------- |
| appId     | wehcat pay appid                            |
| timeStamp | timestamp, seconds                          |
| nonceStr  | nonce string                                |
| package   | package of wechat pay, like `prepay_id=***` |
| signType  | signType of wechat pay, like `RSA`          |
| paySign   | base64 signature                            |

### notify(data)

> params

| param |           description            |
| ----- | -------------------------------- |
| data  | [Wechat Pay Notify] request body |

> return

`Promise` of parse [Wechat Pay Notify].

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
  notifyUrl: 'https://url-of-wechat-apy-notify',
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

- support notify callback
- support upload file
- test

> Yueming Fang

[Wechat Pay]: https://pay.weixin.qq.com/wiki/doc/apiv3/index.shtml
[Wechat Pay Notify]: https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_1_5.shtml
[axios]: https://github.com/axios/axios
