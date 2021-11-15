import Vue from 'vue'
import Router from 'vue-router'

import Layout from '@/layout/default/index.vue';
const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(Router)
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: "/login",
    name:'login',
    component: () => import(/* webpackChunkName: "login" */ "@/views/login/index.vue"),
    meta: {title: '登陆', icon: null, keepAlive:false},
  },
  {
    path: '/401',
    name:'401',
    component: () => import('@/views/errorPage/401.vue'),
    meta: {title: '401', icon: null, keepAlive:false},
  },
  {
    path: '/404',
    name:'404',
    component: () => import('@/views/errorPage/404.vue'),
    meta: {title: '404', icon: null, keepAlive:false},
  },
];

const createRouter = () => new Router({
  mode: 'history', 
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router