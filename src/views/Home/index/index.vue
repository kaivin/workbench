<template>
  <div class="page-root scroll-panel home-index" ref="boxPane">
    <el-card class="box-card scroll-card" shadow="hover">
      <div class="card-content" ref="tableContent">
        <div class="item-row flex-box"> 
          <div class="item-column flex-content" v-if="permitModules.includes('Module_bbs')">
            <div class="item-module">
              <div class="module-header"><h2>消息通知</h2></div>
              <div class="module-body">
                <div class="news-panel">
                  <el-scrollbar wrap-class="scrollbar-wrapper">
                    <div class="news-list">
                      <div class="news-dl" v-for="(item,index) in newsList" v-bind:key="index">
                        <div class="news-dt">{{item.groupname}}：({{item.number}})条新消息！</div>
                        <div class="item-news flex-box" v-for="item1 in item.article" v-bind:key="item1.id" v-on:click="jumpArticle(item1)">
                          <div class="txt-font flex-content" :title="item1.title">
                            <span class="txt-icon" v-bind:class="item1.is_new==1?'update':'new'"><b>{{item1.is_new==1?'改':'新'}}</b></span>
                            <span class="txt-type" v-if="item1.type==1">【{{item1.domain}} [{{item1.website_id}}]】</span>
                            <span class="txt-type" v-else>【{{item1.typename}}】</span>
                            <span class="txt-title" :style="{color:item1.titlecolor?item1.titlecolor:''}">{{item1.title}}</span>
                          </div>
                          <div class="txt-time">({{item1.updatetime}})</div>
                        </div>
                      </div>
                    </div>
                  </el-scrollbar>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="item-row stat-row">
          <div class="item-column">
            <div class="item-module">
              <div class="row-title"><h1><span>红星机器数据分析平台</span></h1></div>
              <div class="btn-panel" v-if="permitModules.includes('Module_cnStat')&&permitModules.includes('Module_enStat')">
                <el-radio-group v-model="language" size="small" @change="cnEnStatChange">
                  <el-radio-button v-for="(item,index) in languageList" v-bind:key="index" :label="item.label">{{item.name}}</el-radio-button>
                </el-radio-group>
              </div>
              <div class="flex-box">
                <div class="target-chart" style="width: 360px;">
                  <h3>{{language=='Module_cnStat'?'中文':'英文'}}各部门日目标</h3>
                  <div id="radialBarChart" class="chart-canvas"></div>
                  <h3>{{currentCluesData.departID?currentCluesData.departName:language=='Module_cnStat'?'中文总':'英文总'}}成交统计</h3>
                  <div class="table-chart" v-if="currentCluesData.targetData">
                    <div class="item-tr">
                      <div class="item-td">组别</div>
                      <div class="item-td">{{currentCluesData.departID?currentCluesData.departName:language=='Module_cnStat'?'中文总计':'英文总计'}}</div>
                    </div>
                    <div class="item-tr">
                      <div class="item-td">时间</div>
                      <div class="item-td">{{currentCluesData.scoreData.mtime}}</div>
                    </div>
                    <div class="item-tr" v-if="language=='Module_cnStat'">
                      <div class="item-td">积分</div>
                      <div class="item-td">{{currentCluesData.scoreData.score}}</div>
                    </div>
                    <div class="item-tr" v-if="currentCluesData.scoreData.level!=''">
                      <div class="item-td">等级</div>
                      <div class="item-td">{{currentCluesData.scoreData.level}}</div>
                    </div>
                    <div class="item-tr">
                      <div class="item-td">{{language=='Module_cnStat'?'成交数量':'A数量'}}</div>
                      <div class="item-td">{{currentCluesData.scoreData.snumber}}</div>
                    </div>
                    <div class="item-tr" v-if="language=='Module_cnStat'">
                      <div class="item-td">A数量</div>
                      <div class="item-td">{{currentCluesData.scoreData.a_number}}</div>
                    </div>
                  </div>
                </div>
                <div class="map-chart flex-content">
                  <div class="search-panel">
                    <div class="item-search">
                      <el-date-picker
                        v-model="mapDate"
                        size="mini"
                        type="daterange"
                        class="date-range"
                        align="right"
                        value-format = "yyyy-MM-dd"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="dateRangeChangeHandler"
                        :picker-options="pickerRangeOptions">
                      </el-date-picker> 
                    </div>
                  </div>
                  <div id="regionMapChart" class="chart-canvas"></div>
                </div>
                <div class="top-ten">
                  <h3>{{currentCluesData.departID?currentCluesData.departName:language=='Module_cnStat'?'中文':'英文'}}热门{{language=='Module_cnStat'?'地区':'国家'}}TOP10</h3>
                  <div id="topTen" class="chart-canva"></div>
                </div>
                <div class="clues-chart">
                  <h3>{{currentCluesData.departID?currentCluesData.departName:language=='Module_cnStat'?'中文':'英文'}}询盘统计</h3>
                  <div class="item-liquid-chart">
                    <div id="cluesLiquidChart1" class="chart-canvas"></div>
                  </div>
                  <div class="item-liquid-chart">
                    <div id="cluesLiquidChart2" class="chart-canvas"></div>
                  </div>
                  <div class="item-liquid-chart">
                    <div id="cluesLiquidChart3" class="chart-canvas"></div>
                  </div>
                </div>
              </div>
              <div class="flex-box flex-column">
                <h3>{{currentCluesData.departID?currentCluesData.departName:language=='Module_cnStat'?'中文':'英文'}}近30天询盘趋势</h3>
                <div id="cluesChart" class="chart-canvas flex-content"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="item-row flex-box salesman" v-if="permitModules.includes('Module_salesman')">
          <div class="item-column flex-content">
            <div class="num-list">
              <p><span>消息提醒</span><strong>{{salesmanData.warningcount}}</strong></p>
              <p><span>询盘总数</span><strong>{{salesmanData.personcount}}</strong></p>
              <p><span>待处理询盘总数</span><strong>{{salesmanData.waitdealcount}}</strong></p>
              <p><span>月底前需反馈询盘总数</span><strong>{{salesmanData.monthsaycount}}</strong></p>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import { worldCountry } from '@/utils/worldCountry';
import { mapGetters } from 'vuex';
import DataSet from '@antv/data-set';
import { Chart } from '@antv/g2';
import * as G2 from '@antv/g2';
import { Bullet,RadialBar,Liquid,Area, measureTextWidth,Pie } from '@antv/g2plot';
export default {
  name: 'Home',
  data() {
    return {
      menuButtonPermit:[],
      permitModules:[],
      currentCluesData:{
        departName:"中文",
        departID:null,
        scoreData:null,
        targetData:null,
        chartData:[],
        avgChartNum:0,
        targetNum:0,
        cluesNum:{
          today:0,
          todayPercent:0,
          totalToday:0,
          yesterday:0,
          yesterdayPercent:0,
          totalYesterday:0,
          month:0,
          monthPercent:0,
          totalMonth:0,
        },
        cluesRegionData:[],
        topTenRegionData:[],
      },
      totalNum:{
        cn:{
          today:0,
          yesterday:0,
          month:0,
        },
        en:{
          today:0,
          yesterday:0,
          month:0,
        },
      },
      salesmanData:{},
      newsList:[],
      pickerRangeOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      mapDate:[],
      languageList:[
        {name:"中文",label:"Module_cnStat"},
        {name:"英文",label:"Module_enStat"},
      ],
      language:'Module_cnStat',
      areaTrendPlot:null,
      regionMapChart:null,
      liquidPlot1:null,
      liquidPlot2:null,
      liquidPlot3:null,
      pieSourcePlot:null,
      radialBarPlot:null
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'device'
    ]),
  },
  created() {
    var $this = this;
    $this.initData();
  },
  methods: {
    // 初始化数据
    initData() {
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
            if($this.menuButtonPermit.includes('Home_index')){
              $this.getPermitModules();
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
    // 初始化页面信息
    initPage(){
      var $this = this;
      if($this.permitModules.includes('Module_bbs')){
        $this.getPostData();
      }
      if(!$this.language){
        if($this.permitModules.includes('Module_cnStat')){
          $this.language = "Module_cnStat";
          $this.currentCluesData.departName = "中文";
        }else{
          if($this.permitModules.includes('Module_enStat')){
            $this.language = "Module_enStat";
            $this.currentCluesData.departName = "英文";
          }
        }
      }
      if($this.language){
        $this.getNearMonth();
        $this.statDataApi();
      }
      if($this.permitModules.includes('Module_salesman')){
        $this.getSalesmanStatData();
      }
    },
    // 获取当前登录用户首页拥有阅读权限的模块
    getPermitModules(){
      var $this = this;
      $this.$store.dispatch("modulelist/getPermitModuleListAction", null).then((response) => {
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
    // 跳转到文章详情
    jumpArticle(row){
      var $this = this;
      var routeUrl = "";
      if(row.type==1){
        routeUrl =  $this.$router.resolve({path:'/Website/logInfo',query:{logID:row.id,websiteID:row.website_id,website:row.domain}});
      }else{
        routeUrl =  $this.$router.resolve({path:'/Article/info',query:{id:row.id}});
      }
      window.open(routeUrl.href,'_blank');
    },
    // 获取论坛最新资讯
    getPostData(){
      var $this = this;
      $this.$store.dispatch("api/getNewPostArticleAction", null).then((response) => {
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
    // 获取中文统计数据
    getCnCluesStatData(){
      var $this = this;
      var resultData = {};
      if($this.currentCluesData.departID){
        resultData.dept_id = $this.currentCluesData.departID;
      }else{
        resultData = null;
      }
      if($this.areaTrendPlot&&!$this.areaTrendPlot.chart.destroyed){
        $this.areaTrendPlot.destroy();
      }
      $this.$store.dispatch("api/cnCluesStatDataAction", resultData).then((response) => {
        if (response) {
          if (response.status) {
            console.log(response,"中文统计数据");
            response.tong.forEach(function(item,index){
              item.date = item.date+"\n"+item.week.replace("星期","周");
            });
            $this.currentCluesData.chartData = response.tong;
            $this.currentCluesData.avgChartNum = response.tongavgnumber;
            $this.currentCluesData.targetNum = response.daytargetnumber;
            $this.drawAreaTrendChart();
            $this.currentCluesData.scoreData = response.deptscore;
            if(!$this.currentCluesData.departID){
              var departTargetNum = [];
              response.groupcount.forEach(function(item,index){
                var itemData = {};
                itemData.id = item.id;
                itemData.name = item.departname;
                itemData.targetNum = item.daytargetnumber;
                itemData.dayNum = item.daynumber;
                var percent = 1;
                if(itemData.dayNum==0){
                  percent = 0;
                }else{
                  if(itemData.targetNum==0){
                    percent = 1;
                  }else{
                    percent = parseFloat((item.daynumber/item.daytargetnumber).toFixed(2));
                  }
                }
                itemData.percent = percent;
                departTargetNum.push(itemData);
              });
              $this.currentCluesData.targetData = departTargetNum;
              $this.drawDepartTarget();
              $this.totalNum.en.today = response.entodaynumber;
              $this.totalNum.en.yesterday = response.enlastdaynumber;
              $this.totalNum.en.month = response.enmonthnumber;
              $this.totalNum.cn.today = response.alltodaynumber;
              $this.totalNum.cn.yesterday = response.alllastdaynumber;
              $this.totalNum.cn.month = response.allmonthnumber;
              $this.currentCluesData.cluesNum.today = response.alltodaynumber;
              $this.currentCluesData.cluesNum.yesterday = response.alllastdaynumber;
              $this.currentCluesData.cluesNum.month = response.allmonthnumber;
              $this.currentCluesData.cluesNum.totalToday = response.alltodaynumber+response.entodaynumber;
              $this.currentCluesData.cluesNum.totalYesterday = response.alllastdaynumber+response.enlastdaynumber;
              $this.currentCluesData.cluesNum.totalMonth = response.allmonthnumber+response.enmonthnumber;
            }else{
              $this.currentCluesData.cluesNum.today = response.alltodaynumber;
              $this.currentCluesData.cluesNum.yesterday = response.alllastdaynumber;
              $this.currentCluesData.cluesNum.month = response.allmonthnumber;
              $this.currentCluesData.cluesNum.totalToday = $this.totalNum.cn.today;
              $this.currentCluesData.cluesNum.totalYesterday = $this.totalNum.cn.yesterday;
              $this.currentCluesData.cluesNum.totalMonth = $this.totalNum.cn.month;
            }
            var todayPercent = parseFloat(($this.currentCluesData.cluesNum.today/$this.currentCluesData.cluesNum.totalToday).toFixed(2));
            var yesterdayPercent = parseFloat(($this.currentCluesData.cluesNum.yesterday/$this.currentCluesData.cluesNum.totalYesterday).toFixed(2));
            var monthPercent = parseFloat(($this.currentCluesData.cluesNum.month/$this.currentCluesData.cluesNum.totalMonth).toFixed(2));
            $this.currentCluesData.cluesNum.todayPercent = Number.isNaN(todayPercent)?0:todayPercent;
            $this.currentCluesData.cluesNum.yesterdayPercent = Number.isNaN(yesterdayPercent)?0:yesterdayPercent;
            $this.currentCluesData.cluesNum.monthPercent = Number.isNaN(monthPercent)?0:monthPercent;
            $this.drawCluesLiquidChart1();
            $this.drawCluesLiquidChart2();
            $this.drawCluesLiquidChart3();
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
    getEnCluesStatData(){
      var $this = this;
      var resultData = {};
      if($this.currentCluesData.departID){
        resultData.dept_id = $this.currentCluesData.departID;
      }else{
        resultData = null;
      }
      if($this.areaTrendPlot&&!$this.areaTrendPlot.chart.destroyed){
        $this.areaTrendPlot.destroy();
      }
      $this.$store.dispatch("api/enCluesStatDataAction", resultData).then((response) => {
        if (response) {
          if (response.status) {
            console.log(response,"英文统计数据");
            response.tong.forEach(function(item,index){
              item.date = item.date+"\n"+item.week.replace("星期","周");
            });
            $this.currentCluesData.chartData = response.tong;
            $this.currentCluesData.avgChartNum = response.tongavgnumber;
            $this.currentCluesData.targetNum = response.daytargetnumber;
            $this.drawAreaTrendChart();
            $this.currentCluesData.scoreData = response.deptscore;
            if(!$this.currentCluesData.departID){
              var departTargetNum = [];
              response.groupcount.forEach(function(item,index){
                var itemData = {};
                itemData.id = item.id;
                itemData.name = item.departname;
                itemData.targetNum = item.daytargetnumber;
                itemData.dayNum = item.daynumber;
                var percent = 1;
                if(itemData.dayNum==0){
                  percent = 0;
                }else{
                  if(itemData.targetNum==0){
                    percent = 1;
                  }else{
                    percent = parseFloat((item.daynumber/item.daytargetnumber).toFixed(2));
                  }
                }
                itemData.percent = percent;
                departTargetNum.push(itemData);
              });
              $this.currentCluesData.targetData = departTargetNum;
              $this.drawDepartTarget();
              $this.totalNum.en.today = response.alltodaynumber;
              $this.totalNum.en.yesterday = response.alllastdaynumber;
              $this.totalNum.en.month = response.allmonthnumber;
              $this.totalNum.cn.today = response.chinatodaynumber;
              $this.totalNum.cn.yesterday = response.chinalastdaynumber;
              $this.totalNum.cn.month = response.chinamonthnumber;
              $this.currentCluesData.cluesNum.today = response.alltodaynumber;
              $this.currentCluesData.cluesNum.yesterday = response.alllastdaynumber;
              $this.currentCluesData.cluesNum.month = response.allmonthnumber;
              $this.currentCluesData.cluesNum.totalToday = response.alltodaynumber+response.chinatodaynumber;
              $this.currentCluesData.cluesNum.totalYesterday = response.alllastdaynumber+response.chinalastdaynumber;
              $this.currentCluesData.cluesNum.totalMonth = response.allmonthnumber+response.chinamonthnumber;
            }else{
              $this.currentCluesData.cluesNum.today = response.alltodaynumber;
              $this.currentCluesData.cluesNum.yesterday = response.alllastdaynumber;
              $this.currentCluesData.cluesNum.month = response.allmonthnumber;
              $this.currentCluesData.cluesNum.totalToday = $this.totalNum.en.today;
              $this.currentCluesData.cluesNum.totalYesterday = $this.totalNum.en.yesterday;
              $this.currentCluesData.cluesNum.totalMonth = $this.totalNum.en.month;
            }
            var todayPercent = parseFloat(($this.currentCluesData.cluesNum.today/$this.currentCluesData.cluesNum.totalToday).toFixed(2));
            var yesterdayPercent = parseFloat(($this.currentCluesData.cluesNum.yesterday/$this.currentCluesData.cluesNum.totalYesterday).toFixed(2));
            var monthPercent = parseFloat(($this.currentCluesData.cluesNum.month/$this.currentCluesData.cluesNum.totalMonth).toFixed(2));
            $this.currentCluesData.cluesNum.todayPercent = Number.isNaN(todayPercent)?0:todayPercent;
            $this.currentCluesData.cluesNum.yesterdayPercent = Number.isNaN(yesterdayPercent)?0:yesterdayPercent;
            $this.currentCluesData.cluesNum.monthPercent = Number.isNaN(monthPercent)?0:monthPercent;
            $this.drawCluesLiquidChart1();
            $this.drawCluesLiquidChart2();
            $this.drawCluesLiquidChart3();
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
    getCnCluesRegionStatData(){
      var $this = this;
      var resultData = {};
      if($this.mapDate&&$this.mapDate.length>0){
        resultData.starttime = $this.mapDate[0];
        resultData.endtime = $this.mapDate[1];
      }else{
        resultData.starttime = "";
        resultData.endtime = "";
      }
      if($this.currentCluesData.departID){
        resultData.dept_id = $this.currentCluesData.departID;
      }else{
        resultData.dept_id = "";
      }
      if($this.regionMapChart&&!$this.regionMapChart.destroyed){
        $this.regionMapChart.destroy();
      }
      $this.$store.dispatch("api/cnCluesRegionStatDataAction", resultData).then((response) => {
        if (response) {
          if (response.status) {
            $this.currentCluesData.cluesRegionData = response.data;
            var topTenRegionData = [];
            response.data.forEach(function(item,index){
              if(index<10){
                topTenRegionData.push(item);
              }
            });
            $this.currentCluesData.topTenRegionData = topTenRegionData;
            console.log(response,"地区询盘统计");
            $this.drawCnCluesRegionChart();
            $this.drawTopTen();
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
    // 获取英文地区统计数据
    getEnCluesRegionStatData(){
      var $this = this;
      var resultData = {};
      if($this.mapDate&&$this.mapDate.length>0){
        resultData.starttime = $this.mapDate[0];
        resultData.endtime = $this.mapDate[1];
      }else{
        resultData.starttime = "";
        resultData.endtime = "";
      }
      if($this.currentCluesData.departID){
        resultData.dept_id = $this.currentCluesData.departID;
      }else{
        resultData.dept_id = "";
      }
      if($this.regionMapChart&&!$this.regionMapChart.destroyed){
        $this.regionMapChart.destroy();
      }
      $this.$store.dispatch("api/enCluesRegionStatDataAction", resultData).then((response) => {
        if (response) {
          if (response.status) {
            $this.currentCluesData.cluesRegionData = worldCountry(response.data);
            $this.currentCluesData.cluesRegionData.sort($this.sortNumber);
            var topTenRegionData = [];
            $this.currentCluesData.cluesRegionData.forEach(function(item,index){
              if(index<10){
                topTenRegionData.push(item);
              }
            });
            $this.currentCluesData.topTenRegionData = topTenRegionData;
            console.log($this.currentCluesData.cluesRegionData,"地区询盘统计");
            console.log($this.currentCluesData.topTenRegionData,"top10");
            $this.drawEnCluesRegionChart();
            $this.drawTopTen();
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
    sortNumber(a,b){
      return b.number - a.number;
    },
    // 近30天询盘统计趋势图
    drawAreaTrendChart(){
      var $this = this;
      if($this.currentCluesData.chartData.length>0){
        const areaTrendPlot = new Area('cluesChart', {
          data:$this.currentCluesData.chartData,    
          xField: 'date',
          yField: 'xunnumber',
          appendPadding:[15,15,15,15],
          height: 370,
          smooth:true,
          areaStyle: () => {
            return {
              fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
            };
          },
          yAxis:{
            grid:{
              line:null
            }
          },
          xAxis: {
            tickCount:15,
            label: {
              // 数值格式化为千分位
              formatter: (v) => {
                var date = v.split("-")[1]+"-"+v.split("-")[2];
                return date
              },
              style:{
                lineHeight:16
              }
            },
            grid:{
              line:{
                style:{
                  stroke: 'black',
                  lineWidth:1,
                  lineDash:[6,3],
                  strokeOpacity:0.1,
                  shadowBlur:0
                }
              }
            },
          },
          legend: {
            position: 'right-top'
          },
          tooltip: {
            formatter: (datum) => {
              return { name: "询盘个数", value: datum.xunnumber };
            },
            title:(e)=>{
              return e.replace(/\n/g," ")
            }
          },
          annotations: [
            // 平均值
            {
              type: 'line',
              start: ['min', $this.currentCluesData.avgChartNum],
              end: ['max', $this.currentCluesData.avgChartNum],
              top:true,
              offsetY: 0,
              offsetX: 0,
              style: {
                stroke: '#f16b6b',
                lineDash: [6, 4],
                lineWidth: 1,
              },
            },
            // 平均值
            {
              type: 'html',
              position:['max',$this.currentCluesData.avgChartNum],
              top:true,
              html:"<span class='chart-font avg'><span class='txt-font'>"+$this.currentCluesData.avgChartNum+"</span><i></i></span>",
              alignX:"left",
              alignY:"bottom",
            },
            // 目标线
            {
              type: 'line',
              start: ['min', $this.currentCluesData.targetNum],
              end: ['max', $this.currentCluesData.targetNum],
              top:true,
              offsetY: 0,
              offsetX: 0,
              style: {
                stroke: '#6aa343',
                lineWidth: 1,
              },
            },
            // 目标线
            {
              type: 'html',
              position:['max',$this.currentCluesData.targetNum],
              top:true,
              html:"<span class='chart-font target'><span class='txt-font'>"+$this.currentCluesData.targetNum+"</span><i></i></span>",
              alignX:"left",
              alignY:"bottom",
            },
          ],
        });
        $this.areaTrendPlot = areaTrendPlot;
        areaTrendPlot.render();
      }
    },
    // 中文地区询盘地图
    drawCnCluesRegionChart(){
      var $this = this;
      if($this.currentCluesData.cluesRegionData.length>0){   
        fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/china-provinces.geo.json')
        .then(res => res.json())
        .then(GeoJSON => {
          const regionMapChart = new G2.Chart({
            container: 'regionMapChart',
            width: 760,
            height: 560,
          });
          regionMapChart.scale({
            latitude: { sync: true },
            longitude: { sync: true }
          });
          regionMapChart.tooltip({
            showTitle: false,
            showMarkers: false,
            shared: true,
          });
          // 同步度量
          regionMapChart.scale({
            longitude: {
              sync: true
            },
            latitude: {
              sync: true
            }
          });
          regionMapChart.axis(false);
          regionMapChart.legend('trend', {
            position: 'bottom',
          });
          // 绘制中国地图背景
          var ds = new DataSet();
          const geoDv = ds.createView('back').source(GeoJSON, {type: 'GeoJSON'});
          const geoView = regionMapChart.createView();
          geoView.data(geoDv.rows);
          geoView.tooltip(false);
          geoView.polygon()
            .position('longitude*latitude')
            .color('grey')
            .style({
              fill: '#fff',
              stroke: '#ccc',
              lineWidth: 1,
            });
          // 可视化用户数据
          const userData = [];
          $this.currentCluesData.cluesRegionData.forEach(function(item,index){
            var itemData = {};
            itemData.name = item.name;
            itemData.number = item.number;
            userData.push(itemData);
          });
          const userDv = ds.createView().source(userData).transform({
            // sizeByCount: true,
            geoDataView: geoDv,
            field: 'name',
            type: 'geo.region',
            as: ['longitude', 'latitude']
          }).transform({
            type: 'map',
            callback: obj => {
              if(obj.number <10){
                  obj.trend="0-10";
              }else if(obj.number <20 && obj.number>=10){
                  obj.trend="10-20";
              }else if(obj.number <30 && obj.number>=20){
                  obj.trend="20-30";
              }else if(obj.number <40 && obj.number>=30){
                  obj.trend="30-40";
              }else if(obj.number <50 && obj.number>=40){
                  obj.trend="40-50";
              }else if(obj.number <60 && obj.number>=50){
                  obj.trend="50-60";
              }else if(obj.number <100 && obj.number>=60){
                  obj.trend="60-100";
              }else if(obj.number <300 && obj.number>=100){
                  obj.trend="100-300";
              }else if(obj.number <500 && obj.number>=300){
                  obj.trend="300-500";
              }else if(obj.number <800 && obj.number>=500){
                  obj.trend="500-800";
              }else{
                  obj.trend="大于800";
              }
              return obj;
            }
          });
          console.log(userDv,"用户数据");
          const userView = regionMapChart.createView();
          userView.data(userDv.rows);
          userView.scale({
            number: {
              alias: '数量'
            },
            name:{
              alias:"地区"
            }
          });
          userView.polygon()
            .position('longitude*latitude')
            .color('trend', '#0050B3-#1890FF-#BAE7FF')
            .tooltip('name*number')
            .style({
              fillOpacity: 0.85
            }).animate({
              leave: {
                animation: 'fade-out'
              }
            });
          userView.interaction('element-active');
          $this.regionMapChart = regionMapChart;
          regionMapChart.render();
        });
      }
    },
    // 英文地区询盘地图
    drawEnCluesRegionChart(){
      var $this = this;
      fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/world.geo.json')
      .then(res => res.json())
      .then(mapData => {
        const regionMapChart = new G2.Chart({
          container: 'regionMapChart',
          width: 760,
          height: 400,
        });
        regionMapChart.tooltip({
          showTitle: false,
          showMarkers: false,
          shared: true,
        });
        // 同步度量
        regionMapChart.scale({
          longitude: {
            sync: true
          },
          latitude: {
            sync: true
          }
        });
        regionMapChart.axis(false);
        regionMapChart.legend('trend', {
          position: 'bottom',
        });
        // 绘制世界地图背景
        var ds = new DataSet();
        const worldMap = ds.createView('back').source(mapData, {type: 'GeoJSON'});
        const worldMapView = regionMapChart.createView();
        worldMapView.data(worldMap.rows);
        worldMapView.tooltip(false);
        worldMapView.polygon()
          .position('longitude*latitude')
          .color('grey')
          .style({
            fill: '#fff',
            stroke: '#ccc',
            lineWidth: 1,
          });
        // 可视化用户数据
        const userData = $this.currentCluesData.cluesRegionData;
        const userDv = ds.createView().source(userData).transform({
          // sizeByCount: true,
          geoDataView: worldMap,
          field: 'country',
          type: 'geo.region',
          as: ['longitude', 'latitude']
        }).transform({
          type: 'map',
          callback: obj => {
            if(obj.number <10){
                obj.trend="0-10";
            }else if(obj.number <20 && obj.number>=10){
                obj.trend="10-20";
            }else if(obj.number <30 && obj.number>=20){
                obj.trend="20-30";
            }else if(obj.number <40 && obj.number>=30){
                obj.trend="30-40";
            }else if(obj.number <50 && obj.number>=40){
                obj.trend="40-50";
            }else if(obj.number <60 && obj.number>=50){
                obj.trend="50-60";
            }else if(obj.number <100 && obj.number>=60){
                obj.trend="60-100";
            }else if(obj.number <300 && obj.number>=100){
                obj.trend="100-300";
            }else if(obj.number <500 && obj.number>=300){
                obj.trend="300-500";
            }else if(obj.number <800 && obj.number>=500){
                obj.trend="500-800";
            }else{
                obj.trend="大于800";
            }
            return obj;
          }
        });
        console.log(userDv,"用户数据");
        const userView = regionMapChart.createView();
        userView.data(userDv.rows);
        userView.scale({
          number: {
            alias: '数量'
          },
          name:{
            alias:"国家"
          },
          country:{
            alias:"英文名"
          }
        });
        userView.polygon()
          .position('longitude*latitude')
          .color('trend', '#0050B3-#1890FF-#BAE7FF')
          .tooltip('name*country*number')
          .style({
            fillOpacity: 0.85
          }).animate({
            leave: {
              animation: 'fade-out'
            }
          });
        userView.interaction('element-active');
        $this.regionMapChart = regionMapChart;
        regionMapChart.render();
      });
    },
    // 中文地区日期选择改变事件
    dateRangeChangeHandler(e){
      var $this = this;
      if($this.language=="Module_cnStat"){
        $this.getCnCluesRegionStatData();
      }else{
        $this.getEnCluesRegionStatData();
      }
    },
    // 获取今天时间
    getNearMonth(){
        var $this = this;
        const date = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        date.setTime(date.getTime());
        var monthDay = start.getFullYear()+"-"+(start.getMonth()+1>9?start.getMonth()+1:'0'+(start.getMonth()+1))+"-"+(start.getDate()+1>9?start.getDate():'0'+(start.getDate()));
        var today = date.getFullYear()+"-"+(date.getMonth()+1>9?date.getMonth()+1:'0'+(date.getMonth()+1))+"-"+(date.getDate()+1>9?date.getDate():'0'+(date.getDate()));
        $this.mapDate = [monthDay,today];
    },
    // 今天、昨天、本月询盘水波图
    drawCluesLiquidChart1(){
      var $this = this;
      if($this.liquidPlot1&&!$this.liquidPlot1.chart.destroyed){
        $this.liquidPlot1.changeData($this.currentCluesData.cluesNum.todayPercent);
      }else{
        const liquidPlot1 = new Liquid('cluesLiquidChart1', {
          percent: $this.currentCluesData.cluesNum.todayPercent,
          height:160,
          outline: {
            border: 2,
            distance: 4,
          },
          wave: {
            length: 128,
          },
          statistic: {
            content: {
              formatter: () => '今日总询盘',
              style: ({ percent }) => ({
                lineHeight: 2,
                fill: percent > 0.65 ? 'white' : 'rgba(44,53,66,0.85)',
              }),
            },
            title: {
              style: ({ percent }) => ({
                fontSize: 60,
                lineHeight: 1,
                fill: percent > 0.65 ? 'white' : 'rgba(44,53,66,0.85)',
              }),
              customHtml: (container, view, { percent }) => {
                const { width, height } = container.getBoundingClientRect();
                const d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
                const text = `${$this.currentCluesData.cluesNum.today}`;
                const textWidth = measureTextWidth(text, { fontSize: 60 });
                const scale = Math.min(d / textWidth, 1);
                return `<div style="width:${d}px;display:flex;align-items:center;justify-content:center;font-size:${scale}em;line-height:${
                  scale <= 1 ? 1 : 'inherit'
                }">${text}</div>`;
              },
            },
          },
        });
        $this.liquidPlot1 = liquidPlot1;
        liquidPlot1.render();
      }
    },
    // 今天、昨天、本月询盘水波图
    drawCluesLiquidChart2(){
      var $this = this;
      if($this.liquidPlot2&&!$this.liquidPlot2.chart.destroyed){
        $this.liquidPlot2.changeData($this.currentCluesData.cluesNum.yesterdayPercent);
      }else{
        const liquidPlot2 = new Liquid('cluesLiquidChart2', {
          percent: $this.currentCluesData.cluesNum.yesterdayPercent,
          height:160,
          outline: {
            border: 2,
            distance: 4,
          },
          wave: {
            length: 128,
          },
          statistic: {
            content: {
              formatter: () => '昨日总询盘',
              style: ({ percent }) => ({
                lineHeight: 2,
                fill: percent > 0.65 ? 'white' : 'rgba(44,53,66,0.85)',
              }),
            },
            title: {
              style: ({ percent }) => ({
                fontSize: 60,
                lineHeight: 1,
                fill: percent > 0.65 ? 'white' : 'rgba(44,53,66,0.85)',
              }),
              customHtml: (container, view, { percent }) => {
                const { width, height } = container.getBoundingClientRect();
                const d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
                const text = `${$this.currentCluesData.cluesNum.yesterday}`;
                const textWidth = measureTextWidth(text, { fontSize: 60 });
                const scale = Math.min(d / textWidth, 1);
                return `<div style="width:${d}px;display:flex;align-items:center;justify-content:center;font-size:${scale}em;line-height:${
                  scale <= 1 ? 1 : 'inherit'
                }">${text}</div>`;
              },
            },
          },
          liquidStyle: ({ percent }) => {
            return {
              fill: percent > 0.45 ? '#5B8FF9' : '#FAAD14',
              stroke: percent > 0.45 ? '#5B8FF9' : '#FAAD14',
            };
          },
          color: () => '#5B8FF9',
        });
        $this.liquidPlot2 = liquidPlot2;
        liquidPlot2.render();
      }
    },
    // 今天、昨天、本月询盘水波图
    drawCluesLiquidChart3(){
      var $this = this;
      if($this.liquidPlot3&&!$this.liquidPlot3.chart.destroyed){
        $this.liquidPlot3.changeData($this.currentCluesData.cluesNum.monthPercent);
      }else{
        const liquidPlot3 = new Liquid('cluesLiquidChart3', {
          percent: $this.currentCluesData.cluesNum.monthPercent,
          height:160,
          outline: {
            border: 2,
            distance: 4,
          },
          wave: {
            length: 128,
          },
          statistic: {
            content: {
              formatter: () => '本月总询盘',
              style: ({ percent }) => ({
                lineHeight: 2,
                fill: percent > 0.65 ? 'white' : 'rgba(44,53,66,0.85)',
              }),
            },
            title: {
              style: ({ percent }) => ({
                fontSize: 60,
                lineHeight: 1,
                fill: percent > 0.65 ? 'white' : 'rgba(44,53,66,0.85)',
              }),
              customHtml: (container, view, { percent }) => {
                const { width, height } = container.getBoundingClientRect();
                const d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
                const text = `${$this.currentCluesData.cluesNum.month}`;
                const textWidth = measureTextWidth(text, { fontSize: 60 });
                const scale = Math.min(d / textWidth, 1);
                return `<div style="width:${d}px;display:flex;align-items:center;justify-content:center;font-size:${scale}em;line-height:${
                  scale <= 1 ? 1 : 'inherit'
                }">${text}</div>`;
              },
            },
          },
        });
        $this.liquidPlot3 = liquidPlot3;
        liquidPlot3.render();
      }
    },
    // top10环形图
    drawTopTen(){
      var $this = this;
      if($this.currentCluesData.topTenRegionData.length>0){
        if($this.pieSourcePlot&&!$this.pieSourcePlot.chart.destroyed){
          $this.pieSourcePlot.changeData($this.currentCluesData.topTenRegionData);
        }else{
          const pieSourcePlot = new Pie('topTen', {
            data:$this.currentCluesData.topTenRegionData,
            angleField: 'number',
            colorField: 'name',
            appendPadding:[15,15,15,15],
            radius: 1,
            innerRadius: 0.64,
            label: {
              type: 'inner',
              offset: '-50%',
              style: {
                textAlign: 'center',
              },
              autoRotate: false,
              formatter: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
            },
            legend:{
              position:'bottom',
              flipPage:false,
            },
            statistic: {
              title: {
                offsetY: -4,
                customHtml: (topTen, view, datum) => {
                  const { width, height } = topTen.getBoundingClientRect();
                  const d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
                  const text = datum ? datum.name : '总计';
                  return $this.renderStatistic(d, text, { fontSize: 28 });
                },
              },
              content: {
                offsetY: 4,
                style: {
                  fontSize: '32px',
                },
                customHtml: (topTen, view, datum, data) => {
                  const { width } = topTen.getBoundingClientRect();

                  const text = datum ? `${datum.number}` : `${data.reduce((r, d) => r + d.number, 0)}`;
                  return $this.renderStatistic(width, text, { fontSize: 32 });
                },
              },
            },
            // 添加 中心统计文本 交互
            interactions: [{ type: 'element-selected' },  { type: 'pie-statistic-active' }],
          });
          $this.pieSourcePlot = pieSourcePlot;
          pieSourcePlot.render();
        }
      }
    },
    renderStatistic(containerWidth, text, style) {
      const { width: textWidth, height: textHeight } = measureTextWidth(text, style);
      const R = containerWidth / 2;
      // r^2 = (w / 2)^2 + (h - offsetY)^2
      var scale = 1;
      if (containerWidth < textWidth) {
        scale = Math.min(Math.sqrt(Math.abs(Math.pow(R, 2) / (Math.pow(textWidth / 2, 2) + Math.pow(textHeight, 2)))), 1);
      }
      const textStyleStr = `width:${containerWidth}px;`;
      return `<div style="${textStyleStr};font-size:${scale}em;line-height:${scale < 1 ? 1 : 'inherit'};">${text}</div>`;
    },
    // 部门日目标环形进度图
    drawDepartTarget(){
      var $this = this;
      if($this.currentCluesData.targetData.length>0){
        if($this.radialBarPlot&&!$this.radialBarPlot.chart.destroyed){
          $this.radialBarPlot.changeData($this.currentCluesData.targetData);
        }else{
          const radialBarPlot = new RadialBar('radialBarChart', {
            data:$this.currentCluesData.targetData,
            xField: 'name',
            yField: 'percent',
            width: 320,
            height:320,
            maxAngle: 360, //最大旋转角度,
            radius: 0.8,
            innerRadius: 0.2,
            xAxis: false,
            tooltip: {
              customContent: (value, items) => {
                if (!items || items.length <= 0) return;
                const { data: itemData } = items[0];
                return (
                  `<div class='custorm-tooltip'>` +
                  `<div class='box'>` +
                  `<div class='title'>${itemData.name}</div>` +
                  `<div class='tooltip-item'><span>今日总数：</span><span>${itemData.dayNum}</span></div>` +
                  `<div class='tooltip-item'><span>今日目标：</span><span>${itemData.targetNum}</span></div>` +
                  `</div>` +
                  `</div>`
                );
              },
            },
            legend: {
              position: 'left',
            },
            colorField: 'name',
            color: ['#FFbcb8', '#FFe0b0', '#bfeec8', '#5B8FF9', '#61DDAA'],
            barBackground: {},
            barStyle: { lineCap: 'round' },
            interactions: [{ type: 'element-highlight' }, { type: 'hover-cursor' }],
          });
          G2.registerInteraction('hover-cursor', {
            showEnable: [
              { trigger: 'element:mouseenter', action: 'cursor:pointer' },
              { trigger: 'element:mouseleave', action: 'cursor:default' },
            ],
          });
          radialBarPlot.on('element:click', (...args) => {
            $this.currentCluesData.departID = args[0].data.data.id;
            $this.currentCluesData.departName = args[0].data.data.name;
            $this.statDataApi();
          });
          $this.radialBarPlot = radialBarPlot;
          radialBarPlot.render();
        }
      }
    },
    // 中英文数据分析切换
    cnEnStatChange(){
      var $this = this;
      $this.currentCluesData.departID = null;
      if($this.language=="Module_cnStat"){
        $this.currentCluesData.departName = "中文";
      }else{
        $this.currentCluesData.departName = "英文";
      }
      $this.statDataApi();
    },
    // 调用数据分析接口
    statDataApi(){
      var $this = this;
      if($this.language=="Module_cnStat"){
        $this.getCnCluesRegionStatData();
        $this.getCnCluesStatData();
      }else{
        $this.getEnCluesRegionStatData();
        $this.getEnCluesStatData();
      }
    },
    // 获取业务员统计数据
    getSalesmanStatData(){
      var $this = this;
      $this.$store.dispatch("api/salesmanStatDataAction", null).then((response) => {
        if (response) {
          if (response.status) {
            console.log(response,"业务员统计数据");
            $this.salesmanData = response;
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
  }
}
</script>
<style lang="scss" scoped>
</style>