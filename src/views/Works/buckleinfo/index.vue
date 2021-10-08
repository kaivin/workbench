<template>
  <div class="page-root scroll-panel dict-page" ref="boxPane">
    <p class="breadcrumb" ref="breadcrumbPane">
      <router-link class="breadcrumb-link" to="/"><span>首页</span></router-link>
      <template v-for="item in breadcrumbList">
        <router-link class="breadcrumb-link" :to="item.router" v-bind:key="item.id" v-if="item.router!=''"><b>-</b><span>{{item.title}}</span></router-link>
        <span class="breadcrumb-link" v-bind:key="item.id" v-else><b>-</b><span>{{item.title}}</span></span>
      </template>
    </p>
    <el-card class="box-card scroll-card" shadow="hover">
        <div class="card-content" ref="cardContent">
            <div class="main-content">
                <div class="item-form">
                    <div class="flex-box" style="width: 240px;">
                        <div class="item-title">工单逾期扣分：</div>
                        <div class="flex-content flex-box item-content">
                            <div class="flex-content item-input"><el-input size="small" v-model="formData.score"></el-input></div><div class="tips-font">/ 天</div>
                        </div>
                    </div>
                </div> 
                <div class="item-form">
                    <div class="flex-box" style="width: 360px;">
                        <div class="item-title">外网IP的系统访问权限：</div>
                        <div class="flex-content flex-box item-content">
                          <div class="flex-content item-input">
                            <el-radio-group v-model="formData.limit_ip" size="small">
                              <el-radio-button label="1">可访问</el-radio-button>
                              <el-radio-button label="2">不可访问</el-radio-button>
                            </el-radio-group>
                          </div>
                        </div>
                    </div>
                </div> 
                <div class="item-form">
                    <div class="flex-box" style="width: 360px;">
                        <div class="item-title">外网IP权限菜单的访问权限：</div>
                        <div class="flex-content flex-box item-content">
                          <div class="flex-content item-input">
                            <el-radio-group v-model="formData.permitip" size="small">
                              <el-radio-button label="1">可访问</el-radio-button>
                              <el-radio-button label="2">不可访问</el-radio-button>
                            </el-radio-group>
                          </div>
                        </div>
                    </div>
                </div> 
                <div class="item-form btn-panel">
                    <el-button type="primary" size="large" v-on:click="saveInfo()">保存</el-button>
                    <el-button type="info" plain size="large" v-on:click="resetFormData()">重置</el-button>
                </div>
            </div>
        </div>
    </el-card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Works_buckle',
  data() {
    return {
      breadcrumbList:[],
      menuButtonPermit:[],
      formData:{
        score:"",
        limit_ip:"1",
        permitip:"1",
      },
      serverData:{},
      isLoading:null
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'menuData'
    ]),
  },
  created(){
    var $this = this;
    $this.getBreadcrumbList();
    $this.initData();
  },
  methods:{
    // 获取面包屑路径
    getBreadcrumbList(){
      var $this = this;
      var breadcrumbList = [];
      var currentID = ""+$this.$router.currentRoute.meta.id;
      var pageID = 0;
      if(currentID.indexOf('-')!=-1){
        pageID = parseInt(currentID.split("-")[1]);
      }else{
        pageID = parseInt(currentID);
      }
      $this.menuData.forEach(function(item,index){
        if(item.meta.id == pageID){
          var itemData = {};
          itemData.id = item.meta.id;
          itemData.router = item.path;
          itemData.title = item.meta.title;
          breadcrumbList.push(itemData);
        }else{
          if(item.children.length>0){
            item.children.forEach(function(item1,index1){
              if(item1.meta.id == pageID){
                var itemData = {};
                itemData.id = item.meta.id;
                itemData.router = item.path;
                itemData.title = item.meta.title;
                breadcrumbList.push(itemData);
                var itemData2 = {};
                itemData2.id = item1.meta.id;
                itemData2.router = item1.path;
                itemData2.title = item1.meta.title;
                breadcrumbList.push(itemData2);
              }else{
                if(item1.children.length>0){
                  item1.children.forEach(function(item2,index2){
                    if(item2.meta.id == pageID){
                      var itemData = {};
                      itemData.id = item.meta.id;
                      itemData.router = item.path;
                      itemData.title = item.meta.title;
                      breadcrumbList.push(itemData);
                      var itemData2 = {};
                      itemData2.id = item1.meta.id;
                      itemData2.router = item1.path;
                      itemData2.title = item1.meta.title;
                      breadcrumbList.push(itemData2);
                      var itemData3 = {};
                      itemData3.id = item2.meta.id;
                      itemData3.router = item2.path;
                      itemData3.title = item2.meta.title;
                      breadcrumbList.push(itemData3);
                    }
                  });
                }
              }
            });
          }
        }
      });
      $this.breadcrumbList = breadcrumbList;
    },
    // loading自定义
    loadingFun(){
      var $this = this;
      $this.isLoading = $this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
    },
    // 重置页面
    resetFormData(){
      var $this = this;
      $this.loadingFun();
      $this.clearFormData();
      $this.initInfo($this.serverData);
    },
    // 初始化数据
    initData(){
      var $this = this;
      $this.loadingFun();
      $this.getUserMenuButtonPermit();
    },
    // 获取当前登陆用户在该页面的操作权限
    getUserMenuButtonPermit(){
      var $this = this;
      $this.$store.dispatch('api/getMenuButtonPermitAction',{id:$this.$router.currentRoute.meta.id}).then(res=>{
        if(res.status){
          if(res.data.length>0){
            res.data.forEach(function(item,index){
              $this.menuButtonPermit.push(item.action_route);
            });
            if($this.menuButtonPermit.includes('Works_buckleinfo')){
                $this.initPage();
            }else{
                $this.$message({
                    showClose: true,
                    message: "未被分配字典表配置页面访问权限",
                    type: 'error',
                    duration:6000
                });
                $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
            }
          }else{
            $this.$message({
              showClose: true,
              message: "未被分配字典表配置页面访问权限",
              type: 'error',
              duration:6000
            });
            $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
          }
        }else{
          $this.$message({
            showClose: true,
            message: response.info,
            type: 'error'
          });
        }
      });
    },
    // 获取工单发布修改所需系统数据
    initPage(){
      var $this = this;
      $this.$store.dispatch('works/buckleInitInfoAction', null).then(response=>{
        if(response){
          if(response.status){
            $this.serverData = response.data;
            console.log(response)
            $this.initInfo($this.serverData);
          }else{
            $this.$message({
                showClose: true,
                message: response.info,
                type: 'error'
            });
          }
        }
      });
    },
    // 初始化页面数据
    initInfo(data){
      var $this = this;
      $this.formData.score = data.bucklescore;
      $this.formData.limit_ip = ""+data.limit_ip;
      $this.formData.permitip = ""+data.permitip;
      $this.isLoading.close();
    },
    // 重置添加文章表单
    clearFormData(){
      var $this = this;
      $this.formData.score = $this.serverData.bucklescore;
      $this.formData.limit_ip = ""+$this.serverData.limit_ip;
      $this.formData.permitip = ""+$this.serverData.permitip;
    },
    // 验证是否为空
    validationForm(){
      var $this = this;
      if($this.formData.score == ""){
        $this.$message({
            showClose: true,
            message: '错误：工单逾期扣分不能为空！',
            type: 'error'
        });
        return false;
      }
      return true;
    },
    // 保存修改数据
    saveInfo(){
      var $this = this;
      $this.loadingFun();
      if(!$this.validationForm()){
        return false;
      }
      var formData = {}
      formData.score = $this.formData.score;
      formData.limit_ip = $this.formData.limit_ip;
      formData.permitip = $this.formData.permitip;
      $this.$store.dispatch('works/buckleInfoSaveAction', formData).then(response=>{
          if(response.status){
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'success'
            });
            $this.initPage();
          }else{
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'error'
            });
          }
      });
    },
  }
}
</script>
<style lang="scss" scoped>
</style>