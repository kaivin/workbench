<template>
  <div class="page-root ArticleSix work-info-page">
    <div class="abs-panel" ref="mainPane">
      <div class="scroll-panel" ref="scrollPane">
        <div class="ArticleSixFl no-comment">
          <div class="main-article" v-bind:style="device==='desktop'?'min-height:'+minHeight+'px;':commentList.length==0?'min-height:'+minHeight+'px!important;':''">
            <div class="article-info" ref="leftPane">
              <div class="ArticleSixFlTop" v-bind:class="articleData.timestatus==2?'time-out':''">
                  <h1>{{articleData.title}}<span>{{articleData.timestatus==2?'[已逾期]':''}}</span></h1>
                  <div class="work-order-attr">
                    <p><span>发布时间：{{articleData.addtime}}</span><span><mark>|</mark>截止时间：{{articleData.endtime}}</span></p>
                    <p><span>工单积分：{{articleData.score}}</span><span v-if="articleData.mytags!=''"><mark>|</mark>工单标签：<em v-bind:style="'background:'+articleData.mytagscolor+';color:#fff;'">{{articleData.mytags}}</em></span></p>
                    <p><span>工单状态：<b v-if="articleData.status==0">已撤销</b><b v-else-if="articleData.status==1">待接单</b><b v-else-if="articleData.status==2">已接单</b><b v-else-if="articleData.status==4">待审核</b><b v-else-if="articleData.status==5">已驳回</b><b v-else-if="articleData.status==6">已完成待评价</b><b v-else>已完成</b></span></p>
                  </div>
              </div>
              <div class="info-content rich-text" v-html="articleData.content"></div>
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
  name: 'workInfo',
  components: { VueUeditorWrap },
  data() {
    return {
      minHeight:0,
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
    $this.initData();
  },
  methods:{
    // 设置高度
    setHeight(){
      var $this = this;
      var minHeight= "auto";
      $this.$nextTick(()=>{
        var screenHeight = $this.$refs.mainPane.offsetHeight-30;
        var leftHeight = $this.$refs.leftPane.offsetHeight;
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
                if($this.$route.query.ID){
                  if(!$this.menuButtonPermit.includes('Worksaccpet_workinfo')){
                    $this.$message({
                      showClose: true,
                      message: "未被分配查看工单详情权限",
                      type: 'error',
                      duration:6000
                    });
                    $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
                  }else{
                    $this.initPage();
                  }
                }else{
                  $this.$router.push({path:`/404?redirect=${$this.$router.currentRoute.fullPath}`});
                }
            }else{
                $this.$message({
                  showClose: true,
                  message: "未被分配查看工单详情权限",
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
      $this.currentID = $this.$route.query.ID;
      $this.$store.dispatch('worksaccpet/workOrderInfoAction', {id:$this.currentID}).then(response=>{
          if(response){
            if(response.status){
              console.log(response,"工单详情");
              $this.articleData = response.data;
            }else{
              if(response.permitstatus&&response.permitstatus==2){
                  $this.$message({
                    showClose: true,
                    message: "未被分配该工单详情访问权限",
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
    ready (editorInstance) {
      console.log(editorInstance);
    },
  }
}
</script>

<style lang="scss" scoped>
</style>