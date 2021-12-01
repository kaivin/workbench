<template>
  <div class="page-root scroll-panel home-index" ref="boxPane">
    <el-card class="box-card scroll-card" shadow="hover">
        <div class="homeMain flex-content dealRankMain">
          <div class="dealRankLeft">
            <div class="dealRankTop">
              <unpay-inquiry 
                :unpayInquiry="unpayInquiry"
                :unpayInquirySet="unpayInquirySet"
                @changeSet="changeSet"
              ></unpay-inquiry>
              <unpay-deal
                :dealScore="dealScore"
                :dealScoreSet="dealScoreSet"
                @changeSet="changeSet"
                :lang="ch"
              ></unpay-deal>
            </div>
            <pay-member
              :payMember="payMember"
              :lang="ch"
            ></pay-member>
          </div>
          <div class="dealRankRight">
            <million-deal
              :millionDeal="millionDeal"
              :millionDealSet="millionDealSet"
              @changeSet="changeSet"
            ></million-deal>
            <award-rank
              :awardMoney="awardMoney"
              :awardMoneySet="awardMoneySet"
              @changeSet="changeSet"
            ></award-rank>
          </div>
        </div>
    </el-card>
  </div>
</template>
<script>
import UnpayInquiry from "../../compoents/memberCompare/UnpayInquiry"
import UnpayDeal from "../../compoents/memberCompare/UnpayDeal"
import PayMember from "../../compoents/memberCompare/PayMember"
import MillionDeal from "../../compoents/memberCompare/MillionDeal"
import AwardRank from "../../compoents/memberCompare/AwardRank"
import {numSeparate} from "@/utils/index"
export default {
  name: "cnGroupAnalysis",
  data() {
    return {
      unpayInquiry: [],
      unpayInquirySet:{
        ifFold: false,//是否需要折叠
        boxHeight: '',
        isFold: false,
      },
      ch:'ch',
      dealScore:[],
      dealScoreSet:{
        ifFold: false,//是否需要折叠
        boxHeight: '',
        isFold: false,
      },
      payMember:[],
      millionDeal:[],
      millionDealSet:{
        ifFold: false,//是否需要折叠
        boxHeight: '',
        isFold: false,
      },
      awardMoney:[],
      awardMoneySet:{
        ifFold: false,//是否需要折叠
        boxHeight: '',
        isFold: false,
      }
    };
  },
  components:{
    UnpayInquiry,
    UnpayDeal,
    PayMember,
    MillionDeal,
    AwardRank,
  },
  created() {
    var $this = this;
    $this.initData();
  },
  methods: {
    // 初始化数据
    initData() {
      var $this = this;
      $this.GetInquiryResult();
    },

    // 获取中文询盘、成交等情况
    GetInquiryResult(){
      var $this = this;
      $this.$store.dispatch("memberCompare/postInquiryRank").then((response) => {
          if (response) {
            if (response.status) {
              // 非付费询盘
              $this.unpayInquiry = response.xunulist;
              $this.unpayInquiry.forEach(function(item){
                item.number = numSeparate(item.number);
              });
              if(response.xunulist.length < 9){
                  $this.unpayInquirySet.ifFold = false;
                  $this.unpayInquirySet.boxHeight = "auto";
              }else{
                  $this.unpayInquirySet.ifFold = true;
                  $this.unpayInquirySet.boxHeight = "770px";
                  $this.unpayInquirySet.isFold = false;
              }
              // 成交积分
              $this.dealScore = response.scorelist;
              $this.dealScore.forEach(function(item){
                item.score = numSeparate(Math.floor(item.score*100)/100);
              });
              if(response.scorelist.length < 9){
                  $this.dealScoreSet.ifFold = false;
                  $this.dealScoreSet.boxHeight = "auto";
              }else{
                  $this.dealScoreSet.ifFold = true;
                  $this.dealScoreSet.boxHeight = "770px";
                  $this.dealScoreSet.isFold = false;
              }
              // 付费
              $this.payMember = response.semulist;
              // 百万成交
              $this.millionDeal = response.Alist;
              if(response.Alist.length < 3){
                  $this.millionDealSet.ifFold = false;
                  $this.millionDealSet.boxHeight = "auto";
              }else{
                  $this.millionDealSet.ifFold = true;
                  $this.millionDealSet.boxHeight = "296px";
                  $this.millionDealSet.isFold = false;
              }
              // 奖金排序
              var moneyarr = response.moneylist;
              moneyarr.sort($this.compare('allmoney'));
              $this.awardMoney = moneyarr;
              $this.awardMoney.forEach(function(item){
                item.allmoney = numSeparate(Math.floor(item.allmoney*100)/100);
              });
              if(response.moneylist.length < 9){
                  $this.awardMoneySet.ifFold = false;
                  $this.awardMoneySet.boxHeight = "auto";
              }else{
                  $this.awardMoneySet.ifFold = true;
                  $this.awardMoneySet.boxHeight = "770px";
                  $this.awardMoneySet.isFold = false;
              }

            } else {
              $this.$message({
                showClose: true,
                message: response.info,
                type: "error",
                duration: 6000
              });
              $this.$router.push({path: `/login?redirect=${$this.$router.currentRoute.fullPath}`})
            }
          }
      });
    },
    // 展开折叠点击事件
    changeSet(data,isfold,boxheight){
      var $this = this;
      var property = data;
      property.isFold = isfold;
      property.boxHeight = boxheight;
    },

    // 数组排序
    compare(property) {
      return function(a,b){
        var value1 = a[property];
        var value2 = b[property];
        return value2 - value1;
      }
    }

  }
}


</script>



