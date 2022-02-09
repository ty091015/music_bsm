import axios from 'axios'
//创建实例
const instance = axios.create({
  timeout: 20000,
})
// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    if (config.url != '/api/user/login' && config.url != '/api/user/register_edit') {
      const token = localStorage.getItem('token')
      config.headers.Authorization = 'Bearer ' + token//----*********必须加++++'Bearer '
    }
    // console.log('config', config)
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

export default instance