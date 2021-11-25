<template>
  <div class="rowDealCount">
    <div class="rowTitle">
      <div class="title-left">
        <h3 class="tit-h3"><span v-if="lang == 'ch'">中文</span><span v-else>英文</span>成交目标完成情况</h3>
        <span class="tit-span">（单位：分）</span>
      </div>
      <div class="datePicker">
        <el-date-picker
          v-model="MonthChoose"
          @change = "MonthChange"
          type="month"
          format="yyyy-MM"
          :picker-options="disabledMonth"
          placeholder="选择月份">
        </el-date-picker>
      </div>
    </div>
    <div class="enrowMain">
        <div class="enTitle">
            <div class="leftTitle">
                <span class="tit1">部门</span>
                <span class="tit2">个数目标仅合格（个）</span>
                <span class="tit3">成交目标（分)</span>
            </div>
            <div class="departMean">
                <span>成交积分</span><span>合格线</span><span>中等线</span><span>优秀线</span>
            </div>
        </div>
        
        <ul class="departLineBox">

            <li class="flex-wrap" v-for="(item,index) in DealCount.departScore" :key="index">
                <div class="departName">
                    {{item.departname}}
                </div>
                <div class="delCircle">
                    <div class="allCircle"></div>
                    <div class="passCircle">
                        <div class="left">
                            <div class="line" :style="passPercent < 50 ? 'transform:rotate(-225deg)' : 'transform:rotate('+ (225/50*(passPercent-50)-225) + 'deg)' "></div>
                        </div>
                        <div class="right">
                            <div class="line" :style="passPercent < 50 ? 'transform:rotate('+ (225/50*passPercent-225) + 'deg)' : 'transform:rotate(-45deg)' " ></div>
                        </div>
                    </div>
                    <div class="numCircle">
                        <div class="left">
                            <div class="line" :style="nowPercent < 50 ? 'transform:rotate(-225deg)' : 'transform:rotate('+ (225/50*(nowPercent-50)-225) + 'deg)' "></div>
                        </div>
                        <div class="right">
                            <div class="line" :style="nowPercent < 50 ? 'transform:rotate('+ (225/50*nowPercent-225) + 'deg)' : 'transform:rotate(-45deg)' " ></div>
                        </div>
                    </div>
                    <div class="numShow">
                        <span class="nowNum">120</span>
                        <span class="aimNum">≥700</span>
                    </div>
                </div>
                <div class="delText">
                    OR
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
            </li>

            <li class="flex-wrap last_li">
                <div class="departName"></div>
                <div class="delCircle"></div>
                <div class="delText"></div>
                <div class="departLine departLine2 flex-content">
                    <div class="step" v-for="(item,index) in 11" :key="index" :style="'left:'+ 10*index +'%'">{{DealCount.stepNum*index}}</div>
                </div>
            </li>
        </ul>
        
    </div>
  </div>
</template>

<script>
import {parseTime}  from "@/utils";
export default {
    name: "enDealCount",
    data() {
        return {
            MonthChoose: '',
            disabledMonth:{
                disabledDate(time){
                    return time.getTime() > Date.now();
                }
            },
            nowPercent: 30,
            passPercent: 60,
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
        var $this = this;
        this.MonthChoose = parseTime(new Date(),'{y}-{m}');
    },
    methods:{
        MonthChange() {
            var $this = this;
            var res = $this.MonthChoose;
            res = parseTime(res,'{y}-{m}');
            $this.MonthChoose = res;
            $this.$emit('MonthChange', res);
        }
    }
}
</script>

<style>

</style>