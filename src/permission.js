import router from '@/router'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'

const whiteList = ['/login', '/404']
router.beforeEach(async(to, from, next) => {
  nprogress.start()
  if (store.getters.token){
    if (to.path  === '/login')
      {
        next('/')  //next后面跟地址不走后置守卫
        nprogress.done()
      }else{
        if(!store.getters.userId){
          await store.dispatch('user/getUserInfo')
        }
        next()
      }
      }else{
        if(whiteList.includes(to.path)){
          next()
        }
        else{
          next('/login')
          nprogress.done()
        }
      }
  
})




router.afterEach(() => {
  nprogress.done()
})