<template>
  <div class="page-root scroll-panel dict-page" ref="boxPane">
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
      menuButtonPermit:[],
      formData:{
        score:"",
      },
      serverData:{},
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'device'
    ]),
  },
  created(){
    var $this = this;
    $this.initData();
  },
  methods:{
    // 重置页面
    resetFormData(){
      var $this = this;
      $this.clearFormData();
      $this.initInfo($this.serverData);
    },
    // 初始化数据
    initData(){
      var $this = this;
      $this.getUserMenuButtonPermit();
    },
    // 获取当前登陆用户在该页面的操作权限
    getUserMenuButtonPermit(){
      var $this = this;
      $this.$store.dispatch('api/getMenuButtonPermitAction',{id:$this.$router.currentRoute.meta.id}).then(res=>{
        console.log(res,"操作权限——工单发布");
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
    },
    // 重置添加文章表单
    clearFormData(){
      var $this = this;
      $this.formData.score = "";
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
      if(!$this.validationForm()){
        return false;
      }
      var formData = {}
      formData.score = $this.formData.score;
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