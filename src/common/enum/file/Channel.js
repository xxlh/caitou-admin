import Enum from '../enum'

/**
 * 枚举类：文件上传来源
 * ChannelEnum
 */
export default new Enum([
    { key: 'STORE', name: '商户后台', value: 10 },
    { key: 'CLIENT', name: '用户端', value: 20 },
    { key: 'PRODUCT', name: '商品', value: 'Product' },
    { key: 'SKU', name: '商品规格', value: 'ProductSku' },
    { key: 'CATEGORY', name: '商品分类', value: 'Category' },
    { key: 'PAGE', name: '落地页', value: 'Page' },
])
