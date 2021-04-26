'use strict';

const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

// 返回几分钟前
exports.relativeTime = time => dayjs(new Date(time * 1000)).fromNow(); // fromNow
