import * as Request from '../utils/request';

// 获取列表
export function setuser(data) {
  return Request.post('/setuser', data);
}

export function getuser(data) {
  return Request.get('/getuser', data);
}
