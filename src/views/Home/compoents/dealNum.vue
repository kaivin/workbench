<template>
  <div class="rowEightFl flex-content">
                    <div class="map-Top-chartTit flex-wrap">
                        <h3>{{language=='Module_cnStat'?'中文':'英文'}}成交统计</h3>
                        <div class="item-search flex-content">                        
                          <el-date-picker
                            v-model="ScoreTimeDate"
                            size="mini"
                            type="month"
                            @change="monthChangeHandler"
                            placeholder="选择月"
                            format="yyyy 年 MM 月"
                            value-format="yyyy-MM"
                            style="width:140px"
                            >
                          </el-date-picker>
                        </div>
                    </div>
                    <div class="rowEightFlItem">
                         <div class="rowEightFlItemTop flex-wrap">
                              <p class="rowEightFlItemTop01 flex-content">
                                 <span>成交积分</span><span>合格线</span><span>中等线</span><span>优秀线</span>
                              </p>
                              <p class="rowEightFlItemTop02">百万成交</p>
                         </div>
                         <ul class="rowEightFlItemBom">
                             <li class="flex-wrap" v-for="(item,index) in currentCluesData.departScoreData" :key="index">
                                <p class="rowEightFlItemFlName">{{item.departname}}</p>
                                <el-tooltip placement="top" effect="light" :visible-arrow="false">
                                  <div slot="content">
                                    <div class="tipnumber">合格线：{{item.passnumber}}</div>
                                    <div class="tipnumber">中等线：{{item.mediumnumber}}</div>
                                    <div class="tipnumber">优秀线：{{item.goodnumber}}</div>
                                  </div>
                                  <p class="rowEightFlItemFlBox flex-content">
                                    <span v-if="language=='Module_cnStat'" class="departnamescore" :style="'width:'+item.score/ScoreData.MaxValue*100+'%'">
                                    <i class="tip-right">{{item.score}}</i>
                                    </span>
                                    <span v-else class="departnamescore" :style="'width:'+item.snumber/ScoreData.MaxValue*100+'%'"></span>
                                    <span class="goodnumber" :style="'width:'+item.goodnumber/ScoreData.MaxValue*100+'%'"></span>
                                    <span class="mediumnumber" :style="'width:'+item.mediumnumber/ScoreData.MaxValue*100+'%'"></span>
                                    <span class="passnumber" :style="'width:'+item.passnumber/ScoreData.MaxValue*100+'%'"></span>
                                  </p>
                                </el-tooltip>
                                <p class="rowEightFlItemFlNum NumClass">
                                   <span v-if="item.a_number>0">{{item.a_number}}</span>
                                </p>

                             </li>
                         </ul>
                         <dl class="rowEightFlItemDl">
                              <dt>
                                  <p class="rowEightFlItemDlTit">{{currentCluesData.departID?currentCluesData.departName:language=='Module_cnStat'?'中文':'英文'}}成交数量</p>
                                  <p class="rowEightFlItemDlNum">{{ScoreData.addallsnumber}}<span v-if="ScoreData.allsnumber!=ScoreData.addallsnumber">(占总成交{{ScoreData.allsnumberPercen}})</span></p>
                              </dt>
                              <dt>
                                  <p class="rowEightFlItemDlTit">{{currentCluesData.departID?currentCluesData.departName:language=='Module_cnStat'?'中文':'英文'}}成交积分</p>
                                  <p class="rowEightFlItemDlNum">{{ScoreData.addallscore}}<span v-if="ScoreData.allscore!=ScoreData.addallscore">(占总成交{{ScoreData.allscorePercen}})</span></p>
                              </dt>
                         </dl>
                    </div>
               </div>
</template>

<script>
export default {
    name:'demo',
    data(){
        return {
            ScoreTimeDate:'',
        }
    },
    props:{
        language:{
            type:String,
            default:""
        },
        ScoreTime:{
            type:String,
            default:""
        },
        currentCluesData:{
            type:Object,
            default:function(){
                return {}
            }
        },
        ScoreData:{
            type:Object,
            default:function(){
                return {}
            }
        },
    },
    watch:{
        ScoreTime:function(newval){
            this.setScoreTimeDate(newval)
        }
    },
    created(){
        
    },
    methods:{
    // 成交统计月份选择
        monthChangeHandler(val){
            this.$emit("monthChangeHandlerDemo",val)
        },
        setScoreTimeDate(val){
            this.ScoreTimeDate = val
        }
    }
}
</script>

<style>

</style>