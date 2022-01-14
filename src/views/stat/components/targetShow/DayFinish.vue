<template>
  <div class="rowDayFinish" :class="lang=='en'? 'enrowDayFinish':''">
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
        <el-table
            :data="DayFinish"
            style="width: 100%"
            border
            class="depDayCont"
            >
            <el-table-column
                prop="name"
                label="部门">
            </el-table-column>
            <el-table-column
                prop="finishnumber"
                label="完成次数">
            </el-table-column>
            <el-table-column
                prop="finishcent"
                label="完成率">
            </el-table-column>
        </el-table>
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
        },
    }
}
</script>

<style></style>