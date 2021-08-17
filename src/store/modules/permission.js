
function _import(file){
    return () => Promise.resolve(require(/* webpackChunkName: "[request]" */`@/views${file}/index.vue`).default);
  }
function dataToTree(data){
  var parents = data.filter(function (item) {
      return item.meta.uid == 0;
  });
  var children = data.filter(function (item) {
      return item.meta.uid != 0;
  });
  convert(parents, children);
  return parents;
}
function convert(parents,children){
  parents.forEach(function (item) {
    item.children = [];
    children.forEach(function (current, index) {
        if (current.meta.uid === item.meta.id) {
            var temp = JSON.parse(JSON.stringify(children)); // 将获得的子集json格式化
            temp.splice(index, 1); // 删除子集中已匹配项
            item.children.push(current);
            convert([current], temp); // 递归
        }
    });
  });
}
import Layout from '@/layout/default/index.vue';
/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
function dataToRoute(data){
  var newData = [];
  data.forEach(function(item,index){
    var itemData = {};
    itemData.path = item.url!==""?"/"+item.url:"";
    itemData.component = item.url!==""?"/"+item.url:"";
    itemData.redirect = item.redirecturl&&item.redirecturl!==""?"/" + item.redirecturl:"";
    itemData.name = item.route;
    itemData.meta = {}
    itemData.meta.id = item.id;
    itemData.meta.uid = item.uid;
    itemData.meta.title = item.name;
    itemData.meta.icon = item.icon;
    itemData.meta.index = ""+item.level;
    itemData.meta.hidden = item.is_hide == "0"?false:true;
    itemData.meta.affix = item.is_fixed == "0"?false:true;
    itemData.meta.keepAlive = item.is_redis == "0"?false:true;
    newData.push(itemData);
  });
  return newData;
}
function filterRoutes(routers) {
  const accessedRouters = []
  routers.forEach(function(item,index){
    if(item.component&&item.component!=""){
      item.component = _import(item.component)
      accessedRouters.push(item);
    }else{
      if(item.redirect!=""){
        accessedRouters.push(item);
      }
    }
    if(item.children&&item.children.length>0){
      item.children = filterRoutes(item.children)
    }
  });
  return accessedRouters;
}
function setRoutes(routers){
  const accessedRouters = filterRoutes(routers)
  const parentRoute = [{
    path: '/',
    component: Layout,
    redirect: '/Home/index',
    name:"Layout",
    meta: {},
    children: [{
        path: "/Article/info",
        name:'articleInfo',
        component: () => import(/* webpackChunkName: "articleInfo" */ "@/views/Article/info/index.vue"),
        meta: {id:'articleInfo-48',title: '文章详情', icon: null, keepAlive:false},
      },
      {
        path: "/Article/addEdit",
        name:'articleAddEdit',
        component: () => import(/* webpackChunkName: "articleAddEdit" */ "@/views/Article/addEdit/index.vue"),
        meta: {id:'articleAddEdit-48',title: '发布文章', icon: null, keepAlive:false},
      },
      {
        path: "/Website/websiteEdit",
        name:'websiteEdit',
        component: () => import(/* webpackChunkName: "websiteEdit" */ "@/views/Website/websiteEdit/index.vue"),
        meta: {id:'websiteEdit-56',title: '网站信息编辑', icon: null, keepAlive:false},
      },
      {
        path: "/Website/logInfo",
        name:'websiteLogInfo',
        component: () => import(/* webpackChunkName: "websiteLogInfo" */ "@/views/Website/logInfo/index.vue"),
        meta: {id:'websiteLogInfo-56',title: '网站日志详情', icon: null, keepAlive:false},
      },
      {
        path: "/Website/logAddEdit",
        name:'websiteLogAddEdit',
        component: () => import(/* webpackChunkName: "websiteLogAddEdit" */ "@/views/Website/logAddEdit/index.vue"),
        meta: {id:'websiteLogAddEdit-56',title: '网站日志添加|修改', icon: null, keepAlive:false},
      },
      {
        path: "/Website/logList",
        name:'websiteLogList',
        component: () => import(/* webpackChunkName: "websiteLogList" */ "@/views/Website/logList/index.vue"),
        meta: {id:'websiteLogList-56',title: '网站日志', icon: null, keepAlive:true},
      },
      {
        path: "/Webserver/addEdit",
        name:'webserverAddEdit',
        component: () => import(/* webpackChunkName: "webserverAddEdit" */ "@/views/Webserver/addEdit/index.vue"),
        meta: {id:'webserverAddEdit-58',title: '服务器添加|修改', icon: null, keepAlive:false},
      },
      {
        path: "/Chinaphone/addEditClues",
        name:'addEditClues',
        component: () => import(/* webpackChunkName: "addEditClues" */ "@/views/Chinaphone/addEditClues/index.vue"),
        meta: {id:'addEditClues-66',title: '询盘添加|修改', icon: null, keepAlive:false},
      },
      {
        path: "/Chinaphone/searchClues",
        name:'searchClues',
        component: () => import(/* webpackChunkName: "searchClues" */ "@/views/Chinaphone/searchClues/index.vue"),
        meta: {id:'searchClues-66',title: '询盘搜索', icon: null, keepAlive:false},
      },
      {
        path: "/Chinaphone/statisticChart",
        name:'statisticChart',
        component: () => import(/* webpackChunkName: "statisticChart" */ "@/views/Chinaphone/statisticChart/index.vue"),
        meta: {id:'statisticChart-66',title: '中文询盘统计', icon: null, keepAlive:false},
      },
      {
        path: "/Enphone/addEditClues",
        name:'addEditEnClues',
        component: () => import(/* webpackChunkName: "addEditEnClues" */ "@/views/Enphone/addEditClues/index.vue"),
        meta: {id:'addEditEnClues-72',title: '询盘添加|修改', icon: null, keepAlive:false},
      },
      {
        path: "/Enphone/statisticClues",
        name:'statisticEnClues',
        component: () => import(/* webpackChunkName: "statisticEnClues" */ "@/views/Enphone/statisticClues/index.vue"),
        meta: {id:'statisticEnClues-72',title: '业务员数据统计', icon: null, keepAlive:false},
      },
      {
        path: "/Enphone/searchClues",
        name:'searchEnClues',
        component: () => import(/* webpackChunkName: "searchEnClues" */ "@/views/Enphone/searchClues/index.vue"),
        meta: {id:'searchEnClues-72',title: '搜索数据', icon: null, keepAlive:false},
      },
    ]
  }]
  accessedRouters.forEach(function(item,index){
    parentRoute[0].children.push(item);
  });
  return parentRoute;
}

const state = {
  routes: [],
  menuData:[]
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.routes = routes
  },
  SET_MENUS: (state, menuData) => {
    state.menuData = menuData
  },
}

const actions = {
  generateRoutes({ commit }, routers) {
    return new Promise(resolve => {
      var newData = dataToRoute(routers);
      let accessedRoutes;
      var menuData = [];
      if (newData.length <= 0) {
        accessedRoutes = [];
      } else {
        accessedRoutes = setRoutes(newData);
        menuData = dataToTree(newData);
        console.log(menuData,"菜单数据");
      }
      commit('SET_ROUTES', accessedRoutes);
      commit('SET_MENUS', menuData);
      resolve(accessedRoutes);
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
  