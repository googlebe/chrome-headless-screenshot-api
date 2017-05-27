const express = require('express');
const BodyParser = require('body-parser');
const Joi = require('joi');
const Celebrate = require('celebrate');
const YamlConfig = require('node-yaml-config');

const routes = require('./routes');
const capture = require('./capture');
const params = require('./params');
const chrome = require('./chrome');

function createApp(config) {
  const app = express();
    
  app.use(Celebrate.errors());

  app.use(BodyParser.json());
  
  app.use(BodyParser.urlencoded({
    extended: true
  }));

  app.get('/', Celebrate({
    query: params.getSchema(config)
  }), routes.index(config) );

  app.post('/', Celebrate({
    body: params.getSchema(config)
  }), routes.index(config) );

  app.listen(config.server.port, function () {
    console.log('Chrome headless screenshot API listening on port %d.', config.server.port);
  });
}

function main() {
    const config = YamlConfig.load(__dirname + '/config/config.yml');
    chrome.launchHeadless(config);
    createApp(config);
}

module.exports = {
    main: main
};