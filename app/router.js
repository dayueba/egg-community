'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  // auth
  router.post('/register', controller.auth.register);
  router.post('/login', controller.auth.login);
  router.get('/authCode', controller.auth.getAuthCode);

  // user
  router.resources('users', '/users', controller.users);

  // follow
  router.post('/follow/:id', app.jwt, controller.follow.create);
  router.delete('/follow/:id', app.jwt, controller.follow.destroy);
  // router.get('/followers', app.jwt, controller.follow.followers);
  router.get('/follows', app.jwt, controller.follow.follows);
  router.get('/common/follows/:id', app.jwt, controller.follow.common_follows);
  router.get('/common/followers/:id', app.jwt, controller.follow.common_followers);

  // feed
  router.post('/feeds', app.jwt, controller.feed.create);
  router.delete('/feeds/:id', app.jwt, controller.feed.destroy);
  router.get('/feeds', app.jwt, controller.feed.index);

  // sign
  router.post('/sign', app.jwt, controller.sign.sign);

};
