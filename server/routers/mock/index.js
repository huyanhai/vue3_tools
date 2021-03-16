/*
 * @Author: huyanhai
 * @since: 2021-01-12 11:54:13
 * @LastAuthor: huyanhai
 * @lastTime: 2021-03-16 11:46:44
 * @FilePath: /vue3_tools/server/routers/mock/index.js
 * @Description:router-mock
 */

const router = require('koa-router')();
const Mock = require('mockjs');
const Random = Mock.Random;

router.prefix('/mock');

router.get('/', async (ctx, next) => {
  ctx.body = 'Hello Mock';
  next();
});

router.get('/test', async (ctx, next) => {
  let content = [];
  for (let i = 0; i < Random.integer(1, 50); i++) {
    content.push({
      name: Random.name(),
    });
  }
  ctx.success(content);
  next();
});

router.post('/test', async (ctx, next) => {
  ctx.success(
    Mock.mock({
      image: Random.image(),
    }),
  );
  next();
});

module.exports = router;
