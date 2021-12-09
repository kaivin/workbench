<template>
  <div class="page-root scroll-panel home-index flex-box" ref="boxPane">
      <div class="infoBox flex-content" :class="scrBool?'fixed':''">          
          <div class="infoBoxCard" :style='"top:"+scrHeight'>
              <div class="personMsg">
                  <div class="personAvatar">
                       <span v-if="userBasicInfo.headimg"><img :src="userBasicInfo.headimg" alt="" /><i v-if='historyDate.length>0' @click="handlediogHistory"></i></span>
                       <span v-else><img src="@/assets/default_pic.jpg" alt="" /><i v-if='historyDate.length>0' @click="handlediogHistory"></i></span>
                  </div> 
                  <h3 class="personName">{{userBasicInfo.name}}</h3>
                  <p class="workTime" v-if='userBasicInfo.comday'>在河南红星机器有限公司工作了{{userBasicInfo.comday}}天</p>
                  <div class="rate_num" v-if='userBasicInfo.postionname'>
                      <span class="num02">{{userBasicInfo.postionname}}</span>
                  </div>
              </div>
              <div class="personDepart">
                  <div class="pdname">
                      <p v-if='userBasicInfo.depart'><span>部门：</span>{{userBasicInfo.depart}}</p>
                  </div>
                  <div class="pdsub">
                      <p v-if='userBasicInfo.comtime'><span>入职时间：</span>{{userBasicInfo.comtime}}</p>
                      <p v-if='userBasicInfo.manangename'><span>主管：</span>{{userBasicInfo.manangename}}</p>
                  </div>
              </div>
              <div class="clear:both"></div>
              <div class="monthResult">
                  <div class="mtit">个人今年数据表现：</div>
                  <ul class="monthUl" v-if='userBasicInfo.userMonthcount||userBasicInfo.userMonthscore||userBasicInfo.userMonthanumber||userBasicInfo.userMonthmoney'>
                      <li v-if='userBasicInfo.userMonthcount'>
                          <div class="mon01">询盘个数</div>
                          <span class="res">{{userBasicInfo.userMonthcount}}</span>
                      </li>
                      <li v-if='userBasicInfo.userMonthscore'>
                          <div class="mon02">成交积分</div>
                          <span class="res">{{userBasicInfo.userMonthscore}}</span>
                      </li>
                      <li v-if='userBasicInfo.userMonthanumber'>
                          <div class="mon03">100万成交个数</div>
                          <span class="res">{{userBasicInfo.userMonthanumber}}</span>
                      </li>
                      <li v-if='userBasicInfo.userMonthmoney'>
                          <div class="mon04">个人奖金 (元)</div>
                          <span class="res">{{userBasicInfo.userMonthmoney}}</span>
                      </li>
                  </ul>
              </div>
          </div>
          <div class="infoBoxRight flex-box">
              <p class="infoBoxRightTop">消息提醒：全部消息<b>{{allNumber}}</b>条；未读<b>{{allNumber-allIsread}}</b>条</p>
              <div class="infoBoxRightBom flex-box flex-content" :class="scrBool?'BomPadBom':''" v-if="permitModules.includes('Module_bbs')">
                  <div class="infoBoxRightBominfo flex-content" v-if="newsList.length > 0">
                    <dl
                      class="news-dl"
                      :class="item.groupname==lastGroupname?'flex-content':''"
                      v-for="(item, index) in newsList"
                      v-bind:key="index"
                    >
                      <dt>{{ item.groupname }}<span>(未读{{item.number-item.isread}})</span></dt>
                      <dd>
                        <div
                          class="item-news flex-box"
                          :class="item1.is_read==1?'isRead':''"
                          v-for="item1 in item.article"
                          v-bind:key="item1.id"
                        >
                          <div class="txt-font flex-content" v-on:click="jumpArticle(item1)" :title="item1.title">
                            <span
                              class="txt-icon"
                              :class="item1.is_new == 1 ? 'update' : 'new'"
                              ><b>{{ item1.is_new == 1 ? "改" : "新" }}</b></span
                            >
                            <span class="txt-type" v-if="item1.type == 1"
                              >【{{ item1.domain }} [{{ item1.website_id }}]】</span
                            >
                            <span class="txt-type" v-else
                              >【{{ item1.typename }}】</span
                            >
                            <span
                              class="txt-title"
                              :style="{
                                color: item1.titlecolor ? item1.titlecolor : '',
                              }"
                              >{{ item1.title }}</span
                            >
                          </div>
                          <div class="txt-time">({{ item1.updatetime }})</div>
                        </div>
                      </dd>
                    </dl>
                  </div>
                  <div class="infoBoxRightBomNoinfo flex-content" v-else></div>
              </div>
          </div>
      </div>
      <el-dialog custom-class="history-dialog" :visible.sync="dialogFormVisible" :before-close="handleClose" width="750px">
            <div class="historyWho">
                <div class="user_img">
                    <span v-if="userBasicInfo.headimg"><img :src="userBasicInfo.headimg" alt="" /></span>
                    <span v-else class="nopic"></span>
                </div>
                <div class="user_name">
                    <h4>{{userBasicInfo.name}}</h4>
                    <p>个人历史成就展示</p>
                </div>
            </div>
            <ul class="historyList">
                <li v-for="(item,index) in historyDate" :key='index'>
                    <span class="historyName">{{item.addtime}}</span>
                    <p class="historyIcon"><span :class="item.icon"></span></p>
                    <span class="historyTap">{{item.tap}}</span>
                    <span class="historyCon">{{item.content}}</span>
                </li>
            </ul>
      </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "Home",
  data() {
    return {
        scrHeight:'0px',//滚动top
        scrBool:false,//滚动样式显隐
        dialogFormVisible:false,
        historyDate:[],
        permitModules:[],
        menuButtonPermit:[],
        newsList:[],
        allIsread:0,
        allNumber:0,
        infoHeight:'0px',//滚动top
        lastGroupname:'',
        relHeight:'',
        userBasicInfo:{
            headimg:'',
            comtime:'',//入职时间
            depart:'',//部门
            comday:0,//入职时长
            manangename:'',//主管名字
            name:'',//名字
            id:'',
            postionname:'',//职位
            userMonthcount:'',//月询盘数据
            userMonthscore:'',//月成交积分数据
            userMonthanumber:'',//月成交个数数据
            userMonthmoney:'',//月奖金数据
        },
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  created() {
    var $this = this;
    $this.initData();
  },
  mounted(){
    const $this = this;
    $this.$refs.boxPane.addEventListener('scroll',this.handleScroll,true);
  },
  beforeDestroy(){
    this.$refs.boxPane.removeEventListener('scroll', this.handleScroll,true);//监听页面滚动事件
  },
  methods: {
    // 初始化数据
    initData() {
      var $this = this;
      $this.getUserMenuButtonPermit();
    },
    // 获取当前登陆用户在该页面的操作权限
    getUserMenuButtonPermit() {
      var $this = this;
      $this.$store.dispatch("api/getMenuButtonPermitAction", {id: $this.$router.currentRoute.meta.id}).then((res) => {
          if (res.status) {
            if (res.data.length > 0) {
              res.data.forEach(function (item, index) {
                $this.menuButtonPermit.push(item.action_route);
              });
              if ($this.menuButtonPermit.includes("Home_index")) {
                $this.getPermitModules();
              } else {
                $this.$message({
                  showClose: true,
                  message: "未被分配该页面的访问权限",
                  type: "error",
                  duration: 6000,
                });
                $this.$router.push({
                  path: `/401?redirect=${$this.$router.currentRoute.fullPath}`,
                });
              }
            } else {
              $this.$message({
                showClose: true,
                message: "未被分配该页面的访问权限",
                type: "error",
                duration: 6000,
              });
              $this.$router.push({
                path: `/401?redirect=${$this.$router.currentRoute.fullPath}`,
              });
            }
          } else {
            $this.$message({
              showClose: true,
              message: response.info,
              type: "error",
            });
          }
        });
    },
    // 获取当前登录用户首页拥有阅读权限的模块
    getPermitModules() {
      var $this = this;
      $this.$store
        .dispatch("modulelist/getPermitModuleListAction", null)
        .then((response) => {
          if (response) {
            if (response.status) {
              $this.permitModules = response.data;
              $this.initPage();
            } else {
              $this.$message({
                showClose: true,
                message: response.info,
                type: "error",
              });
            }
          }
        });
    },
    // 初始化页面信息
    initPage() {
      var $this = this;
      if ($this.permitModules.includes("Module_bbs")) {
        $this.getPostData();
      }
    },
    // 跳转到文章详情
    jumpArticle(row) {
      var $this = this;
      var routeUrl = "";
      if (row.type == 1) {
        routeUrl = $this.$router.resolve({
          path: "/Website/logInfo",
          query: {
            logID: row.id,
            websiteID: row.website_id,
            website: row.domain,
          },
        });
      } else {
        routeUrl = $this.$router.resolve({
          path: "/Article/info",
          query: { id: row.id },
        });
      }   
      $this.getPostData();   
      window.open(routeUrl.href, "_blank");
    },
    // 获取论坛最新资讯
    getPostData() {
      var $this = this;
      $this.newsList=[];
      $this.$store
        .dispatch("api/getNewPostArticleAction", null)
        .then((res) => {
          if (res) {
            if (res.status) {
              if(res.data&&res.data.length>0){
                var allIsread=0;
                var allNumber=0;
                res.data.forEach(function(item,index){
                    allIsread+=item.isread;
                    allNumber+=item.number;
                });
                $this.lastGroupname=res.data[res.data.length-1].groupname;
                $this.allIsread=allIsread;
                $this.allNumber=allNumber;
                $this.newsList = res.data;
              }
              //组员基本信息
              $this.userBasicInfo.headimg=res.userinfo.headimg;
              $this.userBasicInfo.comtime=res.userinfo.comtime;
              $this.userBasicInfo.depart=res.userinfo.depart;
              $this.userBasicInfo.comday=res.userinfo.comday;
              $this.userBasicInfo.manangename=res.userinfo.manangename;
              $this.userBasicInfo.name=res.userinfo.name;
              $this.userBasicInfo.id=res.userinfo.id;
              $this.userBasicInfo.postionname=res.userinfo.postionname;
              $this.userBasicInfo.userMonthcount=res.yearxuncount;
              $this.userBasicInfo.userMonthscore=res.yearscorecount;
              $this.userBasicInfo.userMonthanumber=res.yearanumbercount;
              $this.userBasicInfo.userMonthmoney=res.money;
              $this.handleHistory();
            } else {
              $this.$message({
                showClose: true,
                message: res.info,
                type: "error",
              });
            }
          }
        });
    },
    // 打开弹窗
    handlediogHistory(){
      var $this=this;
      $this.dialogFormVisible = true;
    },
    // 关闭弹窗
    handleClose(){
      var $this = this;
      $this.dialogFormVisible = false;
    },
    // 组员个人历史成就
    handleHistory(){
      var $this = this;
      var searchData={};
      searchData.id=$this.userBasicInfo.id;
      $this.$store.dispatch("api/getPersonHistoryAction",searchData).then((res) => {
          if (res) {
            if (res.status) {
              if(res.data&&res.data.length>0){
                  var historyDate=[];
                  res.data.forEach(function(item,index){
                      var objItem={};
                      objItem.addtime=item.addtime;
                      objItem.content=item.content;
                      if(item.content.indexOf("排名第一")>=0){
                          objItem.tap='询盘Top1';
                          objItem.icon='icon01';
                      }
                      if(item.content.indexOf("销售冠军")>=0){
                          objItem.tap='销售冠军';
                          objItem.icon='icon01';
                      }
                      if(item.content.indexOf("成交单")>=0){
                          objItem.tap='成交Top1';
                          objItem.icon='icon01';
                      }
                      if(item.content.indexOf("公司奖金")>=0){
                          objItem.tap='奖金Top1';
                          objItem.icon='icon01';
                      }
                      if(item.content.indexOf("最高询盘")>=0){
                          objItem.tap='询盘突破峰值';
                          objItem.icon='icon02';
                      }
                      if(item.content.indexOf("历史新高")>=0){
                          objItem.tap='成交分突破峰值';
                          objItem.icon='icon02';
                      }
                      if(item.content.indexOf("最高奖金")>=0){
                          objItem.tap='奖金突破峰值';
                          objItem.icon='icon02';
                      }
                      historyDate.push(objItem);
                  });
                  $this.historyDate=historyDate;
              }
            } else {
              $this.$message({
                showClose: true,
                message: response.info,
                type: "error",
                duration: 6000
              });
            }
          }
      });
    },
    // 竖向滚动条滚动事件
    handleScroll(event){
      var $this = this;
      var scrTop = event.target.scrollTop;
      var personTopTabHeight = 0;
      if(scrTop>=personTopTabHeight){
         $this.scrHeight=scrTop-personTopTabHeight+'px';
         $this.scrBool=true;
      }else{
         $this.scrHeight='auto';
         $this.scrBool=false;
      } 
    },
  },
};
</script>
<style lang="scss" scoped>
</style>