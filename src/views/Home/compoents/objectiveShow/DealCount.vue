<template>
  <div class="rowDealCount">
    <div class="rowTitle">
      <div class="title-left">
        <h3 class="tit-h3"><span v-if="lang == 'ch'">中文</span><span v-else>英文</span>成交目标完成情况</h3>
        <span class="tit-span">（单位：分）</span>
      </div>
      <div class="datePicker">
        <el-date-picker
          v-model="DealCount.month"
          @change = "MonthChange"
          type="month"
          format="yyyy-MM"
          :picker-options="disabledMonth"
          placeholder="选择月份">
        </el-date-picker>
      </div>
    </div>
    <div class="rowMain">
        <div class="maintit">
            <span>百万成交</span>
        </div>
        <ul class="departLineBox">

            <li class="flex-wrap" v-for="(item,index) in DealCount.departScore" :key="index">
                <div class="departName">
                    {{item.departname}}
                </div>
                <el-tooltip placement="top" effect="light" :visible-arrow="false">
                    <div slot="content">
                        <div class="tipnumber">合格线：{{item.passnumber}}</div>
                        <div class="tipnumber">中等线：{{item.mediumnumber}}</div>
                        <div class="tipnumber">优秀线：{{item.goodnumber}}</div>
                    </div>
                    <div class="departLine flex-content">
                        <span class="progressLine" :style="'width:'+item.score/DealCount.maxAimNum*100+'%'">
                            <i>{{item.score}}</i>
                        </span>
                        <span class="standardLine" :style="'width:'+item.passnumber/DealCount.maxAimNum*100+'%'"></span>
                        <span class="mediumLine" :style="'width:'+item.mediumnumber/DealCount.maxAimNum*100+'%'"></span>
                        <span class="excellentLine" :style="'width:'+item.goodnumber/DealCount.maxAimNum*100+'%'"></span>
                    </div>
                </el-tooltip>
                <div class="departScore" :class="item.a_number > 0 ? 'goodScore' : '' ">
                    <span v-if="item.a_number > 0">×{{item.a_number}}个</span>
                </div>
            </li>

        </ul>
        <div class="departMean flex-content">
            <span>成交积分</span><span>合格线</span><span>中等线</span><span>优秀线</span>
        </div>
    </div>
  </div>
</template>

<script>
import {parseTime}  from "@/utils";
export default {
    name: "DealCount",
    data() {
        return {
            disabledMonth:{
                disabledDate(time){
                    return time.getTime() > Date.now();
                }
            }
        }
    },
    props:{
        DealCount: {
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
    created(){
    },
    methods:{
        MonthChange() {
            var $this = this;
            var res = $this.DealCount.month;
            res = parseTime(res,'{y}-{m}');
            $this.DealCount.month = res;
            $this.$emit('MonthChange', res);
        }
    }
}
</script>

<style>

</style>