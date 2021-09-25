/* eslint-disable */
import axios from 'axios'
import { Message } from 'element-ui'
import Qs from 'qs';
import routerDom from '@/router'
import store from '@/store'
import { getSessionID } from '@/utils/session'
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  crossDomain:true,
  timeout: 50000, // request timeout
  url:""
  // headers:{
  //     'Content-Type':'application/x-www-form-urlencoded;charset=utf-8',
  //     "Access-Control-Allow-Origin":"*"
  // },
})
// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    config.transformRequest=[function(data){
        // let newData = JSON.stringify(data);
        let newData = data;
        if(!config.headers.isFile){
          for (let i in data) {
            if (Array.isArray(data[i])) {
              if (data[i].length === 0) {
                data[i] = null
              }
            }
          }
          newData = Qs.stringify(data);
        }
        return newData;
    }];
    if (store.getters.session) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['session_id'] = getSessionID()
    }
    return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response;
    // if the custom code is not 20000, it is judged as an error.
    if (res.status !== 200) {
      Message({
          message: res.statusText|| 'Error',
          type: 'error',
          duration: 5 * 1000
        });
        return Promise.reject(new Error(res.statusText || 'Error'));
    } else {
      if(res.data.errorcode==="authtimeout"){
        Message({
          message: res.data.info,
          type: 'error',
          duration: 5 * 1000
        });
        routerDom.push(`/login?redirect=${routerDom.currentRoute.fullPath}`);
      }else{
        return res.data;
      }
      
    }
  },error => {
    Message({
      message: error,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
/* eslint-disable */