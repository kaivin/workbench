
<template><transition name="fade-transform" mode="out-in">
  <div class="page-root scroll-panel overview-page cn-stat" ref="boxPane">
    <div class="nowCate">
      {{nowcate}}
    </div>
    <el-card class="box-card scroll-card" shadow="hover">
        <div class="homeMain flex-content">
           <el-row class="hxmodule-view">
             <el-col class="hxmodule-item" :xl="6" :lg="12">
               <XpanYears
               language="中文"
               :yeartong="yeartong"
               :yearcount="yearcount"
               :departList="departList"
               ></XpanYears>
             </el-col>
             <el-col class="hxmodule-item" :xl="6" :lg="12">
               <ScoreYears
               language="中文"
               :yearscoretong="yearscoretong"
               :yeardeaprtscore="yeardeaprtscore"
               :departList="departList"
               ></ScoreYears>
             </el-col>
             <el-col class="hxmodule-item" :xl="6" :lg="12">
               <DealYears
               language="中文"
               :yearsanumbertong="yearsanumbertong"
               :yeardeaprtscore="yeardeaprtscore"
               :departList="departList"
               ></DealYears>
             </el-col>
             <el-col class="hxmodule-item" :xl="6" :lg="12">
               <CostYears
               language="中文"
               :yearsmoneytong="yearsmoneytong"
               :yeardeaprtscore="yeardeaprtscore"
               :departList="departList"
               ></CostYears>
             </el-col>
             <el-col class="hxmodule-item" :xl="12" :lg="24" >
               <HotArea
               language="中文"
               :provincecountmap="provincecountmap"
               :provincescoretmap="provincescoretmap"
               :departList="departList"
               ></HotArea>
             </el-col>
             <el-col class="hxmodule-item" :xl="6" :lg="12" >
               <ScoreTop
               :yearuserscoretop5="yearuserscoretop5"
               ></ScoreTop>
             </el-col>
             <el-col class="hxmodule-item" :xl="6" :lg="12">
               <XpanTop
               :moneytop5="moneytop5"
               ></XpanTop>
             </el-col>
           </el-row>
        </div>
    </el-card>
  </div></transition>
</template>
<script>
import CostYears from "../../components/dataOverview/CostYears.vue";
import DealYears from "../../components/dataOverview/DealYears.vue";
import HotArea from "../../components/dataOverview/HotArea.vue";
import ScoreTop from "../../components/dataOverview/ScoreTop.vue";
import ScoreYears from "../../components/dataOverview/ScoreYears.vue";
import XpanTop from "../../components/dataOverview/XpanTop.vue";
import XpanYears from "../../components/dataOverview/XpanYears.vue";
import {getChinacountnew} from "@/api/dataOverview.js";
import {numSeparate} from "@/utils/index";
export default {
  name: "cnDataOverview",
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
      moneytop5:[],//个人年度总询盘个数 TOP5
      yearuserscoretop5:[],//年度积分top5
      provincecountmap:[],//询盘地图 
      provincescoretmap:[],//成交地图
      departList:[],
      nowcate: ""
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
    this.getUserMenuButtonPermit()
    this.nowcate = this.$route.meta.title;
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
          if(permitData.includes('Api_chinacountnew')){
            $this.getPageData()
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
    getPageData(){
      getChinacountnew().then(res=>{
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
          var moneytop5=res.moneytop5;
          moneytop5.forEach(function(item){
            item.allmoney = numSeparate(item.allmoney);
          });
          this.moneytop5 = moneytop5;
          this.yearuserscoretop5 = res.yearuserscoretop5;
          this.provincecountmap =  res.provincecountmap;
          this.provincescoretmap = res.provincescoretmap;
          this.departList = res.readart;
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
