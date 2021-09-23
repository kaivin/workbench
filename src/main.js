import Vue from 'vue'
import Element from 'element-ui'
import {MessageBox} from 'element-ui'
import Cookies from 'js-cookie'
import F2 from '@antv/f2'
Vue.prototype.$F2 = F2;
import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
import Prism from 'prismjs';
// codemirror 编辑器的相关资源
import Codemirror from 'codemirror';
// mode
import 'codemirror/mode/markdown/markdown';
// placeholder
import 'codemirror/addon/display/placeholder';
// active-line
import 'codemirror/addon/selection/active-line';
// scrollbar
import 'codemirror/addon/scroll/simplescrollbars';
import 'codemirror/addon/scroll/simplescrollbars.css';
// style
import 'codemirror/lib/codemirror.css';
VueMarkdownEditor.Codemirror = Codemirror;
VueMarkdownEditor.use(vuepressTheme, {
  Prism,
  extend(md) {
    // md为 markdown-it 实例，可以在此处进行修改配置,并使用 plugin 进行语法扩展
    // md.set(option).use(plugin);
  },
});

// import '../public/ueditor/ueditor.config.js'
// import '../public/ueditor/ueditor.all.js'
// import '../public/ueditor/lang/zh-cn/zh-cn.js'


import 'normalize.css/normalize.css'
import '@/styles/element_variables.scss'
import '@/styles/index.scss';

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import App from './App.vue'
import router from './router'
import store from './store'
import getPageTitle from '@/utils/get-page-title'
import './icons' // icon


const whiteList = ['/login']; // 不需要登录就可以显示的页面白名单
let oneRun = true;
let isFirst = true;
NProgress.configure({ showSpinner: false }) 
router.beforeEach(async(to, from, next) => {
    NProgress.start()
    document.title = getPageTitle(to.meta.title);
    var userInfo = Cookies.get('userInfo');
    var ua =  navigator.userAgent;
    if(oneRun){
      if(ua.indexOf('Chrome')==-1){
        Element.Notification({
          title:'提醒',
          message: '系统君检测到您目前所使用的浏览器可能会影响您的浏览体验，系统君建议您更换为谷歌浏览器访问本系统！~',
          type: 'error',
          duration: 0
        });
      }
    }
    if (userInfo) {
      userInfo = JSON.parse(userInfo);
      if (to.path === '/login') {
        next()
        NProgress.done()
      } else {
        if(oneRun){
          oneRun = false;
          try {
            await store.dispatch('api/getRouteAction').then(response=>{
              if(response.status){
                if(response.data.length>0){
                  store.dispatch('permission/generateRoutes', response.data).then(res=>{
                    if(res.length>0){
                      router.addRoutes(res);
                      router.addRoutes([{path: '*',name:'error404',redirect:"/404",meta: {title: '404', icon: null,hidden:true,keepAlive:false }}]);
                      next({ ...to, replace: true });
                      NProgress.done();
                    }
                  });
                }
              }else{
                Element.Message({
                  message: response.info,
                  type: 'error',
                  duration: 5 * 1000
                });
                next(`/401?redirect=${to.path}`)
                NProgress.done()
              }
            });
          } catch (error) {
            // remove token and go to login page to re-login
            Cookies.remove("userInfo");
            Element.Message({
              message: error|| 'Error',
              type: 'error',
              duration: 5 * 1000
            });
            next(`/login?redirect=${to.path}`)
            NProgress.done()
          }
        }else{
          if(userInfo.phone==""||userInfo.email==""){
            if(isFirst){
              if(to.path === '/User/personset'){
                next()
                NProgress.done() 
              }else{
                MessageBox.confirm('请前往个人中心完善个人联系方式','提示',{
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  next(`/User/personset`);
                  NProgress.done();
                }).catch(() => {
                  isFirst = false;
                  next()
                  NProgress.done()       
                });
              }
            }else{
              next();
              NProgress.done()
            }
          }else{
            next();
            NProgress.done()
          }
        }
      }
    } else {
      /* has no token*/
      oneRun = true;
      if (whiteList.indexOf(to.path) !== -1) {
        next()
        NProgress.done()
      } else {
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }
})
router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

Vue.use(VueMarkdownEditor);
Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
})
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
