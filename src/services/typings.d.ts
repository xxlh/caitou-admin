// @ts-ignore
/* eslint-disable */

declare namespace API {

  type LoginResults = {
    token?: string;
    token_type?: string;
    expires_in?: number;
    expires_in?: expires_time;
    userinfo?: any;
  };

  type LoginStatus = {
    status?: string;
    type?: string;
    msg?: string;
    currentAuthority?: string;
  };

  type CurrentUserinfo = {
    id: number;
    name?: string;
    username?: string;
    avatar?: string;
    email?: string;
    phone?: string;
    permission_ids?: string;
    unreadCount?: number;
    last_login?: string;
  };
}
