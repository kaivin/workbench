<template>
  <div class="page-root scroll-panel home-index" ref="boxPane">
    <el-card class="box-card scroll-card" shadow="hover">
      <div class="card-content" ref="tableContent">
        <div class="item-row flex-box">
          <div class="item-column flex-content" v-if="permitModules.includes('Module_cnStat')">
            <div class="item-module">
              <div class="module-header"><h2>中文总计</h2></div>
              <div class="module-body">
                <div class="num-list">
                  <p><span>今天</span><strong>{{cnCluesData.alltoday}}</strong></p>
                  <p><span>昨天</span><strong>{{cnCluesData.alllastnumber}}</strong></p>
                  <p><span>本月</span><strong>{{cnCluesData.allnumber}}</strong></p>
                </div>
              </div>
            </div>
          </div>
          <div class="item-column flex-content" v-if="permitModules.includes('Module_enStat')">
            <div class="item-module">
              <div class="module-header"><h2>英文总计</h2></div>
              <div class="module-body">
                <div class="num-list">
                  <p><span>今天</span><strong>{{enCluesData.alltoday}}</strong></p>
                  <p><span>昨天</span><strong>{{enCluesData.alllastnumber}}</strong></p>
                  <p><span>本月</span><strong>{{enCluesData.allnumber}}</strong></p>
                </div>
              </div>
            </div>
          </div>
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
                            <span class="txt-icon" v-bind:class="item1.is_new==1?'update':'new'">{{item1.is_new==1?'改':'新'}}</span>
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
        <div class="item-row" v-if="permitModules.includes('Module_cnStat')">
          <div class="item-column">
            <div class="item-module stat-module">
              <div class="module-header">
                <h2>中文统计</h2>
                <ul class="depart-list">
                  <li class="item-depart" v-for="item in cnCluesData.departcount" v-bind:key="item.dept_id" v-bind:class="item.isOn?'active':''" v-on:click="cnDepartChangeHandler(item.dept_id)"><span>{{item.name}}</span></li>
                </ul>
              </div>
              <div class="module-body">
                <div class="stat-panel flex-box">
                  <div class="depart-result">
                    <div class="depart-total">
                      <div class="result-panel">
                        <div class="result-list">
                          <p><span>今天</span><strong v-if="currentCnDepartData.daynumber">{{currentCnDepartData.daynumber.todaynumber}}</strong></p>
                          <p><span>昨天</span><strong v-if="currentCnDepartData.daynumber">{{currentCnDepartData.daynumber.lastdaynumber}}</strong></p>
                          <p><span>本月</span><strong v-if="currentCnDepartData.daynumber">{{currentCnDepartData.daynumber.monthnumber}}</strong></p>
                        </div>
                      </div>
                    </div>
                    <div class="history-high-light">
                      <div class="list-panel">
                        <p class="flex-box"><span class="txt-title flex-content">本月平均数</span><span class="txt-num">{{currentCnDepartData.avgmonthnumber}}</span></p>
                        <p class="flex-box"><span class="txt-title flex-content">本月单日最高询盘数</span><span class="txt-num">{{currentCnDepartData.daymaxnumber}}</span></p>
                        <p class="flex-box"><span class="txt-title flex-content">历史单日最高询盘数</span><span class="txt-num">{{currentCnDepartData.daymaxnumber}}</span></p>
                        <p class="flex-box">
                          <span class="txt-title flex-content">距离目标差距</span>
                          <span class="txt-num" v-if="currentCnDepartData.daynumber">{{currentCnDepartData.daynumber.todaynumber - currentCnDepartData.daytargetnumber>0?'+':''}}{{currentCnDepartData.daynumber.todaynumber - currentCnDepartData.daytargetnumber}}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="depart-chart flex-content">
                    <div class="canvas-wrap">
                      <div class="chart-title">
                        <h2>近30天询盘趋势</h2>
                        <ul class="line-list">
                          <li class="line1">询盘数量</li>
                          <li class="line2">平均值</li>
                          <li class="line3">目标线</li>
                        </ul>
                      </div>
                      <div id="cnCluesChart" class="chart-canvas"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="item-row" v-if="permitModules.includes('Module_enStat')">
          <div class="item-column">
            <div class="item-module stat-module">
              <div class="module-header">
                <h2>英文统计</h2>
                <ul class="depart-list">
                  <li class="item-depart" v-for="item in enCluesData.departcount" v-bind:key="item.dept_id" v-bind:class="item.isOn?'active':''" v-on:click="enDepartChangeHandler(item.dept_id)"><span>{{item.name}}</span></li>
                </ul>
              </div>
              <div class="module-body">
                <div class="stat-panel flex-box">
                  <div class="depart-result">
                    <div class="depart-total">
                      <div class="result-panel">
                        <div class="result-list">
                          <p><span>今天</span><strong v-if="currentEnDepartData.daynumber">{{currentEnDepartData.daynumber.todaynumber}}</strong></p>
                          <p><span>昨天</span><strong v-if="currentEnDepartData.daynumber">{{currentEnDepartData.daynumber.lastdaynumber}}</strong></p>
                          <p><span>本月</span><strong v-if="currentEnDepartData.daynumber">{{currentEnDepartData.daynumber.monthnumber}}</strong></p>
                        </div>
                      </div>
                    </div>
                    <div class="history-high-light">
                      <div class="list-panel">
                        <p class="flex-box"><span class="txt-title flex-content">本月平均数</span><span class="txt-num">{{currentEnDepartData.avgmonthnumber}}</span></p>
                        <p class="flex-box"><span class="txt-title flex-content">本月单日最高询盘数</span><span class="txt-num">{{currentEnDepartData.daymaxnumber}}</span></p>
                        <p class="flex-box"><span class="txt-title flex-content">历史单日最高询盘数</span><span class="txt-num">{{currentEnDepartData.daymaxnumber}}</span></p>
                        <p class="flex-box">
                          <span class="txt-title flex-content">距离目标差距</span>
                          <span class="txt-num" v-if="currentEnDepartData.daynumber">{{currentEnDepartData.daynumber.todaynumber - currentEnDepartData.daytargetnumber>0?'+':''}}{{currentEnDepartData.daynumber.todaynumber - currentEnDepartData.daytargetnumber}}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="depart-chart flex-content">
                    <div class="canvas-wrap">
                      <div class="chart-title">
                        <h2>近30天询盘趋势</h2>
                        <ul class="line-list">
                          <li class="line1">询盘数量</li>
                          <li class="line2">平均值</li>
                          <li class="line3">目标线</li>
                        </ul>
                      </div>
                      <div id="enCluesChart" class="chart-canvas"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="item-row" v-if="permitModules.includes('Module_cnStat')">
          <div class="item-column">
            <div class="item-module stat-module">
              <div class="module-header">
                <h2>中文地区统计</h2>
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
              </div>
              <div class="module-body">
                <div class="map-panel flex-box">
                  <div class="map-chart">
                    <div id="areaMapChart" class="chart-canvas"></div>
                  </div>
                  <div class="flex-content table-panel">
                    <div class="table-chart">
                      <el-table
                        border
                        ref="simpleTable"
                        :data="cnCluesAreaData"
                        tooltip-effect="dark"
                        stripe
                        height="480"
                        style="width: 100%;"
                        row-key="id"
                        show-summary
                        :summary-method="getSummaries"
                        :default-sort = "{prop: 'number', order: 'descending'}"
                        >
                        <el-table-column
                          prop="name"
                          label="地区"
                          >
                        </el-table-column>
                        <el-table-column
                          prop="number"
                          label="数量"
                          sortable
                          >
                        </el-table-column>
                      </el-table>
                    </div>
                  </div>
                </div>
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
import { Line,Area } from '@antv/g2plot';
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
  updated(){
    var $this = this;
    $this.$nextTick(function () {
      if($this.permitModules.includes('Module_cnStat')){
        $this.$refs.simpleTable.doLayout();
      }
    });
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
            if($this.permitModules.includes('Module_cnStat')){
              $this.getCnCluesStatData();
              $this.getToday();
              $this.mapDate = [$this.today,$this.today];
              $this.getCnCluesAreaStatData();
            }
            if($this.permitModules.includes('Module_enStat')){
              $this.getEnCluesStatData();
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
            });
            $this.cnCluesData = response;
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
            });
            $this.enCluesData = response;
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
            console.log(response,"地区询盘统计");
            $this.drawCnCluesAreaChart();
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
        const cnAreaPlot = new Area('cnCluesChart', {
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
            max:$this.currentCnDepartData.daytargetnumber+1,
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
        const enAreaPlot = new Area('enCluesChart', {
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
            max:$this.currentEnDepartData.daytargetnumber+1,
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
                lineDash: [2, 2],
                lineWidth: 3,
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
                lineWidth: 2,
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
            height: 480,
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
            position: 'right',
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
            .color('trend', '#BAE7FF-#1890FF-#0050B3')
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
    getToday(){
        var $this = this;
        const date = new Date();
        date.setTime(date.getTime());
        var today = date.getFullYear()+"-"+(date.getMonth()+1>9?date.getMonth()+1:'0'+(date.getMonth()+1))+"-"+(date.getDate()+1>9?date.getDate():'0'+(date.getDate()));
        $this.today = today;
    },
  }
}
</script>
<style lang="scss" scoped>
</style>