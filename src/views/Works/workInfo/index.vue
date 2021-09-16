<template>
  <div class="page-root ArticleSix work-info-page">
    <div class="abs-panel" ref="mainPane">
      <div class="scroll-panel" ref="scrollPane">
        <div class="article-main">
          <div class="article-content" v-bind:style="'min-height:'+minHeight+'px;'">
            <h1>{{articleData.title}}</h1>
            <ul class="base-info">
              <li>
                <div class="icon-panel">
                  <i class="svg-i color6" v-if="articleData.timestatus==2"><svg-icon icon-class="work_overdue" /></i>
                  <i class="svg-i color7" v-if="articleData.timestatus!=2&&articleData.status==0"><svg-icon icon-class="work_overdue" /></i>
                  <i class="svg-i color1" v-if="articleData.timestatus!=2&&articleData.status==1"><svg-icon icon-class="work_accept" /></i>
                  <i class="svg-i color2" v-if="articleData.timestatus!=2&&articleData.status==2"><svg-icon icon-class="work_doing" /></i>
                  <i class="svg-i color2" v-if="articleData.timestatus!=2&&articleData.status==4"><svg-icon icon-class="work_overdue" /></i>
                  <i class="svg-i color3" v-if="articleData.timestatus!=2&&articleData.status==5"><svg-icon icon-class="work_reject" /></i>
                  <i class="svg-i color4" v-if="articleData.timestatus!=2&&articleData.status==6&&articleData.commentstatus==0"><svg-icon icon-class="work_overdue" /></i>
                  <i class="svg-i color5" v-if="articleData.timestatus!=2&&articleData.status==6&&articleData.commentstatus!=0"><svg-icon icon-class="work_done" /></i>
                </div>
                <div class="value-panel" v-if="articleData.timestatus==2">已逾期</div>
                <div class="value-panel" v-if="articleData.timestatus!=2&&articleData.status==0">已撤销</div>
                <div class="value-panel" v-if="articleData.timestatus!=2&&articleData.status==1">待接单</div>
                <div class="value-panel" v-if="articleData.timestatus!=2&&articleData.status==2">进行中</div>
                <div class="value-panel" v-if="articleData.timestatus!=2&&articleData.status==4">待审核</div>
                <div class="value-panel" v-if="articleData.timestatus!=2&&articleData.status==5">已驳回</div>
                <div class="value-panel" v-if="articleData.timestatus!=2&&articleData.status==6&&articleData.commentstatus==0">待评价</div>
                <div class="value-panel" v-if="articleData.timestatus!=2&&articleData.status==6&&articleData.commentstatus!=0">已完成</div>
                <div class="title-panel">当前状态</div>
              </li>
              <li>
                <div class="icon-panel"></div>
                <div class="value-panel">{{articleData.dealusername}}</div>
                <div class="title-panel">负责人</div>
              </li>
              <li>
                <div class="icon-panel"><i class="svg-i"><svg-icon icon-class="work_start" /></i></div>
                <div class="value-panel">{{articleData.addtime}}</div>
                <div class="title-panel">开始时间</div>
              </li>
              <li>
                <div class="icon-panel"><i class="svg-i"><svg-icon icon-class="work_ending" /></i></div>
                <div class="value-panel red">{{articleData.endtime}}</div>
                <div class="title-panel">截止时间</div>
              </li>
            </ul>
            <div class="title-line"><i class="svg-i"><svg-icon icon-class="work_title" /></i><span>基本信息</span></div>
            <ul class="other-info">
              <li>
                <dl class="item-info">
                  <dt>任务积分</dt>
                  <dd><p class="score">{{articleData.score}}</p></dd>
                </dl>
              </li>
              <li>
                <dl class="item-info">
                  <dt>任务标签</dt>
                  <dd><p class="tags-list" v-if="articleData.tagsList&&articleData.tagsList.length>0"><span v-for="(item,index) in articleData.tagsList" v-bind:key="index" v-bind:style="'background:'+item.color">{{item.name}}</span></p></dd>
                </dl>
              </li>
              <li>
                <dl class="item-info">
                  <dt>已投入时间</dt>
                  <dd><p class="default-text">{{articleData.timeing}}天</p></dd>
                </dl>
              </li>
              <li>
                <dl class="item-info">
                  <dt>工期进度</dt>
                  <dd><p class="range-date"><span class="range-dom"><i v-bind:style="'width:'+articleData.dayPercent"></i></span><span class="font-dom">{{articleData.dayPercent}}</span></p></dd>
                </dl>
              </li>
            </ul>
            <dl class="item-info" v-if="articleData.accpertusername!=''">
              <dt>任务接收人</dt>
              <dd></dd>
            </dl>
            <dl class="item-info" v-if="articleData.mytags!=''">
              <dt>标签</dt>
              <dd><p class="tags-list"><span v-bind:style="'background:'+articleData.mytagscolor">{{articleData.mytags}}</span></p></dd>
            </dl>
            <dl class="item-info">
              <dt>任务描述</dt>
              <dd>
                <div class="info-content rich-text" v-html="articleData.content"></div>
              </dd>
            </dl>
          </div>
        </div>
        <div class="article-log" v-bind:style="'height:'+minHeight+'px;'">
          <el-timeline>
            <el-timeline-item timestamp="2018/4/12" placement="top">
              <el-card>
                <h4>更新 Github 模板</h4>
                <p>王小虎 提交于 2018/4/12 20:46</p>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="2018/4/3" placement="top">
              <el-card>
                <h4>更新 Github 模板</h4>
                <p>王小虎 提交于 2018/4/3 20:46</p>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="2018/4/2" placement="top">
              <el-card>
                <h4>更新 Github 模板</h4>
                <p>王小虎 提交于 2018/4/2 20:46</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>

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
      menuButtonPermit:[],
      currentID:0,
      colspanNum:12,
      articleData:{},
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
      $this.$nextTick(()=>{
        $this.minHeight = $this.$refs.mainPane.offsetHeight-30;
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
                  if(!$this.menuButtonPermit.includes('Works_workeditini')){
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
      $this.$store.dispatch('works/workOrderEditInitInfoAction', {id:$this.currentID}).then(response=>{
          if(response){
            if(response.status){
              console.log(response,"工单详情");
              if(response.data.accpertusername!=''&&response.data.accpertusername.indexOf('|')!=-1){
                response.data.accpertusername = response.data.accpertusername.replace("|","、");
              }
              if(response.data.dealusername!=''&&response.data.dealusername.indexOf('|')!=-1){
                response.data.dealusername = response.data.dealusername.replace("|","、");
              }
              var startTime = new Date(response.data.addtime);
              var endTime = new Date(response.data.endtime);
              var dateDiff = endTime.getTime() - startTime.getTime();
              var dayDiff = Math.ceil(dateDiff/(24*3600*1000));
              response.data.dayDiff = dayDiff;
              response.data.dayPercent = parseFloat(response.data.timeing/response.data.dayDiff*100).toFixed(2)+"%";
              var tagsList = [];
              if(response.data.tagsname!=''){
                if(response.data.tagsname.indexOf(",")!=-1){
                  var tagsArr = response.data.tagsname.split(",");
                  var colorsArr = response.data.tagsnamecolor.split(",");
                  tagsArr.forEach(function(item,index){
                    var itemData = {};
                    itemData.name = item;
                    itemData.color = colorsArr[index];
                    tagsList.push(itemData);
                  });
                }else{
                  var itemData = {};
                  itemData.name = response.data.tagsname;
                  itemData.color = response.data.tagsnamecolor;
                  tagsList.push(itemData);
                }
              }
              response.data.tagsList = tagsList;
              $this.articleData = response.data;
              $this.getCommentList();
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
      formData.workid = $this.currentID;
      formData.is_hidename = $this.isHideName?1:0;
      if($this.content==""){
        $this.$message({
            showClose: true,
            message: "留言内容不能为空",
            type: 'error'
        });
        return false;
      }
      if(formData.workid==0){
        $this.$message({
            showClose: true,
            message: "请重新进入该文章进行留言",
            type: 'error'
        });
        return false;
      }
      $this.$store.dispatch('works/addCommentInfoAction', formData).then(response=>{
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
      $this.$store.dispatch('works/commentInfoListAction', {id:$this.currentID}).then(response=>{
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
        $this.$store.dispatch('works/deleteCurrentCommentAction', {id:id}).then(response=>{
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