<template>
  <div class="page-root scroll-panel home-index" ref="boxPane">
    <el-card class="box-card scroll-card" shadow="hover">
      <div class="card-content" ref="tableContent">
        <div class="item-row flex-box Module_bbs" v-if="newsList.length > 0">
          <div
            class="news-list flex-content"
            v-if="permitModules.includes('Module_bbs')"
          >
            <dl
              class="news-dl flex-wrap"
              v-for="(item, index) in newsList"
              v-bind:key="index"
            >
              <dt class="news-dt">{{ item.groupname }}：</dt>
              <dd class="news-dd flex-content">
                <div
                  class="item-news flex-box"
                  v-for="item1 in item.article"
                  v-bind:key="item1.id"
                  v-on:click="jumpArticle(item1)"
                >
                  <div class="txt-font flex-content" :title="item1.title">
                    <span
                      class="txt-icon"
                      v-bind:class="item1.is_new == 1 ? 'update' : 'new'"
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
        </div>
        <div class="item-row stat-row">
          <div class="rowBtn">
            <p class="btn-panel" v-if="permitModules.includes('Module_cnStat')&&permitModules.includes('Module_enStat')">
              <span
                class="btn-span"
                v-bind:class="item.isOn ? 'active' : ''"
                v-for="(item, index) in languageList"
                v-bind:key="index"
                v-on:click="cnEnStatChange(item.label)"
                >{{ item.name }}统计</span
              >
            </p>
            <div class="rowBtnFr">
              <el-checkbox-group
                class="checkbox-panel"
                v-model="currentCluesData.departID"
                @change="handleDepart"
                size="small"
              >
                <el-checkbox
                  :label="item.value"
                  :disabled="item.disabled"
                  v-for="(item, index) in currentCluesData.DeparData"
                  v-bind:key="index"
                  >{{ item.label }}</el-checkbox
                >
              </el-checkbox-group>
            </div>
          </div>
          
          <el-row :gutter="20" id="module-view">
               <template v-for="moduleitem in moduleList">
                <el-col 
                v-if="moduleitem.isShow"
                :xl="moduleitem.xl"
                :lg="moduleitem.lg"
                :key="moduleitem.name"
                class="module-item"
                >
                  <component
                  :is="moduleitem.name"
                  :ref="moduleitem.ref"
                  :language="language"
                  :currentCluesData="currentCluesData"
                  :targetScore="targetScore"
                  :depDayTarget="depDayTarget"
                  :isDepart1="isDepart1"
                  :zusuercount="zusuercount"
                  :tableHidden="tableHidden"
                  :permitModules="permitModules"
                  :mapDate="mapDate"
                  :ScoreData="ScoreData"
                  :ScoreTime="ScoreTime"
                  :updateScoremonth="updateScoremonth"
                  :updatemtime="updatemtime"
                  @monthChangeHandlerDemo="monthChangeHandler"
                  @dateRangeChangeHandlerDemo="dateRangeChangeHandler"
                  @moduleChecked="groupClick"
                  @tableBtnChange="tableBtn"
                  @dateChange="DaytargetHandler"
                  ></component>
                </el-col>
               </template>
             <!-- <draggable v-model="moduleAry"   forceFallback="true"  animation="1000" @end="onEnd"></draggable> -->
          </el-row>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import { worldCountry } from "@/utils/worldCountry";
import { mapGetters } from "vuex";
import Cookies from "js-cookie";
import draggable from 'vuedraggable';
import { Chart } from "@antv/g2";
import { isObject, deepMix } from "@antv/util";
import {
  Bullet,
  RadialBar,
  Liquid,
  Line,
  Area,
  measureTextWidth,
  Pie,
  Bar,
  Column,
  Mix,
  P,
  G2,
  Rose,
} from "@antv/g2plot";
import depTarget from "../compoents/depTarget";
import dayScore from "../compoents/dayScore";
import monthScore from "../compoents/monthScore";
import scoreDays from "../compoents/scoreDays30";
import scoreYears from "../compoents/scoreYears";
import groupMonthScore from "../compoents/groupMonthScore";
import groupDayScore from "../compoents/groupDayScore";
import teamResult from "../compoents/teamResult";
import hotArea from "../compoents/hotArea";
import dealNum from "../compoents/dealNum";
import dealYearNum from "../compoents/dealYearNum";
import depCost from "../compoents/depCost";
import yearContrast from "../compoents/yearContrast";
import mounthTop from "../compoents/mounthTop";
import yearTop from "../compoents/yearTop";
export default {
  name: "Home",
  data() {
    return {
      updateScoremonth: "",
      depDayTarget: [], //部门日目标
      menuButtonPermit: [],
      permitModules: [],
      thisMonth: "",
      ScoreTime: "",
      DaytargetTime: "",
      DaytargetTodayTime: "",
      TodayMonth: "", //默认本月
      updatemtime: [],
      updateScoremonth: "",
      numList: [],
      sumColor: [],
      tableHidden: {
        tableHeight: 0,
        tableBtnVisible: true,
        tableBtnBool: true,
        tableBtnTxt: "点击展开",
      },
      targetScore: {
        daymaxnumber: [],
        historymaxnumber: [],
        DistanceTarget: 0,
        isDistanceTarget: false,
      },
      currentCluesData: {
        departName: "中文",
        departID: [],
        chartData: [],
        avgChartNum: 0,
        targetNum: 0,
        alltodaynumber: 0,
        alltodaynumberPercent: 0,
        alllastdaynumber: 0,
        alllastdaynumberPercent: 0,
        allmonthnumber: 0,
        monthGrowth: 0,
        monthGrowthTxt: 0,
        DeparData: null,
        groupcountArr: [], //部门数据
        targetData: null,
        targetDataLine: null,
        departScoreData: null,
        userscoreNum: null, //月成交TOP5
        yearuserscoreNum: null, //年度成交Top5
        zugoupmonthArr: null, //年询盘
        zugroupdayArr: [], //日询盘
        monthtongArr: [], //月询盘
        //zusuercountArr:[],//组员成绩
        checkedDeparData: [],
        cluesRegionData: [], //地图
        topTenRegionData: [], //前10
        yeartongArr: [], //年度询盘对比
        registerArr: [], //年度同期询盘对比
        registerGrowth: "", //同比增长量
        registerRate: "", //同比增长率
        yearscoretongArr: [], //年度成交积分对比
        sametimeArr: [], //年度同期成交积分对比
        sametimeGrowth: "", //同比增长量
        sametimeRate: "", //同比增长率
        yeardepartscoreArr: [], //中文年度成交积分
        totalNumscore: "", //总成交积分
        departmentCost: [], //部门成本
        costAverage: [], //成本均价排行
      },
      zusuercount: {
        zusuercountAllArr: [], //所有组员成绩
        zusuercountArr: [], //组员成绩
        zusuercountGroupnameArr: [],
        GroupID: [],
      },
      ScoreData: {
        allscore: "",
        allsnumber: "",
        addallscore: "",
        addallsnumber: "",
        allscorePercen: "",
        allsnumberPercen: "",
        MaxValue: "",
      },
      mapDate: [],
      salesmanData: {},
      newsList: [],
      pickerRangeOptions: this.$pickerRangeOptions,
      languageList: [
        { name: "中文", label: "Module_cnStat", isOn: false },
        { name: "英文", label: "Module_enStat", isOn: false },
      ],
      language: null,
      radialBarPlot: null, //中文地区目标
      worldRegionMapChart: null, //世界地图
      regionMapChart: null, //中国地图
      pieSourcePlot: null, //热门地区TOP10
      monthtongArea: null, //月询盘数据图
      areaTrendPlot: null, //30天询盘
      zugroupdayColumn: null, //日询盘
      zugoupmonthColumn: null, //月询盘
      useryearChart: null,
      yeartongData: null, //年度询盘对比
      registerData: null, //年度同期询盘对比
      yearscoretongData: null, //年度成交积分对比
      yeardepartscoreData: null, //中文年度成交积分
      costAverageData: null, //成本均价排行
      loading: false,
      clickID: "",
      isDepart1: false,
      moduleAry:localStorage.getItem("moduleList")?JSON.parse(localStorage.getItem("moduleList")):[
        {
          name:'depTarget',
          isShow:true,
          lg:24,
          xl:13,
          ref:'depTarget',
        },
        {
          name:'dayScore',
          isShow:true,
          lg:12,
          xl:5,
          ref:'dayScore',
        },
        {
          name:'monthScore',
          isShow:true,
          lg:12,
          xl:6,
          ref:'monthtongChart',
        },
        {
          name:'scoreDays',
          isShow:true,
          lg:24,
          xl:24,
          ref:'drawAreaTrendChart',
        },
        {
          name:'scoreYears',
          isShow:true,
          lg:24,
          xl:24,
          ref:'yeartongChart',
        },
        {
          name:'groupMonthScore',
          isShow:true,
          lg:12,
          xl:12,
          ref:'zugroupmonthChart',
        },
        {
          name:'groupDayScore',
          isShow:true,
          lg:12,
          xl:12,
          ref:'zugroupdayChart',
        },
        {
          name:'teamResult',
          isShow:true,
          lg:24,
          xl:10,
          ref:'teamResult',
        },
        {
          name:'hotArea',
          isShow:true,
          lg:24,
          xl:14,
          ref:'hotAreaDeom',
        },
        {
          name:'dealNum',
          isShow:true,
          lg:12,
          xl:12,
          ref:'dealNum',
        },
        {
          name:'dealYearNum',
          isShow:true,
          lg:12,
          xl:12,
          ref:'yeardepartscoreChart',
        },
        {
          name:'depCost',
          isShow:true,
          lg:24,
          xl:24,
          ref:'costAverageChart',
        },
        {
          name:'yearContrast',
          isShow:true,
          lg:24,
          xl:24,
          ref:'yearscoretongChart',
        },
        {
          name:'mounthTop',
          isShow:true,
          lg:9,
          xl:9,
          ref:'mounthTop',
        },
        {
          name:'yearTop',
          isShow:true,
          lg:15,
          xl:15,
          ref:'yearuserChart',
        },
      ],
    };
  },
  components: {
    draggable,
    depTarget,
    dayScore,
    monthScore,
    scoreDays,
    scoreYears,
    groupMonthScore,
    groupDayScore,
    teamResult,
    hotArea,
    dealNum,
    dealYearNum,
    depCost,
    yearContrast,
    mounthTop,
    yearTop,
  },
  computed: {
    ...mapGetters(["userInfo"]),
     moduleList(){
       let moduleAry = this.moduleAry;
       moduleAry.forEach((item,index)=>{
         if(item.name == 'depTarget'){
           item.isShow = this.permitModules.includes('Module_cnStat') || this.permitModules.includes('Module_enStat')
         }
        //  if(item.name == "groupMonthScore"){
        //    item.isShow = this.currentCluesData.monthtongArr && this.currentCluesData.monthtongArr.length > 0
        //  }
        //  if(item.name == "groupDayScore"){
        //    item.isShow = this.currentCluesData.zugroupdayArr && this.currentCluesData.zugroupdayArr.length > 0
        //  }
        //  if(item.name == "teamResult"){
        //    item.isShow = this.zusuercount.zusuercountArr && this.zusuercount.zusuercountArr.length > 0
        //  }
        //  if(item.name == "hotArea"){
        //    item.isShow = this.permitModules.includes('Module_cnStat') || this.permitModules.includes('Module_enStat')
        //  }
         if(item.name == 'scoreDays'){
           item.isShow = this.permitModules.includes('Module_cnStat') || this.permitModules.includes('Module_enStat')
         }
         if(item.name == 'dealYearNum'){
           item.isShow = this.language=='Module_cnStat';
         }
         if(item.name == 'depCost'){
           item.isShow = this.language=='Module_cnStat';
         }
         if(item.name == 'yearContrast'){
           item.isShow = this.language=='Module_cnStat';
         }
         if(item.name == 'mounthTop'){
           item.isShow = this.language == 'Module_cnStat' && ((this.currentCluesData.userscoreNum && this.currentCluesData.userscoreNum.length > 0) || (this.currentCluesData.yearuserscoreNum && this.currentCluesData.yearuserscoreNum.length > 0))
         }
         if(item.name == 'yearTop'){
           item.isShow = this.language == 'Module_cnStat' && ((this.currentCluesData.userscoreNum && this.currentCluesData.userscoreNum.length > 0) || (this.currentCluesData.yearuserscoreNum && this.currentCluesData.yearuserscoreNum.length > 0))
         }
         if(item.name == "dealNum"){
           if(this.language == 'Module_cnStat'){
             item.lg = 12;
             item.xl = 12;
           }else{
             item.lg = 24;
             item.xl = 24;
           } 
         }
         
         if(item.name == "teamResult"){
           if(this.language == 'Module_cnStat'){
             item.lg = 24;
             item.xl = 10;
           }else{
             item.lg = 24;
             item.xl = 8;
           } 
         }
         if(item.name == "hotArea"){
           if(this.language == 'Module_cnStat'){
             item.lg = 24;
             item.xl = 14;
           }else{
             item.lg = 24;
             item.xl = 16;
           } 
         }
       })
       return moduleAry
     }
  },
  created() {
    var $this = this;
    $this.initData();
  },
  methods: {
    //拖拽结束
    onEnd(){
      localStorage.setItem("moduleList",JSON.stringify(this.moduleAry))
    },
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
            console.log(res.data,'res');
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
              //if($this.permitModules.includes('Module_manager')){
              //  $this.initPage();
              //}else{
              //  $this.$router.push({
              //    path: `/Home/CH/objectiveShow`,
              //  });
              //}
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
      if (!$this.language) {
        if ($this.permitModules.includes("Module_cnStat")) {
          $this.language = "Module_cnStat";
          $this.currentCluesData.departName = "中文";
        } else if ($this.permitModules.includes("Module_enStat")) {
          $this.language = "Module_enStat";
          $this.currentCluesData.departName = "英文";
        } else {
          $this.language = null;
        }
        var userlanguage = {};
        userlanguage.language = $this.language;
        userlanguage = JSON.stringify(userlanguage);
        Cookies.set("language", userlanguage);
      } else {
        $this.language = null;
      }
      if ($this.language) {
        $this.cnEnActiveChange();
        $this.getNearMonth();
        $this.statDataApi();
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
      window.open(routeUrl.href, "_blank");
    },
    // 获取论坛最新资讯
    getPostData() {
      var $this = this;
      $this.$store
        .dispatch("api/getNewPostArticleAction", null)
        .then((response) => {
          if (response) {
            if (response.status) {
              $this.newsList = response.data;
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
    //清除数据
    clearData() {
      var $this = this;
      $this.currentCluesData.alltodaynumber = "";
      $this.currentCluesData.alltodaynumberPercent = "";
      $this.currentCluesData.alllastdaynumber = "";
      $this.currentCluesData.alllastdaynumberPercent = "";
      $this.currentCluesData.allmonthnumber = "";
      $this.currentCluesData.monthGrowth = "";
      $this.currentCluesData.monthGrowthTxt = "";
      $this.currentCluesData.monthtongArr = [];
      $this.currentCluesData.chartData = [];
      $this.currentCluesData.avgChartNum = [];
      $this.currentCluesData.targetNum = [];
      $this.currentCluesData.zugroupdayArr = [];
      $this.currentCluesData.zugoupmonthArr = [];
      $this.currentCluesData.zugoupmonthArr = [];
      $this.zusuercount.zusuercountAllArr = [];
      $this.zusuercount.zusuercountArr = [];
      $this.zusuercount.zusuercountGroupnameArr = [];
      $this.zusuercount.GroupID = [];
      $this.tableHidden.tableHeight = 0;
      $this.tableHidden.tableBtnVisible = true;
      $this.tableHidden.tableBtnBool = true;
      $this.tableHidden.tableBtnTxt = "点击展开";
    },
    // 中文部门日目标
    cnDaytarget() {
      var $this = this;
      var resultData = {};
      if ($this.DaytargetTime && $this.DaytargetTime != "") {
        resultData.time = $this.DaytargetTime;
      } else {
        resultData.time = "";
      }
      $this.targetScore.DistanceTarget = "";
      $this.$store.dispatch("api/getChinadaytargetAction", resultData).then((response) => {
          if (response) {
            if (response.status) {
              // 获取部门数据
              if (response.readdepart && response.readdepart.length > 0) {
                var DeparData = [];
                response.readdepart.forEach(function (item, index) {
                  var itemDate = {};
                  itemDate.value = item.id;
                  itemDate.label = item.name;
                  itemDate.disabled = false;
                  DeparData.push(itemDate);
                });
                $this.currentCluesData.DeparData = DeparData;
              }
              if ($this.DaytargetTime && $this.DaytargetTime != "") {
              } else {
                $this.DaytargetTime = $this.DaytargetTodayTime;
              }
              if (response.groupcount && response.groupcount.length > 0) {
                var groupcountArr = [];
                response.groupcount.forEach(function (item) {
                  var groupcountObj = {};
                  groupcountObj.daynumber = item.daynumber;
                  groupcountObj.daytargetnumber = item.daytargetnumber;
                  groupcountObj.departname = item.departname;
                  groupcountObj.historymaxnumber = item.historymaxnumber;
                  groupcountObj.id = item.id;
                  if (item.searchdaynumber && item.searchdaynumber != null) {
                    groupcountObj.searchdaynumber = item.searchdaynumber;
                  }
                  if (item.monthmaxnumber == null) {
                    groupcountObj.monthmaxnumber = 0;
                  } else {
                    groupcountObj.monthmaxnumber = item.monthmaxnumber;
                  }
                  groupcountArr.push(groupcountObj);
                });
                $this.groupcountArr = groupcountArr;
                $this.depDayTarget = groupcountArr;
              }
              //距目标线差距
              if (response.groupcount.length > 0) {
                var maxTarget = 0;
                response.groupcount.forEach(function (item, index) {
                  var gap = 0;
                  if (item.searchdaynumber) {
                    gap = item.daytargetnumber - item.searchdaynumber;
                    maxTarget = maxTarget + gap;
                  } else {
                    gap = item.daytargetnumber - item.daynumber;
                    maxTarget = maxTarget + gap;
                  }
                });
                if (maxTarget >= 0) {
                  $this.targetScore.isDistanceTarget = true;
                } else {
                  $this.targetScore.isDistanceTarget = false;
                }
                $this.targetScore.DistanceTarget = Math.abs(maxTarget);
              }
              // 部门日目标进度图
              var departTargetNum = [];
              var targetDataLine = [];
              $this.currentCluesData.targetData = [];
              response.groupcount.forEach(function (item, index) {
                var itemData = {};
                var itemDataLine = {};
                var itemDatahisLine = {};
                itemData.id = item.id;
                itemData.name = item.departname;
                if (item.searchdaynumber && item.searchdaynumber >= 0) {
                  itemData.dayNum = [item.searchdaynumber, item.daynumber];
                } else {
                  itemData.dayNum = [item.daynumber];
                }
                itemData.targetNum = [item.daytargetnumber];
                itemDataLine.name = item.departname;
                itemDataLine.count = item.historymaxnumber;
                itemDatahisLine.name = item.departname;
                itemDatahisLine.count = item.monthmaxnumber;
                departTargetNum.push(itemData);
                targetDataLine.push(itemDataLine, itemDatahisLine);
              });
              $this.currentCluesData.targetDataLine = targetDataLine;
              $this.currentCluesData.targetData = departTargetNum.reverse();
              if ($this.radialBarPlot && !$this.radialBarPlot.chart.destroyed) {
                $this.radialBarPlot.chart.destroy();
              }
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
    // 英文部门日目标
    enDaytarget() {
      var $this = this;
      var resultData = {};
      if ($this.DaytargetTime && $this.DaytargetTime != "") {
        resultData.time = $this.DaytargetTime;
      } else {
        resultData.time = "";
      }
      $this.targetScore.DistanceTarget = "";
      $this.$store
        .dispatch("api/getEndaytargetAction", resultData)
        .then((response) => {
          if (response) {
            if (response.status) {
              //部门日目标
              // 获取部门数据
              if (response.readdepart && response.readdepart.length > 0) {
                var DeparData = [];
                response.readdepart.forEach(function (item, index) {
                  var itemDate = {};
                  itemDate.value = item.id;
                  itemDate.label = item.name;
                  itemDate.disabled = false;
                  DeparData.push(itemDate);
                });
                $this.currentCluesData.DeparData = DeparData;
              }
              if ($this.DaytargetTime && $this.DaytargetTime != "") {
              } else {
                $this.DaytargetTime = $this.DaytargetTodayTime;
              }
              if (response.groupcount && response.groupcount.length > 0) {
                var groupcountArr = [];
                response.groupcount.forEach(function (item) {
                  var groupcountObj = {};
                  groupcountObj.daynumber = item.daynumber;
                  groupcountObj.daytargetnumber = item.daytargetnumber;
                  groupcountObj.departname = item.departname;
                  groupcountObj.historymaxnumber = item.historymaxnumber;
                  groupcountObj.searchdaynumber = item.searchdaynumber
                    ? item.searchdaynumber
                    : "";
                  groupcountObj.id = item.id;
                  if (item.monthmaxnumber == null) {
                    groupcountObj.monthmaxnumber = 0;
                  } else {
                    groupcountObj.monthmaxnumber = item.monthmaxnumber;
                  }
                  groupcountArr.push(groupcountObj);
                });
                $this.groupcountArr = groupcountArr;
                $this.depDayTarget = groupcountArr;
              }
              //距目标线差距
              if (response.groupcount.length > 0) {
                var maxTarget = 0;
                response.groupcount.forEach(function (item, index) {
                  var gap = 0;
                  gap = item.daytargetnumber - item.daynumber;
                  maxTarget = maxTarget + gap;
                });
                if (maxTarget >= 0) {
                  $this.targetScore.isDistanceTarget = true;
                } else {
                  $this.targetScore.isDistanceTarget = false;
                }
                $this.targetScore.DistanceTarget = Math.abs(maxTarget);
              }
              // 部门日目标进度图
              var departTargetNum = [];
              var targetDataLine = [];
              $this.currentCluesData.targetData = [];
              response.groupcount.forEach(function (item, index) {
                var itemData = {};
                var itemDataLine = {};
                var itemDatahisLine = {};
                itemData.id = item.id;
                itemData.name = item.departname;
                if (item.searchdaynumber && item.searchdaynumber >= 0) {
                  itemData.dayNum = [item.searchdaynumber, item.daynumber];
                } else {
                  itemData.dayNum = [item.daynumber];
                }
                itemData.targetNum = [item.daytargetnumber];
                itemDataLine.name = item.departname;
                itemDataLine.count = item.historymaxnumber;
                itemDatahisLine.name = item.departname;
                itemDatahisLine.count = item.monthmaxnumber;
                departTargetNum.push(itemData);
                targetDataLine.push(itemDataLine, itemDatahisLine);
              });
              $this.currentCluesData.targetDataLine = targetDataLine;
              $this.currentCluesData.targetData = departTargetNum.reverse();
              if ($this.radialBarPlot && !$this.radialBarPlot.chart.destroyed) {
                $this.radialBarPlot.chart.destroy();
              }
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
    // 获取中文统计数据
    getCnCluesStatData() {
      var $this = this;
      var resultData = {};
      if (
        $this.currentCluesData.departID &&
        $this.currentCluesData.departID.length > 0
      ) {
        resultData.dept_id = $this.currentCluesData.departID;
      } else {
        resultData.dept_id = [];
      }
      if ($this.areaTrendPlot && !$this.areaTrendPlot.chart.destroyed) {
        $this.areaTrendPlot.chart.destroy();
      }
      if ($this.monthtongArea && !$this.monthtongArea.chart.destroyed) {
        $this.monthtongArea.chart.destroy();
      }
      if ($this.zugroupdayColumn && !$this.zugroupdayColumn.chart.destroyed) {
        $this.zugroupdayColumn.chart.destroy();
      }
      if ($this.zugoupmonthColumn && !$this.zugoupmonthColumn.chart.destroyed) {
        $this.zugoupmonthColumn.chart.destroy();
      }
      if ($this.yeartongData && !$this.yeartongData.chart.destroyed) {
        $this.yeartongData.chart.destroy();
      }
      if ($this.registerData && !$this.registerData.chart.destroyed) {
        $this.registerData.chart.destroy();
      }
      if ($this.yearscoretongData && !$this.yearscoretongData.chart.destroyed) {
        $this.yearscoretongData.chart.destroy();
      }
      $this.clearData();
      $this.$store
        .dispatch("api/cnCluesStatDataAction", resultData)
        .then((response) => {
          if (response) {
            if (response.status) {
              // 获取部门数据
              if (response.readart && response.readart.length > 0) {
                var DeparData = [];
                response.readart.forEach(function (item, index) {
                  var itemDate = {};
                  itemDate.value = item.id;
                  itemDate.label = item.name;
                  itemDate.disabled = false;
                  DeparData.push(itemDate);
                });
                $this.currentCluesData.DeparData = DeparData;
              }
              // 日目标统计
              $this.targetScore.daymaxnumber = response.daymaxnumber[0];
              $this.targetScore.historymaxnumber = response.historymaxnumber[0];
              // 日询盘
              var MaxValue = "";
              var MaxArr = [
                response.alltodaynumber,
                response.daytargetnumber,
                response.alllastdaynumber,
              ];
              MaxArr.forEach(function (item, index) {
                if (MaxValue < item) {
                  MaxValue = item;
                }
              });
              $this.currentCluesData.alltodaynumber = response.alltodaynumber;
              $this.currentCluesData.alltodaynumberPercent =
                (response.alltodaynumber / MaxValue) * 100;
              $this.currentCluesData.alllastdaynumber =
                response.alllastdaynumber;
              $this.currentCluesData.alllastdaynumberPercent =
                (response.alllastdaynumber / MaxValue) * 100;
              // 月询盘
              $this.currentCluesData.allmonthnumber = response.allmonthnumber;
              $this.currentCluesData.monthGrowth =
                response.allmonthnumber - response.lastallnumber;
              $this.currentCluesData.monthGrowthTxt = Math.abs(
                response.allmonthnumber - response.lastallnumber
              );
              // 中文成交统计数据
              $this.getCnDepartScore();
              // 近30天询盘统计
              var tongArr = [];
              response.tong.forEach(function (item, index) {
                var itemDate = [];
                itemDate = item.date.split("-");
                item.date =
                  itemDate[1] +
                  "-" +
                  itemDate[2] +
                  "\n" +
                  item.week.replace("星期", "周");
                var tolItem = {};
                tolItem.date = item.date;
                tolItem.xunnumber = item.xunnumber;
                tolItem.title = "询盘";
                if ($this.isDepart1) {
                  var searchItem = {};
                  searchItem.date = item.date;
                  searchItem.xunnumber = item.searchxunnumber;
                  searchItem.title = "搜索询盘";
                  tongArr.push(searchItem, tolItem);
                } else {
                  tongArr.push(tolItem);
                }
              });
              $this.currentCluesData.chartData = tongArr;
              $this.currentCluesData.avgChartNum = response.tongavgnumber;
              $this.currentCluesData.targetNum = response.daytargetnumber;
              $this.$refs["drawAreaTrendChart"][0].drawAreaTrendChart();
              // 月询盘面积图数据
              if (response.monthtong && response.monthtong.length > 0) {
                var monthtongArr = [];
                var monthtongList = [];
                monthtongList = response.monthtong;
                monthtongList.forEach(function (item, index) {
                  var monthtongObj = {};
                  monthtongObj.date = item.date.split("-")[1] + "月";
                  monthtongObj.xunnumber = item.xunnumber;
                  monthtongObj.xunchange = item.tongxunnumber
                    ? item.tongxunnumber
                    : item.xunnumber;
                  monthtongArr.push(monthtongObj);
                });
                $this.currentCluesData.monthtongArr = monthtongArr;
                $this.$refs["monthtongChart"][0].monthtongChart();
              }
              // 年度询盘对比
              if (response.yeartong && response.yeartong.length > 0) {
                var yeartongArr = [];
                var registerArr = [];
                var registerGrowth = "";
                var registerRate = "";
                var registerObj = {
                  year: "",
                  isOn: false,
                  isHeight: 0,
                  value: 0,
                };
                var lastregisterObj = {
                  year: "",
                  isOn: false,
                  isHeight: 0,
                  value: 0,
                };
                response.yeartong.forEach(function (item, index) {
                  var yeartongObj = {};
                  var lastyeartongObj = {};
                  yeartongObj.month = item.date.split("-")[1] + "月";
                  yeartongObj.value = item.xunnumber;
                  yeartongObj.year = item.date.split("-")[0];
                  yeartongObj.date = item.date + "月";
                  lastyeartongObj.month = item.lastdate.split("-")[1] + "月";
                  lastyeartongObj.value = item.lastxunnumber;
                  lastyeartongObj.year = item.lastdate.split("-")[0];
                  yeartongArr.push(yeartongObj, lastyeartongObj);
                  //年度同期询盘对比
                  registerObj.value = registerObj.value + item.xunnumber;
                  registerObj.year = item.date.split("-")[0];
                  lastregisterObj.value =
                    lastregisterObj.value + item.lastxunnumber;
                  lastregisterObj.year = item.lastdate.split("-")[0];
                });
                $this.currentCluesData.yeartongArr = yeartongArr;
                if (registerObj.year > lastregisterObj.year) {
                  registerObj.isOn = true;
                } else {
                  lastregisterObj.isOn = true;
                }
                var MaxVal = "";
                if (registerObj.value > lastregisterObj.value) {
                  MaxVal = registerObj.value;
                } else {
                  MaxVal = lastregisterObj.value;
                }
                registerObj.isHeight = (registerObj.value / MaxVal) * 244;
                lastregisterObj.isHeight =
                  (lastregisterObj.value / MaxVal) * 244;
                registerArr.push(registerObj, lastregisterObj);
                $this.currentCluesData.registerArr = registerArr;
                registerGrowth = registerObj.value - lastregisterObj.value;
                registerRate =
                  Math.abs(
                    (
                      ((registerObj.value - lastregisterObj.value) /
                        lastregisterObj.value) *
                      100
                    ).toFixed(2)
                  ) + "%";
                $this.currentCluesData.registerGrowth = registerGrowth;
                $this.currentCluesData.registerRate = registerRate;
                $this.$refs["yeartongChart"][0].yeartongChart();
              }
              // 小组日成绩
              if (response.zugroupday != "" && response.zugroupday != null) {
                if (response.zugroupday.length > 0 && response.zugroupday) {
                  var zugroupdayArr = [];
                  response.zugroupday.forEach(function (item, index) {
                    var lastdayitemData = {};
                    var todayitemData = {};
                    lastdayitemData.name = item.name;
                    lastdayitemData.title = "昨日数量";
                    lastdayitemData.number = item.lastdaynumber;
                    todayitemData.name = item.name;
                    todayitemData.title = "当日数量";
                    todayitemData.number = item.todaynumber;
                    zugroupdayArr.push(lastdayitemData, todayitemData);
                  });
                  $this.currentCluesData.zugroupdayArr = zugroupdayArr;
                  $this.$nextTick(() => {
                    $this.$refs["zugroupdayChart"][0].zugroupdayChart(); // 日询盘
                  });
                } else {
                  $this.currentCluesData.zugroupdayArr = [];
                }
              } else {
                $this.currentCluesData.zugroupdayArr = [];
              }
              // 小组月成绩
              if (response.zugoupmonth != "" && response.zugoupmonth != null) {
                if (response.zugoupmonth.length > 0 && response.zugoupmonth) {
                  var zugoupmonthArr = [];
                  response.zugoupmonth.forEach(function (item, index) {
                    var lastdayitemData = {};
                    var todayitemData = {};
                    lastdayitemData.name = item.name;
                    lastdayitemData.title = "上月同期";
                    lastdayitemData.number = item.lastmonthnumber;
                    todayitemData.name = item.name;
                    todayitemData.title = "本月同期";
                    todayitemData.number = item.monthnumber;
                    zugoupmonthArr.push(lastdayitemData, todayitemData);
                  });
                  $this.currentCluesData.zugoupmonthArr = zugoupmonthArr;
                  $this.$nextTick(() => {
                    $this.$refs["zugroupmonthChart"][0].zugroupmonthChart(); // 月询盘
                  });
                } else {
                  $this.currentCluesData.zugoupmonthArr = [];
                }
              } else {
                $this.currentCluesData.zugoupmonthArr = [];
              }
              // 组员成绩
              if (response.zusuercount != "" && response.zusuercount != null) {
                if (response.zusuercount.length > 0 && response.zusuercount) {
                  var newStrArr = [];
                  var zusuercountAllArr = []; //综合-组员成绩
                  response.zusuercount.forEach(function (item, index) {
                    if (item.length > 0 && item) {
                      item.forEach(function (items, indexs) {
                        zusuercountAllArr.push(items);
                        if (newStrArr.indexOf(items.dept_id) == -1) {
                          newStrArr.push(items.dept_id);
                        }
                      });
                    }
                  });
                  $this.zusuercount.zusuercountAllArr = zusuercountAllArr;
                  var zusuercountGroupnameArr = []; //小组
                  var GroupID = [];
                  newStrArr.forEach(function (item, index) {
                    GroupID.push(item);
                    $this.currentCluesData.DeparData.forEach(function (
                      items,
                      indexs
                    ) {
                      if (item == items.value) {
                        var GroupnameObj = {};
                        GroupnameObj.value = items.value;
                        GroupnameObj.label = items.label;
                        GroupnameObj.disabled = false;
                        zusuercountGroupnameArr.push(GroupnameObj);
                      }
                    });
                  });
                  $this.zusuercount.GroupID = GroupID;
                  $this.zusuercount.zusuercountGroupnameArr =
                    zusuercountGroupnameArr;
                  $this.groupClick();
                } else {
                  $this.zusuercount.zusuercountArr = [];
                }
              } else {
                $this.zusuercount.zusuercountArr = [];
              }
              // 年度成交积分对比
              if (response.yearscoretong && response.yearscoretong.length > 0) {
                var yearscoretongArr = [];
                var sametimeArr = [];
                var sametimeGrowth = "";
                var sametimeRate = "";
                var registerObj = {
                  year: "",
                  value: 0,
                };
                var lastregisterObj = {
                  year: "",
                  value: 0,
                };
                response.yearscoretong.forEach(function (item, index) {
                  var yeartongObj = {};
                  var lastyeartongObj = {};
                  yeartongObj.month = item.date.split("-")[1] + "月";
                  if ($this.isFloat(Number(item.score))) {
                    yeartongObj.value = Number(Number(item.score).toFixed(2));
                  } else {
                    yeartongObj.value = item.score;
                  }
                  yeartongObj.year = item.date.split("-")[0];
                  lastyeartongObj.month = item.lastdate.split("-")[1] + "月";
                  if ($this.isFloat(Number(item.lastscore))) {
                    lastyeartongObj.value = Number(
                      Number(item.lastscore).toFixed(2)
                    );
                  } else {
                    lastyeartongObj.value = item.lastscore;
                  }
                  lastyeartongObj.year = item.lastdate.split("-")[0];
                  yearscoretongArr.push(yeartongObj, lastyeartongObj);
                  //年度同期成交对比
                  registerObj.year = item.date.split("-")[0];
                  if ($this.isFloat(Number(item.score))) {
                    registerObj.value = Number(
                      (Number(registerObj.value) + Number(item.score)).toFixed(
                        2
                      )
                    );
                  } else {
                    registerObj.value =
                      Number(registerObj.value) + Number(item.score);
                  }
                  lastregisterObj.year = item.lastdate.split("-")[0];
                  if ($this.isFloat(Number(item.lastscore))) {
                    lastregisterObj.value = Number(
                      (
                        Number(lastregisterObj.value) + Number(item.lastscore)
                      ).toFixed(2)
                    );
                  } else {
                    lastregisterObj.value =
                      Number(lastregisterObj.value) + Number(item.lastscore);
                  }
                });
                $this.currentCluesData.yearscoretongArr = yearscoretongArr;
                sametimeArr.push(registerObj, lastregisterObj);
                $this.currentCluesData.sametimeArr = sametimeArr;
                var MaxValue = "";
                if (
                  Number(registerObj.value) >= Number(lastregisterObj.value)
                ) {
                  MaxValue = Number(registerObj.value);
                } else {
                  MaxValue = Number(lastregisterObj.value);
                }
                if (MaxValue == 0) {
                  lastregisterObj.percen = "0%";
                  registerObj.percen = "0%";
                } else {
                  lastregisterObj.percen =
                    ((Number(lastregisterObj.value) / MaxValue) * 100).toFixed(
                      2
                    ) + "%";
                  registerObj.percen =
                    ((Number(registerObj.value) / MaxValue) * 100).toFixed(2) +
                    "%";
                }
                sametimeGrowth =
                  Number(registerObj.value) - Number(lastregisterObj.value);
                if (Number(lastregisterObj.value) == 0) {
                  sametimeRate = Number(registerObj.value).toFixed(2) + "%";
                } else {
                  sametimeRate =
                    Math.abs(
                      ((Number(registerObj.value) -
                        Number(lastregisterObj.value)) /
                        Number(lastregisterObj.value)) *
                        100
                    ).toFixed(2) + "%";
                }
                if ($this.isFloat(sametimeGrowth)) {
                  sametimeGrowth = Number(sametimeGrowth.toFixed(2));
                }
                $this.currentCluesData.sametimeGrowth = sametimeGrowth;
                $this.currentCluesData.sametimeRate = sametimeRate;
                $this.$refs["yearscoretongChart"][0].yearscoretongChart();
              }
              if (
                $this.currentCluesData.departID &&
                $this.currentCluesData.departID.length > 0
              ) {
                if (
                  $this.currentCluesData.departID.length ==
                  $this.currentCluesData.DeparData.length
                ) {
                  if (response.userscore.length > 0 && response.userscore) {
                    var userscoreNum = [];
                    response.userscore.forEach(function (item, index) {
                      var itemData = {};
                      itemData.id = item.id;
                      itemData.username = item.username;
                      itemData.groupname = item.groupname;
                      itemData.headimg = item.headimg;
                      itemData.number = item.number;
                      if (item.lastnumber) {
                        itemData.Growth = Math.abs(
                          item.number - item.lastnumber.number
                        );
                        if (item.number - item.lastnumber.number > 0) {
                          itemData.growthClass = true;
                        }
                        if (item.number - item.lastnumber.number < 0) {
                          itemData.growthClass = false;
                        }
                      } else {
                        itemData.Growth = item.number;
                        itemData.growthClass = true;
                      }
                      userscoreNum.push(itemData);
                    });
                    userscoreNum.sort(function (a, b) {
                      var value1 = a.number;
                      var value2 = b.number;
                      return value2 - value1;
                    });
                    userscoreNum.forEach(function (item, index) {
                      item.percen =
                        (item.number / userscoreNum[0].number) * 100 * 0.9;
                    });
                    $this.currentCluesData.userscoreNum = userscoreNum;
                  } else {
                    $this.currentCluesData.userscoreNum = [];
                  }
                  //年度成交Top5
                  if (
                    response.yearuserscore.length > 0 &&
                    response.yearuserscore
                  ) {
                    var yearuserscoreNum = [];
                    response.yearuserscore.forEach(function (item, index) {
                      var itemData = {};
                      itemData.id = item.id;
                      itemData.username = item.username;
                      itemData.groupname = item.groupname;
                      itemData.number = item.number;
                      itemData.anumber = item.anumber;
                      itemData.children = item.son;
                      itemData.headimg = item.headimg;
                      yearuserscoreNum.push(itemData);
                    });
                    yearuserscoreNum.sort(function (a, b) {
                      var value1 = a.number;
                      var value2 = b.number;
                      return value2 - value1;
                    });
                    var Maxnumber = 0;
                    var yearusernewArr = [];
                    yearuserscoreNum.forEach(function (item, index) {
                      if (index == 0) {
                        Maxnumber = item.number;
                      }
                      if (Maxnumber != 0) {
                        item.Percen =
                          ((item.number / Maxnumber) * 100).toFixed(2) + "%";
                      } else {
                        item.Percen = "0%";
                      }
                    });
                    $this.currentCluesData.yearuserscoreNum = yearuserscoreNum;
                  } else {
                    $this.currentCluesData.yearuserscoreNum = [];
                  }
                  $this.$nextTick(() => {
                    $this.$refs["yearuserChart"][0].yearuserChart();
                  });
                } else {
                  //距目标线差距
                  var maxTarget = 0;
                  $this.currentCluesData.departID.forEach(function (
                    item,
                    index
                  ) {
                    $this.groupcountArr.forEach(function (items, indexs) {
                      if (item == items.id) {
                        var gap = 0;
                        if (items.searchdaynumber) {
                          gap = items.daytargetnumber - items.searchdaynumber;
                          maxTarget = maxTarget + gap;
                        } else {
                          gap = items.daytargetnumber - items.daynumber;
                          maxTarget = maxTarget + gap;
                        }
                      }
                    });
                  });
                  if (maxTarget >= 0) {
                    $this.targetScore.isDistanceTarget = true;
                  } else {
                    $this.targetScore.isDistanceTarget = false;
                  }
                  $this.targetScore.DistanceTarget = Math.abs(maxTarget);
                }
              } else {
                if (response.userscore.length > 0 && response.userscore) {
                  var userscoreNum = [];
                  response.userscore.forEach(function (item, index) {
                    var itemData = {};
                    itemData.id = item.id;
                    itemData.username = item.username;
                    itemData.groupname = item.groupname;
                    itemData.headimg = item.headimg;
                    itemData.number = item.number;
                    if (item.lastnumber) {
                      itemData.Growth = Math.abs(
                        item.number - item.lastnumber.number
                      );
                      if (item.number - item.lastnumber.number > 0) {
                        itemData.growthClass = true;
                      }
                      if (item.number - item.lastnumber.number < 0) {
                        itemData.growthClass = false;
                      }
                    } else {
                      itemData.Growth = item.number;
                      itemData.growthClass = true;
                    }
                    userscoreNum.push(itemData);
                  });
                  userscoreNum.sort(function (a, b) {
                    var value1 = a.number;
                    var value2 = b.number;
                    return value2 - value1;
                  });
                  userscoreNum.forEach(function (item, index) {
                    item.percen =
                      (item.number / userscoreNum[0].number) * 100 * 0.9;
                  });
                  $this.currentCluesData.userscoreNum = userscoreNum;
                } else {
                  $this.currentCluesData.userscoreNum = [];
                }
                //年度成交Top5
                if (
                  response.yearuserscore.length > 0 &&
                  response.yearuserscore
                ) {
                  var yearuserscoreNum = [];
                  response.yearuserscore.forEach(function (item, index) {
                    var itemData = {};
                    itemData.id = item.id;
                    itemData.username = item.username;
                    itemData.groupname = item.groupname;
                    itemData.number = item.number;
                    itemData.anumber = item.anumber;
                    itemData.children = item.son;
                    itemData.headimg = item.headimg;
                    yearuserscoreNum.push(itemData);
                  });
                  yearuserscoreNum.sort(function (a, b) {
                    var value1 = a.number;
                    var value2 = b.number;
                    return value2 - value1;
                  });
                  var Maxnumber = 0;
                  var yearusernewArr = [];
                  yearuserscoreNum.forEach(function (item, index) {
                    if (index == 0) {
                      Maxnumber = item.number;
                    }
                    if (Maxnumber != 0) {
                      item.Percen =
                        ((item.number / Maxnumber) * 100).toFixed(2) + "%";
                    } else {
                      item.Percen = "0%";
                    }
                  });
                  $this.currentCluesData.yearuserscoreNum = yearuserscoreNum;
                } else {
                  $this.currentCluesData.yearuserscoreNum = [];
                }
                $this.$nextTick(() => {
                  $this.$refs["yearuserChart"][0].yearuserChart();
                });
              }
              $this.currentCluesData.DeparData.forEach(function (item, index) {
                item.disabled = false;
              });
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
    // 获取英文统计数据
    getEnCluesStatData() {
      var $this = this;
      var resultData = {};
      if (
        $this.currentCluesData.departID &&
        $this.currentCluesData.departID.length > 0
      ) {
        resultData.dept_id = $this.currentCluesData.departID;
      } else {
        resultData.dept_id = [];
      }
      if ($this.areaTrendPlot && !$this.areaTrendPlot.chart.destroyed) {
        $this.areaTrendPlot.chart.destroy();
      }
      if ($this.zugroupdayColumn && !$this.zugroupdayColumn.chart.destroyed) {
        $this.zugroupdayColumn.chart.destroy();
      }
      if ($this.monthtongArea && !$this.monthtongArea.chart.destroyed) {
        $this.monthtongArea.chart.destroy();
      }
      if ($this.zugoupmonthColumn && !$this.zugoupmonthColumn.chart.destroyed) {
        $this.zugoupmonthColumn.chart.destroy();
      }
      if ($this.yeartongData && !$this.yeartongData.chart.destroyed) {
        $this.yeartongData.chart.destroy();
      }
      if ($this.registerData && !$this.registerData.chart.destroyed) {
        $this.registerData.chart.destroy();
      }
      if ($this.yearscoretongData && !$this.yearscoretongData.chart.destroyed) {
        $this.yearscoretongData.chart.destroy();
      }
      $this.clearData();
      $this.$store
        .dispatch("api/enCluesStatDataAction", resultData)
        .then((response) => {
          if (response) {
            if (response.status) {
              // 获取部门数据
              if (response.readart && response.readart.length > 0) {
                var DeparData = [];
                response.readart.forEach(function (item, index) {
                  var itemDate = {};
                  itemDate.value = item.id;
                  itemDate.label = item.name;
                  itemDate.disabled = false;
                  DeparData.push(itemDate);
                });
                $this.currentCluesData.DeparData = DeparData;
              }
              // 日目标统计
              $this.targetScore.daymaxnumber = response.daymaxnumber[0];
              $this.targetScore.historymaxnumber = response.historymaxnumber[0];
              // 日询盘
              var MaxValue = "";
              var MaxArr = [
                response.alltodaynumber,
                response.daytargetnumber,
                response.alllastdaynumber,
              ];
              MaxArr.forEach(function (item, index) {
                if (MaxValue < item) {
                  MaxValue = item;
                }
              });
              $this.currentCluesData.alltodaynumber = response.alltodaynumber;
              $this.currentCluesData.alltodaynumberPercent =
                (response.alltodaynumber / MaxValue) * 100;
              $this.currentCluesData.alllastdaynumber =
                response.alllastdaynumber;
              $this.currentCluesData.alllastdaynumberPercent =
                (response.alllastdaynumber / MaxValue) * 100;
              // 月询盘
              $this.currentCluesData.allmonthnumber = response.allmonthnumber;
              $this.currentCluesData.monthGrowth =
                response.allmonthnumber - response.lastallnumber;
              $this.currentCluesData.monthGrowthTxt = Math.abs(
                response.allmonthnumber - response.lastallnumber
              );
              // 英文成交统计数据
              $this.getCnDepartScore();
              // 近30天询盘统计
              var tongArr = [];
              response.tong.forEach(function (item, index) {
                var itemDate = [];
                itemDate = item.date.split("-");
                item.date =
                  itemDate[1] +
                  "-" +
                  itemDate[2] +
                  "\n" +
                  item.week.replace("星期", "周");
                var tolItem = {};
                tolItem.date = item.date;
                tolItem.xunnumber = item.xunnumber;
                tolItem.title = "询盘";
                if ($this.isDepart1) {
                  var searchItem = {};
                  searchItem.date = item.date;
                  searchItem.xunnumber = item.searchxunnumber;
                  searchItem.title = "搜索询盘";
                  tongArr.push(searchItem, tolItem);
                } else {
                  tongArr.push(tolItem);
                }
              });
              $this.currentCluesData.chartData = tongArr;
              $this.currentCluesData.avgChartNum = response.tongavgnumber;
              $this.currentCluesData.targetNum = response.daytargetnumber;
              $this.$refs["drawAreaTrendChart"][0].drawAreaTrendChart();
              // 月询盘面积图数据
              if (response.monthtong && response.monthtong.length > 0) {
                var monthtongArr = [];
                var monthtongList = [];
                monthtongList = response.monthtong;
                monthtongList.forEach(function (item, index) {
                  var monthtongObj = {};
                  monthtongObj.date = item.date.split("-")[1] + "月";
                  monthtongObj.xunnumber = item.xunnumber;
                  monthtongObj.xunchange = item.tongxunnumber
                    ? item.tongxunnumber
                    : item.xunnumber;
                  monthtongArr.push(monthtongObj);
                });
                $this.currentCluesData.monthtongArr = monthtongArr;
                $this.$refs["monthtongChart"][0].monthtongChart();
              }
              // 年度询盘对比
              if (response.yeartong && response.yeartong.length > 0) {
                var yeartongArr = [];
                var registerArr = [];
                var registerGrowth = "";
                var registerRate = "";
                var registerObj = {
                  year: "",
                  isOn: false,
                  isHeight: 0,
                  value: 0,
                };
                var lastregisterObj = {
                  year: "",
                  isOn: false,
                  isHeight: 0,
                  value: 0,
                };
                response.yeartong.forEach(function (item, index) {
                  var yeartongObj = {};
                  var lastyeartongObj = {};
                  yeartongObj.month = item.date.split("-")[1] + "月";
                  yeartongObj.value = item.xunnumber;
                  yeartongObj.year = item.date.split("-")[0];
                  yeartongObj.date = item.date + "月";
                  lastyeartongObj.month = item.lastdate.split("-")[1] + "月";
                  lastyeartongObj.value = item.lastxunnumber;
                  lastyeartongObj.year = item.lastdate.split("-")[0];
                  yeartongArr.push(yeartongObj, lastyeartongObj);
                  //年度同期询盘对比
                  registerObj.value = registerObj.value + item.xunnumber;
                  registerObj.year = item.date.split("-")[0];
                  lastregisterObj.value =
                    lastregisterObj.value + item.lastxunnumber;
                  lastregisterObj.year = item.lastdate.split("-")[0];
                });
                $this.currentCluesData.yeartongArr = yeartongArr;
                if (registerObj.year > lastregisterObj.year) {
                  registerObj.isOn = true;
                } else {
                  lastregisterObj.isOn = true;
                }
                var MaxVal = "";
                if (registerObj.value > lastregisterObj.value) {
                  MaxVal = registerObj.value;
                } else {
                  MaxVal = lastregisterObj.value;
                }
                registerObj.isHeight = (registerObj.value / MaxVal) * 244;
                lastregisterObj.isHeight =
                  (lastregisterObj.value / MaxVal) * 244;
                registerArr.push(registerObj, lastregisterObj);
                $this.currentCluesData.registerArr = registerArr;
                registerGrowth = registerObj.value - lastregisterObj.value;
                registerRate =
                  Math.abs(
                    (
                      ((registerObj.value - lastregisterObj.value) /
                        lastregisterObj.value) *
                      100
                    ).toFixed(2)
                  ) + "%";
                $this.currentCluesData.registerGrowth = registerGrowth;
                $this.currentCluesData.registerRate = registerRate;
                $this.$refs["yeartongChart"][0].yeartongChart();
              }
              // 小组日成绩
              if (response.zusuercount != "" && response.zusuercount != null) {
                if (response.zugroupday.length > 0 && response.zugroupday) {
                  var zugroupdayArr = [];
                  response.zugroupday.forEach(function (item, index) {
                    var lastdayitemData = {};
                    var todayitemData = {};
                    lastdayitemData.name = item.name
                      .replace("-", "\n")
                      .replace("-", "\n");
                    lastdayitemData.title = "昨日数量";
                    lastdayitemData.number = item.lastdaynumber;
                    todayitemData.name = item.name
                      .replace("-", "\n")
                      .replace("-", "\n");
                    todayitemData.title = "当日数量";
                    todayitemData.number = item.todaynumber;
                    zugroupdayArr.push(lastdayitemData, todayitemData);
                  });
                  $this.currentCluesData.zugroupdayArr = zugroupdayArr;
                  $this.$nextTick(() => {
                    $this.$refs["zugroupdayChart"][0].zugroupdayChart(); // 日询盘
                  });
                } else {
                  $this.currentCluesData.zugroupdayArr = [];
                }
              } else {
                $this.currentCluesData.zugroupdayArr = [];
              }
              // 小组月成绩
              if (response.zusuercount != "" && response.zusuercount != null) {
                if (response.zugoupmonth.length > 0 && response.zugoupmonth) {
                  var zugoupmonthArr = [];
                  response.zugoupmonth.forEach(function (item, index) {
                    var lastdayitemData = {};
                    var todayitemData = {};
                    lastdayitemData.name = item.name
                      .replace("-", "\n")
                      .replace("-", "\n");
                    lastdayitemData.title = "上月同期";
                    lastdayitemData.number = item.lastmonthnumber;
                    todayitemData.name = item.name
                      .replace("-", "\n")
                      .replace("-", "\n");
                    todayitemData.title = "本月同期";
                    todayitemData.number = item.monthnumber;
                    zugoupmonthArr.push(lastdayitemData, todayitemData);
                  });
                  $this.currentCluesData.zugoupmonthArr = zugoupmonthArr;
                  $this.$nextTick(() => {
                    $this.$refs["zugroupmonthChart"][0].zugroupmonthChart(); // 月询盘
                  });
                } else {
                  $this.currentCluesData.zugoupmonthArr = [];
                }
              } else {
                $this.currentCluesData.zugoupmonthArr = [];
              }
              // 组员成绩
              if (response.zusuercount != "" && response.zusuercount != null) {
                if (response.zusuercount.length > 0 && response.zusuercount) {
                  var newStrArr = [];
                  var zusuercountAllArr = []; //综合-组员成绩
                  response.zusuercount.forEach(function (item, index) {
                    if (item.length > 0 && item) {
                      item.forEach(function (items, indexs) {
                        zusuercountAllArr.push(items);
                        if (newStrArr.indexOf(items.dept_id) == -1) {
                          newStrArr.push(items.dept_id);
                        }
                      });
                    }
                  });
                  $this.zusuercount.zusuercountAllArr = zusuercountAllArr;
                  var zusuercountGroupnameArr = []; //小组
                  var GroupID = [];
                  newStrArr.forEach(function (item, index) {
                    GroupID.push(item);
                    $this.currentCluesData.DeparData.forEach(function (
                      items,
                      indexs
                    ) {
                      if (item == items.value) {
                        var GroupnameObj = {};
                        GroupnameObj.value = items.value;
                        GroupnameObj.label = items.label;
                        GroupnameObj.disabled = false;
                        zusuercountGroupnameArr.push(GroupnameObj);
                      }
                    });
                  });
                  $this.zusuercount.GroupID = GroupID;
                  $this.zusuercount.zusuercountGroupnameArr =
                    zusuercountGroupnameArr;
                  $this.groupClick();
                } else {
                  $this.zusuercount.zusuercountArr = [];
                }
              } else {
                $this.zusuercount.zusuercountArr = [];
              }
              // 年度成交积分对比
              //if(response.yearscoretong&&response.yearscoretong.length>0){
              //  var yearscoretongArr=[];
              //  var sametimeArr=[];
              //  var sametimeGrowth='';
              //  var sametimeRate='';
              //  var registerObj={
              //    year:'',
              //    value:0,
              //  };
              //  var lastregisterObj={
              //    year:'',
              //    value:0,
              //  };
              //  response.yearscoretong.forEach(function(item,index){
              //      var yeartongObj={};
              //      var lastyeartongObj={};
              //      yeartongObj.month=item.date.split('-')[1]+'月';
              //      if ($this.isFloat(Number(item.score))) {
              //         yeartongObj.value=Number(Number(item.score).toFixed(2));
              //      } else {
              //         yeartongObj.value=item.score;
              //      }
              //      yeartongObj.year=item.date.split('-')[0];
              //      lastyeartongObj.month=item.lastdate.split('-')[1]+'月';
              //      if ($this.isFloat(Number(item.lastscore))) {
              //         lastyeartongObj.value=Number(Number(item.lastscore).toFixed(2));
              //      } else {
              //         lastyeartongObj.value=item.lastscore;
              //      }
              //      lastyeartongObj.year=item.lastdate.split('-')[0];
              //      yearscoretongArr.push(yeartongObj,lastyeartongObj);
              //      //年度同期成交对比
              //      registerObj.year=item.date.split('-')[0];
              //      if ($this.isFloat(Number(item.score))) {
              //          registerObj.value=Number((Number(registerObj.value)+Number(item.score)).toFixed(2));
              //      } else {
              //          registerObj.value=Number(registerObj.value)+Number(item.score);
              //      }
              //      lastregisterObj.year=item.lastdate.split('-')[0];
              //      if ($this.isFloat(Number(item.lastscore))) {
              //          lastregisterObj.value=Number((Number(lastregisterObj.value)+Number(item.lastscore)).toFixed(2));
              //      } else {
              //          lastregisterObj.value=Number(lastregisterObj.value)+Number(item.lastscore);
              //      }
              //  });
              //  $this.currentCluesData.yearscoretongArr=yearscoretongArr;
              //  sametimeArr.push(registerObj,lastregisterObj);
              //  $this.currentCluesData.sametimeArr=sametimeArr;
              //  var MaxValue='';
              //  if(Number(registerObj.value)>=Number(lastregisterObj.value)){
              //    MaxValue=Number(registerObj.value);
              //  }else{
              //    MaxValue=Number(lastregisterObj.value);
              //  }
              //  if(MaxValue==0){
              //    lastregisterObj.percen='0%';
              //    registerObj.percen='0%';
              //  }else{
              //      lastregisterObj.percen=(Number(lastregisterObj.value)/MaxValue*100).toFixed(2)+'%';
              //      registerObj.percen=(Number(registerObj.value)/MaxValue*100).toFixed(2)+'%';
              //  }
              //  sametimeGrowth=Number(registerObj.value)-Number(lastregisterObj.value);
              //  if(Number(lastregisterObj.value)==0){
              //    sametimeRate=Number(registerObj.value).toFixed(2)+'%';
              //  }else{
              //    sametimeRate=Math.abs((Number(registerObj.value)-Number(lastregisterObj.value))/Number(lastregisterObj.value)*100).toFixed(2)+'%';
              //  }
              //  if($this.isFloat(sametimeGrowth)){
              //    sametimeGrowth=Number(sametimeGrowth.toFixed(2));
              //  }
              //  $this.currentCluesData.sametimeGrowth=sametimeGrowth;
              //  $this.currentCluesData.sametimeRate=sametimeRate;
              //  $this.yearscoretongChart();
              //}
              if (
                $this.currentCluesData.departID &&
                $this.currentCluesData.departID.length > 0
              ) {
                if (
                  $this.currentCluesData.departID.length ==
                  $this.currentCluesData.DeparData.length
                ) {
                  //if(response.userscore.length>0&&response.userscore){
                  //  var userscoreNum=[];
                  //  response.userscore.forEach(function(item,index){
                  //    var itemData = {};
                  //    itemData.id = item.id;
                  //    itemData.username = item.username;
                  //    itemData.groupname = item.groupname;
                  //    itemData.headimg = item.headimg;
                  //    itemData.number = item.number;
                  //    if(item.lastnumber){
                  //      itemData.Growth = Math.abs(item.number-item.lastnumber.number);
                  //      if(item.number-item.lastnumber.number>0){
                  //        itemData.growthClass=true;
                  //      }
                  //      if(item.number-item.lastnumber.number<0){
                  //        itemData.growthClass=false;
                  //      }
                  //    }else{
                  //      itemData.Growth = item.number;
                  //      itemData.growthClass=true;
                  //    }
                  //    userscoreNum.push(itemData);
                  //  });
                  //  userscoreNum.sort(function(a, b) {
                  //      var value1 = a.number;
                  //      var value2 = b.number;
                  //      return value2 - value1;
                  //  });
                  //  userscoreNum.forEach(function(item,index){
                  //    item.percen = item.number/userscoreNum[0].number*100;
                  //  });
                  //  $this.currentCluesData.userscoreNum = userscoreNum;
                  //}else{
                  //  $this.currentCluesData.userscoreNum=[];
                  //}
                  ////年度成交Top5
                  //if(response.yearuserscore.length>0&&response.yearuserscore){
                  //  var yearuserscoreNum=[];
                  //  response.yearuserscore.forEach(function(item,index){
                  //    var itemData = {};
                  //    itemData.id = item.id;
                  //    itemData.username = item.username;
                  //    itemData.groupname = item.groupname;
                  //    itemData.number = item.number;
                  //    itemData.anumber = item.anumber;
                  //    itemData.children = item.son;
                  //    itemData.headimg = item.headimg;
                  //    yearuserscoreNum.push(itemData);
                  //  });
                  //  yearuserscoreNum.sort(function(a, b) {
                  //      var value1 = a.number;
                  //      var value2 = b.number;
                  //      return value2 - value1;
                  //  });
                  //  var Maxnumber=0;
                  //  var yearusernewArr=[];
                  //  yearuserscoreNum.forEach(function(item,index){
                  //     if(index==0){
                  //       Maxnumber=item.number;
                  //     }
                  //     if(Maxnumber!=0){
                  //        item.Percen=(item.number/Maxnumber*100).toFixed(2)+'%';
                  //     }else{
                  //        item.Percen='0%'
                  //     }
                  //  });
                  //  $this.currentCluesData.yearuserscoreNum = yearuserscoreNum;
                  //}else{
                  //  $this.currentCluesData.yearuserscoreNum=[];
                  //}
                  //$this.$nextTick(() => {
                  //    $this.yearuserChart();
                  //})
                } else {
                  //距目标线差距
                  var maxTarget = 0;
                  $this.currentCluesData.departID.forEach(function (
                    item,
                    index
                  ) {
                    $this.groupcountArr.forEach(function (items, indexs) {
                      if (item == items.id) {
                        var gap = 0;
                        gap = items.daytargetnumber - items.daynumber;
                        maxTarget = maxTarget + gap;
                      }
                    });
                  });
                  if (maxTarget >= 0) {
                    $this.targetScore.isDistanceTarget = true;
                  } else {
                    $this.targetScore.isDistanceTarget = false;
                  }
                  $this.targetScore.DistanceTarget = Math.abs(maxTarget);
                }
              } else {
                //if(response.userscore.length>0&&response.userscore){
                //  var userscoreNum=[];
                //  response.userscore.forEach(function(item,index){
                //    var itemData = {};
                //    itemData.id = item.id;
                //    itemData.username = item.username;
                //    itemData.groupname = item.groupname;
                //    itemData.headimg = item.headimg;
                //    itemData.number = item.number;
                //    if(item.lastnumber){
                //      itemData.Growth = Math.abs(item.number-item.lastnumber.number);
                //      if(item.number-item.lastnumber.number>0){
                //        itemData.growthClass=true;
                //      }
                //      if(item.number-item.lastnumber.number<0){
                //        itemData.growthClass=false;
                //      }
                //    }else{
                //      itemData.Growth = item.number;
                //      itemData.growthClass=true;
                //    }
                //    userscoreNum.push(itemData);
                //  });
                //  userscoreNum.sort(function(a, b) {
                //      var value1 = a.number;
                //      var value2 = b.number;
                //      return value2 - value1;
                //  });
                //  userscoreNum.forEach(function(item,index){
                //    item.percen = item.number/userscoreNum[0].number*100;
                //  });
                //  $this.currentCluesData.userscoreNum = userscoreNum;
                //}else{
                //  $this.currentCluesData.userscoreNum=[];
                //}
                ////年度成交Top5
                //if(response.yearuserscore.length>0&&response.yearuserscore){
                //  var yearuserscoreNum=[];
                //  response.yearuserscore.forEach(function(item,index){
                //    var itemData = {};
                //    itemData.id = item.id;
                //    itemData.username = item.username;
                //    itemData.groupname = item.groupname;
                //    itemData.number = item.number;
                //    itemData.anumber = item.anumber;
                //    itemData.children = item.son;
                //    itemData.headimg = item.headimg;
                //    yearuserscoreNum.push(itemData);
                //  });
                //  yearuserscoreNum.sort(function(a, b) {
                //      var value1 = a.number;
                //      var value2 = b.number;
                //      return value2 - value1;
                //  });
                //  var Maxnumber=0;
                //  var yearusernewArr=[];
                //  yearuserscoreNum.forEach(function(item,index){
                //     if(index==0){
                //       Maxnumber=item.number;
                //     }
                //     if(Maxnumber!=0){
                //        item.Percen=(item.number/Maxnumber*100).toFixed(2)+'%';
                //     }else{
                //        item.Percen='0%'
                //     }
                //  });
                //  $this.currentCluesData.yearuserscoreNum = yearuserscoreNum;
                //}else{
                //  $this.currentCluesData.yearuserscoreNum=[];
                //}
                //$this.$nextTick(() => {
                //    $this.yearuserChart();
                //})
              }
              $this.currentCluesData.DeparData.forEach(function (item, index) {
                item.disabled = false;
              });
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
    // 获取中文地区统计数据
    getCnCluesRegionStatData() {
      var $this = this;
      var resultData = {};
      if ($this.mapDate && $this.mapDate.length > 0) {
        resultData.starttime = $this.mapDate[0];
        resultData.endtime = $this.mapDate[1];
      } else {
        resultData.starttime = "";
        resultData.endtime = "";
      }
      if (
        $this.currentCluesData.departID &&
        $this.currentCluesData.departID.length > 0
      ) {
        resultData.dept_id = $this.currentCluesData.departID;
      } else {
        resultData.dept_id = [];
      }
      console.log(this.$refs)
      $this.$refs["hotAreaDeom"][0].clearChat();
      $this.$store
        .dispatch("api/cnCluesRegionStatDataAction", resultData)
        .then((response) => {
          if (response) {
            if (response.status) {
              var cluesRegionData = response.data;
              cluesRegionData.sort(function (a, b) {
                var value1 = a.number;
                var value2 = b.number;
                return value2 - value1;
              });
              $this.currentCluesData.cluesRegionData = cluesRegionData;
              var topTenRegionData = [];
              response.data.forEach(function (item, index) {
                if (index < 10) {
                  topTenRegionData.push(item);
                }
              });
              topTenRegionData.sort(function (a, b) {
                var value1 = a.number;
                var value2 = b.number;
                return value2 - value1;
              });
              $this.currentCluesData.topTenRegionData = topTenRegionData;
              $this.$refs["hotAreaDeom"][0].drawCnCluesRegionChart();
              $this.$refs["hotAreaDeom"][0].drawTopTen();
              // $this.drawCnCluesRegionChart();
              // $this.drawTopTen();
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
    //判断浮点数
    isFloat(num) {
      if (!isNaN(num) && num % 1 !== 0) {
        return true;
      } else {
        return false;
      }
    },
    // 首页中文成交统计数据
    getCnDepartScore() {
      var $this = this;
      $this.currentCluesData.departScoreData = [];
      var resultData = {};
      if ($this.ScoreTime && $this.ScoreTime != "") {
        resultData.month = $this.ScoreTime;
      } else {
        resultData.month = "";
      }
      var resUrl = "";
      if ($this.language == "Module_cnStat") {
        resUrl = "api/departScoreAction";
      } else {
        resUrl = "api/endepartScoreAction";
      }
      $this.$store.dispatch(resUrl, resultData).then((response) => {
        if (response.status) {
          $this.ScoreTime = response.month;
          if (response.departscore && response.departscore.length > 0) {
            var departscoreArr = [];
            response.departscore.forEach(function (item, index) {
              var itemDate = {};
              itemDate.departname = item.departname;
              if (
                item.passnumber == null ||
                item.passnumber == 0 ||
                item.passnumber == ""
              ) {
                itemDate.passnumber = 0;
              } else {
                itemDate.passnumber = item.passnumber;
              }
              if (
                item.mediumnumber == null ||
                item.mediumnumber == 0 ||
                item.mediumnumber == ""
              ) {
                itemDate.mediumnumber = 0;
              } else {
                itemDate.mediumnumber = item.mediumnumber;
              }
              if (
                item.goodnumber == null ||
                item.goodnumber == 0 ||
                item.goodnumber == ""
              ) {
                itemDate.goodnumber = 0;
              } else {
                itemDate.goodnumber = item.goodnumber;
              }
              if (
                item.a_number == null ||
                item.a_number == 0 ||
                item.a_number == ""
              ) {
                itemDate.a_number = 0;
              } else {
                itemDate.a_number = item.a_number;
              }
              if (
                item.snumber == null ||
                item.snumber == 0 ||
                item.snumber == ""
              ) {
                itemDate.snumber = 0;
              } else {
                itemDate.snumber = item.snumber;
              }
              if (item.score == null || item.score == 0 || item.score == "") {
                itemDate.score = 0;
              } else {
                itemDate.score = item.score;
              }
              departscoreArr.push(itemDate);
            });
            $this.currentCluesData.departScoreData = departscoreArr;
          } else {
            $this.yearuserChart = null;
            if ($this.yearuserChart && !$this.yearuserChart.chart.destroyed) {
              $this.yearuserChart.chart.destroy();
            }
          }
          var scoreArr = [];
          var goodnumberArr = [];
          var Maxscore = "";
          var Maxgoodnumber = "";
          if (
            $this.currentCluesData.departID &&
            $this.currentCluesData.departID.length > 0
          ) {
            if (
              $this.currentCluesData.departID.length ==
              $this.currentCluesData.DeparData.length
            ) {
              if (response.departscore && response.departscore.length > 0) {
                response.departscore.forEach(function (item) {
                  scoreArr.push(item.score);
                  goodnumberArr.push(item.goodnumber);
                });
                scoreArr.forEach(function (item) {
                  if (item > Maxscore) {
                    Maxscore = item;
                  }
                });
                goodnumberArr.forEach(function (item) {
                  if (item > Maxgoodnumber) {
                    Maxgoodnumber = item;
                  }
                });
                if (Maxscore > Maxgoodnumber) {
                  $this.ScoreData.MaxValue = Maxscore * 1.1;
                } else {
                  $this.ScoreData.MaxValue = Maxgoodnumber * 1.1;
                }
              }
              $this.ScoreData.allscore = response.allscore;
              $this.ScoreData.allsnumber = response.allsnumber;
              $this.ScoreData.addallscore = response.allscore;
              $this.ScoreData.addallsnumber = response.allsnumber;
              var updatemtime = [];
              var resMtimeOne = response.mtime.split(" ");
              updatemtime = resMtimeOne[0].split("-");
              updatemtime.push(resMtimeOne[1]);
              $this.updatemtime = updatemtime;
              $this.updateScoremonth = response.scoremonth;
              if ($this.language == "Module_cnStat") {
                if (
                  response.yeardepartscore &&
                  response.yeardepartscore.length > 0
                ) {
                  if (
                    $this.costAverageData &&
                    !$this.costAverageData.chart.destroyed
                  ) {
                    $this.costAverageData.chart.destroy();
                  }
                  if (
                    $this.yeardepartscoreData &&
                    !$this.yeardepartscoreData.chart.destroyed
                  ) {
                    $this.yeardepartscoreData.chart.destroy();
                  }
                  $this.currentCluesData.yeardepartscoreArr = [];
                  $this.currentCluesData.totalNumscore = "";
                  var yeardepartscoreArr = [];
                  var departmentCost = [];
                  var costAverage = [];
                  var totalNumscore = "";
                  response.yeardepartscore.forEach(function (item, index) {
                    var departscoreObj = {};
                    var departmentCostObj = {};
                    var costAverageObj = {};
                    departscoreObj.score = item.score;
                    departscoreObj.departname = item.departname.replace(
                      "电商",
                      ""
                    );
                    departscoreObj.percenter = item.percenter;
                    totalNumscore = Number(totalNumscore) + Number(item.score);
                    yeardepartscoreArr.push(departscoreObj);
                    //部门成本
                    departmentCostObj.departname = item.departname.replace(
                      "电商",
                      ""
                    );
                    departmentCostObj.score = Number(
                      parseFloat(item.score).toFixed(2)
                    );
                    departmentCostObj.allmoney = item.allmoney;
                    departmentCostObj.avgallmoney = item.avgallmoney;
                    departmentCostObj.moneyscore = item.moneyscore;
                    departmentCostObj.personmoney = item.personmoney;
                    departmentCostObj.paymoney = item.paymoney;
                    departmentCostObj.personnumber = item.personnumber;
                    departmentCost.push(departmentCostObj);
                    costAverageObj.departname = item.departname.replace(
                      "电商",
                      ""
                    );
                    costAverageObj.avgallmoney = item.avgallmoney;
                    costAverage.push(costAverageObj);
                  });
                  $this.currentCluesData.yeardepartscoreArr =
                    yeardepartscoreArr;
                  $this.currentCluesData.totalNumscore = Number(
                    totalNumscore.toFixed(2)
                  );
                  $this.$refs["yeardepartscoreChart"][0].yeardepartscoreChart();
                  //部门成本
                  costAverage.sort(function (a, b) {
                    var value1 = a.avgallmoney;
                    var value2 = b.avgallmoney;
                    return value1 - value2;
                  });
                  $this.currentCluesData.costAverage = costAverage;
                  //部门成本均价排行
                  $this.currentCluesData.departmentCost = departmentCost;
                  $this.$refs["costAverageChart"][0].costAverageChart();
                }
              }
            } else {
              if (response.departscore && response.departscore.length > 0) {
                var tolScore = 0;
                var tolNumber = 0;
                $this.currentCluesData.departID.forEach(function (item, index) {
                  response.departscore.forEach(function (items, indexs) {
                    if (item == items.id) {
                      if (
                        items.score == null ||
                        items.score == 0 ||
                        items.score == ""
                      ) {
                        items.score = 0;
                      }
                      if (
                        items.snumber == null ||
                        items.snumber == 0 ||
                        items.snumber == ""
                      ) {
                        items.snumber = 0;
                      }
                      tolScore = tolScore + parseFloat(items.score);
                      tolNumber = tolNumber + parseFloat(items.snumber);
                    }
                  });
                });
                $this.ScoreData.allscore = response.allscore;
                $this.ScoreData.allsnumber = response.allsnumber;
                $this.ScoreData.addallscore = Number(
                  parseFloat(tolScore).toFixed(2)
                );
                $this.ScoreData.addallsnumber = Number(
                  parseFloat(tolNumber).toFixed(2)
                );
                $this.ScoreData.allsnumberPercen =
                  ((parseFloat(tolNumber) / response.allsnumber) * 100).toFixed(
                    2
                  ) + "%";
                $this.ScoreData.allscorePercen =
                  ((parseFloat(tolScore) / response.allscore) * 100).toFixed(
                    2
                  ) + "%";
              }
            }
          } else {
            if (response.departscore && response.departscore.length > 0) {
              response.departscore.forEach(function (item) {
                scoreArr.push(item.score);
                goodnumberArr.push(item.goodnumber);
              });
              scoreArr.forEach(function (item) {
                if (item > Maxscore) {
                  Maxscore = item;
                }
              });
              goodnumberArr.forEach(function (item) {
                if (item > Maxgoodnumber) {
                  Maxgoodnumber = item;
                }
              });
              if (Maxscore > Maxgoodnumber) {
                $this.ScoreData.MaxValue = Maxscore * 1.1;
              } else {
                $this.ScoreData.MaxValue = Maxgoodnumber * 1.1;
              }
            }
            $this.ScoreData.allscore = response.allscore;
            $this.ScoreData.allsnumber = response.allsnumber;
            $this.ScoreData.addallscore = response.allscore;
            $this.ScoreData.addallsnumber = response.allsnumber;
            var updatemtime = [];
            var resMtimeOne = response.mtime.split(" ");
            updatemtime = resMtimeOne[0].split("-");
            updatemtime.push(resMtimeOne[1]);
            $this.updatemtime = updatemtime;
            $this.updateScoremonth = response.scoremonth;
            if ($this.language == "Module_cnStat") {
              if (
                response.yeardepartscore &&
                response.yeardepartscore.length > 0
              ) {
                if (
                  $this.costAverageData &&
                  !$this.costAverageData.chart.destroyed
                ) {
                  $this.costAverageData.chart.destroy();
                }
                if (
                  $this.yeardepartscoreData &&
                  !$this.yeardepartscoreData.chart.destroyed
                ) {
                  $this.yeardepartscoreData.chart.destroy();
                }
                $this.currentCluesData.yeardepartscoreArr = [];
                $this.currentCluesData.totalNumscore = "";
                var yeardepartscoreArr = [];
                var departmentCost = [];
                var costAverage = [];
                var totalNumscore = "";
                response.yeardepartscore.forEach(function (item, index) {
                  var departscoreObj = {};
                  var departmentCostObj = {};
                  var costAverageObj = {};
                  departscoreObj.score = item.score;
                  departscoreObj.departname = item.departname.replace(
                    "电商",
                    ""
                  );
                  departscoreObj.percenter = item.percenter;
                  totalNumscore = Number(totalNumscore) + Number(item.score);
                  yeardepartscoreArr.push(departscoreObj);
                  //部门成本
                  departmentCostObj.departname = item.departname.replace(
                    "电商",
                    ""
                  );
                  departmentCostObj.score = Number(
                    parseFloat(item.score).toFixed(2)
                  );
                  departmentCostObj.allmoney = item.allmoney;
                  departmentCostObj.avgallmoney = item.avgallmoney;
                  departmentCostObj.moneyscore = item.moneyscore;
                  departmentCostObj.personmoney = item.personmoney;
                  departmentCostObj.paymoney = item.paymoney;
                  departmentCostObj.personnumber = item.personnumber;
                  departmentCost.push(departmentCostObj);
                  costAverageObj.departname = item.departname.replace(
                    "电商",
                    ""
                  );
                  costAverageObj.avgallmoney = item.avgallmoney;
                  costAverage.push(costAverageObj);
                });
                $this.currentCluesData.yeardepartscoreArr = yeardepartscoreArr;
                $this.currentCluesData.totalNumscore = Number(
                  totalNumscore.toFixed(2)
                );
                $this.$refs["yeardepartscoreChart"][0].yeardepartscoreChart();
                //部门成本
                costAverage.sort(function (a, b) {
                  var value1 = a.avgallmoney;
                  var value2 = b.avgallmoney;
                  return value1 - value2;
                });
                $this.currentCluesData.costAverage = costAverage;
                //部门成本均价排行
                $this.currentCluesData.departmentCost = departmentCost;
                $this.$refs["costAverageChart"][0].costAverageChart();
              }
            }
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
    // 成交统计月份选择
    monthChangeHandler(val) {
      var $this = this;
      this.ScoreTime = val;
      $this.getCnDepartScore();
    },
    // 成交统计月份选择
    DaytargetHandler(val) {
      var $this = this;
      $this.groupcountArr = [];
      $this.DaytargetTime = val;
      if ($this.language == "Module_cnStat") {
        $this.cnDaytarget();
      } else {
        $this.enDaytarget();
      }
    },
    // 获取英文地区统计数据
    getEnCluesRegionStatData() {
      var $this = this;
      var resultData = {};
      if ($this.mapDate && $this.mapDate.length > 0) {
        resultData.starttime = $this.mapDate[0];
        resultData.endtime = $this.mapDate[1];
      } else {
        resultData.starttime = "";
        resultData.endtime = "";
      }
      if (
        $this.currentCluesData.departID &&
        $this.currentCluesData.departID.length > 0
      ) {
        resultData.dept_id = $this.currentCluesData.departID;
      } else {
        resultData.dept_id = [];
      }
      $this.$refs["hotAreaDeom"][0].clearChat();
      $this.$store
        .dispatch("api/enCluesRegionStatDataAction", resultData)
        .then((response) => {
          if (response) {
            if (response.status) {
              $this.currentCluesData.cluesRegionData = worldCountry(
                response.data
              );
              $this.currentCluesData.cluesRegionData.sort($this.sortNumber);
              var topTenRegionData = [];
              $this.currentCluesData.cluesRegionData.forEach(function (
                item,
                index
              ) {
                if (index < 10) {
                  topTenRegionData.push(item);
                }
              });
              topTenRegionData.sort(function (a, b) {
                var value1 = a.number;
                var value2 = b.number;
                return value2 - value1;
              });
              $this.currentCluesData.topTenRegionData = topTenRegionData;
              $this.$refs["hotAreaDeom"][0].drawEnCluesRegionChart();
              $this.$refs["hotAreaDeom"][0].drawTopTen();
              // $this.drawEnCluesRegionChart();
              // $this.drawTopTen();
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
    // 根据地区的询盘数量做降序排序
    sortNumber(a, b) {
      return b.number - a.number;
    },
    // 中文地区日期选择改变事件
    dateRangeChangeHandler(val) {
      var $this = this;
      this.mapDate = val;
      if (this.language == "Module_cnStat") {
        $this.getCnCluesRegionStatData();
      } else {
        $this.getEnCluesRegionStatData();
      }
    },
    // 获取今天时间
    getNearMonth() {
      var $this = this;
      const date = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      date.setTime(date.getTime());
      //var monthDay = start.getFullYear()+"-"+(start.getMonth()+1>9?start.getMonth()+1:'0'+(start.getMonth()+1))+"-"+(start.getDate()+1>9?start.getDate():'0'+(start.getDate()));
      var lastYear = "";
      var lastmonth = "";
      var lastday = "";
      if (start.getMonth() + 1 <= 3) {
        var absM = Math.abs(start.getMonth() + 1 - 3);
        lastYear =
          parseInt(start.getFullYear()) -
          Math.ceil(absM / 12 == 0 ? 1 : parseInt(absM) / 12);
        lastmonth =
          12 - (absM % 12) > 9 ? 12 - (absM % 12) : "0" + (12 - (absM % 12));
      } else {
        lastYear = start.getFullYear();
        lastmonth =
          start.getMonth() - 1 > 9
            ? start.getMonth() - 1
            : "0" + (start.getMonth() - 1);
      }
      var monthDay =
        lastYear +
        "-" +
        lastmonth +
        "-" +
        (start.getDate() + 1 > 9 ? start.getDate() : "0" + start.getDate());
      var today =
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1 > 9
          ? date.getMonth() + 1
          : "0" + (date.getMonth() + 1)) +
        "-" +
        (date.getDate() + 1 > 9 ? date.getDate() : "0" + date.getDate());
      $this.mapDate = [monthDay, today];
      $this.thisMonth =
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1 > 9
          ? date.getMonth() + 1
          : "0" + (date.getMonth() + 1));
      $this.DaytargetTodayTime = today;
      $this.TodayMonth =
        date.getMonth() + 1 > 9
          ? date.getMonth() + 1
          : "0" + (date.getMonth() + 1);
    },
    renderStatistic(containerWidth, text, style) {
      const { width: textWidth, height: textHeight } = measureTextWidth(
        text,
        style
      );
      const R = containerWidth / 2;
      var scale = 1;
      if (containerWidth < textWidth) {
        scale = Math.min(
          Math.sqrt(
            Math.abs(
              Math.pow(R, 2) /
                (Math.pow(textWidth / 2, 2) + Math.pow(textHeight, 2))
            )
          ),
          1
        );
      }
      const textStyleStr = `width:${containerWidth}px;`;
      return `<div style="${textStyleStr};font-size:${scale}em;line-height:${
        scale < 1 ? 1 : "inherit"
      };">${text}</div>`;
    },
    //点击部门
    handleDepart() {
      var $this = this;
      if (!$this.loading) {
        $this.loading = true;
        setTimeout(() => {
          $this.loading = false;
        }, 1000);
        var departID = $this.currentCluesData.departID;
        var departName = "";
        var DeparId = "";
        $this.currentCluesData.DeparData.forEach(function (item, index) {
          item.disabled = true;
          if (item.label == "电商一部") {
            DeparId = item.value;
          }
        });
        if (departID && departID.length > 0) {
          if (departID.length == $this.currentCluesData.DeparData.length) {
            $this.isDepart1 = false;
            if ($this.language == "Module_cnStat") {
              departName = "中文";
            } else {
              departName = "英文";
            }
          } else {
            if (departID.length == 1) {
              departID.forEach(function (item, index) {
                $this.currentCluesData.DeparData.forEach(function (
                  items,
                  indexs
                ) {
                  if (item == items.value) {
                    departName = departName + items.label;
                  }
                });
                if (item == DeparId) {
                  $this.isDepart1 = true;
                } else {
                  $this.isDepart1 = false;
                }
              });
            } else {
              $this.isDepart1 = false;
              departID = departID.sort(function (a, b) {
                return a - b;
              });
              departID.forEach(function (item, index) {
                $this.currentCluesData.DeparData.forEach(function (
                  items,
                  indexs
                ) {
                  if (item == items.value) {
                    departName = departName + items.label.slice(2, 3);
                  }
                });
              });
              departName = "电商(" + departName.split("").join("、") + ")部";
            }
          }
        } else {
          $this.isDepart1 = false;
          if ($this.language == "Module_cnStat") {
            departName = "中文";
          } else {
            departName = "英文";
          }
        }
        $this.currentCluesData.departName = departName;
        if ($this.language == "Module_cnStat") {
          $this.getCnCluesRegionStatData();
          $this.getCnCluesStatData();
        } else {
          $this.getEnCluesRegionStatData();
          $this.getEnCluesStatData();
        }
      }
    },
    // 中英文选中状态切换
    cnEnActiveChange() {
      var $this = this;
      $this.languageList.forEach(function (item, index) {
        if (item.label == $this.language) {
          item.isOn = true;
        } else {
          item.isOn = false;
        }
      });
    },
    // 中英文数据分析切换
    cnEnStatChange(language) {
      var $this = this;
      if (!$this.loading) {
        $this.loading = true;
        setTimeout(() => {
          $this.loading = false;
        }, 1000);
        if ($this.language != language) {
          $this.isDepart1 = false;
          $this.language = language;
          $this.cnEnActiveChange();
          $this.currentCluesData.departID = [];
          $this.ScoreTime = "";
          if ($this.language == "Module_cnStat") {
            $this.currentCluesData.departName = "中文";
          } else {
            $this.currentCluesData.departName = "英文";
          }
          $this.currentCluesData.DeparData = [];
          var userlanguage = Cookies.get("language");
          userlanguage = JSON.parse(userlanguage);
          userlanguage.language = $this.language;
          userlanguage = JSON.stringify(userlanguage);
          Cookies.set("language", userlanguage);
          $this.statDataApi();
        }
      }
    },
    // 调用数据分析接口
    statDataApi() {
      var $this = this;
      if ($this.language == "Module_cnStat") {
        $this.getCnCluesRegionStatData(); //地区
        $this.cnDaytarget(); //日目标
        $this.getCnCluesStatData(); //其他
      } else {
        $this.getEnCluesRegionStatData();
        $this.enDaytarget();
        $this.getEnCluesStatData();
      }
    },
    // 组员成绩部门点击事件
    groupClick(val) {
      var $this = this;
      if (val) {
        $this.zusuercount.GroupID = val;
      }
      var GroupID = $this.zusuercount.GroupID;
      if (GroupID && GroupID.length > 0) {
        if (GroupID.length == 1) {
          $this.zusuercount.zusuercountGroupnameArr.forEach(function (
            item,
            index
          ) {
            GroupID.forEach(function (items) {
              if (items == item.value) {
                item.disabled = true;
              } else {
                item.disabled = false;
              }
            });
          });
        } else {
          $this.zusuercount.zusuercountGroupnameArr.forEach(function (
            item,
            index
          ) {
            item.disabled = false;
          });
        }
        var zusuercountArr = []; //分组-组员成绩
        GroupID.forEach(function (item, index) {
          $this.zusuercount.zusuercountAllArr.forEach(function (items, indexs) {
            if (item == items.dept_id) {
              var itemData = {};
              itemData.dept_id = items.dept_id;
              itemData.groupname = items.groupname;
              itemData.lastdaynumber = items.lastdaynumber;
              itemData.lastmonthnumber = items.lastmonthnumber;
              itemData.monthnumber = items.monthnumber;
              itemData.todaynumber = items.todaynumber;
              itemData.username = items.username;
              if (items.monthnumber - items.lastmonthnumber > 0) {
                itemData.Class = "rising";
              }
              if (items.monthnumber - items.lastmonthnumber < 0) {
                itemData.Class = "falling";
              }
              if (items.monthnumber - items.lastmonthnumber == 0) {
                itemData.Class = "equality";
              }
              itemData.Growth = Math.abs(
                items.monthnumber - items.lastmonthnumber
              );
              if (itemData.Growth == 0) {
                itemData.Growth = "-";
              }
              zusuercountArr.push(itemData);
            }
          });
        });
        zusuercountArr.sort(function (a, b) {
          var value1 = a.monthnumber;
          var value2 = b.monthnumber;
          return value2 - value1;
        });
        if (zusuercountArr.length > 7) {
          $this.tableHidden.tableBtnVisible = true;
          $this.tableHidden.tableHeight = 357 + "px";
        } else {
          $this.tableHidden.tableBtnVisible = false;
          $this.tableHidden.tableHeight = "auto";
        }
        $this.zusuercount.zusuercountArr = zusuercountArr;
      } else {
        var zusuercountArr = []; //分组-组员成绩
        $this.zusuercount.zusuercountAllArr.forEach(function (item, index) {
          var itemData = {};
          itemData.dept_id = item.dept_id;
          itemData.groupname = item.groupname;
          itemData.lastdaynumber = item.lastdaynumber;
          itemData.lastmonthnumber = item.lastmonthnumber;
          itemData.monthnumber = item.monthnumber;
          itemData.todaynumber = item.todaynumber;
          itemData.username = item.username;
          if (item.monthnumber - item.lastmonthnumber > 0) {
            itemData.Class = "rising";
          }
          if (item.monthnumber - item.lastmonthnumber < 0) {
            itemData.Class = "falling";
          }
          if (item.monthnumber - item.lastmonthnumber == 0) {
            itemData.Class = "equality";
          }
          itemData.Growth = Math.abs(item.monthnumber - item.lastmonthnumber);
          if (itemData.Growth == 0) {
            itemData.Growth = "-";
          }
          zusuercountArr.push(itemData);
        });
        zusuercountArr.sort(function (a, b) {
          var value1 = a.monthnumber;
          var value2 = b.monthnumber;
          return value2 - value1;
        });
        if (zusuercountArr.length > 7) {
          $this.tableHidden.tableBtnVisible = true;
          $this.tableHidden.tableHeight = 357 + "px";
        } else {
          $this.tableHidden.tableBtnVisible = false;
          $this.tableHidden.tableHeight = "auto";
        }
        $this.zusuercount.zusuercountArr = zusuercountArr;
      }
    },
    // 表格点击展开
    tableBtn(tableHeight, tableBtnTxt, tableBtnBool) {
      var $this = this;
      $this.tableHidden.tableBtnBool = tableBtnBool;
      $this.tableHidden.tableHeight = tableHeight;
      $this.tableHidden.tableBtnTxt = tableBtnTxt;
    },
  },
};
</script>
<style lang="scss" scoped>
</style>