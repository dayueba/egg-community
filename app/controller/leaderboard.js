'use strict';

const Controller = require('egg').Controller;

const dayjs = require('dayjs');

class LeaderboardController extends Controller {
  async index() {
    const { ctx, app } = this;
    const user_id = ctx.state.user.id;
    ctx.validate({
      date: {
        type: 'string',
        required: false,
        default: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      },
    }, ctx.request.body);

    // 允许补签
    const { date } = ctx.request.body;

    const day = dayjs(date).date() - 1;

    // 查看是否已签到
    const key = `user:sign:${user_id}:${dayjs(date).format('YYYY-MM')}`;
    const isSignd = await app.redis.getbit(key, day);
    if (isSignd) {
      ctx.response.error({
        message: '已经签到',
      });
      return;
    }

    // 签到
    await app.redis.setbit(key, day, 1);

    // 连续签到次数
    // 再维护一个key
    // 判断昨天是否签到过 如果昨天已经签到 则签到数 + 1 如果没有则将连续签到数修改为1
    // 方法二 遍历
    // const dayOfMonth = dayjs(dayjs().format('YYYY-MM-00')).date();


    // 统计签到次数
    const sign_count = await app.redis.bitcount(key);

    // 签到成功 添加积分
    await app.redis.zincrby('integral', 10, String(user_id));

    ctx.response.success({
      message: '签到成功',
      data: {
        date,
        sign_count,
      },
    });
  }
}

module.exports = LeaderboardController;
