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
                  <i class="svg-i color7" v-if="articleData.timestatus!=2&&articleData.status==0"><svg-icon icon-class="work_undo" /></i>
                  <i class="svg-i color1" v-if="articleData.timestatus!=2&&articleData.status==1"><svg-icon icon-class="work_accept" /></i>
                  <i class="svg-i color2" v-if="articleData.timestatus!=2&&articleData.status==2"><svg-icon icon-class="work_doing" /></i>
                  <i class="svg-i color2" v-if="articleData.timestatus!=2&&articleData.status==4"><svg-icon icon-class="work_accept" /></i>
                  <i class="svg-i color3" v-if="articleData.timestatus!=2&&articleData.status==5"><svg-icon icon-class="work_reject" /></i>
                  <i class="svg-i color4" v-if="articleData.timestatus!=2&&articleData.status==6&&articleData.commentstatus==0"><svg-icon icon-class="work_evaluate" /></i>
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
                <div class="icon-panel"><i class="svg-i"><svg-icon icon-class="work_head" /></i></div>
                <div class="value-panel">{{articleData.dealusername==''?'暂无':articleData.dealusername}}</div>
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
                  <dt>任务时间进度</dt>
                  <dd><p class="range-date"><span class="range-dom"><i v-bind:style="'width:'+articleData.dayPercent"></i></span><span class="font-dom">{{articleData.dayPercent}}</span></p></dd>
                </dl>
              </li>
            </ul>
            <dl class="item-info" v-if="articleData.accpertusername!=''">
              <dt>任务接收人</dt>
              <dd><p class="default-text">{{articleData.accpertusername}}</p></dd>
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
        <div class="article-log" ref="rightPane">
          <div class="log-content" v-bind:style="'height:'+minHeight+'px;width:'+rightWidth+'px;'" v-bind:class="menuButtonPermit.includes('Works_addcomments')&&articleData.status!=0?'has-comment':''">
            <div class="log-title"><span>项目日志</span></div>
            <div class="log-panel">
              <el-scrollbar wrap-class="scrollbar-wrapper">
                <ul class="log-list">
                  <li v-for="(item,index) in logList" v-bind:key="index">
                    <dl>
                      <dt><span>{{item.date}}</span></dt>
                      <dd>
                        <div class="item-log flex-box" v-for="(child,idx) in item.children" v-bind:key="idx">
                          <div class="time"><span>{{child.time}}</span><i class="svg-i"><svg-icon icon-class="work_time" /></i></div>
                          <div class="time-icon">
                            <i class="svg-i" v-if="child.loginfo.indexOf('创建')!=-1"><svg-icon icon-class="work_add" /></i>
                            <i class="svg-i color1" v-else-if="child.loginfo.indexOf('发布了评论')!=-1"><svg-icon icon-class="work_msg" /></i>
                            <i class="svg-i color2" v-else-if="child.loginfo.indexOf('完成')!=-1"><svg-icon icon-class="work_done" /></i>
                            <i class="svg-i" v-else><svg-icon icon-class="work_edit" /></i>
                          </div>
                          <div class="time-content flex-content">
                            <div class="time-title"><strong>{{child.uname}}</strong><span>{{child.loginfo}}</span></div>
                            <div class="time-info">{{child.commentinfo}}</div>
                          </div>
                        </div>
                      </dd>
                    </dl>
                  </li>
                </ul>
              </el-scrollbar>
            </div>
            <div class="message-panel" v-if="menuButtonPermit.includes('Works_addcomments')&&articleData.status!=0">
              <div class="message-content" v-bind:class="isFocus?'focus':''" v-clickOutside="onBlur">
                <div class="input-content">
                  <el-input type="textarea" autosize resize="none" @focus="onFocus" @keydown.enter.native="keyDownHandler" placeholder="请输入内容，按ctrl+enter发布内容" v-model="content"></el-input>
                </div>
                <div class="button-content"><el-button type="primary" size="small" v-on:click="sendMessage">发布</el-button></div>
              </div>
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
export default {
  name: 'workInfo',
  data() {
    return {
      minHeight:0,
      rightWidth:0,
      menuButtonPermit:[],
      currentID:0,
      colspanNum:12,
      articleData:{},
      logList:[],
      content:"",
      isHideName:false,
      isFocus:false,
    }
  },
  directives:{
    clickOutside:{
      bind(el, binding, vnode) {
        function clickHandler(e) {
          // 这里判断点击的元素是否是本身，是本身，则返回
          if (el.contains(e.target)) {
            return false;
          }
          // 判断指令中是否绑定了函数
          if (binding.expression) {
            // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
            binding.value(e);
          }
        }
        // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
        el.__vueClickOutside__ = clickHandler;
        document.addEventListener("click", clickHandler);
      },
      unbind(el, binding) {
        // 解除事件监听
        document.removeEventListener("click", el.__vueClickOutside__);
        delete el.__vueClickOutside__; // 删除属性
      }
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
        $this.rightWidth = $this.$refs.rightPane.offsetWidth;
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
              var logList = [];
              var dateArr = [];
              response.loglist.forEach(function(item,index){
                var dateTime = item.addtime.split(" ");
                var date = dateTime[0];
                if(!dateArr.includes(date)){
                  dateArr.push(date);
                }
                item.date = date;
                item.time = dateTime[1].split(":")[0]+":"+dateTime[1].split(":")[1];
              });
              dateArr.forEach(function(item,index){
                var itemData = {};
                itemData.date = item;
                itemData.children = [];
                response.loglist.forEach(function(item1,index1){
                  if(item == item1.date){
                    var itemChildren = {};
                    itemChildren.time = item1.time;
                    itemChildren.loginfo = item1.loginfo;
                    itemChildren.uname = item1.uname;
                    itemChildren.commentinfo = item1.commentinfo;
                    itemData.children.push(itemChildren);
                  }
                });
                logList.push(itemData);
              });
              $this.logList = logList;
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
    // 重置留言表
    resetComment(){
      var $this = this;
      $this.content = "";
      $this.isHideName = false;
    },
    // 获取焦点
    onFocus(e){
      var $this = this;
      console.log(e);
      $this.isFocus = true;
    },
    // 失去焦点
    onBlur(e){
      var $this = this;
      $this.isFocus = false;
    },
    // 键盘事件监听
    keyDownHandler(e){
      if(e.ctrlKey && e.keyCode==13){
        this.sendMessage();
      }
    },
    // 发送留言
    sendMessage(){
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
            message: "请重新进入该页面进行留言",
            type: 'error'
        });
        return false;
      }
      $this.$store.dispatch('works/addCommentInfoAction', formData).then(response=>{
          if(response){
            if(response.status){
              $this.$message({
                  showClose: true,
                  message: response.info,
                  type: 'success'
              });
              $this.resetComment();
              $this.initPage();
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
  }
}
</script>

<style lang="scss" scoped>
</style>