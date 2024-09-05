import axios from 'axios'
import store from '@/store'
import {Message} from 'element-ui'
import router from '@/router'
const service= axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 10000
})
//成功执行第一个，反之
service.interceptors.request.use((config)=>{
  if (store.getters.token){
    config.headers.Authorization = `Bearer ${store.getters.token}`
  } 
  return config
},(error)=>{
  //失败执行
  return Promise.reject(error)
})

service.interceptors.response.use((response) => {
  const {data,message,success}= response.data
  if(success){
    return data
  }else{
    Message({type: 'error', message})
    return Promise.reject(new Error(message))
  }
}, async(error) => {
  if(error.response.status === 401){
    Message({type: 'warning', message: "用户的token失效了"})
    await store.dispatch('user/logout')
    router.push("/login")
    return Promise.reject(error)
  }
  Message({type: 'error', message: error.message})
  return Promise.reject(error)
})

export default service