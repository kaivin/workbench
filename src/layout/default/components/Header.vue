<template>
    <div class="header">
        <div class="logo">
            <router-link class="logo-link" to="/">
                <img class="logo-img" v-bind:src="logo" alt="">
                <img class="logo-title" v-if="device==='desktop'" v-bind:src="logoFont" alt="">
            </router-link>
        </div>
        <div class="header-center">
            <hamburger id="hamburger-container" v-if="device==='desktop'" v-bind:is-active="sidebar.opened" class="hamburger-container" v-on:toggleClick="toggleSideBar" />
            <div class="header-search" v-if="isArticleSearch&&device==='desktop'">
              <el-input placeholder="请输入内容" v-model="searchWord" size="small" class="article-search">
                <el-button slot="append" @click="searchResult"><span class="search-icon"><svg-icon icon-class="search1" class-name="disabled" /></span><span class="search-font" v-if="device==='desktop'">搜索</span></el-button>
              </el-input>
            </div>
            <div class="header-button" v-if="device==='desktop'">
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
            </div>
        </div>
        <div class="header-right">
          <div class="notice-button" v-if="isEnCluesAdd">
            <el-badge :value="customerTipsCount" :hidden="customerTipsCount==0" :max="99" class="item">
              <i class="svg-i"><svg-icon icon-class="notice" class-name="disabled" /></i>
            </el-badge>
          </div>
          <el-dropdown class="user-button" @command="handleCommand">
            <div class="el-dropdown-link">
              <span class="user-icon">
                <svg-icon icon-class="user1" v-if="device==='desktop'" class-name="disabled" />
                <svg-icon icon-class="user2" v-else class-name="disabled" />
              </span>
              <span class="user-name" v-if="device==='desktop'">您好：{{userInfo.name}}</span>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-user-solid" command="a" v-on:click="linkTo">个人中心</el-dropdown-item>
              <el-dropdown-item divided command="b" v-on:click="logout"><i class="svg-i"><svg-icon icon-class="exit" class-name="disabled" /></i>退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span class="nav-button" v-if="device==='mobile'" v-on:click="toggleSideBar"><i></i></span>
        </div>
    </div>
</template>
<script>
import logo from "@/assets/logo.png";
import logoTitle from "@/assets/logo_font.png";
import { mapGetters } from 'vuex';
import Hamburger from '@/components/Hamburger';
export default {
    data(){
        return{
          logo: logo,
          logoFont:logoTitle,
          searchWord:"",
        }
    },
    components: {
        Hamburger,
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'userInfo',
        'device',
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
      ]),
    },
    methods:{
        // 退出登录
        async logout() {
            var $this = this;
            await $this.$store.dispatch('login/logoutAction').then(response=>{
              if(response.status){
                $this.$router.push(`/login?redirect=${$this.$route.fullPath}`)
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
        toggleSideBar() {
            this.$store.dispatch('app/toggleSideBar')
        },
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
          window.open(routeUrl.href,'_blank');
        },
        // 添加英文询盘
        enCluesAdd(){
          var $this = this;
          var routeUrl =  $this.$router.resolve({path:'/Enphone/addEditClues'});
          window.open(routeUrl.href,'_blank');
        },
        // 添加网站日志
        websiteLogAdd(){
          this.$store.dispatch('app/addWebsiteLog')
        },
        // 添加网站日志
        webMsgIpAdd(){
          this.$store.dispatch('app/addWebMsgIp')
        },
    }
}
</script>



