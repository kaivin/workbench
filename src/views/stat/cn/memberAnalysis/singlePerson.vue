<template>
  <div class="page-root scroll-panel personAnalysis" ref="boxPane">
      <div class="personTopTab" ref="personTopTabPane">
           <div class="chooseDepart flex-box">
                <span class="choosetit">部门选择：</span>
                <div class="departItems flex-content">
                <span v-bind:class="item.isOn?'active':''" v-for="(item,index) in department" :key="index" v-on:click="departChange(item.id)">{{item.name}}</span>
                <p class="departItemsYear">                
                    <span @click="changeType(1)" class="btn-item" :class="type == 1?'hover':''">{{prevYear}}年</span>
                    <span @click="changeType(2)" class="btn-item" :class="type == 2?'hover':''">{{nowYear}}年</span>
                </p>
                </div>
           </div>
           <div class="choosePerson" :class="searchData.dept_id?'active':''">
                <div class="departItems">
                    <p class="item-checkbox" v-bind:class="item.isOn?'active':''" v-for="(item,index) in choosePerson" :key="index" v-on:click="PersonChange(item.id)"><i></i><span>{{item.name}}</span></p>
                </div>
           </div>
      </div>
      <div class="middleBox">          
          <div class="personalCard" :class="scrBool?'fixed':''" :style='"top:"+scrHeight'>
              <div class="personMsg">
                  <div class="personAvatar">
                       <span v-if="userBasicInfo.headimg"><img :src="userBasicInfo.headimg" alt="" /></span>
                       <span v-else class="nopic"></span>
                  </div> 
                  <h3 class="personName">{{userBasicInfo.name}}</h3>
                  <p class="workTime">在河南红星机器有限公司工作了{{userBasicInfo.comday}}天</p>
                  <div class="rate_num">
                      <span class="num02">{{userBasicInfo.postionname}}</span>
                  </div>
              </div>
              <div class="personMore">
                  <div class="pHistory" @click="handleHistory">历史成就</div>
                  <router-link :to="{path: '/stat/cn/memberAnalysis/comparePerson',query:{deptId:searchData.dept_id,itemId:searchData.id}}" tag="a" target="_blank" class="pCompare">对比</router-link>
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
                            <div class="yearNum">{{item.numSeptotalNum}}</div>
                            <div class="numCompare">环比上年同期<span class="numsep" :class="item.totalNum-item.lasttotalNum>0?'':'numdec'">{{item.sequential}}</span>
                            </div>
                      </div>
                  </div>
                  <div class="chartContainer">
                      <div id="inquirybox"></div>
                      <div class="showLine">
                           <span v-for='(item,index) in showLineTime' :key="index" :class="'line'+(index+1)">{{item}}</span>
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
                                <template slot-scope="scope">
                                    <span class="scoreTableSpan" v-if="scope.row.xunnumber==0">{{scope.row.xunnumber}}</span>
                                    <router-link class="scoreTableA" v-else :to="{path:'/stat/cn/productAnalysis/ProStatistic',query:{uid:userBasicInfo.id,month:scope.row.time,type:'1',pick:'enquirie'}}" tag="a" target="_blank">{{scope.row.xunnumber}}</router-link>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="score"
                                label="成交积分">
                                <template slot-scope="scope">
                                    <span class="scoreTableSpan" v-if="scope.row.score==0">{{scope.row.score}}</span>
                                    <router-link class="scoreTableA" v-else :to="{path:'/stat/cn/productAnalysis/ProStatistic',query:{uid:userBasicInfo.id,month:scope.row.time,type:'1',pick:'score'}}" tag="a" target="_blank">{{scope.row.score}}</router-link>
                                </template>
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
                                    {{scope.row.money}}
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
import * as echarts from 'echarts';
import {numSeparate} from "@/utils/index";
import {mapGetters} from 'vuex';
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
            id:'',
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
        showLineTime:[],
        MixChart:null,
        type: 2,//默认展示今年的数据
    };
  },
  computed: {
    ...mapGetters([
      'sidebar',
    ]),
    nowYear(){
      return new Date().getFullYear();
    },
    prevYear(){
      return new Date().getFullYear()-1;
    }
  },
  created() {
    var $this = this;
    $this.searchData.dept_id = parseInt($this.$route.query.deptId);
    $this.searchData.id = parseInt($this.$route.query.itemId);
    $this.initData();
  },
  destroyed(){
    window.removeEventListener('resize',this.echartsSize);
    if(this.MixChart){
        this.MixChart.dispose();
    }
  },
  mounted(){
    const $this = this;
    if(!$this.sidebar.opened){
      $this.$store.dispatch('app/toggleSideBar');
    }
    $this.$refs.boxPane.addEventListener('scroll',this.handleScroll,true);
    window.addEventListener('resize',$this.echartsSize);
  },
  beforeDestroy(){
    this.$refs.boxPane.removeEventListener('scroll', this.handleScroll,true);//监听页面滚动事件
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
        $this.$router.push({path:"/stat/cn/memberAnalysis"});
      }
    },
    //获取部门信息
    getCnDepartList(){
      var $this = this;
      $this.$store.dispatch("api/getCnDepartAction").then((res) => {
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
            }else {
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
      $this.$store.dispatch("api/getCnPersonlistAction",searchData).then((res) => {
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
            }else {
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
        $this.userBasicInfo.id='';
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
      if($this.type == 1){
        searchData.year = $this.prevYear
      }else{
        searchData.year = $this.nowYear
      }
      $this.showLineTime=[(searchData.year-1)+'年',searchData.year+'年','平均值'];
      $this.MixData=[];
      if(this.MixChart){
          this.MixChart.dispose();
      }
      $this.$store.dispatch("api/getCnPersoncountinfoAction",searchData).then((res) => {
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
                            $this.userBasicInfo.userMonthcount=numSeparate(item.xunnumber);
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
                    ChartTabObj.numSeptotalNum=numSeparate(totalNum.toFixed(2)*1);
                    ChartTabObj.numSeplasttotalNum=numSeparate(lasttotalNum.toFixed(2)*1);
                    ChartTabObj.sequential=numSeparate(Math.abs(totalNum-lasttotalNum).toFixed(2)*1);
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
                            $this.userBasicInfo.userMonthscore=numSeparate(item.score);
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
                    ChartTabObj.numSeptotalNum=numSeparate(totalNum.toFixed(2)*1);
                    ChartTabObj.numSeplasttotalNum=numSeparate(lasttotalNum.toFixed(2)*1);
                    ChartTabObj.sequential=numSeparate(Math.abs(totalNum-lasttotalNum).toFixed(2)*1);
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
                            $this.userBasicInfo.userMonthanumber=numSeparate(item.anumber);
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
                    ChartTabObj.numSeptotalNum=numSeparate(totalNum.toFixed(2)*1);
                    ChartTabObj.numSeplasttotalNum=numSeparate(lasttotalNum.toFixed(2)*1);
                    ChartTabObj.sequential=numSeparate(Math.abs(totalNum-lasttotalNum).toFixed(2)*1);
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
                            $this.userBasicInfo.userMonthmoney=numSeparate(item.money);
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
                    ChartTabObj.numSeptotalNum=numSeparate(totalNum.toFixed(2)*1);
                    ChartTabObj.numSeplasttotalNum=numSeparate(lasttotalNum.toFixed(2)*1);
                    ChartTabObj.sequential=numSeparate(Math.abs(totalNum-lasttotalNum).toFixed(2)*1);
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
                $this.userBasicInfo.id=res.userinfo.id;
                $this.userBasicInfo.comtime=res.userinfo.comtime;
                $this.userBasicInfo.depart=res.userinfo.depart;
                $this.userBasicInfo.comday=res.userinfo.comday;
                $this.userBasicInfo.manangename=res.userinfo.manangename;
                $this.userBasicInfo.name=res.userinfo.name;
                if(res.userinfo.postionname&&res.userinfo.postionname!=''&&res.userinfo.postionname!=null){
                    $this.userBasicInfo.postionname=res.userinfo.postionname;
                }else{
                    $this.userBasicInfo.postionname='组员';
                }
                $this.userBasicInfo.headimg=res.userinfo.headimg;
                $this.ChartTab=ChartTab;
                // 个人成绩统计
                if(res.personcount&&res.personcount.length>0){
                  var personCount=[];
                  var maxxun=0;
                  var maxscore=0;
                  var maxanum=0;
                  var maxmoney=0;
                  res.personcount.forEach(function(item,index){
                      var objItem={};
                      objItem.time=item.date;
                      var time=item.date.split('-')[1]+'月';
                      objItem.date=time;
                      if(item.xunnumber&&item.xunnumber!=null){
                        objItem.xunnumber=numSeparate(item.xunnumber);
                        if(maxxun<item.xunnumber){
                            maxxun=item.xunnumber
                        }
                      }else{
                         objItem.xunnumber=0;
                         maxxun=0;
                      }
                      if(item.score&&item.score!=null){
                         objItem.score=numSeparate(item.score);
                        if(maxscore<item.score){
                            maxscore=item.score
                        }
                      }else{
                         objItem.score=0;
                         maxscore=0;
                      }
                      if(item.money&&item.money!=null){
                         objItem.money=numSeparate(item.money);
                        if(maxmoney<item.money){
                            maxmoney=item.money
                        }
                      }else{
                         objItem.money=0;
                         maxmoney=0;
                      }
                      if(item.anumber&&item.anumber!=null){
                        if(maxanum<item.anumber){
                            maxanum=item.anumber
                        }
                      }else{
                         maxanum=0;
                      }
                      objItem.anumber=item.anumber;
                      personCount.push(objItem);
                  });
                  $this.maxPersonCount.maxxun=numSeparate(maxxun);
                  $this.maxPersonCount.maxscore=numSeparate(maxscore);
                  $this.maxPersonCount.maxanum=maxanum;
                  $this.maxPersonCount.maxmoney=numSeparate(maxmoney);
                  $this.personCount=personCount;
                }
                $this.isLoading.close();
            }else {
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
        if(this.MixChart){
            this.MixChart.dispose();
        }
        if($this.currentTab=='enquirie'){            
            $this.showLineTime=[(($this.type == 1?$this.prevYear:$this.nowYear)-1)+'年',$this.type == 1?$this.prevYear:$this.nowYear+'年','平均值'];
        }else{
            $this.showLineTime=[(($this.type == 1?$this.prevYear:$this.nowYear)-1)+'年',$this.type == 1?$this.prevYear:$this.nowYear+'年'];
        }
        $this.getYearInquiryChart();
    },
    // 组合图表
    getYearInquiryChart(){
        var $this = this;
        var nowyear = $this.MixData.nowYear;
        var lastyear = $this.MixData.lastYear;
        var timeArr=[];
        var nowDataArr=[];
        var lastDataArr=[];
        nowyear.forEach(function(item,index){
            timeArr.push(item.time.split("-")[1]+"月");
            nowDataArr.push(item.number);
        });
        lastyear.forEach(function(item,index){
            lastDataArr.push(item.number);
        });
        // 平均值
        var avgMark=false;
        if($this.currentTab=='enquirie'){
            avgMark={
                    data: [
                        {type: 'average', name: '平均值'}
                    ],
                    label: {
                        show: true,
                        position: 'insideEndTop',
                    },
                    lineStyle:{
                        normal: {
                            width:1,
                            color:'#01b01d', // 线条颜色
                        },
                    },
                    emphasis:{
                        lineStyle: {
                        width:1,	// hover时的折线宽度
                        }
                    }
                }
        }else{
            avgMark=false;
        }
        var series=[];
        series=[{
            type: 'bar',
            data:nowDataArr,
            barWidth: '28px',
            itemStyle: {
                color: '#6395f9'
            },
            markLine:avgMark,
            label: {
                normal: {
                    show: false,
                }
            },
        },{
            type: 'line',
            data:lastDataArr,
            smooth:false,
            showSymbol:false,
            lineStyle:{
                normal: {
                    width: 1,
                    color:'#efd587', // 线条颜色
                },
            },
            itemStyle:{
                normal: {
                    borderColor:'#efd587', // 折点颜色
                    borderWidth: 1,
                    color: '#fff'
                },
            },
            areaStyle:{
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                    offset: 0,
                    color:'#efd587',
                    opacity:1
                    },
                    {
                    offset: 1,
                    color: "rgba(255, 255, 255, 0)",
                    }
                ]),
                opacity:0.3
            },
            emphasis:{
                lineStyle: {
                    width: 2,	// hover时的折线宽度
                },
                itemStyle:{
                    borderWidth: 2
                }
            },
            symbolSize:5,
            symbol:'circle',
            animationDuration:2800,
            animationEasing:'quadraticOut',
        }]
        var chartDom = document.getElementById('inquirybox');
        var MixChart = echarts.init(chartDom);
        var option;
        option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function (params, ticket, callback) {
                    var showHtm="";
                    var title = '';
                    var showHtmDd='';
                    for(var i=0;i<params.length;i++){
                        if(params[i]&&params[i]!=undefined){
                            var name = '';
                            var nowyearStr='';
                            var lastyearStr='';
                            nowyear.forEach(function(item,index){
                                if(index==0){                                    
                                    nowyearStr=item.time.split("-")[0]+'-'+params[i].axisValue.replace('月','');
                                }
                            });
                            lastyear.forEach(function(item,index){
                                if(index==0){
                                    lastyearStr=item.time.split("-")[0]+'-'+params[i].axisValue.replace('月','');
                                }
                            });
                            if(i==0){
                                name=nowyearStr;
                            }
                            if(i==1){
                                name=lastyearStr;
                            }
                            var value = params[i].value;
                            if($this.currentTab=='enquirie'){
                                title='询盘个数';
                            }
                            if($this.currentTab=='clinchScore'){
                                title='成交积分';
                            }
                            if($this.currentTab=='clinchNum'){
                                title='100万成交个数';
                            }
                            if($this.currentTab=='money'){
                                title='年度总奖金';
                            }
                            if(params[i].color=='#fff'){
                                params[i].color='#efd587'
                            }
                            showHtmDd+='<dd><i style="background:'+params[i].color+'"></i><span>'+name+'：</span><strong>' + value +'</strong></dd>'
                        }
                    }
                    showHtm='<dl class="columTool"><dt>'+title+'</dt>'+showHtmDd+'</dl>';
                    return showHtm;
                }
            },
            grid: {
                top:'10',
                right:'0',
                left:'35',
                bottom:'30'
            },
            xAxis:{
                type: 'category',
                data:timeArr,
                axisTick: {
                    show: false
                },
                axisLine:{
                    show: true,
                    lineStyle:{
                        type: [4, 0],
                        dashOffset: 3,
                        color: '#e5e5e5',
                        opacity:1,
                        shadowColor: null,
                        shadowBlur: 0,
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                    }
                },
                axisLabel: {
                    color: "#555",
                    fontSize: "13",
                    lineHeight: 18,
                },
                nameTextStyle:{
                    lineHeight:18,
                }
            },
            yAxis:{
                type: 'value',
                axisTick: {
                    show: false
                },
                axisLabel: {
                    color: "#555",
                    fontSize: "13",
                },
                axisLine:{
                    show: false,
                },
                splitLine:{
                    show: true,
                    lineStyle:{
                        type: [4, 2],
                        dashOffset: 3,
                        color: '#e5e5e5',
                        opacity:1,
                        shadowColor: null,
                        shadowBlur: 0,
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                    }
                },
                splitNumber:3,
                nameTextStyle:{
                    lineHeight:18,
                }
            },
            series:series,
        }
        option && MixChart.setOption(option);
        $this.MixChart = MixChart;
    },
    // 组员个人历史成就
    handleHistory(){
      var $this=this;
      $this.dialogFormVisible = true;
      var searchData={};
      searchData.id=$this.searchData.id;
      searchData.type=1;
      $this.$store.dispatch("api/getPersonHistoryAction",searchData).then((res) => {
          if (res) {
            if (res.status) {
              if(res.data&&res.data.length>0){
                  var historyDate=[];
                  res.data.forEach(function(item,index){
                      var objItem={};
                      objItem.addtime=item.addtime;
                      objItem.content=item.content;
                      if(item.content.indexOf("询盘冠军")>=0||item.content.indexOf("询盘成绩")>=0){
                          objItem.tap='询盘Top1';
                          objItem.icon='icon01';
                      }
                      if(item.content.indexOf("成交分")>=0||item.content.indexOf("部门第一")>=0){
                          objItem.tap='销售冠军';
                          objItem.icon='icon01';
                      }
                      if(item.content.indexOf("公司第一")>=0||item.content.indexOf("公司新高")>=0){
                          objItem.tap='成交Top1';
                          objItem.icon='icon01';
                      }
                      if(item.content.indexOf("奖金超越")>=0){
                          objItem.tap='奖金Top1';
                          objItem.icon='icon01';
                      }
                      if(item.content.indexOf("最高历史")>=0){
                          objItem.tap='询盘突破峰值';
                          objItem.icon='icon02';
                      }
                      if(item.content.indexOf("历史新高")>=0){
                          objItem.tap='成交分突破峰值';
                          objItem.icon='icon02';
                      }
                      if(item.content.indexOf("成交量突破")>=0){
                          objItem.tap='成交量突破峰值';
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
            }else {
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
      if(!$this.dialogFormVisible){
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
    },
    changeType(val){
      this.type = val;
      this.getCnPersoncountinfo()
    },
    echartsSize(){
        if(this.MixChart){
            this.MixChart.resize();
        }
    }
  }
}


</script>