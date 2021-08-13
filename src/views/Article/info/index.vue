<template>
  <div class="page-root scroll-panel ArticleSix">
    <div class="ArticleSixFl" v-bind:class="articleData.issay==0&&commentList.length==0?'no-comment':''">
      <div class="article-info">
        <div class="ArticleSixFlTop">
          <h1>{{articleData.title}}</h1>
          <div class="ArticleSixFlTopTag clearfix">
            <p class="ArticleSixFlTopTagFl"><span><i class="svg-i" ><svg-icon icon-class="articleWhite" /></i>{{articleData.typename}}</span><span v-if="articleData.is_hidename==0"><i class="svg-i" ><svg-icon icon-class="authorWhite" /></i>{{articleData.createname}}</span><span v-else><i class="svg-i" ><svg-icon icon-class="authorWhite" /></i>匿名</span><span v-if="device==='desktop'"><i class="svg-i" ><svg-icon icon-class="editorWhite" /></i>{{articleData.addtime}}</span></p>
            <p class="ArticleSixFlTopTagFr"><i class="svg-i" ><svg-icon icon-class="eye_rz" /></i>{{articleData.hits}}<span>|</span><i class="svg-i" ><svg-icon icon-class="read_rz" /></i>{{articleData.updatetime}} </p>
          </div>
          <div class="ArticleSixFlTopRead" v-if="articleData.readshow==1&&device==='desktop'&&(userList.hasreadusercount>0||userList.notreadusercount>0)">
            <p class="article-user" v-if="userList.hasreadusercount>0">
              <strong>{{userList.hasreadusercount}}人已读</strong>
              <template v-for="(item,index) in userList.hasreaduser">
                <span v-bind:key="item.id" v-if="index==0">{{item.name}}</span>
                <span v-bind:key="item.id" v-else>、{{item.name}}</span>
              </template>
            </p>
            <p class="article-user" v-if="userList.notreadusercount>0">
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
    <el-card class="box-card scroll-card comment ArticleSixFr" shadow="hover" id="comment" v-if="articleData.issay==1&&device==='desktop'||articleData.issay==1&&device==='mobile'&&commentList.length>0||articleData.issay==0&&commentList.length>0">
      <div class="ArticleSixFrTop">
           <p slot="header" class="clearfix ArticleSixFrTopHeader"><strong>评论</strong><span v-if="articleData.issay==1&&device==='desktop'">（可匿名）</span></p>
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
    </el-card>
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
        serverUrl: process.env.NODE_ENV=='development'?'http://172.16.10.27:8017/php/controller.php':process.env.VUE_APP_BASE_API+'/php/controller.php',
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
      'device'
    ]),
  },
  created(){
    var $this = this;
    $this.initData();
  },
  methods:{
    // 初始化数据
    initData(){
      var $this = this;
      $this.getUserMenuButtonPermit();
    },
    // 获取当前登陆用户在该页面的操作权限
    getUserMenuButtonPermit(){
      var $this = this;
      $this.$store.dispatch('api/getMenuButtonPermitAction',{id:$this.$router.currentRoute.meta.id}).then(res=>{
        console.log(res,"操作权限");
        if(res.status){
          if(res.data.length>0){
            res.data.forEach(function(item,index){
              $this.menuButtonPermit.push(item.action_route);
            });
            if(!$this.menuButtonPermit.includes('Article_info')){
              $this.$message({
                showClose: true,
                message: "未被分配该页面的访问权限",
                type: 'error',
                duration:6000
              });
              $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
            }else{
              if($this.$route.query.id){
                $this.currentID = $this.$route.query.id;
                $this.$store.dispatch('article/postArticleInfoAction', {id:$this.currentID}).then(response=>{
                    if(response){
                      if(response.status){
                        $this.articleData = response.data;
                        if($this.articleData.readshow==1){
                          $this.getReadUser();
                        }
                        $this.getCommentList();
                      }else{
                        if(response.permitstatus&&response.permitstatus==2){
                          $this.$message({
                            showClose: true,
                            message: "未被分配该文章访问权限",
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
              }else{
                $this.$router.push({path:`/404?redirect=${$this.$router.currentRoute.fullPath}`});
              }
            }
          }else{
            $this.$message({
              showClose: true,
              message: "未被分配该页面的访问权限",
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
    // 获取当前文章的已读用户、未读用户、应读用户
    getReadUser(){
      var $this = this;
      $this.$store.dispatch('article/postArticleReadUserAction', {id:$this.currentID}).then(response=>{
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
              if(response.data.length>0){
                $this.commentList = response.data;
              }
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