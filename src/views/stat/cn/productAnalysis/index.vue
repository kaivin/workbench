<template>
  <div class="page-root scroll-panel product-Analy" ref="boxPane">       
    <div class="focusPro">
        <div class="focusProTit">
            <h3><i><svg-icon icon-class="star" /></i>我关注的产品<span>（{{focusProNum}}）</span></h3>
            <span @click="handleAddPro"><i><svg-icon icon-class="work_add" /></i>添加产品</span>
        </div>
        <ul class="focusProUl" :class="focusProSet.isFold? 'focusShow' : ''" v-if="focusProArr.length>0" :style="'height:'+ focusProSet.boxHeight">
            <li v-for="(item,index) in focusProArr" :key="index">
               <focus-pro :focusPro="item"></focus-pro>
            </li>
        </ul>
        <div class="focusProMore" v-if="focusProSet.ifFold" :class="focusProSet.isFold? '' : 'active'" @click="showAll"></div>
    </div>
    <div class="filter-panel">
      <div class="filter-list">
        <div class="item-filter flex-box">
          <div class="filter-title"><span class="txt-title">地区：</span></div>
          <div class="filter-content">
            <div class="item-list region">              
              <el-select v-model="province" @change="handleRegion" size="small" clearable placeholder="选择地区">
                  <el-option
                      v-for="item in ProvinceList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
              </el-select>
            </div>
          </div>
          <div class="filter-title"><span class="txt-title">时间选择：</span></div>
          <div class="filter-content flex-content">
            <div class="item-list time">
              <div class="item-change">
                   <span :class="item.isOn?'active':''" v-for="(item,index) in changeTime" :key="index" v-on:click="handlerTime(item.name)">{{item.name}}</span>
              </div>
              <div class="item-date">
                <el-date-picker
                  v-model="searchForm.data"
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
              </div>
            </div>
          </div>
        </div>
        <div class="item-filter flex-box">
          <div class="filter-title"><span class="txt-title">产品类型：</span></div>
          <div class="filter-content flex-content">
            <div class="item-list pro">
              <div class="item-checkbox" v-bind:class="item.isOn?'active':''" v-for="item in ProList" v-bind:key="item.id" v-on:click="handlerPro(item.id)"><i></i><span>{{item.name}}</span></div>
              <div class="item-reset" v-if="isFilter"><span>全部重置</span></div>
            </div>
          </div>
        </div>
      </div>
      <div class="filter-tips"><p><i class="svg-i"><svg-icon icon-class="tips" class-name="disabled" /></i>当前为产品榜单页面，展示<span v-html='tipsInfo'></span>数据信息</p></div>
    </div>
    <div class="focusMain">
        <unpay-inquiry 
          :unpayInquiry="unpayInquiry"
          :unpayInquirySet="unpayInquirySet"
          :lang="ch"
          @changeSet="changeSet"
          v-if="unpayInquiry.length>0"
        ></unpay-inquiry>
        <unpay-deal
          :dealScore="dealScore"
          :dealScoreSet="dealScoreSet"
          :lang="ch"
          @changeSet="changeSet"
          v-if="dealScore.length>0"
        ></unpay-deal>
        <million-deal
          :millionDeal="millionDeal"
          :millionDealSet="millionDealSet"
          :lang="ch"
          @changeSet="changeSet"
          v-if="millionDeal.length>0"
        ></million-deal>
    </div>
    <el-dialog :title="focusProTitle" custom-class="transfer-dialog" :visible.sync="dialogFocusProVisible" width="840px">
        <div class="transfer-panel">
        <div class="transfer-wrap">
            <el-transfer 
            v-model="focusProValue" 
            :data="AllProList"
            :titles="['可关注产品', '已关注产品']"
            filterable
            :filter-method="filterfocusProMethod"
            filter-placeholder="请输入用户关键字"
            ></el-transfer>
        </div>
        </div>
        <template #footer>
        <span class="dialog-footer">
            <el-button @click="dialogFocusProVisible = false">取 消</el-button>
            <el-button type="primary" :class="issaveFocusPro?'isDisabled':''" :disabled="issaveFocusPro" @click="saveFocusPro">确 定</el-button>
        </span>
        </template>
    </el-dialog>
  </div>
</template>
<script>
import focusPro from "../../components/productAnalysis/focusPro";
import UnpayInquiry from "../../components/productAnalysis/UnpayInquiry";
import UnpayDeal from "../../components/productAnalysis/UnpayDeal";
import MillionDeal from "../../components/productAnalysis/MillionDeal";
import {numSeparate,rankingWithTotalItem} from "@/utils/index";
export default {
  name: "cnProductAnalysis",
  data() {
    return {
      ch:'ch',
      defaultChartData:[],
      focusProArr:[], 
      focusProNum:0,
      focusProSet:{
        ifFold: true,//是否需要折叠
        boxHeight: '',
        isFold: true,
      },
      AllProList: [],
      focusProValue: [],
      dialogFocusProVisible:false,
      focusProTitle:"关注产品",
      issaveFocusPro:false,
      filterfocusProMethod(query, item) {
          if(item.label){
            return item.label.indexOf(query) > -1;
          }
      },
      isFilter:false,
      tipsInfo:'当前为产品榜单页面，展示今年数据信息',
      ProvinceList:[],
      ProList:[],
      changeTime:[
        {name:'近3月',isOn:false},
        {name:'近半年',isOn:true},
        {name:'今年',isOn:false},
      ],
      province:'',
      typePro:[],
      searchForm:{
        province:'',
        typeid:[],
        data:[],
      },
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
      unpayInquiry: [],
      unpayInquirySet:{
        ifFold: false,//是否需要折叠
        boxHeight: '',
        isFold: false,
      },
      dealScore:[],
      dealScoreSet:{
        ifFold: false,//是否需要折叠
        boxHeight: '',
        isFold: false,
      },
      millionDeal:[],
      millionDealSet:{
        ifFold: false,//是否需要折叠
        boxHeight: '',
        isFold: false,
      },
    };
  },
  components:{
    focusPro,
    UnpayInquiry,
    UnpayDeal,
    MillionDeal,
  },
  created() {
    var $this = this;
    $this.getUserMenuButtonPermit();
  },
  mounted(){
    const $this = this;
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
          if(permitData.includes('Api_chinaproductfocus')){
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
      $this.getChinaproductlist();
      $this.getProvince();
    },
    //首页中文统计（中文产品列表）（产品分析）
    getChinaproductlist(){
      var $this = this;
      $this.$store.dispatch("api/getChinaproductlistAction").then((res) => {
          if (res) {
            if (res.status) {
                if(res.data&&res.data.length>0){
                    var AllProList=[];
                    res.data.forEach(function(item,index){
                        var objItem={};
                        objItem.key=item.id;
                        objItem.label=item.name;
                        AllProList.push(objItem);
                    });
                    $this.AllProList=AllProList;
                    $this.getfocusPro();
                }
            } else {
              $this.$message({
                showClose: true,
                message: res.info,
                type: "error",
                duration: 6000
              });
            }
          }
      });
    },
    //点击搜索隐藏关注数据
    hiddenFocusPro(){
      var $this = this;
      $this.focusProSet.boxHeight = "0px";
      $this.focusProSet.isFold = false;
    },
    //初始化关注产品数据
    initFocusPro(){
      var $this = this;
      $this.defaultChartData=[];
      $this.focusProArr=[];
      $this.focusProNum=0;
      $this.focusProSet.boxHeight = "auto";
      $this.focusProSet.isFold = true;
      $this.focusProValue=[];
    },
    //获取顶部我的关注产品
    getfocusPro(){
      var $this = this;
      var ChartColor=['#79ffff','#6787fe','#ffe775','#ff5568'];
      $this.initFocusPro();
      $this.$store.dispatch("api/getChinaproductFocusAction").then((res) => {
          if (res) {
            if (res.status) {
                if(res.myfoucs&&res.myfoucs.length>0){
                    var focusProValue=[];
                    res.myfoucs.forEach(function(item,index){
                        focusProValue.push(item.id);
                        if(item.xuntong&&item.xuntong.length>0){
                            var focusProTrend=[];//趋势
                            var focusProPie=[];//占比
                            item.xuntong.forEach(function(items,indexs){
                                var pieItem={
                                    name:0,
                                    value:0,
                                    color:'',
                                };
                                if(items&&items.length>0){
                                  items.forEach(function(itemk,indexk){     
                                      var objItem={};
                                      objItem.date=itemk.date;
                                      objItem.number=itemk.number;
                                      objItem.name=itemk.depart.replace('电商','');
                                      objItem.color=ChartColor[index];
                                      focusProTrend.push(objItem);
                                      pieItem.value=pieItem.value+itemk.number;
                                      pieItem.name=itemk.depart.replace('电商','');
                                      pieItem.color=ChartColor[index];
                                  });
                                }
                                focusProPie.push(pieItem);
                            });
                            if(focusProPie&&focusProPie.length>0){
                              var focusProPieArr=[];
                              focusProPie.forEach(function(items,indexs){ 
                                  if(items.value!=0){
                                      focusProPieArr.push(items);
                                  }
                              });
                            }
                            item.focusProTrend=focusProTrend;
                            item.focusProPie=focusProPieArr;
                            item.ChartColor=ChartColor;
                        }
                    });
                    $this.focusProValue=focusProValue;//关注产品id 
                    $this.focusProNum=res.myfoucs.length;//关注数量  
                    $this.focusProArr=res.myfoucs;//基础数据                  
                }
                console.log($this.focusProArr,'$this.focusProArr');
            } else {
              $this.$message({
                showClose: true,
                message: res.info,
                type: "error",
                duration: 6000
              });
            }
          }
      });
    },
    // 展开折叠点击事件
    changeSet(data,isfold,boxheight){
      var $this = this;
      $this.focusProSet.isFold=isfold;
      $this.focusProSet.boxHeight=boxheight;
    },
    //点击弹出添加关注产品框
    handleAddPro(){
        var $this=this;
        $this.dialogFocusProVisible=true;
    },
    // 用户分配保存
    saveFocusPro(){
        var $this = this;
        if(!$this.issaveFocusPro){ 
            $this.issaveFocusPro=true;       
            var searchForm = {};
            searchForm.id=$this.focusProValue;
            $this.$store.dispatch('api/getChinaAddfocusproductAction', searchForm).then(res=>{
                if(res.status){
                    $this.$message({
                        showClose: true,
                        message: res.info,
                        type: 'success'
                    });
                    $this.dialogFocusProVisible = false;
                    $this.getfocusPro();
                    setTimeout(()=>{
                        $this.issaveFocusPro=false;
                    },1000);
                }else{
                    $this.$message({
                        showClose: true,
                        message: res.info,
                        type: 'error'
                    });
                    setTimeout(()=>{
                        $this.issaveFocusPro=false;
                    },1000);
                }
            });
        }
    },
    showAll(){
        var $this=this;
        $this.focusProSet.isFold = !$this.focusProSet.isFold;
        if($this.focusProSet.isFold){
          $this.focusProSet.boxHeight = "auto";
        }else{
          $this.focusProSet.boxHeight = "0px";
        }
    },
    //重组搜索事件
    RestSearch(){
      var $this=this;
      var searchForm = {};
      var tipsInfoStr='';
      if($this.searchForm.data&&$this.searchForm.data.length>0){
        searchForm.starttime=$this.searchForm.data[0];
        searchForm.endtime=$this.searchForm.data[1];
        tipsInfoStr='<span>'+searchForm.starttime+' ~ '+searchForm.endtime+'</span>';
      }
      if($this.searchForm.province&&$this.searchForm.province!=''){
          searchForm.province=$this.searchForm.province;
          tipsInfoStr='<span>'+$this.searchForm.province+'</span>'+tipsInfoStr;
      }
      if($this.searchForm.typeid&&$this.searchForm.typeid.length>0){
          searchForm.typeid=$this.searchForm.typeid;
          tipsInfoStr=tipsInfoStr+'<span>'+$this.typePro+'</span>';
      }
      if(tipsInfoStr&&tipsInfoStr!=''){
        $this.tipsInfo=tipsInfoStr;
      }else{
        tipsInfoStr='今年';
        $this.tipsInfo=tipsInfoStr;
      }
      return searchForm;
    },
    //重组搜索事件
    clearSearch(){
      var $this=this;
      $this.unpayInquiry=[];
      $this.unpayInquirySet.ifFold=false;
      $this.unpayInquirySet.boxHeight='';
      $this.unpayInquirySet.isFold=false;
      $this.dealScore=[];
      $this.dealScoreSet.ifFold=false;
      $this.dealScoreSet.boxHeight='';
      $this.dealScoreSet.isFold=false;
      $this.millionDeal=[];
      $this.millionDealSet.ifFold=false;
      $this.millionDealSet.boxHeight='';
      $this.millionDealSet.isFold=false;
    },
    //搜索筛选数据
    searchData(){
      var $this=this;
      $this.clearSearch();
      var searchForm=$this.RestSearch();
      $this.$store.dispatch("api/getChinaproductcountfooterAction", searchForm).then((res) => {
          if (res) {
            if (res.status) {
              // 询盘
              if(res.xunlist&&res.xunlist.length>0){
                  var unpayInquiry=[];
                  var maxNum=0;
                  res.xunlist.forEach(function(item){
                    maxNum+=item.number;
                  });
                  var unpayInquiryArr = rankingWithTotalItem(res.xunlist,'number');
                  unpayInquiryArr.forEach(function(item){
                    item.starttime=$this.searchForm.data[0];
                    item.endtime=$this.searchForm.data[1];
                    if(item.keyproduct){  
                      if(item.keyproduct.indexOf(',')>0){
                        var keyproductArr=item.keyproduct.split(",");
                        item.productname=keyproductArr[0];
                      }else{
                        item.productname=item.keyproduct;
                      }
                    }else{
                      item.keyproduct='——';
                    }
                    item.percentNum=(item.number/maxNum*100).toFixed(2);
                    item.number = numSeparate(item.number);
                    unpayInquiry.push(item);
                  });
                  $this.unpayInquiry = unpayInquiry;
                  if(res.xunlist.length < 9){
                      $this.unpayInquirySet.ifFold = false;
                      $this.unpayInquirySet.boxHeight = "auto";
                  }else{
                      $this.unpayInquirySet.ifFold = true;
                      $this.unpayInquirySet.boxHeight = "616px";
                      $this.unpayInquirySet.isFold = false;
                  }
              }
              // 成交积分
              if(res.scorelist&&res.scorelist.length>0){
                  var dealScore=[];
                  var maxNum=0;
                  var maxScore=0;
                  res.scorelist.forEach(function(item){
                    maxNum+=item.number;
                    maxScore+=item.scorenumber;
                  });
                  var dealScoreArr = rankingWithTotalItem(res.scorelist,'number');
                  dealScoreArr.forEach(function(item){
                    item.starttime=$this.searchForm.data[0];
                    item.endtime=$this.searchForm.data[1];
                    if(item.xunproduct.indexOf(',')>0){
                      var keyproductArr=item.xunproduct.split(",");
                      item.productname=keyproductArr[0];
                    }else{
                      item.productname=item.xunproduct;
                    }
                    item.percentNum=(item.number/maxNum*100).toFixed(2);
                    item.percentScore=(item.scorenumber/maxNum*100).toFixed(2);
                    item.scorenumber = numSeparate(Math.floor(item.scorenumber*100)/100);
                    item.number = numSeparate(Math.floor(item.number*100)/100);
                    if(!item.xunproduct||item.xunproduct==''){
                      item.xunproduct='——'
                    }
                    dealScore.push(item);
                  });
                  $this.dealScore = dealScore;
                  if(res.scorelist.length < 9){
                      $this.dealScoreSet.ifFold = false;
                      $this.dealScoreSet.boxHeight = "auto";
                  }else{
                      $this.dealScoreSet.ifFold = true;
                      $this.dealScoreSet.boxHeight = "616px";
                      $this.dealScoreSet.isFold = false;
                  }
              }
              // 百万成交
              if(res.anumberlist&&res.anumberlist.length>0){
                  var millionDeal=[];
                  var maxNum=0;
                  res.anumberlist.forEach(function(item){
                    maxNum+=item.number;
                  });
                  var millionDealArr = rankingWithTotalItem(res.anumberlist,'number');
                  millionDealArr.forEach(function(item){
                    item.starttime=$this.searchForm.data[0];
                    item.endtime=$this.searchForm.data[1];
                    if(item.xunproduct.indexOf(',')>0){
                      var keyproductArr=item.xunproduct.split(",");
                      item.productname=keyproductArr[0];
                    }else{
                      item.productname=item.xunproduct;
                    }
                    item.percentNum=(item.number/maxNum*100).toFixed(2);
                    if(!item.xunproduct||item.xunproduct==''){
                      item.xunproduct='——'
                    }
                    millionDeal.push(item);
                  });
                  $this.millionDeal=millionDeal;
                  if(res.anumberlist.length < 9){
                      $this.millionDealSet.ifFold = false;
                      $this.millionDealSet.boxHeight = "auto";
                  }else{
                      $this.millionDealSet.ifFold = true;
                      $this.millionDealSet.boxHeight = "616px";
                      $this.millionDealSet.isFold = false;
                  }
              }
            } else {
              $this.$message({
                showClose: true,
                message: res.info,
                type: "error",
                duration: 6000
              });
            }
          }
      });
    },
    //获取搜索地区和产品分类数据
    getProvince(){
      var $this = this;
      $this.$store.dispatch("api/getChinaprovinceAction").then((res) => {
          if (res) {
            if (res.status) {
               if(res.data&&res.data.length>0){
                 var ProvinceList=[];
                 res.data.forEach(function(item,index){
                   var objItem={};
                   objItem.value=item.id;
                   objItem.label=item.name;
                   objItem.isOn=false;
                   ProvinceList.push(objItem);
                 });
                 $this.ProvinceList=ProvinceList;
               }
               if(res.type&&res.type.length>0){
                 res.type.forEach(function(item,index){
                   item.isOn=false;
                 });
                 $this.ProList=res.type;
               }
               $this.getNearMonth();
            } else {
              $this.$message({
                showClose: true,
                message: res.info,
                type: "error",
                duration: 6000
              });
            }
          }
      });
    },
    //点击产品类型事件
    handlerPro(varData){
      var $this=this;
      var ProList=$this.ProList;
      if(ProList&&ProList.length>0){
        var typePro = [];
        var typeid = [];
        ProList.forEach(function(item,index){
          if(item.id == varData){
            item.isOn = !item.isOn;
          }
          if(item.isOn){
            typePro.push(item.name);
            typeid.push(item.id);
          }
        });
        $this.ProList=ProList;
        $this.typePro=typePro;
        $this.searchForm.typeid=typeid;
      }
      $this.hiddenFocusPro();
      $this.searchData();
    },
    //点击地区事件
    handleRegion(){
      var $this=this;
      $this.searchForm.province='';
      if($this.ProvinceList&&$this.ProvinceList.length>0){
        $this.ProvinceList.forEach(function(item,index){
          if($this.province==item.value){
            $this.searchForm.province=item.label;
          }
        });
      }
      $this.hiddenFocusPro();
      $this.searchData();
    },
    handleData(){
      var $this=this;
      var changeTime=$this.changeTime;
      changeTime.forEach(function(item,index){
        item.isOn=false;
        var dataOne=$this.searchForm.data.toString();
        var dataTwo=item.data.toString();
        if(dataOne==dataTwo){
          item.isOn=true;
        }
      });
      $this.hiddenFocusPro();
      $this.searchData();
    },
    //点击时间选择
    handlerTime(varData){
      var $this=this;
      var changeTime=$this.changeTime;
      changeTime.forEach(function(item,index){
        item.isOn=false;
        if(item.name==varData){
          $this.searchForm.data=item.data;
          item.isOn=true;
        }
      });
      $this.hiddenFocusPro();
      $this.searchData();
    },
    //默认时间周期
    getNearMonth(){
      var $this=this;
      var end = new Date();
      var endYear = end.getFullYear();
      var endMonth = end.getMonth() + 1;
      endMonth = endMonth<10?'0'+endMonth:endMonth; 
      var endDate = endYear+"-"+endMonth;
      var changeTime=$this.changeTime;
      changeTime.forEach(function(item,index){
          if(item.name=='近3月'){
            var start = new Date();
            start.setMonth(start.getMonth() - 3);
            var startYear = start.getFullYear();
            var startMonth = start.getMonth() +1;
            startMonth = startMonth<10?'0'+startMonth:startMonth;
            var startDate = startYear+"-"+startMonth;
            item.data=[startDate,endDate];
          }
          if(item.name=='近半年'){
            var start = new Date();
            start.setMonth(start.getMonth() - 6);
            var startYear = start.getFullYear();
            var startMonth = start.getMonth() +1;
            startMonth = startMonth<10?'0'+startMonth:startMonth;
            var startDate = startYear+"-"+startMonth;
            item.data=[startDate,endDate];
            $this.searchForm.data=[startDate,endDate];
          }
          if(item.name=='今年'){
            var start = new Date();
            start.setMonth(start.getMonth() - 6);
            var startYear = start.getFullYear();
            var startDate = startYear+"-01";
            item.data=[startDate,endDate];
          }
      });
      $this.changeTime=changeTime;
      $this.searchData();
    },
    // 展开折叠点击事件
    changeSet(data,isfold,boxheight){
      var $this = this;
      var property = data;
      property.isFold = isfold;
      property.boxHeight = boxheight;
    },
  }
}
</script>



