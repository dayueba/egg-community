'use strict';

const Controller = require('egg').Controller;

const dayjs = require('dayjs');

class FeedController extends Controller {
  async create() {
    const { ctx, app } = this;
    const user_id = ctx.state.user.id;

    ctx.validate({
      content: 'string',
    }, ctx.request.body);

    const { content } = ctx.request.body;

    const feed = await ctx.model.Feed.create({
      content,
      user_id,
      updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    });

    const followersIds = await app.redis.smembers(`Follow:${user_id}`);

    for (const id of followersIds) {
      const key = `Feeds:${id}`;
      await app.redis.zadd(key, dayjs().unix(), feed.id);
    }

    // 自己发的动态也要添加到自己的feed流里
    await app.redis.zadd(`Feeds:${user_id}`, dayjs().unix(), feed.id);

    ctx.response.success({
      message: '创建成功',
    });
  }

  async destroy() {
    const { ctx, app } = this;
    const user_id = ctx.state.user.id;
    const feed_id = ctx.params.id;

    const feed = await ctx.model.Feed.findByPk(feed_id);
    if (!feed || feed.user_id !== user_id) {
      ctx.response.error({
        message: '不是你的动态',
      });
      return;
    }

    await feed.destroy();

    const followersIds = await app.redis.smembers(`Follow:${user_id}`);

    for (const id of followersIds) {
      const key = `Feeds:${id}`;
      await app.redis.zrem(key, feed.id);
    }

    // 删除的时候也要在自己的feed流里删除
    await app.redis.zrem(`Feeds:${user_id}`, feed.id);


    ctx.response.success({
      message: '删除成功',
    });
  }

  async index() {
    const { ctx, app } = this;
    const user_id = ctx.state.user.id;
    const key = `Feeds:${user_id}`;

    const feed_ids = await app.redis.zrange(key, 0, 100);
    const feeds = [];
    for (const feed_id of feed_ids) {
      const feed = await ctx.model.Feed.findByPk(feed_id);
      feeds.push({
        content: feed.content,
        pubtime: ctx.helper.relativeTime(dayjs(feed.created_at).unix()),
      });
    }

    ctx.response.success({
      data: {
        feeds,
      },
    });
  }
}

module.exports = FeedController;
