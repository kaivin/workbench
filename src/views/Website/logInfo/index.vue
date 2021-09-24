<template>
  <div class="page-root ArticleSix">
    <div class="abs-panel" ref="mainPane">
      <div class="scroll-panel" ref="scrollPane">
        <p class="breadcrumb" ref="breadcrumbPane">
          <router-link class="breadcrumb-link" to="/"><span>首页</span></router-link>
          <template v-for="item in breadcrumbList">
            <router-link class="breadcrumb-link" :to="item.router" v-bind:key="item.id" v-if="item.router!=''"><b>-</b><span>{{item.title}}</span></router-link>
            <span class="breadcrumb-link" v-bind:key="item.id" v-else><b>-</b><span>{{item.title}}</span></span>
          </template>
          <router-link class="breadcrumb-link" :to="'/Website/logList?websiteID='+websiteID+'&website='+website"><b>-</b><span>{{website}}工作日志</span></router-link>
          <span class="breadcrumb-link"><b>-</b><span>{{articleData.title}}</span></span>
        </p>
        <div class="ArticleSixFl" v-bind:class="articleData.issay==0&&commentList.length==0?'no-comment':''">
          <div class="main-article" v-bind:style="device==='desktop'?'min-height:'+minHeight+'px;':commentList.length==0?'min-height:'+minHeight+'px!important;':''">
            <div class="article-info" ref="leftPane">
              <div class="ArticleSixFlTop">
                  <h1>{{articleData.title}}</h1>
                  <h2>网站：{{website}} [ {{websiteID}} ]</h2>
                  <div class="ArticleSixFlTopTag clearfix">
                      <p class="ArticleSixFlTopTagFl"><span v-if="articleData.is_hidename==0"><i class="svg-i" ><svg-icon icon-class="art-author" /></i>{{articleData.createname}}</span><span v-else><i class="svg-i" ><svg-icon icon-class="art-author" /></i>匿名</span><span v-if="device==='desktop'"><i class="svg-i" ><svg-icon icon-class="art-edit-time" /></i>{{articleData.updatetime}}</span></p>
                      <p class="ArticleSixFlTopTagFr">阅读：{{articleData.hits}}<span>|</span>发布时间：{{articleData.addtime}}</p>
                  </div>
                  <div class="ArticleSixFlTopRead" v-if="articleData.readshow==1&&device==='desktop'&&(userList.hasreadusercount>0||userList.notreadusercount>0)">
                        <p class="article-user" v-if="articleData.readshow==1">
                          <strong>{{userList.hasreadusercount}}人已读</strong>
                          <template v-for="(item,index) in userList.hasreaduser">
                            <span v-bind:key="item.id" v-if="index==0">{{item.name}}</span>
                            <span v-bind:key="item.id" v-else>、{{item.name}}</span>
                          </template>
                        </p>
                        <p class="article-user" v-if="articleData.readshow==1">
                          <strong>{{userList.notreadusercount}}人未读</strong>
                          <template v-for="(item,index) in userList.notreaduser">
                            <span v-bind:key="item.id" v-if="index==0">{{item.name}}</span>
                            <span v-bind:key="item.id" v-else>、{{item.name}}</span>
                          </template>
                        </p>
                  </div>
              </div>
              <div class="info-content" v-bind:class="articleData.is_markdown==1?'vuepress-markdown-body':'rich-text'" v-html="articleData.content"></div>
            </div>
          </div>
        </div>
        <div class="comment ArticleSixFr" id="comment" v-if="articleData.issay==1&&device==='desktop'||articleData.issay==1&&device==='mobile'&&commentList.length>0||(articleData.issay==0&&commentList.length>0)" v-bind:style="device==='desktop'?'min-height:'+minHeight+'px;':commentList.length>=0?'min-height:'+minHeight+'px!important;':''" ref="rightPane">
          <div class="ArticleSixFrTop" v-bind:class="commentList.length>0?'':'no-comment'">
            <p class="clearfix ArticleSixFrTopHeader"><strong>评论</strong><span v-if="articleData.issay==1&&device==='desktop'">（可匿名）</span></p>
            <div class="ArticleSixFrTopMain" v-if="articleData.issay==1&&device==='desktop'">
              <div class="ueditor-panel"><vue-ueditor-wrap v-model="content" :config="editorConfig" @ready="ready"></vue-ueditor-wrap></div>
              <div class="btn-rich">
                <el-switch class="hide-name" v-model="isHideName" inactive-text="匿名发布"></el-switch>
                <el-button type="primary" v-on:click="submitComment">提交</el-button>
              </div>
            </div>
          </div>
          <div class="ArticleSixFrBom" v-if="commentList.length>0">
            <div class="item-comment" v-for="item in commentList" v-bind:key="item.id">
              <div class="comment-header">
                <span class="name" v-if="item.is_hidename==0">{{item.name}}</span><span class="name" v-else>匿名</span>
                <span class="time">{{item.addtime}}</span>
                <span v-if="articleData.commentdelete==1&&menuButtonPermit.includes('Article_commentdelete')" class="delete" v-on:click="deleteComment(item.id)" title="删除该条评论"><i class="el-icon-delete-solid"></i></span>
              </div>
              <div class="comment-body" v-html="item.content"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-backtop target=".scroll-panel"></el-backtop>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import VueUeditorWrap from 'vue-ueditor-wrap'
export default {
  name: 'articleInfo',
  components: { VueUeditorWrap },
  data() {
    return {
      minHeight:0,
      breadcrumbList:[],
      websiteID:"",
      website:"",
      menuButtonPermit:[],
      currentID:0,
      colspanNum:12,
      articleData:{},
      userList:{},
      commentList:[],
      content:"",
      isHideName:false,
      editorConfig: {
        UEDITOR_HOME_URL: '/ueditor/',
        // 服务端接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
        serverUrl: process.env.NODE_ENV=='development'?'http://172.16.10.24:8017/php/controller.php':process.env.VUE_APP_BASE_API+'/php/controller.php',
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 工具栏是否可以浮动
        autoFloatEnabled: false,
        // 初始容器高度
        initialFrameHeight:120,
        // 初始容器宽度
        initialFrameWidth: '100%',
        // 关闭自动保存
        enableAutoSave: false,
        maximumWords:1000,
        elementPathEnabled:false,
        wordCount:false,
        toolbars: [
            [
                'source', //源代码
                "|",
                'undo', //撤销
                'redo', //重做
                '|',
                'bold', //加粗
                'italic', //斜体
                'forecolor', //字体颜色
                'backcolor', //背景色
                '|',
                'link', //超链接
                'unlink', //取消链接
                'anchor', //锚点
                '|',
                'inserttable', //插入表格
                'edittable', //表格属性
                'edittd', //单元格属性
                '|',
                // 'simpleupload', //单图上传
                'insertimage', //多图上传
                '|',
                'emotion', //表情
                'spechars', //特殊字符
                '|',
            ]
        ]
      },
    }
  },
  computed: {
    ...mapGetters([
      'device',
      'menuData'
    ]),
  },
  mounted(){
      const $this = this;
      this.$nextTick(function () {
        $this.setHeight();
      });
      window.onresize = () => {
          return (() => {
            $this.setHeight();
          })()
      };
  },
  watch: {
      minHeight(val) {
        if (!this.timer) {
          this.minHeight = val
          this.timer = true
          const $this = this
          setTimeout(function() {
            $this.timer = false
          }, 400)
        }
      },
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
      console.log($this.breadcrumbList,"面包屑数据");
    },
    // 设置高度
    setHeight(){
      var $this = this;
      var minHeight= "auto";
      $this.$nextTick(()=>{
        var screenHeight = $this.$refs.mainPane.offsetHeight-30;
        var leftHeight = $this.$refs.leftPane.offsetHeight;
        var breadcrumbHeight = $this.$refs.breadcrumbPane.offsetHeight;
        if($this.device==='desktop'){
          if($this.articleData.issay==1||$this.articleData.issay==0&&$this.commentList.length>0){
            var rightHeight = $this.$refs.rightPane.offsetHeight;
            if(leftHeight>rightHeight){
              minHeight = leftHeight;
            }else{
              minHeight = rightHeight;
            }
          }else{
            minHeight = leftHeight;
          }
          if(minHeight<=screenHeight){
            minHeight = screenHeight;
          }else{
            if (leftHeight<rightHeight){
              minHeight = minHeight+40;
            }
          }
        }else{
          if($this.commentList.length>0){
            if($this.$refs.rightPane){
              var rightHeight = $this.$refs.rightPane.offsetHeight;
              var scrollHeight = leftHeight + rightHeight + 15;
              if(scrollHeight<screenHeight){
                minHeight = rightHeight + (screenHeight+30-scrollHeight);
              }
            }
          }else{
            var scrollHeight = leftHeight;
            if(scrollHeight<screenHeight){
              minHeight = leftHeight + (screenHeight+30-scrollHeight);
            }
          }
        }
        $this.minHeight = minHeight;
      });
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
        if(res.status){
            if(res.data.length>0){
                res.data.forEach(function(item,index){
                    $this.menuButtonPermit.push(item.action_route);
                });
                if($this.$route.query.logID){
                  if(!$this.menuButtonPermit.includes('Website_loginfo')){
                    $this.$message({
                      showClose: true,
                      message: "未被分配查看日志详情权限",
                      type: 'error',
                      duration:6000
                    });
                    $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
                  }else{
                    if($this.$route.query.websiteID&&$this.$route.query.website){
                      $this.initPage();
                    }else{
                      $this.$router.push({path:`/404?redirect=${$this.$router.currentRoute.fullPath}`});
                    }
                  }
                }else{
                  $this.$router.push({path:`/404?redirect=${$this.$router.currentRoute.fullPath}`});
                }
            }else{
                $this.$message({
                  showClose: true,
                  message: "未被分配查看日志详情权限",
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
    // 初始化页面信息
    initPage(){
      var $this = this;
      $this.currentID = $this.$route.query.logID;
      $this.websiteID = $this.$route.query.websiteID;
      $this.website = $this.$route.query.website;
      $this.$store.dispatch('website/websiteLogInfoAction', {id:$this.currentID}).then(response=>{
          if(response){
            if(response.status){
              console.log(response,"文章详情");
              $this.articleData = response.data;
              if($this.articleData.readshow==1){
                $this.getReadUser();
              }
              $this.getCommentList();
            }else{
              if(response.permitstatus&&response.permitstatus==2){
                  $this.$message({
                    showClose: true,
                    message: "未被分配该日志访问权限",
                    type: 'error',
                    duration:6000
                  });
                  $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
                }else{
                  $this.$message({
                    showClose: true,
                    message: response.info,
                    type: 'error'
                  });
                }
            }
          }
      });
    },
    // 获取当前日志的已读用户、未读用户、应读用户
    getReadUser(){
      var $this = this;
      $this.$store.dispatch('website/websiteLogReadUserAction', {id:$this.currentID}).then(response=>{
          if(response){
            if(response.status){
              $this.userList = response;
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
    // 跳转到评论
    lookComment(){
      var $this = this;
      document.getElementById("comment").scrollIntoView();
    },
    ready (editorInstance) {
      console.log(editorInstance);
    },
    // 重置留言表
    resetComment(){
      var $this = this;
      $this.content = "";
      $this.isHideName = false;
    },
    // 提交留言
    submitComment(){
      var $this = this;
      var formData = {};
      formData.content= $this.content;
      formData.articleid = $this.currentID;
      formData.is_hidename = $this.isHideName?1:0;
      if($this.content==""){
        $this.$message({
            showClose: true,
            message: "留言内容不能为空",
            type: 'error'
        });
        return false;
      }
      if(formData.articleid==0){
        $this.$message({
            showClose: true,
            message: "请重新进入该文章进行留言",
            type: 'error'
        });
        return false;
      }
      $this.$store.dispatch('article/postArticleSubmitCommentAction', formData).then(response=>{
          if(response){
            if(response.status){
              $this.resetComment();
              $this.getCommentList();
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
    // 获取留言列表数据
    getCommentList(){
      var $this = this;
      $this.$store.dispatch('article/postArticleCommentListAction', {id:$this.currentID}).then(response=>{
          if(response){
            if(response.status){
              $this.commentList = response.data;
              $this.$nextTick(()=>{
                $this.setHeight();
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
    // 删除评论
    deleteComment(id){
      var $this = this;
      $this.$confirm('是否确认删除该评论?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        $this.$store.dispatch('article/deleteCommentAction', {id:id}).then(response=>{
            if(response){
              if(response.status){
                $this.$message({
                    showClose: true,
                    message: response.info,
                    type: 'success'
                });
                $this.getCommentList();
              }else{
                $this.$message({
                    showClose: true,
                    message: response.info,
                    type: 'error'
                });
              }
            }
        });
      }).catch(() => {
          $this.$message({
            type: 'info',
            message: '已取消删除'
          });
      });
    }
  }
}
</script>

<style lang="scss" scoped>
</style>