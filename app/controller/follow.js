'use strict';

const Controller = require('egg').Controller;

const dayjs = require('dayjs');

class FollowController extends Controller {
  async create() {
    const { ctx, app } = this;
    const user_id = ctx.state.user.id;
    const follow_user_id = ctx.params.id;
    const key = `Follow:${user_id}`;

    const hasFollowd = await app.redis.sismember(key, follow_user_id);

    if (hasFollowd) {
      ctx.response.error({
        message: '已经关注了',
      });
      return;
    }

    const follow = await ctx.model.Follow.findOne({
      where: {
        user_id,
        follow_user_id,
      },
    });

    if (follow) {
      follow.status = 1;
      follow.updated_at = dayjs().format('YYYY-MM-DD HH:mm:ss');
      follow.save();
    } else {
      await ctx.model.Follow.create({
        user_id,
        follow_user_id,
        status: 1,
        updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      });
    }
    await app.redis.sadd(key, follow_user_id);

    // 关注要添加feed
    const feeds = await ctx.model.Feed.findAll({
      where: {
        user_id: follow_user_id,
      },
    }); // 直接用findAll 先假设一个人的动态最多为2000条

    for (const feed of feeds) {
      const key = `Feeds:${user_id}`;
      await app.redis.zadd(key, dayjs(feed.created_at).unix(), feed.id);
    }

    ctx.response.success({
      message: '关注成功',
    });
  }

  async destroy() {
    const { ctx, app } = this;
    const user_id = ctx.state.user.id;
    const follow_user_id = ctx.params.id;

    const hasFollowd = await app.redis.sismember(`Follow:${user_id}`, follow_user_id);

    if (!hasFollowd) {
      ctx.response.error({
        message: '没有关注',
      });
      return;
    }
    await app.redis.srem(`Follow:${user_id}`, follow_user_id);

    const follow = await ctx.model.Follow.findOne({
      where: {
        user_id,
        follow_user_id,
        status: 1,
      },
    });

    follow.status = 0;
    follow.updated_at = dayjs()
      .format('YYYY-MM-DD HH:mm:ss');
    follow.save();

    // 关注要取消feed
    const feeds = await ctx.model.Feed.findAll({
      where: {
        user_id: follow_user_id,
      },
    }); // 直接用findAll 先假设一个人的动态最多为2000条

    for (const feed of feeds) {
      const key = `Feeds:${user_id}`;
      await app.redis.zrem(key, feed.id, dayjs(feed.created_at).unix());
    }

    ctx.response.success({
      message: '取消关注成功',
    });
  }

  async follows() {
    const { ctx } = this;
    const user_id = ctx.state.user.id;
    const follows = await ctx.model.Follow.findAll({
      attribute: [ 'follow_user_id' ],
      where: {
        user_id,
        status: 1,
      },
    });

    const users = [];
    for (const follow of follows) {
      console.log(follow);
      const user = await ctx.model.User.findByPk(follow.follow_user_id);
      console.log(user);
      users.push({
        username: user.username,
      });
    }

    ctx.response.success({
      data: {
        users,
      },
    });
  }

  async common_follows() {
    const { ctx, app } = this;
    const user_id = ctx.state.user.id;

    const user_ids = await app.redis.sinter(`Follow:${user_id}`, `Follow:${ctx.params.id}`);

    const users = [];
    for (const userId of user_ids) {
      const user = await ctx.model.User.findByPk(userId);
      users.push({
        username: user.username,
      });
    }

    ctx.response.success({
      data: {
        users,
      },
    });
  }

  async common_followers() {
    const { ctx } = this;
    ctx.response.success({
      data: {
        //
      },
    });
  }
}

module.exports = FollowController;
