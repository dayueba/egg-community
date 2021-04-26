'use strict';

const resultCode = require('../lib/result_code');

module.exports = {
  success({ data, message = resultCode.SUCCESS.message }) {
    this.ctx.body = {
      code: resultCode.SUCCESS.code,
      message,
      data,
    };
  },

  error({ data, message = resultCode.FAILED.message }) {
    this.ctx.body = {
      code: resultCode.FAILED.code,
      message,
      data,
    };
  },

  notFound() {
    return {
      code: 404,
      message: 'not found',
      data: {},
    };
  },
};
