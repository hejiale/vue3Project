import Axios from "axios";
import router from "../../router";
const { errorMessage } = utils

interface Error {
  response: {
    data: {
      msg: ''
    }
  }
}

window.__axiosPromiseArr = []

Axios.defaults.baseURL = '/api';
Axios.defaults.timeout = 10000000;
Axios.defaults.headers["Content-Type"] = "application/json; charset=utf-8";

// Axios 请求拦截器
Axios.interceptors.request.use(async (config) => {
  console.log(import.meta.env.VITE_SERVICE_BASE_URL)

  config.headers["Content-Type"] = "application/json; charset=utf-8";
  config.headers["responseType"] = "blob";

  if (sessionStorage.getItem("tokenValue")) {
    config.headers['tokenValue'] = `${sessionStorage.getItem("tokenValue")}`;
  }

// 将cancel放置于全局变量的数组中, 用于取消请求
config.cancelToken = new Axios.CancelToken((cancel) => {
  window.__axiosPromiseArr.push({
    cancel
  })
})

  return config;
});
 
// Axios 响应拦截器 对返回码进行处理处理
Axios.interceptors.response.use(
  async (res) => {
    if (res.status === 200) {
      // successMessage('This is an success message')
      //  处理文件流接口
      // if (res.headers["content-disposition"]) {
      //   return res;
      // }
      // 调用成功返回接口数据
      if (res.data.code === 200) {
        return res.data;
      } else if (res.data.code === 9999) {
        router.replace({
          name: "login",
        });
      }
    } else {
      // errorMessage('This is an error message');
      return Promise.reject(res.data.msg);
    }
  },
  (err: Error) => {
    errorMessage(err.response.data.msg);
    return Promise.reject(err.response.data.msg);
  }
);
