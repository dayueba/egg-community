'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = {
      desc: '社区项目-接口',
      author: 'jiajun.pan',
    };
  }
}

module.exports = HomeController;
