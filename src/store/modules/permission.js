import Cookies from 'js-cookie'
function _import(file){
    return () => Promise.resolve(require(/* webpackChunkName: "[request]" */`@/views${file}/index.vue`).default);
  }
function dataToTree(data){
  var parents = data.filter(function (item) {
      return item.meta.uid == 0&&!item.meta.hidden;
  });
  var children = data.filter(function (item) {
      return item.meta.uid != 0&&!item.meta.hidden;
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
  var userInfo = JSON.parse(Cookies.get('userInfo'));
  const accessedRouters = filterRoutes(routers);
  const parentRoute = [{
    path: '/',
    component: Layout,
    redirect: userInfo.issales==2?'/Sales/index':'/Home/index',
    name:"Layout",
    meta: {},
    children: [
      {
        path: "/Home/CH/objectiveShow",
        name:'cnObjectiveShow',
        component: () => import("@/views/Home/CH/objectiveShow/index.vue"),
        meta: {id:'Home-chObjective',title: '目标展示', icon: null, keepAlive:false},
      },
      {
        path: "/Home/CH/dataOverview",
        name:'cnDataOverview',
        component: () => import("@/views/Home/CH/dataOverview/index.vue"),
        meta: {id:'Home-chOverview',title: '数据总览', icon: null, keepAlive:false},
      },
      {
        path: "/Home/CH/sectorAnalysis",
        name:'cnSectorAnalysis',
        component: () => import("@/views/Home/CH/sectorAnalysis/index.vue"),
        meta: {id:'Home-chSector',title: '部门分析', icon: null, keepAlive:false},
      },
      {
        path: "/Home/CH/teamMember",
        name:'cnTeamMember',
        component: () => import(/* webpackChunkName: "cnTeamMember" */ "@/views/Home/CH/teamMember/index.vue"),
        meta: {id:'Home-chTeam',title: '小组分析', icon: null, keepAlive:false},
      },
      {
        path: "/Home/CH/groupAnalysis",
        name:'cnGroupAnalysis',
        component: () => import("@/views/Home/CH/groupAnalysis/index.vue"),
        meta: {id:'Home-chGroup',title: '组员分析', icon: null, keepAlive:false},
      },
      {
        path: "/Home/CH/groupAnalysis/singlePerson",
        name:'groupAnalysis',
        component: () => import("@/views/Home/CH/groupAnalysis/singlePerson.vue"),
        meta: {id:'Home-chGroup',title: '组员分析', icon: null, keepAlive:false},
      },
      {
        path: "/Home/EN/objectiveShow",
        name:'enObjectiveShow',
        component: () => import("@/views/Home/EN/objectiveShow/index.vue"),
        meta: {id:'Home-enObjective',title: '目标展示', icon: null, keepAlive:false},
      },
      {
        path: "/Home/EN/dataOverview",
        name:'enDataOverview',
        component: () => import("@/views/Home/EN/dataOverview/index.vue"),
        meta: {id:'Home-enOverview',title: '数据总览', icon: null, keepAlive:false},
      },
      {
        path: "/Home/EN/sectorAnalysis",
        name:'enSectorAnalysis',
        component: () => import("@/views/Home/EN/sectorAnalysis/index.vue"),
        meta: {id:'Home-enSector',title: '部门分析', icon: null, keepAlive:false},
      },
      {
        path: "/Home/EN/teamMember",
        name:'enTeamMember',
        component: () => import("@/views/Home/EN/teamMember/index.vue"),
        meta: {id:'Home-enTeam',title: '小组分析', icon: null, keepAlive:false},
      },
      {
        path: "/Home/EN/groupAnalysis",
        name:'enGroupAnalysis',
        component: () => import("@/views/Home/EN/groupAnalysis/index.vue"),
        meta: {id:'Home-enGroup',title: '组员分析', icon: null, keepAlive:false},
      },{
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
      {
        path: "/Enphone/editHistoryLog",
        name:'editHistoryLog',
        component: () => import(/* webpackChunkName: "editHistoryLog" */ "@/views/Enphone/editHistoryLog/index.vue"),
        meta: {id:'editHistoryLog-72',title: '询盘修改日志', icon: null, keepAlive:false},
      },
      {
        path: "/Sales/index",
        name:'Salesindex',
        component: () => import(/* webpackChunkName: "editHistoryLog" */ "@/views/Sales/index/index.vue"),
        meta: {id:'Salesindex-79',title: '业务员个人所有询盘', icon: null, keepAlive:false},
      },
      {
        path: "/Sales/phonecount",
        name:'phonecount',
        component: () => import(/* webpackChunkName: "salesPhonecount" */ "@/views/Sales/phonecount/index.vue"),
        meta: {id:'phonecount-79',title: '业务员数据统计', icon: null, keepAlive:false},
      },
      {
        path: "/Sales/search",
        name:'search',
        component: () => import(/* webpackChunkName: "salesSearch" */ "@/views/Sales/search/index.vue"),
        meta: {id:'search-79',title: '业务员数据分析', icon: null, keepAlive:false},
      },
      {
        path: "/Sales/phoneinfosub",
        name:'phoneinfosub',
        component: () => import(/* webpackChunkName: "salesPhoneinfosub" */ "@/views/Sales/phoneinfosub/index.vue"),
        meta: {id:'phoneinfosub-79',title: '业务员询盘修改', icon: null, keepAlive:false},
      },
      {
        path: "/Works/addEdit",
        name:'workOrderAddEdit',
        component: () => import(/* webpackChunkName: "workOrderAddEdit" */ "@/views/Works/addEdit/index.vue"),
        meta: {id:'workOrderAddEdit-94',title: '工单发布', icon: null, keepAlive:false},
      },
      {
        path: "/Works/workInfo",
        name:'workInfo',
        component: () => import(/* webpackChunkName: "workInfo" */ "@/views/Works/workInfo/index.vue"),
        meta: {id:'workInfo-94',title: '工单详情', icon: null, keepAlive:false},
      },
      {
        path: "/Works/statData",
        name:'workStatData',
        component: () => import(/* webpackChunkName: "workStatData" */ "@/views/Works/statData/index.vue"),
        meta: {id:'workStatData-94',title: '工单发布数据统计', icon: null, keepAlive:false},
      },
      {
        path: "/WorkOrder/workInfo",
        name:'workOrderInfo',
        component: () => import(/* webpackChunkName: "workOrderInfo" */ "@/views/WorkOrder/workInfo/index.vue"),
        meta: {id:'workInfo-95',title: '工单详情', icon: null, keepAlive:false},
      },
      {
        path: "/Demo/index",
        name:'Demo_index',
        component: () => import(/* webpackChunkName: "DemoIndex" */ "@/views/Demo/index/index.vue"),
        meta: {id:'demo_index-1000',title: '测试页面', icon: null, keepAlive:false},
      },
      {
        path: "/Demo/test",
        name:'Demo_test',
        component: () => import(/* webpackChunkName: "DemoTest" */ "@/views/Demo/test/index.vue"),
        meta: {id:'demo_test-1001',title: '测试页面2', icon: null, keepAlive:false},
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
  