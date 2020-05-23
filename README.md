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

|      config       |                description                 |
| ----------------- | ------------------------------------------ |
| appId             | Wechat App Id                              |
| mchId             | Wechat Merchant Id                         |
| mchKey            | Wechat Merchant Key                        |
| subAppid          | Wechat Sub App Id                          |
| subMchId          | Wechat Sub Merchant Key                    |
| mchCert           | Wechat Merchant certificate                |
| mchCertPrivateKey | Wechat Merchant certificate private key    |
| returnCode        | [Wechat Pay] return code                   |
| mchEventKey       | [Wechat Pay Event] key                     |
| notifyUrl         | [Wechat Pay Event] notify url              |
| xml.parser        | [xml2js] Options                           |
| xml.builder       | [xml2js] Options for the Builder           |
| error             | throw error settings                       |
| logger            | logger settings, use [log4js]              |
| axios             | HTTP Client, use [axios]                   |
| nonceStr          | Generator of nonceStr, default to [nanoid] |

> return

A instance of `WechatPay` OpenAPI Node.js SDK.

## Example

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
- event: Support [Wechat Pay Event].

> Yueming Fang

[Wechat Pay]: https://pay.weixin.qq.com/wiki/doc/api/index.html
[Wechat Pay Event]: https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_7&index=8
[axios]: https://github.com/axios/axios
[log4js]: https://log4js-node.github.io/log4js-node
[xml2js]: https://github.com/Leonidas-from-XIV/node-xml2js
[nanoid]: https://github.com/ai/nanoid
