<template>
  <div class="page-root scroll-panel home-index" ref="boxPane">
        <div class="personTopTab">
            <div class="chooseDepart flex-box">
                  <span class="choosetit">部门选择：</span>
                  <div class="departItems noAfter">
                       <span v-bind:class="item.isOn?'active':''" v-for="(item,index) in department" :key="index" v-on:click="departChange(item.id)">{{item.name}}</span>
                  </div>
                  <span class="choosetit" style="margin-left:20px">时间选择：</span>
                  <div class="departItems flex-content">
                      <el-date-picker
                        v-model="searchData.data"
                        @change="handleData"
                        type="monthrange"
                        format="yyyy-MM"
                        value-format="yyyy-MM"
                        key="b"
                        size="mini"
                        class="date-range"
                        range-separator="～"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerMonthRangeOptions">
                      </el-date-picker>
                      <i class="departItemBtn" v-on:click="departItemBtn">重置</i>
                  </div>
            </div>
        </div>
        <div class="flex-content dealRankMain" :class="searchData.dept_id==''?'':'active'">
          <div class="dealRankLeft">
            <div class="dealRankTop">
              <template v-if='searchData.dept_id!=12'>
                <unpay-inquiry 
                  :unpayInquiry="unpayInquiry"
                  :unpayInquirySet="unpayInquirySet"
                  :lang="en"
                  :ByTime ="Inquirytime"
                  :isdep1="isdep1"
                  @changeSet="changeSet"
                ></unpay-inquiry>
              </template>
              <template v-if='searchData.dept_id==12'>
                <unpay-inquiry 
                  :unpayInquiry="payMember"
                  :unpayInquirySet="payMemberSet"
                  :lang="en"
                  :ByTime ="Paytime"
                  :isdep1="isdep1"
                  @changeSet="changeSet"
                ></unpay-inquiry>
              </template>
              <unpay-deal
                :dealScore="dealScore"
                :dealScoreSet="dealScoreSet"
                @changeSet="changeSet"
                :scoretime ="scoretime"
                :lang="en"
                :isdep1="isdep1"
              ></unpay-deal>
              <million-deal
                :millionDeal="millionDeal"
                :millionDealSet="millionDealSet"
                :lang="en"
                @changeSet="changeSet"
                :scoretime ="scoretime"
              ></million-deal>
              <div class="dealRankRight" v-if='searchData.dept_id!=""'>
                <award-rank
                  :awardMoney="awardMoney"
                  :awardMoneySet="awardMoneySet"
                  :lang="en"
                  :isAwardBool="isAwardBool"
                  :moneytime ="moneytime"
                  @changeSet="changeSet"
                ></award-rank>
              </div>
            </div>
            <pay-member
              :payMember="payMember"
              :lang="en"
              v-if='searchData.dept_id==""'
            ></pay-member>
          </div>
          <div class="dealRankRight" v-if='searchData.dept_id==""'>
            <award-rank
              :awardMoney="awardMoney"
              :awardMoneySet="awardMoneySet"
              :lang="en"
              :isAwardBool="isAwardBool"
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
  name: "enMemberAnalysis",
  data() {
    return {
      ByTime:'',//截至时间
      department:[],//部门列表
      isAwardBool:false,
      unpayInquiry: [],
      unpayInquirySet:{
        ifFold: false,//是否需要折叠
        boxHeight: '630px',
        isFold: false,
      },
      en:"en",
      dealScore:[],
      dealScoreSet:{
        ifFold: false,//是否需要折叠
        boxHeight: '630px',
        isFold: false,
      },
      payMember:[],
      payMemberSet:{
        ifFold: false,//是否需要折叠
        boxHeight: '630px',
        isFold: false,
      },
      millionDeal:[],
      millionDealSet:{
        ifFold: false,//是否需要折叠
        boxHeight: '630px',
        isFold: false,
      },
      awardMoney:[],
      awardMoneySet:{
        ifFold: false,//是否需要折叠
        boxHeight: '630px',
        isFold: false,
      },
      searchData:{
          dept_id:'',
          id:'',
      },
      scoretime:'',
      moneytime: '',
      Inquirytime: '',
      Paytime: '',
      pickerMonthRangeOptions: {
        shortcuts: [{
          text: '今年至今',
          onClick(picker) {
            const end = new Date();
            const start = new Date(new Date().getFullYear(), 0);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近六个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setMonth(start.getMonth() - 6);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      isdep1:false
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
                        objItem.isOn=false;
                        department.push(objItem);
                    });
                    $this.department=department;
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
    // 清除搜索数据
    departItemBtn(){
        var $this=this;
        $this.department.forEach(function(item,index){
            item.isOn=false;
        });
        $this.searchData.dept_id='';
        $this.searchData.data=[];
        $this.searchData.starttime='';
        $this.searchData.endtime='';
        $this.GetInquiryResult();
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
        $this.GetInquiryResult();
    },
    //点击时间搜索
    handleData(){
      var $this=this;
      $this.GetInquiryResult();
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
    //重组搜索数据
    initsearch(){
      var $this = this;
      var searchData={};
      if($this.searchData.dept_id&&$this.searchData.dept_id!=''){
        searchData.dept_id=$this.searchData.dept_id;
      }
      if($this.searchData.data&&$this.searchData.data.length>0){
        searchData.starttime=$this.searchData.data[0];
        searchData.endtime=$this.searchData.data[1];
      }
      return searchData;
    },
    // 清空数据
    emptyData(){
        var $this=this;
        $this.unpayInquiry=[];
        $this.unpayInquirySet.ifFold=false;
        $this.unpayInquirySet.boxHeight='630px';
        $this.unpayInquirySet.isFold=false;
        $this.payMemberSet.ifFold=false;
        $this.payMemberSet.boxHeight='630px';
        $this.payMemberSet.isFold=false;
        $this.dealScore=[];
        $this.dealScoreSet.ifFold=false;
        $this.dealScoreSet.boxHeight='630px';
        $this.dealScoreSet.isFold=false;
        $this.payMember=[];
        $this.millionDeal=[];
        $this.millionDealSet.ifFold=false;
        $this.millionDealSet.boxHeight='630px';
        $this.millionDealSet.isFold=false;
        $this.awardMoney=[];
        $this.awardMoneySet.ifFold=false;
        $this.awardMoneySet.boxHeight='630px';
        $this.awardMoneySet.isFold=false;
        $this.scoretime='';
        $this.moneytime='';
        $this.Inquirytime='';
        
    },
    // 获取英文询盘、成交等情况
    GetInquiryResult(){
      var $this = this;
      var searchData={};
      searchData=$this.initsearch();
      $this.emptyData();
      $this.$store.dispatch("memberCompare/postEnInquiryRank",searchData).then((response) => {
          if (response) {
            if (response.status) {
                if($this.searchData.dept_id==12){
                  
                  var scorelist = [];
                  var inquirylist = [];
                  var alist = [];
                  if(response.semulist&&response.semulist.length>0){
                    for(var i=0;i<response.semulist.length;i++){
                      var scoreobj={};
                      var inquiryobj={};
                      var aobj={};
                      scoreobj.uid = response.semulist[i].id;
                      scoreobj.headimg = response.semulist[i].headimg;
                      scoreobj.departname = response.semulist[i].departname;
                      scoreobj.dept_id = response.semulist[i].dept_id;
                      scoreobj.score = response.semulist[i].score;
                      scoreobj.ownuser = response.semulist[i].name;
                      
                      inquiryobj.id = response.semulist[i].id;
                      inquiryobj.headimg = response.semulist[i].headimg;
                      inquiryobj.departname = response.semulist[i].departname;
                      inquiryobj.dept_id = response.semulist[i].dept_id;
                      inquiryobj.number = response.semulist[i].number;
                      inquiryobj.name = response.semulist[i].name;
                      
                      aobj.dept_id = response.semulist[i].dept_id;
                      aobj.headimg = response.semulist[i].headimg;
                      aobj.departname = response.semulist[i].departname;
                      aobj.uid = response.semulist[i].id;
                      aobj.number = response.semulist[i].Anumber;
                      aobj.ownuser = response.semulist[i].name;

                      scorelist.push(scoreobj);
                      inquirylist.push(inquiryobj);
                      alist.push(aobj);
                    }
                    // 付费
                    var inquirytime
                    if($this.searchData.data&&$this.searchData.data.length>0){
                      inquirytime=$this.searchData.data[0]+' ~ '+$this.searchData.data[1];
                    }else{
                        inquirytime='';
                    }
                    $this.payInquiryPlug(inquirylist,inquirytime);
                    // 成交积分
                    var scoretime
                    if($this.searchData.data&&$this.searchData.data.length>0){
                        scoretime=$this.searchData.data[0]+'|'+$this.searchData.data[1]
                    }else{
                        scoretime=response.scoretime;
                    }
                    $this.integralPlug(scorelist,scoretime);
                    // 百万成交
                    $this.MillionsPlug(alist);
                    $this.anumber=1;
                  }
                  // 奖金排序
                  if(response.moneylist&&response.moneylist.length>0){
                    var moneytime
                    if($this.searchData.data&&$this.searchData.data.length>0){
                      moneytime=$this.searchData.data[0]+' ~ '+$this.searchData.data[1];
                    }else{
                        moneytime='截至'+response.moneytime;
                    }
                    $this.BonusPlug(response.moneylist,moneytime);
                  }

                  $this.isdep1=true

                }else{
                  // 非付费询盘
                  if(response.xunulist&&response.xunulist.length>0){
                    var moneytime
                    if($this.searchData.data&&$this.searchData.data.length>0){
                      moneytime=$this.searchData.data[0]+' ~ '+$this.searchData.data[1];
                    }else{
                        moneytime='';
                    }
                    $this.enquiriesPlug(response.xunulist,moneytime);
                  }
                  // 成交积分
                  if(response.scorelist&&response.scorelist.length>0){
                    var scoretime
                    if($this.searchData.data&&$this.searchData.data.length>0){
                        scoretime=$this.searchData.data[0]+'|'+$this.searchData.data[1]
                    }else{
                        scoretime=response.scoretime;
                    }
                    $this.integralPlug(response.scorelist,scoretime);
                  }
                  // 付费
                  if(response.semulist&&response.semulist.length>0){
                    $this.payPlug(response.semulist);
                  }
                  // 百万成交
                  if(response.Alist&&response.Alist.length>0){
                    $this.MillionsPlug(response.Alist);
                  }
                  // 奖金排序
                  if(response.moneylist&&response.moneylist.length>0){
                    var moneytime
                    if($this.searchData.data&&$this.searchData.data.length>0){
                      moneytime=$this.searchData.data[0]+' ~ '+$this.searchData.data[1];
                    }else{
                        moneytime='截至'+response.moneytime;
                    }
                    $this.BonusPlug(response.moneylist,moneytime);
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
    //非付费询盘
    enquiriesPlug(varData,varTime){
      var $this = this;
      var unpayInquiry=rankingWithTotalItem(varData,'number');
      unpayInquiry.forEach(function(item){
        item.number = numSeparate(item.number);
        item.deptName=item.departname;
      });
      $this.unpayInquiry = unpayInquiry;
      $this.Inquirytime = varTime;
      if(varData.length < 10){
          $this.unpayInquirySet.ifFold = false;
      }else{
          $this.unpayInquirySet.ifFold = true;
          $this.unpayInquirySet.isFold = false;
      }
    },
    //成交积分
    integralPlug(varData,varTime){
      var $this = this;
      var dealScore=varData.sort(function(a, b){return b.score - a.score});
      var dealScore=rankingWithTotalItem(varData,'score');
      dealScore.forEach(function(item){
        item.score = numSeparate(Math.floor(item.score*100)/100);
        item.deptName=item.departname;
      });
      $this.dealScore = dealScore;
      $this.scoretime = varTime;
      if(varData.length < 10){
          $this.dealScoreSet.ifFold = false;
      }else{
          $this.dealScoreSet.ifFold = true;
          $this.dealScoreSet.isFold = false;
      }
    },
    //付费询盘
    payInquiryPlug(varData,varTime){
      var $this = this;
      var payMember = varData.sort(function(a, b){return b.number - a.number});
      payMember = rankingWithTotalItem(payMember,'number');
      
      payMember.forEach(function(item){
        item.numberStr = numSeparate(item.number);
        item.deptName=item.departname;
      });
      $this.payMember=payMember;
      $this.Paytime = varTime;
      if(varData.length < 10){
          $this.payMemberSet.ifFold = false;
      }else{
          $this.payMemberSet.ifFold = true;
          $this.payMemberSet.isFold = false;
      }
    },
    //付费
    payPlug(varData){
      var $this = this;
      var payMember=rankingWithTotalItem(varData,'number');
      payMember.forEach(function(item){
        item.numberStr = numSeparate(item.number);
        item.deptName=item.departname;
      });
      $this.payMember=payMember;
    },
    //百万成交
    MillionsPlug(varData){
      var $this = this;
      var millionDeal=varData.sort(function(a, b){return b.number - a.number});
      var millionDeal=rankingWithTotalItem(varData,'number');
      millionDeal.forEach(function(item){
        item.deptName=item.departname;
      });
      $this.millionDeal=millionDeal;
      if(varData.length < 10){
          $this.millionDealSet.ifFold = false;
      }else{
          $this.millionDealSet.ifFold = true;
          $this.millionDealSet.isFold = false;
      }
    },
    //奖金排序
    BonusPlug(varData,varTime){
      var $this = this;                  
      var moneyarr = varData;
      moneyarr.sort($this.compare('allmoney'));
      var awardMoney = rankingWithTotalItem(moneyarr,'allmoney');
      awardMoney.forEach(function(item){
        item.allmoney = numSeparate(Math.floor(item.allmoney*100)/100);
        item.deptName=item.departname;
      });
      $this.awardMoney=awardMoney;
      $this.moneytime = varTime;
      if(varData.length < 10){
          $this.awardMoneySet.ifFold = false;
      }else{
          $this.awardMoneySet.ifFold = true;
          if($this.searchData.dept_id==""){
              $this.isAwardBool=false;
              $this.awardMoneySet.boxHeight = "1133px";
          }else{
              $this.isAwardBool=true;
          }
          $this.awardMoneySet.isFold = false;
      }
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



