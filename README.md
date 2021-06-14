# node-wechat

[Wechat Pay] v3 Node.js SDK.

## Install

```bash
yarn add @axolo/node-wechat-pay
```

## API

please see `src` and `test` for more api usage.

### constructor(config)

> params

|      config       | required |               description                |
| ----------------- | :------: | ---------------------------------------- |
| appId             |   yes    | Wechat App Id                            |
| mchId             |   yes    | Wechat Merchant Id                       |
| mchKey            |   yes    | Wechat Merchant Key                      |
| subAppid          |          | Wechat Sub App Id                        |
| subMchId          |          | Wechat Sub Merchant Key                  |
| mchCert           |          | Wechat Merchant certificate              |
| mchCertPrivateKey |          | Wechat Merchant certificate private key  |
| mchEventKey       |          | [Wechat Pay Event] APIv3 key             |
| notifyUrl         |          | [Wechat Pay Event] notify url            |
| baseUrl           |          | base URL of Wechat Pay API               |
| error             |          | class of Error, default `WechatPayError` |
| logger            |          | fuction of logger, default `console`     |
| http              |          | HTTP Client, default [axios]             |


> return

A instance of `WechatPay` OpenAPI Node.js SDK.

### callback(body)


| params |           description           |
| ------ | ------------------------------- |
| body   | [Wechat Pay Event] request body |

> return

Promise of parse [Wechat Pay Event].

## Example

```js
const WechatPay = require('@axolo/node-wechat-pay');

const wechatPay = new WechatPay({
  appid: 'wx2421b1c4370ec43b',
  mchId: '10000100',
  mchKey: 'KEY',
});

wechatPay.logger.log(wechatPay);
```

## Test

### config

```js
// test/config.js
'use strict';

module.exports = {
  mchId: 'MCH_ID',
  appId: 'APP_ID',
};
```

### run

```bash
node test/http.js # test http request
```

> Yueming Fang

[Wechat Pay]: https://pay.weixin.qq.com/wiki/doc/api/index.html
[Wechat Pay Event]: https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_7&index=8
[axios]: https://github.com/axios/axios
