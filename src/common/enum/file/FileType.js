import Enum from '../enum'

/**
 * 枚举类：文件存储方式
 * FileTypeEnum
 */
export default new Enum([
    { key: 'IMAGE', name: '图片', value: 'image' },
    { key: 'ANNEX', name: '附件', value: 'file' },
    { key: 'VIDEO', name: '视频', value: 'video' }
])
