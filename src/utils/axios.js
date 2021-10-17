import axios from 'axios';
import { Toast } from 'zarm';

const MODE = import.meta.env.MODE; // 环境变量

axios.defaults.baseURL = MODE === 'development' ? '' : 'http://121.41.2.76:7001';
axios.defaults.withCredentials = true
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers['Authorization'] = `${localStorage.getItem('token') || null}`;
axios.defaults.headers.post['Content-Type'] = 'application/json';

axios.interceptors.response.use(res => {
  if (typeof res.data !== 'object') {
    Toast.show('服务端异常！');
    return Promise.reject(res.data);
  }

  if (res.data.code !== 200) {
    if (res.data.msg) {
      Toast.show(res.data.msg); // 所有接口层面的报错都统一拦截处理
    }
    if (res.data.code === 401) { // unauthorized
      window.location.href = '/login';
    }

    return Promise.resolve(res.data.data);
  }

  return res.data.data;
})

export default axios;
