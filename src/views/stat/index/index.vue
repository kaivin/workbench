
<template>
  <div class="page-root stat-index flex-box" ref="boxPane">
    <sidebar :menu-list="sidebarMenu" />
    <div class="flex-content" style="position:relative;">
      <div class="abs-panel">
          <router-view></router-view>
      </div>
    </div>
  </div>
</template>


<script>
import sidebar  from '../components/sidebar.vue';
export default {
  name: 'statIndex',
  data() {
    return {
      sidebarMenu:[],
    }
  },
  components: {
    sidebar,
  },
  created(){
    var $this = this;
    $this.getUserMenuButtonPermit();
  },
  methods:{
    // 获取当前登陆用户在该页面的操作权限
    getUserMenuButtonPermit(){
      var $this = this;
      $this.$store.dispatch('api/getMenuButtonPermitAction',{id:$this.$router.currentRoute.meta.id}).then(res=>{
        if(res.data.length>0){
          var cnMenuList = {};
          var enMenuList = {};
          cnMenuList.title = "中文";
          enMenuList.title = "英文";
          cnMenuList.menuList = [];
          enMenuList.menuList = [];
          res.data.forEach(function(item,index){
            var itemData = {};
            switch (item.action_route) {
              case 'Api_chinadaytargetnew':
                  itemData.router = "/stat/cn/targetShow";
                  itemData.title = "目标展示";
                  cnMenuList.menuList.push(itemData);
                  break;
              case 'Api_chinacountnew':
                  itemData.router = "/stat/cn/dataOverview";
                  itemData.title = "数据总览";
                  cnMenuList.menuList.push(itemData);
                  break;
              case 'Api_chinadepartcountdefault':
                  itemData.router = "/stat/cn/departAnalysis";
                  itemData.title = "部门分析";
                  cnMenuList.menuList.push(itemData);
                  break;
              case 'Api_chinagroupcountdefault':
                  itemData.router = "/stat/cn/groupAnalysis";
                  itemData.title = "小组分析";
                  cnMenuList.menuList.push(itemData);
                  break;
              case 'Api_chinapersoncountdefault':
                  itemData.router = "/stat/cn/memberAnalysis";
                  itemData.title = "组员分析";
                  cnMenuList.menuList.push(itemData);
                  break;
              case 'Api_endaytargetnew':
                  itemData.router = "/stat/en/targetShow";
                  itemData.title = "目标展示";
                  enMenuList.menuList.push(itemData);
                  break;
              case 'Api_encountnew':
                  itemData.router = "/stat/en/dataOverview";
                  itemData.title = "数据总览";
                  enMenuList.menuList.push(itemData);
                  break;
              case 'Api_endepartcountdefault':
                  itemData.router = "/stat/en/departAnalysis";
                  itemData.title = "部门分析";
                  enMenuList.menuList.push(itemData);
                  break;
              case 'Api_engroupcountdefault':
                  itemData.router = "/stat/en/groupAnalysis";
                  itemData.title = "小组分析";
                  enMenuList.menuList.push(itemData);
                  break;
              case 'Api_enpersoncountdefault':
                  itemData.router = "/stat/en/memberAnalysis";
                  itemData.title = "组员分析";
                  enMenuList.menuList.push(itemData);
            } 
            $this.sidebarMenu = [cnMenuList,enMenuList];
          });
        }else{
          $this.$message({
            showClose: true,
            message: "未被分配该页面的访问权限",
            type: 'error',
              duration:6000
          });
          $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
        }
      });
    },
  }
}
</script>
<style lang="scss" scoped>
</style>
