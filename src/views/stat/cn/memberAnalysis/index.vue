<template>
  <div class="page-root scroll-panel personAnalysis" ref="boxPane">
      <div class="personTopTab">
          <div class="chooseDepart flex-box">
                <span class="choosetit">部门选择：</span>
                <div class="departItems flex-content">
                <span v-bind:class="item.isOn?'active':''" v-for="(item,index) in department" :key="index" v-on:click="departChange(item.id)">{{item.name}}</span>
                </div>
          </div>
          <div class="choosePerson" :class="searchData.dept_id?'active':''">
                <div class="departItems">
                    <p class="item-checkbox" v-bind:class="item.isOn?'active':''" v-for="(item,index) in choosePerson" :key="index" v-on:click="PersonChange(searchData.dept_id,item.id)"><i></i><span>{{item.name}}</span></p>
                </div>
          </div>
      </div>
      <div class="flex-content dealRankMain">
        <div class="dealRankLeft">
          <div class="dealRankTop">
            <unpay-inquiry 
              :unpayInquiry="unpayInquiry"
              :unpayInquirySet="unpayInquirySet"
              :lang="ch"
              @changeSet="changeSet"
            ></unpay-inquiry>
            <unpay-deal
              :dealScore="dealScore"
              :dealScoreSet="dealScoreSet"
              @changeSet="changeSet"
              :scoretime ="scoretime"
              :lang="ch"
            ></unpay-deal>
            <million-deal
              :millionDeal="millionDeal"
              :millionDealSet="millionDealSet"
              :lang="ch"
              :scoretime ="scoretime"
              @changeSet="changeSet"
            ></million-deal>
          </div>
          <pay-member
            :payMember="payMember"
            :lang="ch"
          ></pay-member>
        </div>
        <div class="dealRankRight">
          <award-rank
            :awardMoney="awardMoney"
            :awardMoneySet="awardMoneySet"
            :lang="ch"
            :moneytime ="moneytime"
            @changeSet="changeSet"
          ></award-rank>
        </div>
      </div>
  </div>
</template>
<script>
import UnpayInquiry from "../../components/memberCompare/UnpayInquiry"
import UnpayDeal from "../../components/memberCompare/UnpayDeal"
import PayMember from "../../components/memberCompare/PayMember"
import MillionDeal from "../../components/memberCompare/MillionDeal"
import AwardRank from "../../components/memberCompare/AwardRank"
import {numSeparate,rankingWithTotalItem} from "@/utils/index"
export default {
  name: "cnMemberAnalysis",
  data() {
    return {
      department:[],//部门列表
      choosePerson:[], //组员列表  
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
      },
      searchData:{
          dept_id:'',
          id:'',
      },
      scoretime:'',
      moneytime: ''
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
    $this.getUserMenuButtonPermit();
  },
  methods: {
    //获取部门信息
    getCnDepartList(){
      var $this = this;
      $this.$store.dispatch("api/getCnDepartAction").then((res) => {
          if (res) {
            if (res.status) {
                if(res.data&&res.data.length>0){
                    var department=[];
                    res.data.forEach(function(item,index){
                        var objItem={};
                        objItem.name=item.name;
                        objItem.id=item.id;
                        objItem.isOn=false;
                        department.push(objItem);
                    });
                    $this.department=department;
                }
                $this.getCnPersonlist();
            } else {
              $this.$message({
                showClose: true,
                message: response.info,
                type: "error",
                duration: 6000
              });
            }
          }
      });
    },
    //获取部门下组员信息
    getCnPersonlist(){
      var $this = this;
      var searchData={};
      searchData.dept_id=$this.searchData.dept_id;
      $this.$store.dispatch("api/getCnPersonlistAction",searchData).then((res) => {
          if (res) {
            if (res.status) {
                if(res.ulist&&res.ulist.length>0){
                    var choosePerson=[];
                    res.ulist.forEach(function(item,index){
                        var objItem={};
                        objItem.name=item.name;
                        objItem.id=item.id;
                        objItem.isOn=false;
                        choosePerson.push(objItem);
                    });
                    $this.choosePerson=choosePerson;
                }
            } else {
              $this.$message({
                showClose: true,
                message: response.info,
                type: "error",
                duration: 6000
              });
            }
          }
      });
    },
    // 点击部门获取部门ID
    departChange(valData){
        var $this=this;
        $this.searchData.dept_id=valData;
        $this.department.forEach(function(item,index){
            item.isOn=false;
            if(item.id==valData){
              item.isOn=true;
            }
        });
        $this.getCnPersonlist();
    },
    // 点击组员获取组员ID
    PersonChange(deptId,itemId){
        var $this=this;
        $this.choosePerson.forEach(function(item,index){
            item.isOn=false;
            if(item.id==itemId){
              item.isOn=true;
              $this.searchData.id=item.id;
            }
        });
        // 跳转个人详情
        var routeUrl =  $this.$router.resolve({path: "/stat/cn/memberAnalysis/singlePerson",query:{deptId:deptId,itemId:itemId}});
        window.open(routeUrl.href,'_blank');
    },
    // 获取当前登陆用户在该页面的操作权限
    getUserMenuButtonPermit(){
      var $this = this;
      $this.$store.dispatch('api/getMenuButtonPermitAction',{id:$this.$router.currentRoute.meta.id}).then(res=>{
        if(res.data.length>0){
          var permitData = [];
          res.data.forEach(function(item,index){
            permitData.push(item.action_route);
          });
          if(permitData.includes('Api_chinapersoncountdefault')){
            $this.initData()
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
    // 初始化数据
    initData() {
      var $this = this;
      $this.getCnDepartList();
      $this.GetInquiryResult();
    },
    // 获取中文询盘、成交等情况
    GetInquiryResult(){
      var $this = this;
      $this.$store.dispatch("memberCompare/postInquiryRank").then((response) => {
          if (response) {
            if (response.status) {
              // 非付费询盘
              if(response.xunulist&&response.xunulist.length>0){
                  var unpayInquiry=rankingWithTotalItem(response.xunulist,'number');
                  unpayInquiry.forEach(function(item){
                    item.number = numSeparate(item.number);
                    item.deptName=item.departname;
                  });
                  $this.unpayInquiry = unpayInquiry;
                  if(response.xunulist.length < 9){
                      $this.unpayInquirySet.ifFold = false;
                      $this.unpayInquirySet.boxHeight = "auto";
                  }else{
                      $this.unpayInquirySet.ifFold = true;
                      $this.unpayInquirySet.boxHeight = "630px";
                      $this.unpayInquirySet.isFold = false;
                  }
              }
              // 成交积分
              if(response.scorelist&&response.scorelist.length>0){
                  var dealScore=rankingWithTotalItem(response.scorelist,'score');
                  dealScore.forEach(function(item){
                    item.score = numSeparate(Math.floor(item.score*100)/100);
                    item.deptName=item.departname;
                  });
                  $this.dealScore = dealScore;
                  $this.scoretime = response.scoretime;
                  if(response.scorelist.length < 9){
                      $this.dealScoreSet.ifFold = false;
                      $this.dealScoreSet.boxHeight = "auto";
                  }else{
                      $this.dealScoreSet.ifFold = true;
                      $this.dealScoreSet.boxHeight = "630px";
                      $this.dealScoreSet.isFold = false;
                  }
              }
              // 付费
              if(response.semulist&&response.semulist.length>0){
                  var payMember=rankingWithTotalItem(response.semulist,'number');
                  payMember.forEach(function(item){
                    item.numberStr = numSeparate(item.number);
                    item.deptName=item.departname;
                  });
                  $this.payMember=payMember;
              }
              // 百万成交
              if(response.Alist&&response.Alist.length>0){
                  var millionDeal=rankingWithTotalItem(response.Alist,'number');
                  millionDeal.forEach(function(item){
                    item.deptName=item.departname;
                  });
                  $this.millionDeal=millionDeal;
                  if(response.Alist.length < 3){
                      $this.millionDealSet.ifFold = false;
                      $this.millionDealSet.boxHeight = "auto";
                  }else{
                      $this.millionDealSet.ifFold = true;
                      $this.millionDealSet.boxHeight = "630px";
                      $this.millionDealSet.isFold = false;
                  }
              }
              // 奖金排序
              if(response.moneylist&&response.moneylist.length>0){
                var moneyarr = response.moneylist;
                moneyarr.sort($this.compare('allmoney'));
                var awardMoney = rankingWithTotalItem(moneyarr,'allmoney');
                awardMoney.forEach(function(item){
                  item.allmoney = numSeparate(Math.floor(item.allmoney*100)/100);
                  item.deptName=item.departname;
                });
                $this.awardMoney=awardMoney;
                $this.moneytime = response.moneytime;
                if(response.moneylist.length < 9){
                    $this.awardMoneySet.ifFold = false;
                    $this.awardMoneySet.boxHeight = "auto";
                }else{
                    $this.awardMoneySet.ifFold = true;
                    $this.awardMoneySet.boxHeight = "1133px";
                    $this.awardMoneySet.isFold = false;
                }
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



