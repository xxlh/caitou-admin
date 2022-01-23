import {
  AlipayCircleOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import { Alert, Space, message, Tabs, Button, Popover } from 'antd';
import React, { useEffect, useState } from 'react';
import ProForm, { ProFormCaptcha, ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { Link, history, useModel } from 'umi';
import Footer from '@/components/Footer';
import { login, loginWework } from '@/services/auth';
import request from 'umi-request';
import { getFakeCaptcha } from '@/services/ant-design-pro/login';
import styles from './index.less';
import Script from 'react-load-script';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);
/** 此方法会跳转到 redirect 参数所在的位置 */

const goto = () => {
  if (!history) return;
  setTimeout(() => {
    const { query } = history.location;
    const { redirect } = query as {
      redirect: string;
    };
    history.push(redirect || '/');
  }, 10);
};

const Login: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const [userLoginState, setUserLoginState] = useState<API.LoginStatus>({});
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const [weworkLoading, setWeworkLoading] = useState(false);

  const fetchUserInfo = async (userInfo: API.CurrentUserinfo) => {
    // const userInfo = await initialState?.fetchUserInfo?.();
    // if (userInfo) {
    setInitialState({ ...initialState, currentUser: userInfo }); // }
  };

  const saveToken = (data:API.LoginResults) => {
    const token = data.token ? `${data.token_type} ${data.token}` : '';
    if (!token) throw new Error("Get token failed!");
    localStorage.setItem('token', token);
    request.interceptors.request.use((url, options) => {
      return {
        options: {
          ...options,
          headers: {
            Authorization: token,
          },
        },
      };
    });
  }

  const handleSubmit = async (values: API.LoginParams) => {
    setSubmitting(true);

    try {
      // 登录
      const data = await login({ ...values, type });
      saveToken(data);
      message.success('登录成功！');
      await fetchUserInfo(data.userinfo);
      goto();
    } catch (error: any) {
      // 如果失败去设置用户错误信息
      const msg = error?.data?.msg || '登录失败，请重试！';
      setUserLoginState({
        status: 'error',
        type: 'account',
        msg,
      }); // message.error(msg);
    }

    setSubmitting(false);
  };

  const toWeworkAuth = () => {
    // if (NoInWeworkBrowser) return false;
    setWeworkLoading(true);
    location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + WEWORK_CORPID + '&redirect_uri=' + encodeURIComponent(location.href) + '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect'
  }

  const generateWeworkQRcode = () => {
    const wwLogin = new WwLogin({
      "id": "wework-qrcode",
      "appid": WEWORK_CORPID,
      "agentid": WEWORK_AGENTID,
      "redirect_uri": encodeURIComponent(location.href),
      "state": "",
      "href": "",
      "lang": "zh",
    });
    console.log(wwLogin);
  }

  useEffect(() => {
    (async () => {
      // 企业微信授权回调验证
      const { code } = history.location.query as {code: string}
      if (code) {
        try {
          // 登录
          let data = await loginWework({code});
          saveToken(data);
          message.success('登录成功！');
          await fetchUserInfo(data.userinfo);
          goto();
        } catch (error: any) {
          // 如果失败去设置用户错误信息
          const msg = error?.data?.msg || '授权失败，请重试！';
          setUserLoginState({
            status: 'error',
            type: 'account',
            msg,
          }); // message.error(msg);
          // 清除code参数
          let queryWithoutCode = {...history.location.query}
          delete queryWithoutCode.code;
          history.replace(history.location.pathname + '?' + Object.entries(queryWithoutCode).map(q => q.join('=')).join('&'));
        }
      }
    })()
  }, [])

  const { status, type: loginType, msg } = userLoginState;
  return (
    <div className={styles.container}>
      {/* <div className={styles.lang}>{SelectLang}</div> */}
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <Link to="/">
              <img alt="logo" className={styles.logo} src="/logo.svg" />
              <span className={styles.title}>Ant Design</span>
            </Link>
          </div>
          <div className={styles.desc}>Ant Design 是西湖区最具影响力的 Web 设计规范</div>
        </div>

        <div className={styles.main}>
          <ProForm
            initialValues={{
              autoLogin: true,
            }}
            submitter={{
              searchConfig: {
                submitText: '登录',
              },
              render: (_, dom) => dom.pop(),
              submitButtonProps: {
                loading: submitting,
                size: 'large',
                style: {
                  width: '100%',
                },
              },
            }}
            onFinish={async (values) => {
              handleSubmit(values as API.LoginParams);
            }}
          >
            <Tabs activeKey={type} onChange={setType}>
              <Tabs.TabPane key="account" tab={'账户密码登录'} />
              <Tabs.TabPane key="mobile" tab={'手机号登录'} />
            </Tabs>

            {status === 'error' && loginType === 'account' && (
              <LoginMessage content={msg || '登陆错误！'} />
            )}
            {type === 'account' && (
              <>
                <ProFormText
                  name="username"
                  fieldProps={{
                    size: 'large',
                    prefix: <UserOutlined className={styles.prefixIcon} />,
                  }}
                  placeholder={'用户名: admin or user'}
                  rules={[
                    {
                      required: true,
                      message: '用户名是必填项！',
                    },
                  ]}
                />
                <ProFormText.Password
                  name="password"
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined className={styles.prefixIcon} />,
                  }}
                  placeholder={'密码: ant.design'}
                  rules={[
                    {
                      required: true,
                      message: '密码是必填项！',
                    },
                  ]}
                />
              </>
            )}

            {status === 'error' && loginType === 'mobile' && <LoginMessage content="验证码错误" />}
            {type === 'mobile' && (
              <>
                <ProFormText
                  fieldProps={{
                    size: 'large',
                    prefix: <MobileOutlined className={styles.prefixIcon} />,
                  }}
                  name="mobile"
                  placeholder={'请输入手机号！'}
                  rules={[
                    {
                      required: true,
                      message: '手机号是必填项！',
                    },
                    {
                      pattern: /^1\d{10}$/,
                      message: '不合法的手机号！',
                    },
                  ]}
                />
                <ProFormCaptcha
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined className={styles.prefixIcon} />,
                  }}
                  captchaProps={{
                    size: 'large',
                  }}
                  placeholder={'请输入验证码！'}
                  captchaTextRender={(timing, count) => {
                    if (timing) {
                      return `${count} ${'秒后重新获取'}`;
                    }

                    return '获取验证码';
                  }}
                  name="captcha"
                  rules={[
                    {
                      required: true,
                      message: '验证码是必填项！',
                    },
                  ]}
                  onGetCaptcha={async (phone) => {
                    const result = await getFakeCaptcha({
                      phone,
                    });

                    if (result === false) {
                      return;
                    }

                    message.success('获取验证码成功！验证码为：1234');
                  }}
                />
              </>
            )}
            <div
              style={{
                marginBottom: 24,
              }}
            >
              <ProFormCheckbox noStyle name="autoLogin">
                自动登录
              </ProFormCheckbox>
              <a
                style={{
                  float: 'right',
                }}
              >
                忘记密码 ?
              </a>
            </div>
          </ProForm>
          
          <Space style={{marginTop:'20px', verticalAlign:'middle'}}>
            其他登录方式 :
            {!navigator.userAgent.includes('Mobile') && !navigator.userAgent.includes('wxwork') && !navigator.userAgent.includes('MicroMessenger') ?
              <Popover content={<div id="wework-qrcode">loading...</div>} onVisibleChange={generateWeworkQRcode}>
                <Script
                  url="http://wwcdn.weixin.qq.com/node/wework/wwopen/js/wwLogin-1.2.5.js"
                  // onLoad={generateWeworkQRcode}
                />
                <Button icon={<img style={{width:28}} src={'/icons/wework.png'}/>} style={{width:200, height:40}}>企业微信登录</Button>
              </Popover>
            :
              <Button icon={<img style={{width:28}} src={'/icons/wework.png'}/>} style={{width:200, height:40}}
              loading={weworkLoading} onClick={toWeworkAuth}>企业微信登录</Button>
            }
          </Space>
          {/* <Space className={styles.other}>
            其他登录方式 :
            <AlipayCircleOutlined className={styles.icon} />
            <TaobaoCircleOutlined className={styles.icon} />
            <WeiboCircleOutlined className={styles.icon} />
          </Space> */}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
