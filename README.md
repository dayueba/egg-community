# community



## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### Deploy

```bash
$ npm start
$ npm stop
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.


[egg]: https://eggjs.org

[awesome-egg]: https://github.com/eggjs/awesome-egg


## 项目特点
- 使用大量redis特性，如排行榜功能使用sorted set实现，用户签到记录使用bitmap实现，地理位置使用GEO实现，点击量使用HyperLogLog实现

## TODO
- [] 接入es 做feed搜索模块 https://github.com/brucewar/egg-elasticsearch
- [] refresh token
- [] redis从单机版升级成集群 https://www.npmjs.com/package/egg-redis
