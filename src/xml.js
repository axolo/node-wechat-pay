'use strict';

const xml2js = require('xml2js');

class WechatPayXml {
  constructor(config = {}) {
    this.config = config;
  }

  async parser(xml) {
    const parser = new xml2js.Parser(this.config.parser);
    const json = await parser.parseStringPromise(xml);
    return json;
  }

  async builder(object) {
    const builder = new xml2js.Builder(this.config.builder);
    const xml = await builder.buildObject(object);
    return xml;
  }
}

module.exports = WechatPayXml;
