import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'

// 企业微信自动登录
const WEWORK_CORPID = 'wwab032cc648e1816d'
const loginPath = '/passport/login'
const token = storage.get(ACCESS_TOKEN)
const pathname = window.location.pathname
const hash = window.location.hash
const userAgent = window.navigator.userAgent
if (!token && (pathname !== loginPath && hash.indexOf(loginPath) == -1) && (userAgent.includes('wxwork') || userAgent.includes('MicroMessenger'))) {
	const redirect_uri = encodeURIComponent(location.origin + loginPath + '?redirect=' + pathname);
	// 需要配置「可作为应用OAuth2.0网页授权功能的回调域名」为redirect_uri域名
	location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + WEWORK_CORPID + '&redirect_uri=' + redirect_uri + '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect';
}