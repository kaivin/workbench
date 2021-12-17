<template>
  <div class="rowDayFinish">
    <div class="rowTitle">
      <div class="title-left">
        <h3 class="tit-h3">日询盘优秀天数统计</h3>
        <span class="tit-span">（单位：次）</span>
        <span class="tit-span">注：与上月同期对比</span>
      </div>
      <div class="datePicker">
        <el-date-picker
          v-model="MonthChoose"
          @change = "DayMonthChange"
          type="month"
          format="yyyy-MM"
          :picker-options="disabledMonth"
          placeholder="选择月份">
        </el-date-picker>
      </div>
    </div>
    <div class="rowMain">
        <ul class="depDayCont" :class="lang == 'en' ? 'endepDay' : '' ">
            <li v-for="(item,index) in DayFinish" :key="index">
                <div class="depName">{{item.name}}</div>
                <div class="depRes">
                    <span class="resnum">{{item.finishnumber}}</span>
                    <span class="resdet" :class="parseInt(item.finishnumber) < parseInt(item.lastfinishnumber) ? 
                        'down' : 'grow'"><span v-if="parseInt(item.finishnumber) < parseInt(item.lastfinishnumber)"><i class="svg-i"><svg-icon icon-class="data-down" /></i>同比下降</span>
                        <span v-else><i class="svg-i"><svg-icon icon-class="data-up" /></i>同比增长</span>
                    <i >{{parseInt(item.finishnumber) > parseInt(item.lastfinishnumber) ? parseInt(item.finishnumber) - parseInt(item.lastfinishnumber) : parseInt(item.lastfinishnumber) - parseInt(item.finishnumber)}}</i></span>
                </div>
            </li>
        </ul>
    </div>
  </div>
</template>

<script>
import {parseTime}  from "@/utils";
export default {
    name: "DayFinish",
    data() {
        return {
            MonthChoose: '',
            disabledMonth:{
                disabledDate(time){
                    return time.getTime() > Date.now();
                }
            }
        }
    },
    props:{
        DayFinish: {
            type: Array,
            default: function () {
                return [];
            },
        },
        lang: {
            type: String,
            default: function(){
                return "";
            }
        }
    },
    created(){
        var $this = this;
        this.MonthChoose = parseTime(new Date(),'{y}-{m}');
    },
    methods:{
        DayMonthChange() {
            var $this = this;
            var res = $this.MonthChoose;
            res = parseTime(res,'{y}-{m}');
            $this.MonthChoose = res;
            $this.$emit('dayMonthChange', res);
        }
    }
}
</script>

<style></style>