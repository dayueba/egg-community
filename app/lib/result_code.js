'use strict';

module.exports = {
  SUCCESS: {
    code: 200,
    message: '操作成功',
  },
  FAILED: {
    code: 500,
    message: '操作失败',
  },
  VALIDATE_FAILED: {
    code: 404,
    message: '参数检验失败',
  },
  UNAUTHORIZED: {
    code: 401,
    message: '暂未登录或token已经过期',
  },
  FORBIDDEN: {
    code: 403,
    message: '没有相关权限',
  },
};
