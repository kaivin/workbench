<template>
  <div class="page-root scroll-panel home-index" ref="boxPane">
    <el-card class="box-card scroll-card target-part" shadow="hover">
      <div class="target_top">
        <day-score 
          :DayScore="DayScore" 
          :lang="ch"
        ></day-score>
      </div>
      <div class="target_box">
        <div class="target_left">
          <day-target 
            :DayTarget="DayTarget" 
            :DayAim ="DayAim" 
            :Dep1DayNum="Dep1DayNum" 
            :lang="ch"
            @dayChange="dayChange" 
          ></day-target>
          <deal-count 
            :DealCount="DealCount" 
            @MonthChange="monthChange" 
            :lang="ch"
          ></deal-count>
          
        </div>
        <div class="target_right">
          <day-finish 
            :DayFinish="DayFinish" 
            @dayMonthChange="getDayFinish"
            :lang="ch"
          ></day-finish>
          <month-deal 
            :MonthFinish="MonthFinish"
            :scoremonth="scoremonth"
            @yearChange="GetMonthDeal"
            :lang="ch"
          ></month-deal>
        </div>
      </div>

    </el-card>
  </div>
</template>
<script>
import {parseTime}  from "@/utils";
import DayScore from "../../components/targetShow/DayScore";
import DealCount from "../../components/targetShow/DealCount";
import DayTarget from "../../components/targetShow/DayTarget";
import DayFinish from "../../components/targetShow/DayFinish";
import MonthDeal from "../../components/targetShow/MonthDeal"
export default {
  name: "cnTargetShow",
  data() {
    return {
      DayScore: {
        dayMaxNum: 0,
        historyMaxNum: 0,
        allTodayNum: 0,
        allYesterdayNum: 0,
        todayPercent: 0,
        yesterdayPercent: 0,
      },
      DealCount: {
        maxAimNum: 200,
        departScore:[],
        stepNum: 50,
        month: ''
      },
      DayTarget:[],
      DayAim:[],
      DayFinish:[],
      Dep1DayNum: 0,
      MonthFinish:[],
      scoremonth: '',
      ch:"ch"
    };
  },
  components:{
    DayScore,
    DealCount,
    DayTarget,
    DayFinish,
    MonthDeal
  },
  created() {
    var $this = this;
    $this.getUserMenuButtonPermit();
  },
  methods: {
    // 获取当前登陆用户在该页面的操作权限
    getUserMenuButtonPermit(){
      var $this = this;
      $this.$store.dispatch('api/getMenuButtonPermitAction',{id:$this.$router.currentRoute.meta.id}).then(res=>{
        if(res.data.length>0){
          var permitData = [];
          res.data.forEach(function(item,index){
            permitData.push(item.action_route);
          });
          if(permitData.includes('Api_chinadaytargetnew')){
            $this.initData()
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
      });
    },
    // 初始化数据
    initData() {
      var $this = this;
      // 获取中文日询盘
      var nowDay = parseTime(new Date(),'{y}-{m}-{d}');
      // 获取中文月积分
      var nowMonth = parseTime(new Date(),'{y}-{m}');
      $this.getMonthScore();
      // 获取中文日目标
      $this.getDepDayTarget(nowDay);
      // 获取中文日目标完成情况
      $this.getDayFinish(nowMonth);
      // 获取年度目标完成情况
      $this.GetMonthDeal();
    },

    // 1.中文日询盘：日期改变
    dayChange(val){
      var $this = this;
      $this.getDepDayTarget(val);
    },

    //1.中文日询盘:进度展示
    getPercent(a,b){
      var $this = this;
      if(b>0){
        if(a<b){
          var daypercent = a/b*100 ;
          this.DayScore.todayPercent = daypercent;
          this.DayScore.yesterdayPercent = 100 ;
        }else{
          var yesterdaypercent = b/a*100 ;
          this.DayScore.todayPercent = 100;
          this.DayScore.yesterdayPercent = yesterdaypercent ;
        }
      }
      
    },

    // 2.获取中文目标完成情况
    getMonthScore(val){
      var $this = this;
      var data = {};
      if(val){
        data.time = val;
      }
      $this.$store
        .dispatch("homeobject/postDealNum", data)
        .then((response) => {
          if (response) {
            if (response.status) {
              var dscore  = response.departscore;
              $this.DealCount.departScore = dscore;
              $this.DealCount.month = response.month;
              var maxnum = 0;
              for(var i=0;i<dscore.length;i++){
                if(dscore[i].goodnumber>dscore[i].score){
                  if(dscore[i].goodnumber > maxnum){
                    maxnum = dscore[i].goodnumber;
                  }
                }else{
                  if(dscore[i].score > maxnum){
                    maxnum = dscore[i].score;
                  }
                }
                
              }
              $this.getMaxNum(maxnum);
            } else {
              $this.$message({
                showClose: true,
                message: response.info,
                type: "error",
                duration: 6000
              });
              $this.$router.push({path: `/login?redirect=${$this.$router.currentRoute.fullPath}`})
            }
          }
      });
    },
    // 2.获取最大成交数额，比例尺数字设置
    getMaxNum(data){
      var $this = this;
      var num = Math.floor(data/100);
      var maxnum = (num+1)*100;
      $this.DealCount.maxAimNum = maxnum;
      $this.DealCount.stepNum = maxnum/4;
    },
    // 2.中文目标完成情况日期变更
    monthChange(val){
      var $this = this;
      $this.getMonthScore(val);
    },

    // 3.各部门日目标
    getDepDayTarget(val){
      var $this = this;
      var data = {};
      data.time = val;
      $this.$store
        .dispatch("homeobject/postDayTarget", data)
        .then((response) => {
          if (response) {
            if (response.status) {
              var res = response.groupcount;
              var newArr = [];
              var aimArr = [];
              for(var i=0; i<res.length;i++){
                var departname = res[i].departname;
                var historymaxnumber = res[i].historymaxnumber;
                var monthmaxnumber = res[i].monthmaxnumber;
                var daynumber = res[i].daynumber;
                var daytargetnumber = res[i].daytargetnumber;

                if(res[i].hasOwnProperty('searchdaynumber')){
                  var searchdaynumber = res[i].searchdaynumber;
                  
                  var sepArr2 = {
                    departname: departname,
                    name: "非搜索询盘",
                    number: daynumber - searchdaynumber,
                    stack: 1
                  }
                  newArr.push(sepArr2);

                  var sepArr1 = {
                    departname: departname,
                    name: "搜索询盘",
                    number: searchdaynumber,
                    stack: 1
                  }
                  newArr.push(sepArr1);
                  
                  $this.Dep1DayNum = res[i].daynumber;
                }else{
                  var sepArr1 = {
                    departname: departname,
                    name: "搜索询盘",
                    number: daynumber,
                    stack: 1
                  }
                  newArr.push(sepArr1);
                }
                var sepArr3 = {
                  departname: departname,
                  name: "本月最高",
                  number: monthmaxnumber,
                  stack: 2
                }
                newArr.push(sepArr3);

                var sepArr4 = {
                  departname: departname,
                  name: "历史最高",
                  number: historymaxnumber,
                  stack: 3
                }
                newArr.push(sepArr4);

                var sepArr5 = {
                  departname: departname,
                  name: "目标询盘",
                  number: daytargetnumber
                }
                aimArr.push(sepArr5)
              }
              $this.DayTarget = newArr;
              $this.DayAim = aimArr;
              
              
              var daymax = 0;
              if(response.daymaxnumber.length>0){
                daymax = response.daymaxnumber[0].effectivenumber;
              }
              var historymax = response.historymaxnumber[0].effectivenumber;
              var todaynum = response.alltoday;
              var yeaterdaynum = response.alllastday;
              $this.DayScore.dayMaxNum = daymax;
              $this.DayScore.historyMaxNum = historymax;
              $this.DayScore.allTodayNum = todaynum;
              $this.DayScore.allYesterdayNum = yeaterdaynum;
              // $this.getPercent(todaynum,yeaterdaynum);
            } else {
              $this.$message({
                showClose: true,
                message: response.info,
                type: "error",
                duration: 6000
              });
              $this.$router.push({path: `/login?redirect=${$this.$router.currentRoute.fullPath}`})
            }
          }
      });
    },

    // 4.日目标完成情况
    getDayFinish(val){
      var $this = this;
      var data = {};
      data.time = val;
      $this.$store
        .dispatch("homeobject/postDayFinish", data)
        .then((response) => {
          if (response) {
            if (response.status) {
              var res = response.departmonthdarget;
              var nowmonth = parseTime(new Date(),'{y}-{m}');
              var monthnumber=0;
              if(nowmonth == val){
                monthnumber = parseTime(new Date(),'{d}');
              }else{
                monthnumber = new Date(val.split("-")[0],val.split("-")[1],0).getDate();
              }
              for(var i = 0; i<res.length;i++){
                if(res[i].finishnumber !=0 ||res[i].finishnumber!=''){
                  res[i].finishcent = res[i].finishnumber/monthnumber*100;
                  res[i].finishcent = res[i].finishcent.toFixed(1)+"%"
                }else{
                  res[i].finishcent = '0%'
                }
                
              }
              $this.DayFinish = res;
            } else {
              $this.$message({
                showClose: true,
                message: response.info,
                type: "error",
                duration: 6000
              });
              $this.$router.push({path: `/login?redirect=${$this.$router.currentRoute.fullPath}`})
            }
          }
      });
    },

    // 5.部门月成交完成情况
    GetMonthDeal(val){
      var $this = this;
      var data = {};
      if(val){
        data.year = val;
      }else if(new Date().getMonth() < 4){
        data.year = new Date().getFullYear()-1;
      }else{
        data.year = new Date().getFullYear();
      }
      $this.$store
        .dispatch("homeobject/postDepFinish", data)
        .then((response) => {
          if (response) {
            if (response.status) {
              $this.MonthFinish = response.departscoreyear;
              $this.scoremonth = response.scoremonth;
            } else {
              $this.$message({
                showClose: true,
                message: response.info,
                type: "error",
                duration: 6000
              });
              $this.$router.push({path: `/login?redirect=${$this.$router.currentRoute.fullPath}`})
            }
          }
      });
    }
  }
}
</script>

