import { RcFile } from "antd/lib/upload";
import cos from "./cos";

type UploadPramas = {
    file: File | RcFile | Blob,
    filename: string,
    hashFilename: boolean,
    path: string,
    id: number,
    success: any,
    error: any,
    progress: any,
}

function _createHash (hashLength:number) {
    return Array.from(Array(Number(hashLength) || 24), () => Math.floor(Math.random() * 36).toString(36)).join('');
}

export default async (param:UploadPramas) => {
    const { file } = param;
    if (param.hashFilename) param.filename = _createHash(16);
    if (param.filename && param.filename.indexOf('.') == -1 && file.name) param.filename += file.name.substring(file.name.lastIndexOf('.'))
    const filename = param.filename || (file?.name ? (file?.name) : "");
    const uploadUrl = param.path ? `/${param.path}/${filename}` : filename;
    cos.putObject({
        Bucket: 'caitou-1252187609', /* 必须 */
        Region: 'ap-guangzhou',     /* 存储桶所在地域，必须字段 */
        Key: uploadUrl,              /* 必须 */
        StorageClass: 'STANDARD',
        Body: param.file, // 上传文件对象
        onProgress: function (progressData) {
            param.progress(progressData.percent * 100)
        }
    }, function (err, data) {
        if (!err && data) {
            param.success(data)
        } else {
            param.error({
                msg: '上传失败'
            })
        }
    });
}