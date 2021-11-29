<template>
  <div class="page-root scroll-panel home-index" ref="boxPane">
    <el-card class="box-card scroll-card" shadow="hover">
        <div class="homeMain flex-content">
           <el-row :gutter="20" class="hxmodule-view">
             <el-col class="hxmodule-item" :xl="6" :lg="12">
               <XpanYears
               language="英文"
               :yeartong="yeartong"
               :yearcount="yearcount"
               :departList="departList"
               ></XpanYears>
             </el-col>
             <el-col class="hxmodule-item" :xl="6" :lg="12">
               <ScoreYears
               language="英文"
               :yearscoretong="yearscoretong"
               :yeardeaprtscore="yeardeaprtscore"
               :yearscorenumbertong="yearscorenumbertong"
               :yearscorenumbercount="yearscorenumbercount"
               :departList="departList"
               ></ScoreYears>
             </el-col>
             <el-col class="hxmodule-item" :xl="6" :lg="12">
               <DealYears
               language="英文"
               :yearsanumbertong="yearsanumbertong"
               :yeardeaprtscore="yeardeaprtscore"
               :departList="departList"
               ></DealYears>
             </el-col>
             <el-col class="hxmodule-item" :xl="6" :lg="12">
               <CostYears
               language="英文"
               :yearsmoneytong="yearsmoneytong"
               :yeardeaprtscore="yeardeaprtscore"
               :departList="departList"
               ></CostYears>
             </el-col>
             <el-col class="hxmodule-item" :xl="12" :lg="24" >
               <HotArea
               language="英文"
               :provincecountmap="provincecountmap"
               :provincescoretmap="provincescoretmap"
               :provincescorenumbertmap="provincescorenumbertmap"
               :departList="departList"
               ></HotArea>
             </el-col>
             <el-col class="hxmodule-item" :xl="6" :lg="12" >
               <XpanTop
               language="英文"
               :yearusertop5="yearusertop5"
               ></XpanTop>
             </el-col>
             <el-col class="hxmodule-item" :xl="6" :lg="12" >
               <ScoreTop
               language="英文"
               :yearuserscoretop5="yearuserscoretop5"
               ></ScoreTop>
             </el-col>
           </el-row>
        </div>
    </el-card>
  </div>
</template>

<script>
import CostYears from "@/components/dataOverview/CostYears.vue";
import DealYears from "@/components/dataOverview/DealYears.vue";
import HotArea from "@/components/dataOverview/HotArea.vue";
import ScoreTop from "@/components/dataOverview/ScoreTop.vue";
import ScoreYears from "@/components/dataOverview/ScoreYears.vue";
import XpanTop from "@/components/dataOverview/XpanTop.vue";
import XpanYears from "@/components/dataOverview/XpanYears.vue";
import {getEncountnew} from "@/api/dataOverview.js";
export default {
  name: "enDataOverview",
  data() {
    return {
      menuButtonPermit: [],//操作权限
      permitModules: [],
      yeartong:[],//中文年度询盘对比
      yearcount:[],//部门询盘占比
      yearscoretong:[],//中文年度成交积分对比
      yeardeaprtscore:[],//各部门年度成交积分
      yearsanumbertong:[],//中文年度成交100万数量对比
      yearsmoneytong:[],//中文年度总成本对比
      yearusertop5:[],//个人年度总询盘个数 TOP5
      yearuserscoretop5:[],//年度积分top5
      provincecountmap:[],//询盘地图 
      provincescoretmap:[],//成交积分地图
      provincescorenumbertmap:[],//成交个数地图
      yearscorenumbertong:[],//英文年度成交个数
      yearscorenumbercount:[],//英文年度成交个数占比
      departList:[],
    };
  },
  components:{
    CostYears,//年度成本
    DealYears,//年度100万数量
    HotArea,//热门地区
    ScoreTop,//个人积分排行
    ScoreYears,//年度积分
    XpanTop,//个人询盘排行
    XpanYears,//年度询盘
  },
  created() {
    this.getPageData()
  },
  methods: {
    getPageData(){
      getEncountnew().then(res=>{
        if(res.status){
          this.yeartong = res.yeartong;
          this.yearcount = res.yearcount;
          let yearscoretong = res.yearscoretong;
          for(let i = 0;i<yearscoretong.length;i++){
            yearscoretong[i].lastscore = parseFloat(parseFloat(yearscoretong[i].lastscore).toFixed(2));
            yearscoretong[i].score = parseFloat(parseFloat(yearscoretong[i].score).toFixed(2));
          }
          this.yearscoretong = yearscoretong;
          this.yeardeaprtscore = res.yeardeaprtscore;
          this.yearsanumbertong = res.yearsanumbertong;
          this.yearsmoneytong = res.yearsmoneytong;
          this.yearusertop5 = res.yearusertop5;
          this.yearuserscoretop5 = res.yearuserscoretop5;
          this.provincecountmap =  res.provincecountmap;
          this.provincescoretmap = res.provincescoretmap;
          this.provincescorenumbertmap = res. provincescorenumbertmap;
          this.yearscorenumbertong = res.yearscorenumbertong;
          this.yearscorenumbercount = res.yearscorenumbercount;
          this.departList = res.readart;
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.hxmodule-item{
  margin-bottom: 22px;
  
}
</style>
