'use strict';

import axios from 'axios';

let BASE_URL = process.env.VUE_APP_BASE_API;

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
      test_headers: 'test_headers',
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
    return rawResponse.data;
  },
  rawError => {
    const {
      data,
      config: { headers, method, params },
    } = rawError.response;
    console.log(rawError.response);
    const errMsg = rawError.toString();
    const code = errMsg.substr(errMsg.indexOf('code') + 5);
    window.$sentry.addBreadcrumb({
      type: 'http',
      category: 'api',
      data: {
        headers: headers,
        method: method,
        request: method === 'get' ? params : rawError.response.config?.data,
        response: data,
      },
      timestamp: new Date().getTime(),
    });
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
