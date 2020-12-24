import axios from 'axios';

// 模拟报错弹框
const showMessage = error => console.log(error.content.toString());

// 创建实例时设置配置的默认值
const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '/' : '/',
  timeout: 10000,
});

// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    return {
      ...config,
      headers: {
        ...config.headers,
      },
      params: {
        ...config.params,
        _t: Date.now(),
      },
    };
  },
  function (error) {
    // 对请求错误做些什么
    const err = {
      data: '',
      code: -1,
      message: error,
    };
    return Promise.reject(err);
  },
);

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    const { config, data } = response;
    const { hideError } = config;
    if (data.code !== 0) {
      if (!hideError) {
        showMessage({ content: data.message });
      }
      return Promise.reject(data);
    }
    return Promise.resolve(data);
  },
  function (error) {
    // 对响应错误做点什么
    const { config, data, statusText } = error.response;
    const err = {
      data: '',
      code: -2,
      message: error,
    };
    if (!config.hideError) {
      showMessage({ content: data.message || statusText });
    }
    return Promise.reject(err);
  },
);

export default instance;
