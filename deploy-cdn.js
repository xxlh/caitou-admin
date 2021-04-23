var WQCLOUD = require('wqcloud');
var config = require('./config/deploy.config');

var options = {
  SecretId: config.SecretId,
  SecretKey: config.SecretKey,
  // 不填，每次请求都会自动重新生成
  // Signature: '',
  Nonce: parseInt(Math.random() * 999999, 10),
  Timestamp: parseInt(new Date() / 1000, 10),
  Region: '',
  Version: '2018-06-06',
  'Paths.0': 'https://caitou.ieexx.com/',
  FlushType: 'delete',
};

var CDN = WQCLOUD.CDN(options);
CDN.PurgePathCache().then(res => {
  if (!res.Response.Error && res.Response.TaskId)
    console.info('成功刷新CDN缓存！TaskId: ' + res.Response.TaskId);
  else console.error(res.Response.Error);
});
