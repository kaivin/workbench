<template>
  <div class="rowDayScore flex-content">
    <div class="rowTitle">
      <div class="title-left">
        <h3 class="tit-h3"><span v-if="lang == 'ch'">中文</span><span v-else>英文</span>日询盘</h3>
        <span class="tit-span">（单位：个）</span>
      </div>
      <div class="datePicker">
        <span class="go-left on"  @click="dayPrev">前一天</span>
        <el-date-picker
          v-model="dateChoose"
          @change = "dateChange"
          type="date"
          format="yyyy-MM-dd"
          :picker-options="disabledTime"
          placeholder="选择日期">
        </el-date-picker>
        <span class="go-right" :class="nextOn ? 'on' : '' " @click="dayNext">后一天</span>
      </div>
    </div>

    <div class="rowMain">
      <ul class="rowLineItem">
        <li
          class="flex-box"
          :class="
            DayScore.allTodayNum <= DayScore.allYesterdayNum
              ? 'rowOneColor'
              : ''
          "
        >
          <i class="svg-i"><svg-icon icon-class="homePic" /></i>
          <p class="flex-content">
            今日询盘
            <strong>{{ DayScore.allTodayNum }}</strong>
            <span
              ><i
                :style="'width:' + DayScore.todayPercent + '%'"
              ></i
            ></span>
          </p>
        </li>
        <li class="flex-box">
          <i class="svg-i"><svg-icon icon-class="homeTime" /></i>
          <p class="flex-content">
            昨日询盘
            <strong>{{ DayScore.allYesterdayNum }}</strong>
            <span
              ><i
                :style="'width:' + DayScore.yesterdayPercent + '%'"
              ></i
            ></span>
          </p>
        </li>
      </ul>

      <ul class="rowCountItem">
        <li class="countMonth">
          <p>本月单日最高<span>{{ DayScore.dayMaxNum }}</span></p>
        </li>
        <li CLASS="countDay">
          <p>历史单日最高<span>{{ DayScore.historyMaxNum }}</span></p>
        </li>
      </ul>

    </div>
  </div>
</template>

<script>
import {parseTime}  from "@/utils";
export default {
  name: "DayScore",
  data() {
    return {
      dateChoose: '',
      nextOn: false,
      disabledTime:{
        disabledDate(time){
          return time.getTime() > Date.now();
        }
      }
    };
  },
  created(){
    var $this = this;
    this.dateChoose = parseTime(new Date(),'{y}-{m}-{d}');
  },
  props: {
    DayScore: {
      type: Object,
      default: function () {
        return {};
      },
    },
    lang:{
      type: String,
      default: function () {
        return {};
      },
    }
  },
  methods:{
    dayPrev() { 
      var $this = this;
      var nowDayStr = new Date($this.dateChoose).getTime();
      var prevDayStr = nowDayStr - 3600*24*1000;
      var prevDay = new Date(prevDayStr);
      prevDay = parseTime(prevDay,'{y}-{m}-{d}');
      $this.nextOn = true;
      $this.dateChoose = prevDay;
      $this.$emit('dayChange', prevDay);
    },
    dayNext(){
      var $this = this;
      var nowDayStr = new Date($this.dateChoose).getTime();
      if(new Date().getTime() - nowDayStr < 3600*24*1000){
        $this.nextOn = false;
      }else{
        var nextDayStr = nowDayStr + 3600*24*1000;
        var nextDay = new Date(nextDayStr);
        nextDay = parseTime(nextDay,'{y}-{m}-{d}');
        $this.dateChoose = nextDay;
        if(new Date().getTime() - nowDayStr < 3600*24*1000*2){
          $this.nextOn = false;
        }
        $this.$emit('dayChange', nextDay);
      }
    },
    dateChange(){
      var $this = this;
      var res = $this.dateChoose;
      res = parseTime(res,'{y}-{m}-{d}');
      $this.dateChoose = res;
      var normalstr = new Date($this.dateChoose).getTime();
      if(new Date().getTime() - normalstr  < 3600*24*1000){
        $this.nextOn = false;
      }else{
        $this.nextOn = true;
      }
      $this.$emit('dayChange', res);
    }
  }
};
</script>

<style>
</style>