/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1619280866953_9528';

  // add your middleware config here
  config.middleware = [
    // 'robot',
    'errorHandler',
    'notfoundHandler',
  ];

  // 只对 /api 前缀的 url 路径生效
  config.errorHandler = {
    match: '/',
  };

  // robot's configurations
  config.robot = {
    ua: [
      /Baiduspider/i,
    ],
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.redis = {
    client: {
      port: 6379,
      host: '127.0.0.1',
      password: null,
      db: 0,
    },
  };

  config.sequelize = {
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    password: '123456',
    database: 'community',
    define: {
      timestamps: false,
      freezeTableName: true,
    },
  };

  config.security = {
    csrf: {
      enable: false,
    },
  };

  config.jwt = {
    secret: 'secret key',
  };

  config.pagination = {
    pagesize: 10,
  };

  return {
    ...config,
    ...userConfig,
  };
};
