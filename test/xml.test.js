'use strict';

const Xml = require('../src/xml');

const config = {
  parser: {
    explicitArray: false,
    explicitRoot: false,
  },
};
const xml = new Xml(config);

const str = `
  <xml>
    <appid>wxb03854a4f17f6e49</appid>
    <mch_id>1593852311</mch_id>
    <nonce_str>foLW9tu5SeCTVVTEr0_DK</nonce_str>
    <device_info>DEVICE_ID</device_info>
    <trade_type>JSAPI</trade_type>
    <body>微信交易（wechat trade）</body>
    <sign>8902782A9DB48CED9FC37567EF508D68AEA54D4EBB5BF509302FAE1A8381E590</sign>
  </xml>`;

xml.parser(str).then(json => console.log(json));
