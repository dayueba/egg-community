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

  // auth
  router.resources('users', '/users', controller.users);
};
