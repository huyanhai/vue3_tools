'use strict';

import axios from 'axios';

let BASE_URL = process.env.NODE_ENV == 'production' ? '' : '/api/v1';

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  headers: {},
});

// 拦截请求
instance.interceptors.request.use(function (config) {
  return {
    ...config,
    headers: {
      ...config.headers,
    },
    params: {
      ...config.params,
      _t: new Date().getTime(),
    },
  };
});

// 过滤逻辑错误
instance.interceptors.response.use(
  rawResponse => {
    console.log(rawResponse);
    return rawResponse.data;
  },
  rawError => {
    const errMsg = rawError.toString();
    const code = errMsg.substr(errMsg.indexOf('code') + 5);
    return Promise.reject({
      code: code,
      message: errMsg,
    });
  },
);

export const all = axios.all;
export const spread = axios.spread;
export const CancelToken = axios.CancelToken;

export function get(url, config = {}) {
  return instance.get(url, config);
}

export function post(url, data = {}, config = {}) {
  return instance.post(url, data, config);
}

export function put(url, data = {}, config = {}) {
  return instance.put(url, data, config);
}

export function del(url, config = {}) {
  return instance.delete(url, config);
}

export default instance;
