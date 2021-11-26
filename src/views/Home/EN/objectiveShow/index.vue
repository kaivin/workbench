<template>
  <div class="page-root scroll-panel home-index" ref="boxPane">
    <el-card class="box-card scroll-card target-part" shadow="hover">
        <el-row>
          <el-col :md="24" :lg="12" class="target_left">
            <day-score 
              :DayScore="DayScore" 
              @dayChange ="dayChange" 
              :lang="en"
            ></day-score>
            <day-target 
              :DayTarget="DayTarget" 
              :DayAim ="DayAim" 
              :Dep1DayNum="Dep1DayNum" 
              :lang="en"
            ></day-target>
            <day-finish 
              :DayFinish="DayFinish" 
              @dayMonthChange="getDayFinish"
              :lang="en"
            ></day-finish>
          </el-col>
          <el-col :md="24" :lg="12" class="target_right">
            <en-deal-count 
              :DealCount="DealCount" 
              @MonthChange="monthChange" 
              :lang="en"
              :maxnumline="maxnumline"
            ></en-deal-count>
            <month-deal 
              :MonthFinish="MonthFinish"
            ></month-deal>
          </el-col>
        </el-row>
    </el-card>
  </div>
</template>
<script>
import {parseTime}  from "@/utils";
import DayScore from "../../compoents/objectiveShow/DayScore";
import enDealCount from "../../compoents/objectiveShow/enDealCount";
import DayTarget from "../../compoents/objectiveShow/DayTarget";
import DayFinish from "../../compoents/objectiveShow/DayFinish";
import MonthDeal from "../../compoents/objectiveShow/MonthDeal"
export default {
  name: "objectiveShow",
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
        stepNum: 50
      },
      maxnumline:0,
      DayTarget:[],
      Dep1DayNum:0,
      DayAim:[],
      DayFinish:[],
      MonthFinish:[],
      en:'en'
    };
  },
  components:{
    DayScore,
    enDealCount,
    DayTarget,
    DayFinish,
    MonthDeal
  },
  created() {
    var $this = this;
    $this.initData();
  },
  methods: {
    // 初始化数据
    initData() {
      var $this = this;
      // 获取英文文日询盘
      var nowDay = parseTime(new Date(),'{y}-{m}-{d}');
      $this.getEnDepDayNum(nowDay);
      // 获取英文月积分
      var nowMonth = parseTime(new Date(),'{y}-{m}');
      $this.getMonthScore(nowMonth);
      // 获取英文日目标
      $this.getDepDayTarget(nowDay);
      // 获取中文日目标完成情况
      $this.getDayFinish(nowMonth);
      // 获取年度目标完成情况
      $this.GetMonthDeal();
    },

    // 1.获取英文日询盘
    getEnDepDayNum(val){
      var $this = this;
      var data = {};
      data.time = val;
      $this.$store
        .dispatch("homeobject/postEnDayNum", data)
        .then((response) => {
          if (response) {
            if (response.status) {
              var daymax = response.daymaxnumber[0].effectivenumber;
              var historymax = response.historymaxnumber[0].effectivenumber;
              var todaynum = response.alltoday;
              var yeaterdaynum = response.alllastday;
              $this.DayScore.dayMaxNum = daymax;
              $this.DayScore.historyMaxNum = historymax;
              $this.DayScore.allTodayNum = todaynum;
              $this.DayScore.allYesterdayNum = yeaterdaynum;
              $this.getPercent(todaynum,yeaterdaynum);
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

    // 1.英文日询盘：日期改变
    dayChange(val){
      var $this = this;
      $this.getEnDepDayNum(val);
      $this.getDepDayTarget(val);
    },

    //1.英文日询盘:进度展示
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

    // 2.获取英文目标完成情况
    getMonthScore(val){
      var $this = this;
      var data = {};
      data.time = val;
      $this.$store
        .dispatch("homeobject/postEnDealNum", data)
        .then((response) => {
          if (response) {
            if (response.status) {
              var dscore  = response.departscore;
              $this.DealCount.departScore = dscore;
              var maxnum = 0;
              var maxline = 0;
              for(var i=0;i<dscore.length;i++){
                if(dscore[i].goodnumber > maxnum){
                  maxnum = dscore[i].goodnumber;
                }
                if(dscore[i].numberline > maxline){
                  maxline = dscore[i].numberline
                }
              }
              $this.getMaxNum(maxnum);
              $this.maxnumline = maxline + 50;
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
    // 2.获取最大成交数额，比例尺数字设置
    getMaxNum(data){
      var $this = this;
      var num = Math.floor(data/10);
      var maxnum = (num+1)*10;
      $this.DealCount.maxAimNum = maxnum;
      $this.DealCount.stepNum = maxnum/10;
    },
    // 2.英文目标完成情况日期变更
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
        .dispatch("homeobject/postEnDayTarget", data)
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
                  var sepArr1 = {
                    departname: departname,
                    name: "搜索询盘",
                    number: searchdaynumber,
                    stack: 1
                  }
                  newArr.push(sepArr1);
                  var sepArr2 = {
                    departname: departname,
                    name: "非搜索询盘",
                    number: daynumber - searchdaynumber,
                    stack: 1
                  }
                  newArr.push(sepArr2);
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

    // 4.日目标完成情况
    getDayFinish(val){
      var $this = this;
      var data = {};
      data.time = val;
      $this.$store
        .dispatch("homeobject/postEnDayFinish", data)
        .then((response) => {
          if (response) {
            if (response.status) {
              $this.DayFinish = response.departmonthdarget;
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

    // 5.部门月成交完成情况
    GetMonthDeal(){
      var $this = this;
      var data = {};
      data.year = new Date().getFullYear;
      $this.$store
        .dispatch("homeobject/postEnDepFinish", data)
        .then((response) => {
          if (response) {
            if (response.status) {
              $this.MonthFinish = response.departscoreyear;
            } else {
              $this.$message({
                showClose: true,
                message: response.info,
                type: "error",
              });
            }
          }
      });
    }
  }
}
</script>

