<template>
    <div class="header-panel">
        <div class="logo">
            <router-link class="logo-link" :to="homeRedirect">
                <img class="logo-img" v-bind:src="logo" alt="">
                <img class="logo-title" v-bind:src="logoFont" alt="">
            </router-link>
        </div>
        <div class="header-center">
            <div class="header-search" v-if="isArticleSearch">
              <el-input placeholder="请输入内容" v-model="searchWord" @keypress.native.enter="searchResult" size="small" class="article-search">
                <el-button slot="append" @click="searchResult"><span class="search-icon"><svg-icon icon-class="search1" class-name="disabled" /></span><span class="search-font">搜索</span></el-button>
              </el-input>
            </div>
            <div class="header-button" v-if="isArticleAdd||isWebsiteAdd||isWebserverAdd||isCnPhoneAdd||isEnPhoneAdd||isEnCateAdd||isEnProductAdd||isCnCateAdd||isCnProductAdd||isWebsiteAttrAdd||isInformationAdd||isTagAdd||isUserAdd||isDepartAdd||isRoleAdd||isMenuAdd||isPermitAdd||isPromotedAccountAdd||isPromotedChannelAdd||isCnProcessAdd||isCnMoneyAdd||isCnCluesAdd||isEnCluesAdd||isWebsiteLogAdd||isWebMsgIpAdd||iscompareListAdd||isEncompareListAdd||isCntargetlistAdd||isEntargetlistAdd||isWorkOrderTagAdd||isWorkOrderAdd||isDepartScoreAdd||isResourceTypeAdd||isResourceAdd||isCnScoreAdd||isEnScoreAdd||iscompareGroupListAdd||isEncompareGroupListAdd">
              <div class="item-button" v-if="isArticleAdd" v-on:click="articleAdd"><span class="button-icon"><svg-icon icon-class="add" class-name="disabled" /></span><span class="button-font">发布文章</span></div>
              <div class="item-button" v-if="isWebsiteAdd" v-on:click="websiteAdd"><span class="button-icon"><svg-icon icon-class="add" class-name="disabled" /></span><span class="button-font">添加网站</span></div>
              <div class="item-button" v-if="isWebserverAdd" v-on:click="webserverAdd"><span class="button-icon"><svg-icon icon-class="add" class-name="disabled" /></span><span class="button-font">添加服务器</span></div>
              <div class="item-button" v-if="isCnPhoneAdd" v-on:click="cnPhoneAdd"><span class="button-icon"><svg-icon icon-class="add" class-name="disabled" /></span><span class="button-font">添加电话</span></div>
              <div class="item-button" v-if="isEnPhoneAdd" v-on:click="enPhoneAdd"><span class="button-icon"><svg-icon icon-class="add" class-name="disabled" /></span><span class="button-font">添加电话</span></div>
              <div class="item-button" v-if="isEnCateAdd" v-on:click="enCateAdd"><span class="button-icon"><svg-icon icon-class="add" class-name="disabled" /></span><span class="button-font">添加分类</span></div>
              <div class="item-button" v-if="isEnProductAdd" v-on:click="enProductAdd"><span class="button-icon"><svg-icon icon-class="add" class-name="disabled" /></span><span class="button-font">添加产品</span></div>
              <div class="item-button" v-if="isCnCateAdd" v-on:click="cnCateAdd"><span class="button-icon"><svg-icon icon-class="add" class-name="disabled" /></span><span class="button-font">添加分类</span></div>
              <div class="item-button" v-if="isCnProductAdd" v-on:click="cnProductAdd"><span class="button-icon"><svg-icon icon-class="add" class-name="disabled" /></span><span class="button-font">添加产品</span></div>
              <div class="item-button" v-if="isWebsiteAttrAdd" v-on:click="websiteAttrAdd"><span class="button-icon"><svg-icon icon-class="add" class-name="disabled" /></span><span class="button-font">添加标签</span></div>
              <div class="item-button" v-if="isInformationAdd" v-on:click="informationAdd"><span class="button-icon"><svg-icon icon-class="add" class-name="disabled" /></span><span class="button-font">添加栏目</span></div>
              <div class="item-button" v-if="isTagAdd" v-on:click="tagAdd"><span class="button-icon"><svg-icon icon-class="add" class-name="disabled" /></span><span class="button-font">添加标签</span></div>
              <div class="item-button" v-if="isUserAdd" v-on:click="userAdd"><span class="button-icon"><svg-icon icon-class="add" class-name="disabled" /></span><span class="button-font">添加用户</span></div>
              <div class="item-button" v-if="isDepartAdd" v-on:click="departAdd"><span class="button-icon"><svg-icon icon-class="add" class-name="disabled" /></span><span class="button-font">添加部门</span></div>
              <div class="item-button" v-if="isRoleAdd" v-on:click="roleAdd"><span class="button-icon"><svg-icon icon-class="add" class-name="disabled" /></span><span class="button-font">添加角色</span></div>
              <div class="item-button" v-if="isMenuAdd" v-on:click="menuAdd"><span class="button-icon"><svg-icon icon-class="add" class-name="disabled" /></span><span class="button-font">添加菜单</span></div>
              <div class="item-button" v-if="isPermitAdd" v-on:click="permitAdd"><span class="button-icon"><svg-icon icon-class="add" class-name="disabled" /></span><span class="button-font">添加权限</span></div>
              <div class="item-button" v-if="isPromotedAccountAdd" v-on:click="promotedAccountAdd"><span class="button-icon"><svg-icon icon-class="add" class-name="disabled" /></span><span class="button-font">添加账户</span></div>
              <div class="item-button" v-if="isPromotedChannelAdd" v-on:click="promotedChannelAdd"><span class="button-icon"><svg-icon icon-class="add" class-name="disabled" /></span><span class="button-font">添加渠道</span></div>
              <div class="item-button" v-if="isCnProcessAdd" v-on:click="cnProcessAdd"><span class="button-icon"><svg-icon icon-class="add" class-name="disabled" /></span><span class="button-font">添加数据</span></div>
              <div class="item-button" v-if="isCnMoneyAdd" v-on:click="cnMoneyAdd"><span class="button-icon"><svg-icon icon-class="add" class-name="disabled" /></span><span class="button-font">添加充值记录</span></div>
              <div class="item-button" v-if="isCnCluesAdd" v-on:click="cnCluesAdd"><span class="button-icon"><svg-icon icon-class="add" class-name="disabled" /></span><span class="button-font">新增询盘</span></div>
              <div class="item-button" v-if="isEnCluesAdd" v-on:click="enCluesAdd"><span class="button-icon"><svg-icon icon-class="add" class-name="disabled" /></span><span class="button-font">新增询盘</span></div>
              <div class="item-button" v-if="isWebsiteLogAdd" v-on:click="websiteLogAdd"><span class="button-icon"><svg-icon icon-class="add" class-name="disabled" /></span><span class="button-font">添加网站日志</span></div>
              <div class="item-button" v-if="isWebMsgIpAdd" v-on:click="webMsgIpAdd"><span class="button-icon"><svg-icon icon-class="add" class-name="disabled" /></span><span class="button-font">添加IP白名单</span></div>
              <div class="item-button" v-if="iscompareListAdd" v-on:click="compareListAdd"><span class="button-icon"><svg-icon icon-class="add" class-name="disabled" /></span><span class="button-font">添加部门成交</span></div>
              <div class="item-button" v-if="iscompareGroupListAdd" v-on:click="compareGroupListAdd"><span class="button-icon"><svg-icon icon-class="add" class-name="disabled" /></span><span class="button-font">添加小组成交</span></div>
              <div class="item-button" v-if="isEncompareListAdd" v-on:click="EncompareListAdd"><span class="button-icon"><svg-icon icon-class="add" class-name="disabled" /></span><span class="button-font">添加部门A</span></div>
              <div class="item-button" v-if="isEncompareGroupListAdd" v-on:click="EncompareGroupListAdd"><span class="button-icon"><svg-icon icon-class="add" class-name="disabled" /></span><span class="button-font">添加小组成交积分</span></div>
              <div class="item-button" v-if="isCntargetlistAdd" v-on:click="CntargetlistAdd"><span class="button-icon"><svg-icon icon-class="add" class-name="disabled" /></span><span class="button-font">添加日目标</span></div>
              <div class="item-button" v-if="isEntargetlistAdd" v-on:click="EntargetlistAdd"><span class="button-icon"><svg-icon icon-class="add" class-name="disabled" /></span><span class="button-font">添加日目标</span></div>
              <div class="item-button" v-if="isWorkOrderTagAdd" v-on:click="workOrderTagAdd"><span class="button-icon"><svg-icon icon-class="add" class-name="disabled" /></span><span class="button-font">添加标签</span></div>
              <div class="item-button" v-if="isWorkOrderAdd" v-on:click="workOrderAdd"><span class="button-icon"><svg-icon icon-class="add" class-name="disabled" /></span><span class="button-font">工单发布</span></div>
              <div class="item-button" v-if="isDepartScoreAdd" v-on:click="DepartScoreAdd"><span class="button-icon"><svg-icon icon-class="add" class-name="disabled" /></span><span class="button-font">部门月度积分添加</span></div>
              <div class="item-button" v-if="isResourceTypeAdd" v-on:click="resourceTypeAdd"><span class="button-icon"><svg-icon icon-class="add" class-name="disabled" /></span><span class="button-font">添加资源类型</span></div>
              <div class="item-button" v-if="isResourceAdd" v-on:click="resourceAdd"><span class="button-icon"><svg-icon icon-class="add" class-name="disabled" /></span><span class="button-font">添加资源</span></div>
              <div class="item-button" v-if="isCnScoreAdd" v-on:click="cnScoreAdd"><span class="button-icon"><svg-icon icon-class="add" class-name="disabled" /></span><span class="button-font">中文个人成交添加</span></div>
              <div class="item-button" v-if="isEnScoreAdd" v-on:click="enScoreAdd"><span class="button-icon"><svg-icon icon-class="add" class-name="disabled" /></span><span class="button-font">英文个人成交添加</span></div>
            
            </div>
        </div>
        <div class="header-right">
          <span class="cache-icon" v-if="isHomeCache" v-on:click="clearHomeCache" title="清除首页数据缓存">
            <svg-icon icon-class="clearCache" class-name="disabled" />
          </span>
          <span class="cache-icon" v-if="isNohomeCache" v-on:click="clearCache" title="清除数据缓存">
            <svg-icon icon-class="clearCache" class-name="disabled" />
          </span>
          <span class="feedback-icon" v-on:click="openDialog" title="意见反馈">
            <svg-icon icon-class="feedback" class-name="disabled" />
          </span>
          <div class="notice-button" v-if="isEnCluesAdd&&customerTipsCount>0">
            <el-badge :value="customerTipsCount" :hidden="customerTipsCount==0" :max="99" class="item">
              <i class="svg-i"><svg-icon icon-class="notice" class-name="disabled" /></i>
            </el-badge>
          </div>
          <el-dropdown class="user-button" @command="handleCommand">
            <div class="el-dropdown-link">
              <span class="user-icon">
                <img v-if="userInfo.headimg" :src="userInfo.headimg" alt="">
                <svg-icon v-else icon-class="user1" class-name="disabled" />
              </span>
              <span class="user-name">您好：{{userInfo.name}}</span>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-user-solid" command="a" v-on:click="linkTo">个人中心</el-dropdown-item>
              <el-dropdown-item divided command="b" v-on:click="logout"><i class="svg-i"><svg-icon icon-class="exit" class-name="disabled" /></i>退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <el-dialog title="意见反馈" custom-class="add-edit-dialog feedback" :visible.sync="dialogFormVisible" :before-close="handleClose" width="480px">
          <el-form :model="dialogForm">
            <div class="item-form">
                <el-input type="textarea" v-model="dialogForm.content" :autosize="{ minRows: 4, maxRows: 8}" placeholder="请尽可能的描述清楚具体页面出现的具体问题" ref="content"></el-input>
            </div>
            <div class="item-form">
                <p class="tips">您在本系统使用过程中遇到任何问题，都可以在这里反馈给我们，我们会尽快第一时间解决您所提出的问题</p>
            </div>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="handleClose">取 消</el-button>
              <el-button type="primary" @click="saveData">确 定</el-button>
            </span>
          </template>
        </el-dialog>
    </div>
</template>
<script>
import logo from "@/assets/logo.png";
import logoTitle from "@/assets/logo_font.png";
import { mapGetters } from 'vuex';
import Cookies from 'js-cookie'
import Hamburger from '@/components/Hamburger';
export default {
    data(){
        return{
          homeRedirect:"/",
          logo: logo,
          logoFont:logoTitle,
          searchWord:"",
          dialogFormVisible:false,
          dialogForm:{
            content:"",
          },
        }
    },
    components: {
        Hamburger,
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'userInfo',
        'ModuleList',
        'isArticleSearch',
        'isArticleAdd',
        'isWebsiteAdd',
        'isWebserverAdd',
        'isCnPhoneAdd',
        'isEnPhoneAdd',
        'isEnCateAdd',
        'isEnProductAdd',
        'isCnCateAdd',
        'isCnProductAdd',
        'isWebsiteAttrAdd',
        'isInformationAdd',
        'isTagAdd',
        'isUserAdd',
        'isDepartAdd',
        'isRoleAdd',
        'isMenuAdd',
        'isPermitAdd',
        'isPromotedAccountAdd',
        'isPromotedChannelAdd',
        'isCnProcessAdd',
        'isCnMoneyAdd',
        'isCnCluesAdd',
        'isEnCluesAdd',
        'isWebsiteLogAdd',
        'customerTipsCount',
        'isWebMsgIpAdd',
        'iscompareListAdd',
        'iscompareGroupListAdd',
        'isEncompareListAdd',
        'isEncompareGroupListAdd',
        'isCntargetlistAdd',
        'isEntargetlistAdd',
        'isWorkOrderTagAdd',
        'isWorkOrderAdd',
        'isDepartScoreAdd',
        'isResourceTypeAdd',
        'isResourceAdd',
        'isCnScoreAdd',
        'isEnScoreAdd',
        'isHomeCache',
        'isNohomeCache',
        'isCustormbuyFile',
      ]),
    },
  watch: {
      //监听相同路由下参数变化的时候，从而实现异步刷新
      '$route'(to,from) {
        if(to.path=="/Article/index"){
          if(!to.query.keyword){
            this.searchWord = "";
          }
        }
      },
  },
  created(){
    var homeRedirect = "";
    if(this.userInfo.issales==2){
      homeRedirect = '/Sales/index';
    }else{
      if(this.ModuleList.includes("Module_manager")){
        homeRedirect = '/Home/index';
      }else{
        if(this.ModuleList.includes("Module_cnStat")){
          homeRedirect = '/Home/CH/objectiveShow';
        }else{
          if(this.ModuleList.includes("Module_enStat")){
            homeRedirect = '/Home/EN/objectiveShow';
          }
        }
      }
    }
    this.homeRedirect = homeRedirect;
    if(this.$route.path=="/Article/index"){
      if(this.$route.query.keyword){
        this.searchWord = this.$route.query.keyword;
      }
    }
  },
  methods:{
      // 清除缓存
      clearCache(){
        var $this = this;
        var type = "all";
        $this.$store.dispatch('api/clearCacheAction', {cachename:type}).then(response=>{
          if(response){
            if(response.status){
              $this.$message({
                showClose: true,
                message: response.info,
                type: 'success'
              });
              $this.enCluesSearchData();
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
      // 清除首页数据
      clearHomeCache(){
          var $this = this;
          var userlanguage = Cookies.get('language');      
          userlanguage = JSON.parse(userlanguage);
          var cacheForm={}
          if(userlanguage.language=='Module_cnStat'){
            cacheForm.cachename='chinaindex'
          }else{
            cacheForm.cachename='enindex'
          }
          $this.$store.dispatch('api/clearHomeCacheAction', cacheForm).then(response=>{
            if(response){
              if(response.status){
                $this.$message({
                  showClose: true,
                  message: response.info,
                  type: 'success'
                });
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
      // 打开意见反馈弹窗
      openDialog(){
        var $this = this;
        $this.dialogFormVisible = true;
      },
      // 关闭弹窗
      handleClose(){
        var $this = this;
        $this.dialogFormVisible = false;
      },
      // 提交反馈
      saveData(){
        var $this = this;
        $this.$store.dispatch('api/getAddsayAction', $this.dialogForm).then(response=>{
          if(response){
            if(response.status){
              $this.$message({
                showClose: true,
                message: response.info,
                type: 'success'
              });
              $this.dialogForm.content = "";
              $this.handleClose();
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
      // 退出登录
      async logout() {
          var $this = this;
          await $this.$store.dispatch('login/logoutAction').then(response=>{
            if(response.status){
              $this.$router.push(`/login`)
              //$this.$router.push(`/login?redirect=${$this.$route.fullPath}`)
            }else{
              $this.$message({
                showClose: true,
                message: response.info,
                type: 'error'
              });
            }
          });
      },
      // 侧边导航伸缩
      //toggleSideBar() {
      //    this.$store.dispatch('app/toggleSideBar')
      //},
      // 跳转到个人中心
      linkTo(){
        var $this = this;
        $this.$router.push(`/User/personset`);
      },
      // 下拉菜单点击触发事件
      handleCommand(e){
        var $this = this;
        if(e==="a"){
          $this.linkTo();
        }else{
          $this.logout();
        }
      },
      // 搜索结果点击事件
      searchResult(){
        var $this = this;
        if($this.searchWord!=""){
          $this.$router.push({path:'/Article/index',query:{keyword:$this.searchWord}});
        }else{
          $this.$router.push({path:'/Article/index'});
        }
      },
      // 发布贴吧文章
      articleAdd(){
        var $this = this;
        var routeUrl =  $this.$router.resolve({path:'/Article/addEdit'});
        window.open(routeUrl.href,'_blank');
      },
      // 添加网站
      websiteAdd(){
        this.$store.dispatch('app/addWebsite')
      },
      // 添加服务器
      webserverAdd(){
        var $this = this;
        var routeUrl =  $this.$router.resolve({name:'webserverAddEdit'});
        window.open(routeUrl.href,'_blank');
      },
      // 添加中文电话
      cnPhoneAdd(){
        this.$store.dispatch('app/addCnPhone')
      },
      // 添加英文电话
      enPhoneAdd(){
        this.$store.dispatch('app/addEnPhone')
      },
      // 添加英文产品分类
      enCateAdd(){
        this.$store.dispatch('app/addEnCate')
      },
      // 添加英文产品
      enProductAdd(){
        this.$store.dispatch('app/addEnProduct')
      },
      // 添加中文产品分类
      cnCateAdd(){
        this.$store.dispatch('app/addCnCate')
      },
      // 添加中文产品
      cnProductAdd(){
        this.$store.dispatch('app/addCnProduct')
      },
      // 添加中文产品
      websiteAttrAdd(){
        this.$store.dispatch('app/addWebsiteAttr')
      },
      // 添加论坛栏目
      informationAdd(){
        this.$store.dispatch('app/addInformation')
      },
      // 添加论坛标签
      tagAdd(){
        this.$store.dispatch('app/addTag')
      },
      // 添加用户
      userAdd(){
        this.$store.dispatch('app/addUser')
      },
      // 添加部门
      departAdd(){
        this.$store.dispatch('app/addDepart')
      },
      // 添加角色
      roleAdd(){
        this.$store.dispatch('app/addRole')
      },
      // 添加菜单
      menuAdd(){
        this.$store.dispatch('app/addMenu')
      },
      // 添加权限
      permitAdd(){
        this.$store.dispatch('app/addPermit')
      },
      // 添加推广账户
      promotedAccountAdd(){
        this.$store.dispatch('app/addPromotedAccount')
      },
      // 添加推广渠道
      promotedChannelAdd(){
        this.$store.dispatch('app/addPromotedChannel')
      },
      // 添加中文推广营销流程数据
      cnProcessAdd(){
        this.$store.dispatch('app/addCnProcess')
      },
      // 添加中文推广消费充值记录
      cnMoneyAdd(){
        this.$store.dispatch('app/addCnMoney')
      },
      // 添加中文询盘
      cnCluesAdd(){
        var $this = this;
        var routeUrl =  $this.$router.resolve({path:'/Chinaphone/addEditClues'});
        window.open(routeUrl.href,'_self');
      },
      // 添加英文询盘
      enCluesAdd(){
        var $this = this;
        var routeUrl =  $this.$router.resolve({path:'/Enphone/addEditClues'});
        window.open(routeUrl.href,'_self');
      },
      // 添加网站日志
      websiteLogAdd(){
        this.$store.dispatch('app/addWebsiteLog')
      },
      // 添加网站日志
      webMsgIpAdd(){
        this.$store.dispatch('app/addWebMsgIp')
      },
      // 添加部门成交
      compareListAdd(){
        this.$store.dispatch('app/addCompareList')
      },
      // 添加小组成交
      compareGroupListAdd(){
        this.$store.dispatch('app/addCompareGroupList')
      },
      // 添加部门A成交
      EncompareListAdd(){
        this.$store.dispatch('app/addEncompareList')
      },
      EncompareGroupListAdd(){
        this.$store.dispatch('app/addEncompareGroupList')
      },
      // 中文添加日目标
      CntargetlistAdd(){
        this.$store.dispatch('app/addCntargetlist')
      },
      // 英文添加日目标
      EntargetlistAdd(){
        this.$store.dispatch('app/addEntargetlist')
      },
      // 添加工单标签
      workOrderTagAdd(){
        this.$store.dispatch('app/addWorkOrderTag')
      },
      // 工单发布
      workOrderAdd(){
        var $this = this;
        var routeUrl =  $this.$router.resolve({path:'/Works/addEdit'});
        window.open(routeUrl.href,'_blank');
      },
      // 部门月度积分添加
      DepartScoreAdd(){
        this.$store.dispatch('app/addDepartScore')
      },
      // 资源类型添加
      resourceTypeAdd(){
        this.$store.dispatch('app/addResourceType')
      },
      // 资源添加
      resourceAdd(){
        this.$store.dispatch('app/addResource')
      },
      // 中文个人成交添加
      cnScoreAdd(){
        this.$store.dispatch('app/addCnScore')
      },
      // 英文个人成交添加
      enScoreAdd(){
        this.$store.dispatch('app/addEnScore')
      },
  }
}
</script>
<style lang="scss" scoped>
.addfile{
  label{
    display: block;
    cursor: pointer;
  }
}
</style>


