<template>
  <div class="page-root scroll-panel home-index" ref="boxPane">
    <el-card class="box-card scroll-card" shadow="hover">
        <div class="personTopTab">
            <div class="chooseDepart flex-box">
                  <span class="choosetit">部门选择：</span>
                  <div class="departItems flex-content">
                  <span v-bind:class="item.isOn?'active':''" v-for="(item,index) in department" :key="index" v-on:click="departChange(item.id)">{{item.name}}</span>
                  </div>
            </div>
            <div class="choosePerson">
                  <div class="decor"></div>
                  <div class="departItems">
                      <p class="item-checkbox" v-bind:class="item.isOn?'active':''" v-for="(item,index) in choosePerson" :key="index" v-on:click="PersonChange(searchData.dept_id,item.id)"><i></i><span>{{item.name}}</span></p>
                  </div>
            </div>
        </div>
        <div class="homeMain flex-content dealRankMain">
          <div class="dealRankLeft">
            <div class="dealRankTop">
              <unpay-inquiry 
                :unpayInquiry="unpayInquiry"
                :unpayInquirySet="unpayInquirySet"
                :lang="en"
                @changeSet="changeSet"
              ></unpay-inquiry>
              <unpay-deal
                :dealScore="dealScore"
                :dealScoreSet="dealScoreSet"
                @changeSet="changeSet"
                :lang="en"
              ></unpay-deal>
            </div>
            <pay-member
              :payMember="payMember"
              :lang="en"
            ></pay-member>
          </div>
          <div class="dealRankRight">
            <million-deal
              :millionDeal="millionDeal"
              :millionDealSet="millionDealSet"
              :lang="en"
              @changeSet="changeSet"
            ></million-deal>
            <award-rank
              :awardMoney="awardMoney"
              :awardMoneySet="awardMoneySet"
              :lang="en"
              @changeSet="changeSet"
            ></award-rank>
          </div>
        </div>
    </el-card>
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
  name: "enMemberAnalysis",
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
      en:"en",
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
      $this.$store.dispatch("api/getEnDepartAction").then((res) => {
          if (res) {
            if (res.status) {
                if(res.data&&res.data.length>0){
                    var department=[];
                    res.data.forEach(function(item,index){
                        var objItem={};
                        objItem.name=item.name;
                        objItem.id=item.id;
                        if(index==0){
                          objItem.isOn=true;
                          $this.searchData.dept_id=item.id;
                        }else{
                          objItem.isOn=false;
                        }
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
      $this.$store.dispatch("api/getEnPersonlistAction",searchData).then((res) => {
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
        var routeUrl =  $this.$router.resolve({path: "/stat/en/memberAnalysis/singlePerson",query:{deptId:deptId,itemId:itemId}});
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
          if(permitData.includes('Api_enpersoncountdefault')){
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

    // 获取英文询盘、成交等情况
    GetInquiryResult(){
      var $this = this;
      $this.$store
        .dispatch("memberCompare/postEnInquiryRank")
        .then((response) => {
          if (response) {
            if (response.status) {
              console.log(response);
              // 非付费询盘
              $this.unpayInquiry = rankingWithTotalItem(response.xunulist,'number');
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
              $this.dealScore = rankingWithTotalItem(response.scorelist,'score');
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
              $this.payMember = rankingWithTotalItem(response.semulist,'number');
              // 百万成交
              $this.millionDeal = rankingWithTotalItem(response.Alist,'number');
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
              $this.awardMoney = rankingWithTotalItem(moneyarr,'allmoney');
              $this.awardMoney.forEach(function(item){
                item.allmoney = numSeparate(Math.floor(item.allmoney*100)/100);
              });
              console.log($this.awardMoney,"奖金排行榜");
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



