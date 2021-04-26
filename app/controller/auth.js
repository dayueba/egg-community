'use strict';

const Controller = require('egg').Controller;

const SHA256 = require('crypto-js/sha256');

const dayjs = require('dayjs');

class AuthController extends Controller {
  async getAuthCode() {
    const { ctx, app } = this;
    ctx.validate({
      phone: 'string',
    }, ctx.request.query);

    const phone = ctx.request.query.phone;
    const key = `AuthCode:${phone}`;

    // TODO 接口限流 可以在使用专门的中间件 或者直接在此处编写

    const user = await ctx.model.User.findOne({
      attributes: [ 'id' ],
      where: {
        phone,
      },
    });

    if (user) {
      ctx.response.error({
        message: '手机号已被注册',
      });
      return;
    }

    // 生成6位数验证码
    const authCode = [];
    for (let i = 0; i < 6; i++) {
      authCode.push(Math.floor(Math.random() * 10));
    }

    await app.redis.set(key, authCode.join(''));
    await app.redis.expire(key, 60);

    ctx.response.success({
      data: {
        authCode: authCode.join(''),
      },
    });
  }

  async register() {
    const { ctx, app, config } = this;
    ctx.validate({
      phone: 'string',
      authCode: 'string',
      password: {
        type: 'string',
        min: 6,
        max: 16,
      },
      username: 'string',
    }, ctx.request.body);
    const { phone, authCode, password, username } = ctx.request.body;

    const key = `AuthCode:${phone}`;
    const authCodeRedis = await app.redis.get(key);
    if (authCode !== authCodeRedis) {
      ctx.response.error({
        message: '验证码校验失败',
      });
      return;
    }

    ctx.runInBackground(async () => {
      await app.redis.del(key);
    });

    const passwordHash = SHA256(password + config.keys).toString();

    await ctx.model.User.create({
      phone,
      password: passwordHash,
      username,
      created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    });

    ctx.response.success({
      message: '注册成功',
      data: {
        phone,
        username,
      },
    });
  }

  async login() {
    const { ctx, config, app } = this;
    ctx.validate({
      phone: 'string',
      password: 'string',
    }, ctx.request.body);

    const { phone, password } = ctx.request.body;

    const user = await ctx.model.User.findOne({
      attributes: [ 'id', 'password' ],
      where: {
        phone,
      },
    });

    if (!user) {
      ctx.response.error({
        message: '用户不存在',
      });
      return;
    }

    const passwordHash = SHA256(password + config.keys).toString();
    if (user.password !== passwordHash) {
      ctx.response.error({
        message: '账号或密码错误',
      });
      return;
    }

    const token = app.jwt.sign({ id: user.id }, app.config.jwt.secret);

    ctx.response.success({
      data: {
        token,
      },
    });
  }

  // todo 登出功能
  // async logout() {
  //   const { ctx } = this;
  //   ctx.validate(loginRule, ctx.request.body);
  //   ctx.body = {
  //     desc: '社区项目-接口',
  //     author: 'jiajun.pan',
  //   };
  // }
}

module.exports = AuthController;
