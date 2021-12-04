<template>
  <div class="page-root scroll-panel personAnalysis" ref="boxPane">
      <div class="personTopTab" ref="personTopTabPane">
           <div class="chooseDepart flex-box">
                <span class="choosetit">部门选择：</span>
                <div class="departItems flex-content">
                <span v-bind:class="item.isOn?'active':''" v-for="(item,index) in department" :key="index" v-on:click="departChange(item.id)">{{item.name}}</span>
                </div>
           </div>
           <div class="choosePerson">
                <div class="decor"></div>
                <div class="departItems">
                    <p class="item-checkbox" v-bind:class="item.isOn?'active':''" v-for="(item,index) in choosePerson" :key="index" v-on:click="PersonChange(item.id)"><i></i><span>{{item.name}}</span></p>
                </div>
           </div>
      </div>
      <div class="middleBox">          
          <div class="personalCard" :class="scrBool?'fixed':''" :style='"top:"+scrHeight'>
              <div class="personMsg">
                  <div class="personAvatar">
                      <img :src="userBasicInfo.headimg" alt="" />
                  </div>
                  <h3 class="personName">{{userBasicInfo.name}}</h3>
                  <p class="workTime">在河南红星机器有限公司工作了{{userBasicInfo.comday}}天</p>
                  <div class="rate_num">
                      <span class="num02">{{userBasicInfo.postionname}}</span>
                  </div>
              </div>
              <div class="personMore">
                  <div class="pHistory" @click="handleHistory">历史成就</div>
                  <div class="pCompare" @click="handleContrast(searchData.dept_id,searchData.id)">对比</div>
              </div>
              <div class="personDepart">
                  <div class="pdname">
                      <p><span>部门：</span>{{userBasicInfo.depart}}</p>
                  </div>
                  <div class="pdsub">
                      <p><span>入职时间：</span>{{userBasicInfo.comtime}}</p>
                      <p><span>主管：</span>{{userBasicInfo.manangename}}</p>
                  </div>
              </div>
              <div class="clear:both"></div>
              <div class="monthResult">
                  <div class="mtit">个人{{userBasicInfo.userTimeMonth}}月份数据表现：</div>
                  <ul class="monthUl">
                      <li>
                          <div class="mon01">询盘个数</div>
                          <span class="res">{{userBasicInfo.userMonthcount}}</span>
                      </li>
                      <li>
                          <div class="mon02">成交积分</div>
                          <span class="res">{{userBasicInfo.userMonthscore}}</span>
                      </li>
                      <li>
                          <div class="mon03">100万成交个数</div>
                          <span class="res">{{userBasicInfo.userMonthanumber}}</span>
                      </li>
                      <li>
                          <div class="mon04">个人奖金 (元)</div>
                          <span class="res">{{userBasicInfo.userMonthmoney}}</span>
                      </li>
                  </ul>
              </div>
          </div>
          <div class="middleRight">              
              <div class="personYearChart">
                  <div class="yearChartTab">
                      <div class="yearTabItem" :class="item.isOn?'active':''" v-for="(item,index) in ChartTab" :key='index' @click="handleTab(item.tap)">
                            <p class="yearTabTitle">{{item.name}}<span>{{item.unit}}</span></p>
                            <div class="yearNum">{{item.totalNum}}</div>
                            <div class="numCompare">环比上年同期<span class="numsep" :class="item.totalNum-item.lasttotalNum>0?'':'numdec'">{{Math.abs(item.totalNum-item.lasttotalNum)}}</span>
                            </div>
                      </div>
                  </div>
                  <div class="chartContainer">
                      <div id="inquirybox"></div>
                      <div class="showLine">
                        <span class="line1">2021年</span>
                        <span class="line2">2020年</span>
                        <span class="line3">月平均值</span>
                      </div>
                  </div>
              </div>                          
              <div class="personScoreNum">
                  <h3 class="stitle">个人成绩统计</h3>
                  <div class="scoreTable">
                        <el-table
                            :data="personCount"
                            border
                            style="width: 100%">
                            <el-table-column
                                prop="date"
                                label="日期">
                            </el-table-column>
                            <el-table-column
                                prop="xunnumber"
                                label="询盘个数">
                            </el-table-column>
                            <el-table-column
                                prop="score"
                                label="成交积分">
                            </el-table-column>
                            <el-table-column
                                prop="anumber"
                                label="百万个数">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.anumber>0">
                                        <div class="awardicon" v-for="(item,index) in scope.row.anumber" :key="index"></div>
                                    </div>
                                    <div v-else class="line"></div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="money"
                                label="个人奖金">
                                <template slot-scope="scope">
                                    {{scope.row.money.toFixed(1)}}
                                </template>
                            </el-table-column>
                        </el-table>
                  </div>
                  <div class="scoreSepcount">
                      <ul class="countul">
                          <li class="i1">
                              <p>最高月询盘数量</p>
                              <span>{{maxPersonCount.maxxun}}</span>
                          </li>
                          <li class="i2">
                              <p>最高月成交积分</p>
                              <span>{{maxPersonCount.maxscore}}</span>
                          </li>
                          <li class="i3">
                              <p>最高月成交百万个数</p>
                              <span>{{maxPersonCount.maxanum}}</span>
                          </li>
                          <li class="i4">
                              <p>最高月奖金</p>
                              <span>{{maxPersonCount.maxmoney}}</span>
                          </li>
                      </ul>
                  </div>
              </div>
          </div>
      </div>
      <el-dialog custom-class="history-dialog" :visible.sync="dialogFormVisible" :before-close="handleClose" width="750px">
            <div class="historyWho">
                <div class="user_img">
                    <img :src="userBasicInfo.headimg" alt="" />
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
import { Mix } from '@antv/g2plot';
export default {
  name: "cnSinglePerson",
  data() {
    return {
        scrHeight:'0px',//滚动top
        scrBool:false,//滚动样式显隐
        dialogFormVisible:false,
        historyDate:[],
        department:[],//部门列表
        choosePerson:[], //组员列表       
        currentTimeMonth:'',
        userBasicInfo:{
            headimg:'',
            comtime:"",//入职时间
            depart:"",//部门
            comday:0,//入职时长
            manangename:"",//主管名字
            name:"",//名字
            postionname:"",//职位
            userTimeMonth:'',//月份
            userMonthcount:'',//月询盘数据
            userMonthscore:'',//月成交积分数据
            userMonthanumber:'',//月成交个数数据
            userMonthmoney:'',//月奖金数据
        },
        personCount:[],//个人成绩列表
        maxPersonCount:{},
        ChartTab:[],
        currentTab:'enquirie',
        currentMix:[],
        MixData:{},
        searchData:{
            dept_id:'',
            id:'',
        },
        MixChart:null,
    };
  },
  created() {
    var $this = this;
    $this.searchData.dept_id = parseInt($this.$route.query.deptId);
    $this.searchData.id = parseInt($this.$route.query.itemId);
    $this.initData();
  },
  mounted(){
      const $this = this;
      // 监听竖向滚动条滚动事件
      window.addEventListener('scroll',this.handleScroll,true);
  },
  destroyed(){
    window.removeEventListener('scroll', this.handleScroll,true);//监听页面滚动事件
  },
  methods: {
    // loading自定义
    loadingFun(){
      var $this = this;
      $this.isLoading = $this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
    },
    // 初始化数据
    initData() {
      var $this = this;
      if($this.searchData.id&&$this.searchData.id!=''){
        $this.loadingFun();
        $this.getCnDepartList();
        $this.getCnPersoncountinfo();
      }else{
        $this.$message({
            showClose: true,
            message:'请选择组员！',
            type: "error",
            duration: 6000
        });
        $this.$router.push({path:"/stat/en/memberAnalysis"});
      }
    },
    //获取部门信息
    getCnDepartList(){
      var $this = this;
      $this.$store.dispatch("api/getEnDepartAction").then((res) => {
          if (res) {
            if (res.status) {
                if(res.data&&res.data.length>0){
                    var department=[];
                    res.data.forEach(function(item,index){
                        var objItem={};
                        objItem.name=item.name;
                        objItem.id=item.id;
                        objItem.isOn=false;
                        if($this.searchData.dept_id==item.id){
                            objItem.isOn=true;
                        }
                        department.push(objItem);
                    });
                    $this.department=department;
                }
                $this.getCnPersonlist();
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
    //获取部门下组员信息
    getCnPersonlist(){
      var $this = this;
      var searchData={};
      searchData.dept_id=$this.searchData.dept_id;
      $this.$store.dispatch("api/getEnPersonlistAction",searchData).then((res) => {
          if (res) {
            if (res.status) {
                if(res.ulist&&res.ulist.length>0){
                    var choosePerson=[];
                    res.ulist.forEach(function(item,index){
                        var objItem={};
                        objItem.name=item.name;
                        objItem.id=item.id;
                        objItem.isOn=false;
                        if($this.searchData.id==item.id){
                            objItem.isOn=true;
                        }
                        choosePerson.push(objItem);
                    });
                    $this.choosePerson=choosePerson;
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
    //清空数据
    emptyData(){
        var $this=this;
        $this.userBasicInfo.headimg='';
        $this.userBasicInfo.comtime='';
        $this.userBasicInfo.depart='';
        $this.userBasicInfo.comday='';
        $this.userBasicInfo.manangename='';
        $this.userBasicInfo.name='';
        $this.userBasicInfo.postionname='';
        $this.userBasicInfo.userTimeMonth='';
        $this.userBasicInfo.userMonthcount='';
        $this.userBasicInfo.userMonthscore='';
        $this.userBasicInfo.userMonthanumber='';
        $this.userBasicInfo.userMonthmoney='';
        $this.personCount=[];
        $this.maxPersonCount.maxxun='';
        $this.maxPersonCount.maxscore='';
        $this.maxPersonCount.maxanum='';
        $this.maxPersonCount.maxmoney='';
        $this.currentTab='enquirie';
        $this.personCount=[];
        $this.ChartTab=[];
        $this.currentMix=[];
        $this.MixData={};
    },
    //组员分析详情页
    getCnPersoncountinfo(){
      var $this = this;
      $this.emptyData();
      var searchData={};
      searchData.id=$this.searchData.id;
      $this.MixData=[];
      if ($this.MixChart && !$this.MixChart.chart.destroyed) {
          $this.MixChart.chart.destroy();
      }
      $this.$store.dispatch("api/getEnPersoncountinfoAction",searchData).then((res) => {
          if (res) {
            if (res.status) {
                //默认当前月份
                var userTimeMonth=$this.getMonth();
                $this.userBasicInfo.userTimeMonth=userTimeMonth.split('-')[1];
                //年度总询盘个数
                var ChartTab=[];
                var currentMix=[];
                var MixData={
                    nowYear:[],
                    lastYear:[],
                }
                if(res.yearcount&&res.yearcount.length>0){
                    var totalNum=0;
                    var lasttotalNum=0;
                    var currentMixItem={
                        currentTab:'enquirie',
                        nowYear:[],
                        lastYear:[],
                    }               
                    res.yearcount.forEach(function(item,index){
                        var nowYearObj={};
                        var lastYearObj={};
                        if(item.date==userTimeMonth){
                            $this.userBasicInfo.userMonthcount=item.xunnumber;
                        }
                        totalNum=totalNum+item.xunnumber;
                        lasttotalNum=lasttotalNum+item.lastxunnumber;
                        nowYearObj.time=item.date;
                        nowYearObj.number=item.xunnumber;
                        lastYearObj.time=item.lastdate;
                        lastYearObj.number=item.lastxunnumber;
                        if($this.currentTab=='enquirie'){
                            MixData.nowYear.push(nowYearObj);
                            MixData.lastYear.push(lastYearObj);
                        }
                        currentMixItem.nowYear.push(nowYearObj);
                        currentMixItem.lastYear.push(lastYearObj);
                    });
                    var ChartTabObj={};
                    ChartTabObj.totalNum=totalNum.toFixed(2)*1;
                    ChartTabObj.lasttotalNum=lasttotalNum.toFixed(2)*1;
                    ChartTabObj.name='年度总询盘个数';
                    ChartTabObj.unit='（单位：个）';
                    ChartTabObj.tap='enquirie'; 
                    ChartTabObj.isOn=true;
                    ChartTab.push(ChartTabObj);
                    currentMix.push(currentMixItem);
                }
                //年度总成交积分
                if(res.yearscore&&res.yearscore.length>0){
                    var totalNum=0;
                    var lasttotalNum=0;
                    var currentMixItem={
                        currentTab:'clinchScore',
                        nowYear:[],
                        lastYear:[],
                    }               
                    res.yearscore.forEach(function(item,index){
                        var nowYearObj={};
                        var lastYearObj={};
                        if(item.date==userTimeMonth){
                            $this.userBasicInfo.userMonthscore=item.score;
                        }
                        totalNum=totalNum+item.score;
                        lasttotalNum=lasttotalNum+item.lastscore;
                        nowYearObj.time=item.date;
                        nowYearObj.number=item.score;
                        lastYearObj.time=item.lastdate;
                        lastYearObj.number=item.lastscore;
                        currentMixItem.nowYear.push(nowYearObj);
                        currentMixItem.lastYear.push(lastYearObj);
                    });
                    var ChartTabObj={};
                    ChartTabObj.totalNum=totalNum.toFixed(2)*1;
                    ChartTabObj.lasttotalNum=lasttotalNum.toFixed(2)*1;
                    ChartTabObj.name='年度总成交积分';
                    ChartTabObj.unit='（单位：分）';
                    ChartTabObj.tap='clinchScore'; 
                    ChartTabObj.isOn=false;
                    ChartTab.push(ChartTabObj); 
                    currentMix.push(currentMixItem); 
                }
                //年度100万成交个数
                if(res.yearanumber&&res.yearanumber.length>0){
                    var totalNum=0;
                    var lasttotalNum=0; 
                    var currentMixItem={
                        currentTab:'clinchNum',
                        nowYear:[],
                        lastYear:[],
                    }                
                    res.yearanumber.forEach(function(item,index){
                        var nowYearObj={};
                        var lastYearObj={};
                        if(item.date==userTimeMonth){
                            $this.userBasicInfo.userMonthanumber=item.anumber;
                        }
                        totalNum=totalNum+item.anumber;
                        lasttotalNum=lasttotalNum+item.lastanumber;
                        nowYearObj.time=item.date;
                        nowYearObj.number=item.anumber;
                        lastYearObj.time=item.lastdate;
                        lastYearObj.number=item.lastanumber;
                        currentMixItem.nowYear.push(nowYearObj);
                        currentMixItem.lastYear.push(lastYearObj);
                    });
                    var ChartTabObj={};
                    ChartTabObj.totalNum=totalNum.toFixed(2)*1;
                    ChartTabObj.lasttotalNum=lasttotalNum.toFixed(2)*1;
                    ChartTabObj.name='年度100万成交个数';
                    ChartTabObj.unit='（单位：个）';
                    ChartTabObj.tap='clinchNum';  
                    ChartTabObj.isOn=false;
                    ChartTab.push(ChartTabObj); 
                    currentMix.push(currentMixItem);
                }
                //年度总奖金
                if(res.yearmoney&&res.yearmoney.length>0){
                    var totalNum=0;
                    var lasttotalNum=0; 
                    var currentMixItem={
                        currentTab:'money',
                        nowYear:[],
                        lastYear:[],
                    }               
                    res.yearmoney.forEach(function(item,index){
                        var nowYearObj={};
                        var lastYearObj={};
                        if(item.date==userTimeMonth){
                            $this.userBasicInfo.userMonthmoney=item.money;
                        }
                        totalNum=totalNum+item.money;
                        lasttotalNum=lasttotalNum+item.lastmoney;
                        nowYearObj.time=item.date;
                        nowYearObj.number=item.money;
                        lastYearObj.time=item.lastdate;
                        lastYearObj.number=item.lastmoney;
                        currentMixItem.nowYear.push(nowYearObj);
                        currentMixItem.lastYear.push(lastYearObj);
                    });
                    var ChartTabObj={};
                    ChartTabObj.totalNum=totalNum.toFixed(2)*1;
                    ChartTabObj.lasttotalNum=lasttotalNum.toFixed(2)*1;
                    ChartTabObj.name='年度总奖金';
                    ChartTabObj.unit='（单位：元）';
                    ChartTabObj.tap='money';
                    ChartTabObj.isOn=false;
                    ChartTab.push(ChartTabObj);
                    currentMix.push(currentMixItem);  
                }
                $this.MixData=MixData;
                // 组合图表
                $this.getYearInquiryChart();
                $this.currentMix=currentMix;
                //组员基本信息
                $this.userBasicInfo.comtime=res.userinfo.comtime;
                $this.userBasicInfo.depart=res.userinfo.depart;
                $this.userBasicInfo.comday=res.userinfo.comday;
                $this.userBasicInfo.manangename=res.userinfo.manangename;
                $this.userBasicInfo.name=res.userinfo.name;
                $this.userBasicInfo.postionname=res.userinfo.postionname;
                $this.userBasicInfo.headimg=res.userinfo.headimg;
                $this.ChartTab=ChartTab;
                $this.ChartTabItem=ChartTab
                // 个人成绩统计
                if(res.personcount&&res.personcount.length>0){
                  var personCount=[];
                  var maxxun=0;
                  var maxscore=0;
                  var maxanum=0;
                  var maxmoney=0;
                  res.personcount.forEach(function(item,index){
                      var objItem={};
                      item.date=item.date.split('-')[1]+'月';
                      objItem.date=item.date;
                      objItem.xunnumber=item.xunnumber;
                      objItem.score=item.score;
                      objItem.anumber=item.anumber;
                      objItem.money=item.money;
                      personCount.push(objItem);
                      if(maxxun<item.xunnumber){
                        maxxun=item.xunnumber
                      }
                      if(maxscore<item.score){
                        maxscore=item.score
                      }
                      if(maxanum<item.anumber){
                        maxanum=item.anumber
                      }
                      if(maxmoney<item.money){
                        maxmoney=item.money
                      }
                  });
                  $this.maxPersonCount.maxxun=maxxun;
                  $this.maxPersonCount.maxscore=maxscore;
                  $this.maxPersonCount.maxanum=maxanum;
                  $this.maxPersonCount.maxmoney=maxmoney;
                  $this.personCount=personCount;
                }
                $this.isLoading.close();
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
    // 获取默认时间
    getMonth(){
      const start = new Date();
      var startYear = start.getFullYear();
      var startMonth = start.getMonth() +1;
      startMonth = startMonth<10?'0'+startMonth:startMonth;
      var startDate = startYear+"-"+startMonth;
      return startDate;
    },
    // 点击部门获取部门ID
    departChange(valData){
        var $this=this;
        $this.searchData.dept_id=valData;
        $this.department.forEach(function(item,index){
            item.isOn=false;
            if(item.id==valData){
              item.isOn=true;
            }
        });
        $this.getCnPersonlist();
    },
    // 点击组员获取组员ID
    PersonChange(valData){
        var $this=this;
        $this.loadingFun();
        $this.searchData.id=valData;
        $this.choosePerson.forEach(function(item,index){
            item.isOn=false;
            if(item.id==valData){
              item.isOn=true;
            }
        });
        $this.getCnPersoncountinfo();
    },
    // 点击切换
    handleTab(valData){
        var $this=this;
        var ChartTab=$this.ChartTab;
        $this.MixData=[];
        if(ChartTab&&ChartTab.length>0){
            ChartTab.forEach(function(item,index){
                item.isOn=false;
                if(item.tap==valData){
                    item.isOn=true;
                }
            });
        }
        $this.ChartTab=ChartTab;
        $this.currentTab=valData;
        var MixData={
            nowYear:[],
            lastYear:[],
        }
        if($this.currentMix&&$this.currentMix.length>0){
            $this.currentMix.forEach(function(item,index){
                if(item.currentTab==valData){
                    MixData.nowYear=item.nowYear;
                    MixData.lastYear=item.lastYear;
                }
            });
        }
        $this.MixData=MixData;        
        if ($this.MixChart && !$this.MixChart.chart.destroyed) {
            $this.MixChart.chart.destroy();
        }
        $this.getYearInquiryChart();
    },
    // 组合图表
    getYearInquiryChart(){
        var $this = this;
        var nowyear = $this.MixData.nowYear;
        var lastyear = $this.MixData.lastYear;
        //计算y轴显示的最大数值
        var maxnum = 0;
        for(var i=0;i<nowyear.length;i++){
            if(nowyear[i].number > maxnum){
                maxnum = nowyear[i].number;
            }
        }
        for(var i=0;i<lastyear.length;i++){
            if(lastyear[i].number > maxnum){
                maxnum = lastyear[i].number;
            }
        }
        const MixChart = new Mix('inquirybox', {
        tooltip: { 
            shared: true
        },      
        syncViewPadding: true,
        plots: [
            {
                type: 'column',
                options: {
                    data: nowyear,
                    xField: 'time',
                    yField: 'number',
                    appendPadding:[15,0,0,0],
                    minColumnWidth: 22,
                    maxColumnWidth: 22,
                    yAxis: {
                        grid: {
                            line: {
                                style: {
                                    stroke: '#f2f2f2',
                                },
                            
                            },
                        },
                        tickCount: 5,
                        max:maxnum,
                        label:{
                            style:{
                                fontSize: 12,
                                fill: "#b3b3b3"
                            }
                        }
                    },
                    xAxis: {
                        label:{
                            style:{
                                fontSize: 12,
                                fill: "#b3b3b3"
                            }
                        }
                    },
                    meta: {
                        time: {
                            formatter:(item)=>{
                                return item
                            }
                        },
                        number: {
                            alias: '今年询盘',
                        },
                    },
                    label: {
                        position: 'top',
                    },
                    annotations: [
                        {
                            type: 'line',
                            start: ['min', 'median'],
                            end: ['max', 'median'],
                            style: {
                                stroke: '#5fce45',
                                lineWidth: 2,
                                lineDash: [8, 4]
                            },
                        },
                    ],
                    columnStyle: {
                        fill: 'l(270) 0:#b9cff4 0.5:#a0bff4 1:#82adf2'
                    },
                },
            },
            {
                type: 'area', 
                options: {
                    data: lastyear,
                    xField: 'time',
                    yField: 'number',
                    areaStyle: () => {
                        return {
                            fill: 'l(270) 0:#ffffff 0.5:#efd587 1:#f1cb56',
                        };
                    },
                    color: "#f3be1c",
                    line:{
                        color: "#f3be1c",
                        size:2
                    },
                    point:{
                        size: 4,
                        shape: "circle",
                        style: {
                            fill: '#fff',
                            stroke: '#f3be1c',
                            lineWidth:  1,
                        },
                    },
                    meta: {
                        time: {
                            formatter:(item)=>{
                                return item
                            }
                        },
                        number: {
                            alias: '去年询盘',
                        },
                    },
                    yAxis: {
                        grid: {
                            line: {
                                style: {
                                    stroke: '#f2f2f2',
                                },
                            
                            },
                        },
                        tickCount: 5,
                        max: maxnum,
                        label:{
                            style:{
                                fontSize: 12,
                                fill: "#b3b3b3",
                                fillOpacity: 1
                            }
                        }
                    },
                    xAxis:false,
                }
            }
        ],
        });
        $this.MixChart=MixChart;
        MixChart.render();
    },
    // 跳转到对比页
    handleContrast(deptId,itemId){
      var $this=this;
      var routeUrl =  $this.$router.resolve({path: "/stat/en/memberAnalysis/comparePerson",query: {deptId:deptId,itemId:itemId}});
      window.open(routeUrl.href,'_blank');
    },
    // 组员个人历史成就
    handleHistory(){
      var $this=this;
      $this.dialogFormVisible = true;
      var searchData={};
      searchData.id=$this.searchData.id;
      searchData.type=2;
      $this.$store.dispatch("api/getPersonHistoryAction",searchData).then((res) => {
          if (res) {
            if (res.status) {
              if(res.data&&res.data.length>0){
                  var historyDate=[];
                  res.data.forEach(function(item,index){
                      var objItem={};
                      objItem.addtime=item.addtime;
                      objItem.content=item.content;
                      objItem.tap='成交TOP1';
                      objItem.icon='icon01';
                      if(item.content.indexOf("突破")>=0){
                          objItem.tap='询盘突破峰值';
                          objItem.icon='icon02';
                      }
                      if(item.content.indexOf("历史新高")>=0){
                          objItem.tap='询盘突破峰值';
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
    // 关闭弹窗
    handleClose(){
      var $this = this;
      $this.dialogFormVisible = false;
      $this.historyDate=[];
    },
    // 竖向滚动条滚动事件
    handleScroll(event){
      var $this = this;
      var scrTop = event.target.scrollTop;
      var personTopTabHeight = $this.$refs.personTopTabPane.offsetHeight+20+5;
      if(scrTop>=personTopTabHeight){
         $this.scrHeight=scrTop-personTopTabHeight+'px';
         $this.scrBool=true;
      }else{
         $this.scrHeight='auto';
         $this.scrBool=false;
      }      
    }
  }
}


</script>