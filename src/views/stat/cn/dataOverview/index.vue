
<template><transition name="fade-transform" mode="out-in">
  <div class="page-root scroll-panel overview-page cn-stat" ref="boxPane">
    <div class="nowCate">
      {{nowcate}} 
      <div class="btn-group">
        <div @click="changeType(1)" class="btn-item" :class="type == 1?'active':''">{{prevYear}}年</div>
        <div @click="changeType(2)" class="btn-item" :class="type == 2?'active':''">{{nowYear}}年</div>
      </div>
    </div>
    <el-card class="box-card scroll-card" shadow="hover">
        <div class="homeMain flex-content">
          <el-row class="hxmodule-view" :gutter="14">
              <el-col class="hxmodule-item" :xl="8" :lg="12">
                <XpanYears
                language="中文"
                :yeartong="yeartong"
                :departList="departList"
                :year="type==1?prevYear:nowYear"
                ></XpanYears>
              </el-col>
              <el-col class="hxmodule-item" :xl="8" :lg="12">
                <ScoreYears
                language="中文"
                :yearscoretong="yearscoretong"
                :departList="departList"
                :year="type==1?prevYear:nowYear"
                ></ScoreYears>
              </el-col>
              <el-col class="hxmodule-item" :xl="8" :lg="12">
                <DealYears
                language="中文"
                :yearsanumbertong="yearsanumbertong"
                :departList="departList"
                :year="type==1?prevYear:nowYear"
                ></DealYears>
              </el-col>
              <el-col class="hxmodule-item" :xl="6" :lg="24">
                <div class="overviewItem">
                  <XpanPercent
                    language="中文"
                    :departList="departList"
                    :year="type==1?prevYear:nowYear"
                    :yearcount="yearcount">
                    </XpanPercent>
                </div>
                <div class="overviewItem">
                  <ScorePercent
                    language="中文"
                    :departList="departList"
                    :year="type==1?prevYear:nowYear"
                    :yeardeaprtscore="yeardeaprtscore">
                    </ScorePercent>
                </div>
                
              </el-col>
              <el-col class="hxmodule-item" :xl="12" :lg="24" >
                <HotArea
                language="中文"
                :regionData="regionData"
                :departList="departList"
                :year="type==1?prevYear:nowYear"
                ></HotArea>
              </el-col>
              <el-col class="hxmodule-item" :xl="6" :lg="24" >
                  <div class="overviewItem">
                  <DealDepart
                  language="中文"
                  :yeardeaprtscore="yeardeaprtscore"
                  :departList="departList"
                  :year="type==1?prevYear:nowYear"
                  ></DealDepart>
                  </div>
                  <div class="overviewItem">
                  <CostDepart
                  language="中文"
                  :yeardeaprtscore="yeardeaprtscore"
                  :departList="departList"
                  :year="type==1?prevYear:nowYear"
                  ></CostDepart>
                  </div>
              </el-col>

              <el-col class="hxmodule-item overbtm_box" :xl="24" :lg="24">
                  <div class="hotpro_box">
                    <HotProduct
                    language="中文"
                    :producttop10="producttop10"
                    :year="type==1?prevYear:nowYear"
                    :departList="departList"
                    ></HotProduct>
                  </div>
                  <div class="scoretop_box">
                    <ScoreTop
                    language="中文"
                    :scoretop5="scoretop5"
                    ></ScoreTop>
                  </div>
              </el-col>
          </el-row>
        </div>
    </el-card>
  </div></transition>
</template>
<script>
import CostYears from "../../components/dataOverview/CostYears.vue";
import CostDepart from "../../components/dataOverview/CostDepart.vue";
import DealYears from "../../components/dataOverview/DealYears.vue";
import DealDepart from "../../components/dataOverview/DealDepart.vue";
import HotArea from "../../components/dataOverview/HotArea.vue";
import ScoreTop from "../../components/dataOverview/ScoreTop.vue";
import ScoreYears from "../../components/dataOverview/ScoreYears.vue";
import ScorePercent from "../../components/dataOverview/ScorePercent.vue";
import XpanTop from "../../components/dataOverview/XpanTop.vue";
import XpanYears from "../../components/dataOverview/XpanYears.vue";
import XpanPercent from "../../components/dataOverview/XpanPercent.vue";
import HotProduct from "../../components/dataOverview/HotProduct.vue";
import {getChinacountnew} from "@/api/dataOverview.js";
import {numSeparate,rankingWithTotalItem} from "@/utils/index";
import { mapGetters } from 'vuex';
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
      regionData:{
        provincecountmap:[],//询盘地图 
        provincescoretmap:[],//成交地图
        regionInquiryCountDepart:[],// 地区各部门询盘个数
        regionDealScoreDepart:[], // 地区各部门成交积分
      },
      departList:[],
      nowcate: "",//当前分类
      producttop10:{
        productscoretop10:[],//产品积分top10
        productxuntop10:[],//产品询盘top10
      },
      scoretop5:{
        yearuserxuntop5:[],//询盘top5
        anumbertop5:[],//百万成交top5
        moneytop5:[],//个人年度总询盘个数 TOP5
        yearuserscoretop5:[],//年度积分top5
      },
      type: 2,//默认展示今年的数据
    };
  },
  computed: {
    ...mapGetters([
      'sidebar',
    ]),
    nowYear(){
      return new Date().getFullYear();
    },
    prevYear(){
      return new Date().getFullYear()-1;
    }
  },
  components:{
    CostYears,//年度成本
    CostDepart,//部门年度成本
    DealYears,//年度100万数量
    DealDepart,//部门年度100万数量
    HotArea,//热门地区
    ScoreTop,//个人积分排行
    ScoreYears,//年度积分
    ScorePercent,//部门年度积分
    XpanTop,//个人询盘排行
    XpanYears,//年度询盘
    XpanPercent,//部门年度询盘
    HotProduct,//热门产品
  },
  created() {
    this.getUserMenuButtonPermit()
    this.nowcate = this.$route.meta.title;
    var month = new Date().getMonth();
    if(month < 3){
      this.type = 1
    }
  },
  mounted(){
    const $this = this;
    if(!$this.sidebar.opened){
      $this.$store.dispatch('app/toggleSideBar');
    }    
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
      var data = {};
      if(this.type == 1){
        data.ytime = this.prevYear
      }else{
        data.ytime = this.nowYear
      }
      getChinacountnew(data).then(res=>{
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
          this.regionData.provincecountmap =  res.provincecountmap;
          this.regionData.provincescoretmap = res.provincescoretmap;
          this.regionData.regionInquiryCountDepart = res.provincedepartxuntop10;
          this.regionData.regionDealScoreDepart = res.provincedepartscoretop10;
          this.departList = res.readart;
          this.producttop10.productxuntop10 = res.productxuntop10;
          this.producttop10.productscoretop10 = res.productscoretop10;
          var moneytop5=res.moneytop5;
          moneytop5.sort(function(a, b){return a.allmoney - b.allmoney}).reverse();
          moneytop5 = rankingWithTotalItem(moneytop5,'allmoney');
          moneytop5.forEach(function(item){
            item.allmoney = numSeparate(item.allmoney);
          });
          this.scoretop5.moneytop5 = moneytop5;
          var yearuserscoretop5 = res.yearuserscoretop5;
          yearuserscoretop5.sort(function(a, b){return a.number - b.number}).reverse(); 
          yearuserscoretop5 = rankingWithTotalItem(yearuserscoretop5,'number');
          this.scoretop5.yearuserscoretop5 = yearuserscoretop5;
          var anumbertop5 = res.anumbertop5;
          anumbertop5.sort(function(a, b){return a.number - b.number}).reverse(); 
          anumbertop5 = rankingWithTotalItem(anumbertop5,'number');
          this.scoretop5.anumbertop5 = anumbertop5;
          var yearuserxuntop5 = res.yearuserxuntop5;
          yearuserxuntop5.sort(function(a, b){return a.number - b.number}).reverse(); 
          yearuserxuntop5 = rankingWithTotalItem(yearuserxuntop5,'number');
          this.scoretop5.yearuserxuntop5 =yearuserxuntop5;
        }
      })
    },
    changeType(val){
      this.type = val;
      this.getPageData()
    },
  }
}
</script>
<style lang="scss" scoped>

</style>
