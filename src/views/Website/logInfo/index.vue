<template>
  <div class="page-root scroll-panel">
    <div class="article-header">
      <div class="flex-row multiple-column">
        <div class="flex-column txt-content">
          <div class="flex-row">
            <div class="flex-column txt-font nowrap"><span>网站：</span></div>
            <div class="flex-column txt-content nowrap">
              <strong>{{website}} [ {{websiteID}} ]</strong>
            </div>
          </div>
        </div>
        <div class="flex-column txt-content">
          <div class="flex-row">
            <div class="flex-column txt-font nowrap"><span>创建者：</span></div>
            <div class="flex-column txt-content nowrap">
              <strong v-if="articleData.is_hidename==0">{{articleData.createname}}</strong><strong v-else>匿名</strong>
            </div>
          </div>
        </div>
        <div class="flex-column txt-content">
          <div class="flex-row">
            <div class="flex-column txt-font nowrap"><span>创建时间：</span></div>
            <div class="flex-column txt-content nowrap">
              <strong>{{articleData.addtime}}</strong>
            </div>
          </div>
        </div>
        <div class="flex-column txt-content">
          <div class="flex-row">
            <div class="flex-column txt-font nowrap"><span>修改时间：</span></div>
            <div class="flex-column txt-content nowrap">
              <strong>{{articleData.updatetime}}</strong>
            </div>
          </div>
        </div>
        <div class="flex-column txt-content">
          <div class="flex-row">
            <div class="flex-column txt-font nowrap"><span>点击量：</span></div>
            <div class="flex-column txt-content">
              <strong>{{articleData.hits}}</strong>
            </div>
          </div>
        </div>
        <div class="flex-column txt-content" v-if="articleData.issay==1||(articleData.issay==0&&commentList.length>0)">
          <div class="flex-row">
            <div class="flex-column txt-font nowrap"><span>评论数：</span></div>
            <div class="flex-column txt-content">
              <strong>{{commentList.length}}</strong>
            </div>
            <div class="flex-column txt-content" style="line-height:0;" v-if="articleData.issay==1&&device==='desktop'||articleData.issay==1&&device==='mobile'&&commentList.length>0||articleData.issay==0&&commentList.length>0">
              <el-tag class="btn-back" v-on:click="lookComment">评论</el-tag>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-row">
        <div class="flex-column txt-font nowrap"><span>标题：</span></div>
        <div class="flex-column txt-content">
          <strong>{{articleData.title}}</strong>
        </div>
      </div>
      <div class="flex-row" v-if="articleData.readshow==1">
        <div class="flex-column txt-font nowrap"><span>已读：</span></div>
        <div class="flex-column txt-content">
           <p class="article-user">
            <strong>{{userList.hasreadusercount}}人已读</strong>
            <template v-for="(item,index) in userList.hasreaduser">
              <span v-bind:key="item.id" v-if="index==0">{{item.name}}</span>
              <span v-bind:key="item.id" v-else>、{{item.name}}</span>
            </template>
          </p>
        </div>
      </div>
      <div class="flex-row" v-if="articleData.readshow==1">
        <div class="flex-column txt-font nowrap"><span>未读：</span></div>
        <div class="flex-column txt-content">
          <p class="article-user">
            <strong>{{userList.notreadusercount}}人未读</strong>
            <template v-for="(item,index) in userList.notreaduser">
              <span v-bind:key="item.id" v-if="index==0">{{item.name}}</span>
              <span v-bind:key="item.id" v-else>、{{item.name}}</span>
            </template>
          </p>
        </div>
      </div>
    </div>
    <div class="info-content" v-bind:class="articleData.is_markdown==1?'vuepress-markdown-body':'rich-text'" v-html="articleData.content"></div>
    <el-card class="box-card comment" shadow="hover" id="comment" v-if="articleData.issay==1&&device==='desktop'||articleData.issay==1&&device==='mobile'&&commentList.length>0||(articleData.issay==0&&commentList.length>0)">
      <div slot="header" class="clearfix comment-header">
        <strong>评论</strong><span v-if="articleData.issay==1&&device==='desktop'">（可匿名）</span>
      </div>
      <div class="comment-content">
        <div class="rich-comment" v-if="articleData.issay==1&&device==='desktop'">
          <vue-ueditor-wrap v-model="content" :config="editorConfig" @ready="ready"></vue-ueditor-wrap>
          <div class="btn-rich"><el-checkbox class="hide-name" v-model="isHideName" border>匿名</el-checkbox><el-button type="primary" v-on:click="submitComment">提交</el-button></div>
        </div>
        <el-divider class="white-line" v-if="articleData.issay==1&&commentList.length>0&&device==='desktop'"><i class="el-icon-goblet-square-full"></i></el-divider>
        <div class="comment-list" v-if="commentList.length>0">
          <div class="item-comment" v-for="(item,index) in commentList" v-bind:key="item.id">
            <div class="comment-header"><span class="floor">#{{commentList.length-index}}楼</span><span class="time">{{item.addtime}}</span><span class="name" v-if="item.is_hidename==0">{{item.name}}：</span><span class="name" v-else>匿名：</span><span v-if="articleData.commentdelete==1" class="delete" v-on:click="deleteComment(item.id)" title="删除该条评论"><i class="el-icon-delete-solid"></i></span></div>
            <div class="comment-body" v-html="item.content"></div>
          </div>
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
        serverUrl: process.env.NODE_ENV=='development'?'http://172.16.10.27:8017/php/controller.php':process.env.VUE_APP_BASE_API+'/php/controller.php',
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 工具栏是否可以浮动
        autoFloatEnabled: false,
        // 初始容器高度
        initialFrameHeight: 200,
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
.article-user{
  width: 100%;
  overflow: hidden;
  font-size: 14px;
  strong{
    margin-right: 10px;
  }
}
.el-divider__text{
  background: #f2f2f2!important;
}
.white-line ::v-deep .el-divider__text{
  background: #ffffff!important;
}
.box-card{
  height: auto!important;
  .comment-header{
    font-size:0;
    line-height:0;
    padding: 0 5px;
    span,strong{
      line-height: 32px;
      color: $--color-primary;
      vertical-align: middle;
    }
    strong{
      font-size: 18px;
      font-weight: bold;
    }
    span{
      font-size: 14px;
    }
  }
  .comment-content{
    padding-top: 10px;
    overflow: hidden;
  }
}
.el-card ::v-deep .edui-editor{
  border: 1px solid $border!important;
}
.btn-back{
  cursor: pointer;
}
.btn-rich{
  padding: 15px 15px 0;
  text-align: right;
  line-height:0;
  .hide-name{
    margin: 0 15px;
  }
}
.comment-list{
  width: 100%;
  overflow: hidden;
  padding-bottom: 20px;
  .item-comment{
    width: 100%;
    overflow: hidden;
    border-bottom: 1px solid #f2f2f2;
    margin-top: 15px;
    &:hover{
      .comment-header{
        .delete{
          display: block;
        }
      }
    }
    .comment-header{
      height:24px;
      span{
        display: block;
        float:left;
        height: 24px;
        line-height: 24px;
        margin-right: 10px;
        &.floor{
          color:#999;
        }
        &.name{
          font-weight: bold;
        }
        &.delete{
          float:right;
          cursor: pointer;
          display: none;
          i{
            font-size: 16px;
          }
        }
      }
    }
    .comment-body{
      padding: 15px;
      overflow: hidden;
      p,div{
        width: 100%;
        margin: 10px 0;
      }
      table{
        margin: 10px 0;
      }
      img,video,table{
        max-width: 100%;
      }
    }
  }
}
.article-header{
  margin-bottom: 15px;
  border-top: 1px solid $primaryBorder;
  border-left: 1px solid $primaryBorder;
  display: block;
  .flex-row{
    display: flex;
    .flex-column{
      padding: 10px;
      line-height: 28px;
      font-size: 15px;
      border-bottom: 1px solid $primaryBorder;
      border-right: 1px solid $primaryBorder;
    }
    .nowrap{
      word-break: keep-all;
      word-wrap:normal;
      white-space:nowrap;
    }
    .txt-content{
      flex: 1;
    }
    &.multiple-column{
      flex-wrap: wrap;
      >.flex-column{
        padding:0;
        border-bottom:none;
        border-right:none;
      }
    }
  }
}
</style>