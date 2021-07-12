import { SecretId, SecretKey } from '/config/deploy.config';

import COS from 'cos-js-sdk-v5';
import { request } from 'umi';
import { SoundFilled } from '@ant-design/icons';

const Bucket = 'caitou-1252187609';
const Region = 'ap-guangzhou';     /* 存储桶所在地域，必须字段 */

let cos = new COS({
    SecretId: 'AKID0pOilX1FBrGPGq9H8i01mFRM0NUJswjF',
    SecretKey: 'GFxOXQ1LNIxKQEm7BxTheKktkKdfQuBC',
//   getAuthorization: function (options, callback) {
//       // 异步获取临时密钥
//       request('http://example.com/server/sts.php', {
//           bucket: Bucket,
//           region: Region,
//       }).then(function (data) {
//           var credentials = data && data.credentials;
//           if (!data || !credentials) return console.error('credentials invalid');
//           callback({
//               TmpSecretId: credentials.tmpSecretId,
//               TmpSecretKey: credentials.tmpSecretKey,
//               SecurityToken: credentials.sessionToken,
//               // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
//               StartTime: data.startTime, // 时间戳，单位秒，如：1580000000
//               ExpiredTime: data.expiredTime, // 时间戳，单位秒，如：1580000900
//           });
//       });
//   }
});

export let getObjectUrl = (params: COS.GetObjectAclParams) => {
    return new Promise((resolve, reject) => {
        cos.getObjectUrl({
            Bucket,
            Region,
            Method: 'PUT',
            Sign: true,
            ...params
        }, (err, data) => {
            if (err) return reject(err);
            resolve(data.Url);
        });
    });
}

export default cos;