'use strict';

const Service = require('egg').Service;

class FollowService extends Service {
  async isAdmin(token) {
    const { config } = this;
    return config.adminToken.includes(token.replace('Bearer ', ''));
  }
}

module.exports = FollowService;
