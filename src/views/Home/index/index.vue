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
                  <h3>各部门日目标</h3>
                  <div id="radialBarChart" class="chart-canvas"></div>
                  <h3>各部门成交积分</h3>
                  <div class="table-chart">
                    <div class="item-tr">
                      <div class="item-td">组别</div>
                      <div class="item-td">中文总计</div>
                    </div>
                    <div class="item-tr">
                      <div class="item-td">时间</div>
                      <div class="item-td">2021-09</div>
                    </div>
                    <div class="item-tr">
                      <div class="item-td">积分</div>
                      <div class="item-td">88</div>
                    </div>
                    <div class="item-tr">
                      <div class="item-td">等级</div>
                      <div class="item-td">优秀</div>
                    </div>
                    <div class="item-tr">
                      <div class="item-td">成交个数</div>
                      <div class="item-td">88</div>
                    </div>
                    <div class="item-tr">
                      <div class="item-td">A+数量</div>
                      <div class="item-td">88</div>
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
                  <div id="areaMapChart" class="chart-canvas"></div>
                </div>
                <div class="top-ten">
                  <h3>TOP10热门地区</h3>
                  <div id="topTen" class="chart-canva"></div>
                </div>
                <div class="clues-chart">
                  <h3>询盘统计</h3>
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
                <h3>近30天询盘趋势</h3>
                <div id="cluesChart" class="chart-canvas flex-content"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="item-row flex-box salesman" v-if="permitModules.includes('Module_salesman')">
          <div class="item-column flex-content">
            <div class="item-module">
              <div class="module-header"><h2>业务员个人数据</h2></div>
              <div class="module-body">
                <div class="num-list">
                  <p><span>消息提醒</span><strong>{{salesmanData.warningcount}}</strong></p>
                  <p><span>询盘总数</span><strong>{{salesmanData.personcount}}</strong></p>
                  <p><span>待处理询盘总数</span><strong>{{salesmanData.waitdealcount}}</strong></p>
                  <p><span>月底前需反馈询盘总数</span><strong>{{salesmanData.monthsaycount}}</strong></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import DataSet from '@antv/data-set';
import { Chart } from '@antv/g2';
import { Bullet,RadialBar,Liquid,Area, measureTextWidth,Pie } from '@antv/g2plot';
export default {
  name: 'Home',
  data() {
    return {
      menuButtonPermit:[],
      permitModules:[],
      cnCluesData:{},
      enCluesData:{},
      salesmanData:{},
      newsList:[],
      currentCnDepartData:{},
      currentEnDepartData:{},
      cnCluesAreaData:[],
      topTenAreaData:[],
      cnAreaPlot:null,
      cnAreaMapChart:null,
      enAreaPlot:null,
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
      today:"",
      languageList:[
        {name:"中文",label:"Module_cnStat"},
        {name:"英文",label:"Module_enStat"},
      ],
      language:'Module_cnStat',
      liquidPlot1:null,
      liquidPlot2:null,
      liquidPlot3:null,
      currentCluesNum:{
        today:0,
        todayPercent:0,
        yesterday:0,
        yesterdayPercent:0,
        month:0,
        monthPercent:0,
      },
      pieSourcePlot:null,
      departTargetNum:[],
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
      // $this.initPage();
    },
    // 获取当前登陆用户在该页面的操作权限
    getUserMenuButtonPermit(){
      var $this = this;
      $this.$store.dispatch('api/getMenuButtonPermitAction',{id:$this.$router.currentRoute.meta.id}).then(res=>{
        console.log(res);
        if(res.status){
          if(res.data.length>0){
            res.data.forEach(function(item,index){
              $this.menuButtonPermit.push(item.action_route);
            });
            if($this.menuButtonPermit.includes('Home_index')){
              $this.initPage();
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
      $this.getPermitModules();
    },
    // 获取当前登录用户首页拥有阅读权限的模块
    getPermitModules(){
      var $this = this;
      $this.$store.dispatch("modulelist/getPermitModuleListAction", null).then((response) => {
        if (response) {
          if (response.status) {
            $this.permitModules = response.data;
            if($this.permitModules.includes('Module_bbs')){
              $this.getPostData();
            }
            if($this.permitModules.includes('Module_cnStat')&&$this.permitModules.includes('Module_enStat')){
              $this.language = "Module_cnStat";
            }else{
              if($this.permitModules.includes('Module_cnStat')||$this.permitModules.includes('Module_enStat')){
                if($this.permitModules.includes('Module_cnStat')){
                  $this.language = "Module_cnStat";
                }else{
                  $this.language = "Module_enStat";
                }
              }else{
                $this.language = null;
              }
            }
            if($this.language){
              if($this.language == "Module_cnStat"){
                $this.getCnCluesStatData();
                $this.getNearMonth();
                $this.getCnCluesAreaStatData();
              }else{
                $this.getEnCluesStatData();
              }
            }
            if($this.permitModules.includes('Module_salesman')){
              $this.getSalesmanStatData();
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
      $this.$store.dispatch("api/cnCluesStatDataAction", null).then((response) => {
        if (response) {
          if (response.status) {
            console.log(response,"中文统计数据");
            var departTargetNum = [];
            response.departcount.forEach(function(item,index){
              item.tong.forEach(function(item1,index1){
                item1.date = item1.date+"\n"+item1.week.replace("星期","周");
              });
              if(index==0){
                item.isOn = true;
                $this.currentCnDepartData = item;
                $this.drawCnAreaChart();
              }else{
                item.isOn = false;
              }
              var itemData = {};
              itemData.id = item.dept_id;
              itemData.name = item.name;
              itemData.targetNum = item.daytargetnumber;
              itemData.dayNum = item.daynumber.todaynumber;
              var percent = parseFloat((item.daynumber.todaynumber/item.daytargetnumber).toFixed(2))
              itemData.percent = Number.isNaN(percent)?0:percent;
              departTargetNum.push(itemData);
            });
            $this.departTargetNum = departTargetNum;
            console.log($this.departTargetNum,"部门目标数据");
            $this.drawDepartTarget();
            $this.cnCluesData = response;
            if($this.language=="Module_cnStat"){
              $this.currentCluesNum.today = response.alltoday;
              $this.currentCluesNum.yesterday = response.alllastnumber;
              $this.currentCluesNum.month = response.allnumber;
              var todayPercent = parseFloat((response.alltoday/(response.alltoday+response.enalltoday)).toFixed(2));
              var yesterdayPercent = parseFloat((response.alllastnumber/(response.alllastnumber+response.enalllastnumber)).toFixed(2));
              var monthPercent = parseFloat((response.allnumber/(response.allnumber+response.enallnumber)).toFixed(2));
              $this.currentCluesNum.todayPercent = Number.isNaN(todayPercent)?0:todayPercent;
              $this.currentCluesNum.yesterdayPercent = Number.isNaN(yesterdayPercent)?0:yesterdayPercent;
              $this.currentCluesNum.monthPercent = Number.isNaN(monthPercent)?0:monthPercent;
              $this.drawCluesLiquidChart1();
              $this.drawCluesLiquidChart2();
              $this.drawCluesLiquidChart3();
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
    // 获取英文统计数据
    getEnCluesStatData(){
      var $this = this;
      $this.$store.dispatch("api/enCluesStatDataAction", null).then((response) => {
        if (response) {
          if (response.status) {
            console.log(response,"英文统计数据");
            var departTargetNum = [];
            response.departcount.forEach(function(item,index){
              item.tong.forEach(function(item1,index1){
                item1.date = item1.date+"\n"+item1.week.replace("星期","周");
              });
              if(index==0){
                item.isOn = true;
                $this.currentEnDepartData = item;
                $this.drawEnAreaChart();
              }else{
                item.isOn = false;
              }
              var itemData = {};
              itemData.id = item.dept_id;
              itemData.name = item.name;
              itemData.targetNum = item.daytargetnumber;
              itemData.dayNum = item.daynumber.todaynumber;
              var percent = parseFloat((item.daynumber.todaynumber/item.daytargetnumber).toFixed(2))
              itemData.percent = Number.isNaN(percent)?0:percent;
              departTargetNum.push(itemData);
            });
            $this.departTargetNum = departTargetNum;
            console.log($this.departTargetNum,"部门目标数据");
            $this.drawDepartTarget();
            $this.enCluesData = response;
            $this.currentCluesNum.today = response.alltoday;
            $this.currentCluesNum.yesterday = response.alllastnumber;
            $this.currentCluesNum.month = response.allnumber;
            var todayPercent = parseFloat((response.alltoday/(response.alltoday+response.enalltoday)).toFixed(2));
            var yesterdayPercent = parseFloat((response.alllastnumber/(response.alllastnumber+response.enalllastnumber)).toFixed(2));
            var monthPercent = parseFloat((response.allnumber/(response.allnumber+response.enallnumber)).toFixed(2));
            $this.currentCluesNum.todayPercent = Number.isNaN(todayPercent)?0:todayPercent;
            $this.currentCluesNum.yesterdayPercent = Number.isNaN(yesterdayPercent)?0:yesterdayPercent;
            $this.currentCluesNum.monthPercent = Number.isNaN(monthPercent)?0:monthPercent;
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
    // 获取中文地区统计数据
    getCnCluesAreaStatData(){
      var $this = this;
      var resultData = {};
      if($this.mapDate&&$this.mapDate.length>0){
        resultData.starttime = $this.mapDate[0];
        resultData.endtime = $this.mapDate[1];
      }else{
        resultData.starttime = "";
        resultData.endtime = "";
      }
      $this.$store.dispatch("api/cnCluesAreaStatDataAction", resultData).then((response) => {
        if (response) {
          if (response.status) {
            $this.cnCluesAreaData = response.data;
            var topTenAreaData = [];
            response.data.forEach(function(item,index){
              if(index<10){
                topTenAreaData.push(item);
              }
            });
            $this.topTenAreaData = topTenAreaData;
            console.log(response,"地区询盘统计");
            $this.drawCnCluesAreaChart();
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
    // 中文部门切换
    cnDepartChangeHandler(id){
      var $this = this;
      var cnCluesData = $this.cnCluesData;
      cnCluesData.departcount.forEach(function(item,index){
        if(item.dept_id == id){
          item.isOn = true;
          $this.currentCnDepartData = item;
          if($this.cnAreaPlot&&!$this.cnAreaPlot.chart.destroyed){
            $this.cnAreaPlot.destroy();
          }
          $this.drawCnAreaChart();
        }else{
          item.isOn = false;
        }
      });
      $this.cnCluesData = cnCluesData;
    },
    // 英文部门切换
    enDepartChangeHandler(id){
      var $this = this;
      var enCluesData = $this.enCluesData;
      enCluesData.departcount.forEach(function(item,index){
        if(item.dept_id == id){
          item.isOn = true;
          $this.currentEnDepartData = item;
          if($this.enAreaPlot&&!$this.enAreaPlot.chart.destroyed){
            $this.enAreaPlot.destroy();
          }
          $this.drawEnAreaChart();
        }else{
          item.isOn = false;
        }
      });
      $this.enCluesData = enCluesData;
    },
    // 中文各部门统计趋势图
    drawCnAreaChart(){
      var $this = this;
      if($this.currentCnDepartData.tong){
        const cnAreaPlot = new Area('cluesChart', {
          data:$this.currentCnDepartData.tong,    
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
              start: ['min', $this.currentCnDepartData.avgnumber],
              end: ['max', $this.currentCnDepartData.avgnumber],
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
              position:['max',$this.currentCnDepartData.avgnumber],
              top:true,
              html:"<span class='chart-font avg'><span class='txt-font'>"+$this.currentCnDepartData.avgnumber+"</span><i></i></span>",
              alignX:"left",
              alignY:"bottom",
            },
            // 目标线
            {
              type: 'line',
              start: ['min', $this.currentCnDepartData.daytargetnumber],
              end: ['max', $this.currentCnDepartData.daytargetnumber],
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
              position:['max',$this.currentCnDepartData.daytargetnumber],
              top:true,
              html:"<span class='chart-font target'><span class='txt-font'>"+$this.currentCnDepartData.daytargetnumber+"</span><i></i></span>",
              alignX:"left",
              alignY:"bottom",
            },
          ],
        });
        $this.cnAreaPlot = cnAreaPlot;
        cnAreaPlot.render();
      }
    },
    // 英文各部门统计趋势图
    drawEnAreaChart(){
      var $this = this;
      if($this.currentEnDepartData.tong){
        if($this.enAreaPlot&&!$this.enAreaPlot.chart.destroyed){
          $this.enAreaPlot.changeData($this.currentEnDepartData.tong);
        }else{
          const enAreaPlot = new Area('cluesChart', {
            data:$this.currentEnDepartData.tong,    
            xField: 'date',
            yField: 'xunnumber',
            appendPadding:[15,15,15,15],
            seriesField: '',
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
                start: ['min', $this.currentEnDepartData.avgnumber],
                end: ['max', $this.currentEnDepartData.avgnumber],
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
                position:['max',$this.currentEnDepartData.avgnumber],
                top:true,
                html:"<span class='chart-font avg'><span class='txt-font'>"+$this.currentEnDepartData.avgnumber+"</span><i></i></span>",
                alignX:"left",
                alignY:"bottom",
              },
              // 目标线
              {
                type: 'line',
                start: ['min', $this.currentEnDepartData.daytargetnumber],
                end: ['max', $this.currentEnDepartData.daytargetnumber],
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
                position:['max',$this.currentEnDepartData.daytargetnumber],
                top:true,
                html:"<span class='chart-font target'><span class='txt-font'>"+$this.currentEnDepartData.daytargetnumber+"</span><i></i></span>",
                alignX:"left",
                alignY:"bottom",
              },
            ],
          });
          $this.enAreaPlot = enAreaPlot;
          enAreaPlot.render();
        }
      }
    },
    // 中文地区询盘地图
    drawCnCluesAreaChart(){
      var $this = this;
      if($this.cnCluesAreaData.length>0){   
        fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/china-provinces.geo.json')
        .then(res => res.json())
        .then(GeoJSON => {
          const cnAreaMapChart = new Chart({
            container: 'areaMapChart',
            width: 760,
            height: 560,
          });
          cnAreaMapChart.scale({
            latitude: { sync: true },
            longitude: { sync: true }
          });
          cnAreaMapChart.tooltip({
            showTitle: false,
            showMarkers: false,
            shared: true,
          });
          // 同步度量
          cnAreaMapChart.scale({
            longitude: {
              sync: true
            },
            latitude: {
              sync: true
            }
          });
          cnAreaMapChart.axis(false);
          cnAreaMapChart.legend('trend', {
            position: 'bottom',
          });
          // 绘制中国地图背景
          var ds = new DataSet();
          const geoDv = ds.createView('back').source(GeoJSON, {type: 'GeoJSON'});
          const geoView = cnAreaMapChart.createView();
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
          $this.cnCluesAreaData.forEach(function(item,index){
            var itemData = {};
            itemData.name = item.name;
            itemData.value = item.number;
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
              if(obj.value <10){
                  obj.trend="0-10";
              }else if(obj.value <20 && obj.value>=10){
                  obj.trend="10-20";
              }else if(obj.value <30 && obj.value>=20){
                  obj.trend="20-30";
              }else if(obj.value <40 && obj.value>=30){
                  obj.trend="30-40";
              }else if(obj.value <50 && obj.value>=40){
                  obj.trend="40-50";
              }else if(obj.value <60 && obj.value>=50){
                  obj.trend="50-60";
              }else if(obj.value <100 && obj.value>=60){
                  obj.trend="60-100";
              }else if(obj.value <300 && obj.value>=100){
                  obj.trend="100-300";
              }else if(obj.value <500 && obj.value>=300){
                  obj.trend="300-500";
              }else if(obj.value <800 && obj.value>=500){
                  obj.trend="500-800";
              }else{
                  obj.trend="大于800";
              }
              return obj;
            }
          });
          console.log(userDv,"用户数据");
          const userView = cnAreaMapChart.createView();
          userView.data(userDv.rows);
          userView.scale({
            value: {
              alias: '数量'
            },
            name:{
              alias:"地区"
            }
          });
          userView.polygon()
            .position('longitude*latitude')
            .color('trend', '#0050B3-#1890FF-#BAE7FF')
            .tooltip('name*value')
            .style({
              fillOpacity: 0.85
            }).animate({
              leave: {
                animation: 'fade-out'
              }
            });
          userView.interaction('element-active');
          $this.cnAreaMapChart = cnAreaMapChart;
          cnAreaMapChart.render();
        });
      }
    },
    // 地区合计
    getSummaries(param){
      var $this = this;
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
        } else {
          sums[index] = '-';
        }
      });
      return sums;
    },
    // 中文地区日期选择改变事件
    dateRangeChangeHandler(e){
      var $this = this;
      if($this.cnAreaMapChart&&!$this.cnAreaMapChart.destroyed){
        $this.cnAreaMapChart.destroy();
        $this.getCnCluesAreaStatData();
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
        $this.liquidPlot1.changeData($this.currentCluesNum.todayPercent);
      }else{
        const liquidPlot1 = new Liquid('cluesLiquidChart1', {
          percent: $this.currentCluesNum.todayPercent,
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
                const text = `${$this.currentCluesNum.today}`;
                const textWidth = measureTextWidth(text, { fontSize: 60 });
                const scale = Math.min(d / textWidth, 1);
                return `<div style="width:${d}px;display:flex;align-items:center;justify-content:center;font-size:${scale}em;line-height:${
                  scale <= 1 ? 1 : 'inherit'
                }">${text}</div>`;
              },
            },
          },
        });
        liquidPlot1.render();
      }
    },
    // 今天、昨天、本月询盘水波图
    drawCluesLiquidChart2(){
      var $this = this;
      if($this.liquidPlot2&&!$this.liquidPlot2.chart.destroyed){
        $this.liquidPlot2.changeData($this.currentCluesNum.yesterdayPercent);
      }else{
        const liquidPlot2 = new Liquid('cluesLiquidChart2', {
          percent: $this.currentCluesNum.yesterdayPercent,
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
                const text = `${$this.currentCluesNum.yesterday}`;
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
        liquidPlot2.render();
      }
    },
    // 今天、昨天、本月询盘水波图
    drawCluesLiquidChart3(){
      var $this = this;
      if($this.liquidPlot3&&!$this.liquidPlot3.chart.destroyed){
        $this.liquidPlot3.changeData($this.currentCluesNum.monthPercent);
      }else{
        const liquidPlot3 = new Liquid('cluesLiquidChart3', {
          percent: $this.currentCluesNum.monthPercent,
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
                const text = `${$this.currentCluesNum.month}`;
                const textWidth = measureTextWidth(text, { fontSize: 60 });
                const scale = Math.min(d / textWidth, 1);
                return `<div style="width:${d}px;display:flex;align-items:center;justify-content:center;font-size:${scale}em;line-height:${
                  scale <= 1 ? 1 : 'inherit'
                }">${text}</div>`;
              },
            },
          },
        });
        liquidPlot3.render();
      }
    },
    // top10环形图
    drawTopTen(){
      var $this = this;
      if($this.topTenAreaData.length>0){
        if($this.pieSourcePlot&&!$this.pieSourcePlot.chart.destroyed){
          $this.pieSourcePlot.changeData($this.topTenAreaData);
        }else{
          const pieSourcePlot = new Pie('topTen', {
            data:$this.topTenAreaData,
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
              // content: '{value}',
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
            interactions: [{ type: 'element-selected' }, { type: 'element-active' }, { type: 'pie-statistic-active' }],
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
      if($this.departTargetNum.length>0){
        if($this.radialBarPlot&&!$this.radialBarPlot.chart.destroyed){
          $this.radialBarPlot.changeData($this.departTargetNum);
        }else{
          const radialBarPlot = new RadialBar('radialBarChart', {
            data:$this.departTargetNum,
            xField: 'name',
            yField: 'percent',
            width: 320,
            height:320,
            maxAngle: 360, //最大旋转角度,
            radius: 0.8,
            innerRadius: 0.2,
            xAxis: false,
            tooltip: {
              formatter: (datum) => {
                var dayNum = 0;
                $this.departTargetNum.forEach(function(item,index){
                  if(item.name == datum.name){
                    dayNum = item.dayNum;
                  }
                })
                return { name: '今日总数', value: dayNum };
              },
            },
            legend: {
              position: 'left',
            },
            colorField: 'name',
            color: ['#FFbcb8', '#FFe0b0', '#bfeec8', '#5B8FF9', '#61DDAA'],
            barBackground: {},
            barStyle: { lineCap: 'round' },
            interactions: [{ type: 'element-active' }],
          });
          $this.radialBarPlot = radialBarPlot;
          radialBarPlot.render();
          radialBarPlot.on('element:click', (...args) => {
            console.log(...args);
          });
        }
      }
    },
    // 中英文数据分析切换
    cnEnStatChange(){
      var $this = this;
      if($this.language=="Module_cnStat"){
        $this.getCnCluesStatData();
      }else{
        $this.getEnCluesStatData();
      }
    },
  }
}
</script>
<style lang="scss" scoped>
</style>