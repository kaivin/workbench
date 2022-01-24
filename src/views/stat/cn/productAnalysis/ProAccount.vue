<template>
  <div class="page-root scroll-panel product-Analy" ref="boxPane"> 
        <div class="nowCate">
        {{nowcate}}
        </div>
        <div class='product-AnalyMain'>
            <div class="personTopTab" v-if="contrastName=='overview'">
                <div class="chooseDepart flex-box">
                        <span class="choosetit">产品分类：</span>
                        <div class="departItems flex-content">
                        <span v-bind:class="item.isOn?'active':''" v-for="(item,index) in ProCategoryList" :key="index" v-on:click="handleCategory(item.id)">{{item.name}}</span>
                        </div>
                </div>
                <div class="choosePerson" :class="routTag.typeid?'active':''">
                        <div class="departItems">
                            <p class="item-checkbox" v-bind:class="item.isOn?'active':''" v-for="(item,index) in ProList" :key="index" v-on:click="handlePro(item.id,item.typeid)"><i></i><span>{{item.name}}</span></p>
                        </div>
                </div>
            </div>
            <div class="prodeptBox" ref="prodeptPaneBox">
                <div class="prodeptMain" :style="'width:'+personTopTabWidth" ref="prodeptPane" :class="scrBool?'prodeptFix':''">
                    <div class="proBox">
                        <el-tooltip v-if="(routTag.productnameId!=0||routTag.productnameId!='')&&hasfocus==1" class="proBoxStar" effect="dark" content="取消关注" placement="top">
                            <el-button v-on:click="getCancelfocuspro(routTag.productname)" class="svg-i"><svg-icon icon-class="workOrder_starSolid" /></el-button>
                        </el-tooltip>
                        <el-tooltip v-if="(routTag.productnameId!=0||routTag.productnameId!='')&&hasfocus==2" class="proBoxStar" effect="dark" content="添加关注" placement="top">
                            <el-button v-on:click="getAddfocuspro(routTag.productname)" class="svg-i"><svg-icon icon-class="workOrder_starHollow" /></el-button>
                        </el-tooltip>
                        <span>{{routTag.productname}}</span>
                    </div>
                    <p class="contrastTab">
                        <span v-for="(item,index) in contrastTab" v-if="item.isDisplay" :class='item.isOn?"active":""' :key='index' v-on:click="handlecontrastTab(item.tagName)">{{item.name}}</span>
                    </p>
                    <div class="deptBox" v-if="contrastName!='departCont'">
                        <span class="deptBoxTit">部门选择:</span>
                        <p class="deptBoxItem" v-bind:class="item.isOn?'active':''" v-for="(item,index) in department" :key="index" v-on:click="handleDepart(item.id)"><i></i><span>{{item.name}}</span></p>
                    </div>
                </div>
            </div>
            <div class="contrast" v-if="contrastName=='productCont'||contrastName=='departCont'">
                <p class="contrastPro" v-if="contrastProname.length>0"><span v-for="(item,index) in contrastProname" :class="'color-0'+(index+1)" :key="index">{{item.name}}<i class="svg-i" v-on:click="deleteDefault(item)"><svg-icon icon-class="close" class-name="disabled" /></i></span></p>
                <span class="contrastProTab" v-if="contrastName=='productCont'&&contrastBtnShow" v-on:click="handleAddcontrast('productCont')"><i><svg-icon icon-class="work_add" /></i>添加产品</span>
                <span class="contrastProTab" v-if="contrastName=='departCont'&&contrastBtnShow" v-on:click="handleAddcontrast('departCont')"><i><svg-icon icon-class="work_add" /></i>添加对比部门</span>
            </div>
            <div class="contrast contrastTime" v-if="contrastName=='timeCont'">     
                    <el-date-picker
                        v-model="routTag.data"
                        @change="handleContData"
                        type="monthrange"
                        format="yyyy-MM"
                        value-format="yyyy-MM"
                        key="a"
                        size="mini"
                        class="date-range"
                        range-separator="～"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerMonthRangeOptions">
                    </el-date-picker>  
                    <span class='contrastTimeCon'>对比</span>
                    <el-date-picker
                        v-model="routTag.csdata"
                        @change="handleContData"
                        type="monthrange"
                        format="yyyy-MM"
                        value-format="yyyy-MM"
                        key="c"
                        size="mini"
                        class="date-range"
                        range-separator="～"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerMonthRangeOptions">
                    </el-date-picker>
            </div>
            <template v-for="(item,index) in enquirieList" v-if="contrastName!='timeCont'">
                <echart-days :scoreHeight='300' :is-interval='1' :enquirieChart="item" :contrastTag="contrastName"></echart-days>
            </template>
            <div class="enquirieTag" :class="[contrastName=='timeCont'?'TwoTagTop':'']">
                <div class="enquirieTagTop flex-box" v-if="contrastName!='timeCont'">  
                        <h3>阶段数据</h3>   
                        <div class="filter-title"><span class="txt-title">时间选择：</span></div>
                        <div class="filter-content flex-content">
                            <div class="item-list">
                                <div class="item-change">
                                    <span :class="item.isOn?'active':''" v-for="(item,index) in changeTime" :key="index" v-on:click="handlerTime(item.name)">{{item.name}}</span>
                                </div>
                                <div class="item-date" :class="isTimeSelecte?'active':''">
                                    <el-date-picker
                                    v-model="routTag.data"
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
                <div class="enquirieTagCore flex-box"  v-if="contrastName=='overview'">
                    <div class="enquirieTagCoreBox">
                            <p class="CoreBoxTit">核心数据</p>
                            <dl class="CoreBoxBom">
                                <dd class='Core01'>     
                                    <el-tooltip placement="right" class="CoreBoxBomPer" effect="light">
                                        <div slot="content" class="CoreBoxBomPerTop">
                                            <p>历史最高询盘</p>
                                            <p>时间：<span>{{xunmaxmonth.xunmonth}}</span></p>
                                            <p>询盘：<span>{{xunmaxmonth.number}}</span></p>
                                        </div>
                                        <div>
                                            <div class="CoreBoxBomNum">
                                                <span>{{CoreData.enquiriesNum}}</span>
                                                <p>询盘个数</p>
                                            </div>
                                            <div class="CoreBoxBomPerBom">
                                                <b>100个询盘=<span>{{CoreData.EnquiryPoints}}</span>分</b>
                                                <p>（成交积分 / 询盘个数）</p>
                                            </div>
                                        </div>
                                    </el-tooltip>
                                </dd> 
                                <dd class='Core02'>
                                    <div class="CoreBoxBomNum">
                                        <span>{{CoreData.ClinchIntegral}}</span>
                                        <p>成交积分</p>
                                    </div>
                                    <div class="CoreBoxBomPer">
                                        <b>平均分:<span>{{CoreData.average}}</span></b>
                                        <p>（成交积分 / 成交个数）</p>
                                    </div>
                                </dd> 
                                <dd class='Core03'>
                                    <div class="CoreBoxBomNum">
                                        <span>{{CoreData.ClinchNum}}</span>
                                        <p>成交个数</p>
                                    </div>
                                    <div class="CoreBoxBomPer">
                                        <b>成交率:<span>{{CoreData.closing}}</span></b>
                                        <p>（成交个数 / 询盘个数）</p>
                                    </div>
                                </dd> 
                            </dl>
                    </div>             
                    <div class="personYearChart flex-content">
                            <div class="yearChartTab">
                                <div class="yearTabItem" :class="item.isOn?'active':''" v-for="(item,index) in ChartTab" :key='index' @click="handleTab(item.tap)">
                                        <p class="yearTabTitle">{{item.name}}<span>{{item.unit}}</span></p>
                                        <div class="yearNum">{{item.numSeptotalNum}}</div>
                                        <div class="numCompare" v-if='isOnTab'>环比上年同期<span v-bind:style="{color:item.totalNum-item.lasttotalNum>0?'#f25e5e':'#27d12c'}">
                                            {{item.sequential}}
                                            <i><svg-icon :icon-class="item.totalNum-item.lasttotalNum>0?'data-up':'data-down'" /></i> </span>
                                        </div>
                                </div>
                            </div>
                            <div class="chartContainer">
                                <div id="inquirybox" style="height:267px"></div>
                                <div class="showLine" :class="isYearBool?'Line':''">
                                    <span v-for='(item,index) in showLineTime' :key="index" :class="'line'+(index+1)">{{item}}</span>
                                </div>
                            </div>
                    </div>
                </div>
                <div class="proAccount" :class="[EnquirieMap.length==2?'mapOneAccount':'',EnquirieMap.length>2?'mapTwoAccount':'']">
                        <template v-for="(item,index) in ChartEnquirie">
                            <echart-days :scoreHeight='250' :is-interval='0' :enquirieChart="item" :contrastTag="contrastName"></echart-days>
                        </template>
                        <template v-if="ChartAccount.length>1" v-for="item in ChartAccount">
                            <account-chart 
                            :accountArr="item"  :contrastTag="contrastName"
                            @departchange="departchange"
                            ></account-chart>
                        </template>
                        <map-chart 
                        :ChartMapArr="EnquirieMap" 
                        :is-cn="true"
                        ></map-chart>
                        <map-chart 
                        :ChartMapArr="ChartMap" 
                        :is-cn="true"
                        ></map-chart>
                        <div class="clearfix"></div>
                        <div class="pro_user" id="pro_user" v-if="intableData.length>0||scoretableData.length>0">
                            <inquiry-table :intableData="intableData" :chooseData="chooseData" :lang="ch"></inquiry-table>
                            <score-table :scoretableData="scoretableData" :chooseData="chooseData" :lang="ch"></score-table>
                        </div>
                </div>
            </div>
        </div>
      <el-dialog :title="focusProTitle" custom-class="transfer-dialogPro" :visible.sync="dialogFocusProVisible" :before-close="closePopup" width="830px">
            <p class='transfer-panelTit'><i><svg-icon icon-class="tips" /></i>共可添加 4 组{{contrastName=='productCont'?'产品':contrastName=='departCont'?'部门':''}}进行对比，当前已选 {{contrastRright.length}} 组</p>
            <div class="transfer-panel" :class="contrastName=='departCont'?'transferDepart':''">
                <div class="transferFl">
                     <div class="transferFlTop" v-if="contrastName=='productCont'">
                          <el-input
                                class="el-transfer-panel__filter"
                                v-model="dialogSearch"
                                placeholder="搜索产品"
                                @input="dialogSearchBtn"
                                size="small">
                          </el-input>
                          <i class="el-input__prefix" @click="clearQuery"><svg-icon icon-class="search1" /></i>
                     </div>
                    <div class="transferFlSearch" v-if='dialogSearchList.length>0'>
                        <dl>
                            <dd :class="item.isOn?'isOn':''" @click="transferPro(item.id)" v-for="(item,index) in dialogSearchList" :key="index">
                                <i></i><span>{{item.name}}</span>
                            </dd>
                        </dl>
                    </div>
                    <div class="transferBox" :class="contrastName=='productCont'?'transHeight':''" v-else>
                        <dl :class="[item.isOn?'isOn':'',item.isDisplay?'isDisplay':'']" v-for="(item,index) in contrastList" :key="index">
                            <dt @click="transferType(item.id)"><i></i><span>{{item.name}}</span></dt>
                            <dd :class="items.isOn?'isOn':''" @click="transferPro(items.id)" v-for="(items,indexs) in item.son" :key="indexs">
                                <i></i><span>{{items.name}}</span>
                            </dd>
                        </dl>
                    </div>
                </div>
                <div class="transferFr">
                    <div class="transferBox">
                        <p class="transferBoxTop"><span>已选{{contrastName=='productCont'?'产品':contrastName=='departCont'?'部门':''}}：{{contrastRright.length}}</span><i @click="cleartransfer">清空</i></p>
                        <p class="transferBoxTit" :class="item.name==routTag.productname?'active':''" v-for="(item,index) in contrastRright" :key="index">
                            <span>{{item.name}}</span>
                            <i v-if="item.name==routTag.productname"><svg-icon icon-class="stat_lock" /></i>
                            <i @click="cleartransferPro(item.id)" class="transClose" v-else><svg-icon icon-class="stat_Circlefork" /></i>
                        </p>
                    </div>
                </div>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="closePopup">取 消</el-button>
                    <el-button type="primary" @click="saveContrast">确 定</el-button>
                </span>
            </template>
      </el-dialog>
  </div>
</template>
<script>
import * as echarts from 'echarts';
import {randomString,formatDate,numSeparate,rankingWithTotalItem} from "@/utils/index"
import {MapInterval,TopTenColor} from "@/utils/MapColor"
import { chinaData } from "@/utils/chinaMap";
import echartDays from "../../components/productAnalysis/echartDays";
import accountChart from "../../components/productAnalysis/accountChart";
import mapChart from "../../components/productAnalysis/mapChart";
import Areachart from "../../components/productAnalysis/Areachart";
import InquiryTable from "../../components/productAnalysis/InquiryTable";
import ScoreTable from "../../components/productAnalysis/ScoreTable";
import { mapGetters } from 'vuex';
export default {
  name: "cnProAccount",
  data() {
    return {
      dialogSearch:'',
      dialogSearchList:[],
      scrBool:false,
      personTopTabWidth:'auto',
      isYearBool:false,//时间是否跨年
      isCate:false,//点击分类属性
      xunmaxmonth:{},//最大询盘月份
      ChartColor:['#044bff','#fe4c46','#fdcb66','#47cbfe'],
      minWidth:"",
      mapRatio:0.75,
      mapNum:'',//地图个数
      ProCategoryList:[],
      showLineTime:[],
      ProList:[],
      hasfocus:'',//是否关注
      routTag:{
          csdata:[],
          data:[],
          productnameId:0,
          productname:'',
          typeid:'',
          starttime:'',
          endtime:'',
          cstarttime:'',
          cendtime:'',
          dept_id:[]
      },
      AllProList:[],
      allDept_id:[],//部门全选id
      department:[],//部门数据
      enquirieList:[],//获取询盘趋势*
      currentTab:'enquirie',
      MixData:[],
      ChartTab:[],
      isOnTab:false,
      currentMix:[],
      MixChart:null,      
      dialogFocusProVisible:false,
      focusProTitle:"",
      contrastList:[],
      contrastRright:[],//弹出框右侧数据
      contrastPass:[],//弹出框传递
      contrastName:'overview',
      contrastBtnShow:true,
      contrastTab:[
        {name:'总览',tagName:'overview',isOn:true,isDisplay:true},
        {name:'产品对比',tagName:'productCont',isOn:false,isDisplay:true},
        {name:'部门对比',tagName:'departCont',isOn:false,isDisplay:true},
        {name:'时间对比',tagName:'timeCont',isOn:false,isDisplay:true},
      ],
      contrastProname:[],
      contrastItem:[],
      changeTime:[
        {name:'近3月',isOn:false},
        {name:'近半年',isOn:false},
        {name:'今年',isOn:false},
      ],
      isTimeSelecte:true,
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
            start.setMonth(start.getMonth() - 5);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      ChartEnquirie:[],
      ChartAccount:[],
      ChartMap:[],
      EnquirieMap:[],
      CoreData:{
          enquiriesNum:0,
          ClinchNum:0,
          ClinchIntegral:0,
          average:0,
          closing:'',
          EnquiryPoints:'',
      },
      nowcate: "",
      intableData:[],//组员询盘
      scoretableData:[],//组员积分
      ch:"ch",
      en:"en",
      chooseData:{
          chooseDepart:"",
          tag:""
      }
    };
  },
  computed: {
    ...mapGetters([
      'sidebar',
    ]),
  },
  components:{
    echartDays,
    accountChart,
    mapChart,
    Areachart,
    InquiryTable,
    ScoreTable
  },
  watch:{
    minWidth(val) {
      if (!this.timer) {
        this.minWidth = val
        this.timer = true
        const $this = this
        setTimeout(function() {
          $this.timer = false
        }, 400)
      }
    },
  },
  created() {
    var $this = this;
    this.nowcate = this.$route.meta.title;
    $this.getNearMonth();
    $this.getChinaproductlist();
  },
  destroyed(){
    window.removeEventListener('resize',this.echartsSize);
    if(this.MixChart){
        this.MixChart.dispose();
    }
  },
  mounted(){
    const $this = this;
    if(!$this.sidebar.opened){
      $this.$store.dispatch('app/toggleSideBar');
    };
    $this.$refs.boxPane.addEventListener('scroll',this.handleScroll,true);
    if($this.$refs.boxPane){  
      $this.minWidth = $this.$refs.boxPane.offsetWidth; 
    };
    window.onresize = () => {
      return (() => {
        if($this.$refs.boxPane){
          $this.minWidth = $this.$refs.boxPane.offsetWidth; 
        }
      })()
    };
    window.addEventListener('resize',$this.echartsSize);
  },
  beforeDestroy(){
    this.$refs.boxPane.removeEventListener('scroll', this.handleScroll,true);//监听页面滚动事件
  },
  methods: {
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
            start.setMonth(start.getMonth() - 2);
            var startYear = start.getFullYear();
            var startMonth = start.getMonth() +1;
            startMonth = startMonth<10?'0'+startMonth:startMonth;
            var startDate = startYear+"-"+startMonth;
            item.data=[startDate,endDate];
          }
          if(item.name=='近半年'){
            var start = new Date();
            start.setMonth(start.getMonth() - 5);
            var startYear = start.getFullYear();
            var startMonth = start.getMonth() +1;
            startMonth = startMonth<10?'0'+startMonth:startMonth;
            var startDate = startYear+"-"+startMonth;
            item.data=[startDate,endDate];
          }
          if(item.name=='今年'){
            var start = new Date(new Date().getFullYear(), 0);
            var startYear = start.getFullYear();
            var startDate = startYear+"-01";
            item.data=[startDate,endDate];
          }
      });
      $this.changeTime=changeTime;
      $this.getForRouting();
    },
    // 获取路由参数
    getForRouting(){
      var $this = this;
      $this.routTag.productname=$this.$route.query.productname;
      $this.routTag.typeid=$this.$route.query.typeid;
      $this.routTag.productnameId='';
      $this.routTag.data=[$this.$route.query.starttime,$this.$route.query.endtime];
      $this.getCategory();      
    },
    //获取搜索地区和产品分类数据
    getCategory(){
      var $this = this;
      $this.$store.dispatch("api/getChinaprovinceAction").then((res) => {
          if (res) {
            if (res.status) {
               if(res.type&&res.type.length>0){
                 res.type.forEach(function(item,index){
                    item.isOn=false;
                    if($this.routTag.typeid==item.id){
                        item.isOn=true;
                    }
                 });
                 $this.ProCategoryList=res.type;
                 $this.getchinaproduct();
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
    //获取分类下的产品
    getchinaproduct(){
      var $this = this;
      var searchData={};
      searchData.id=$this.routTag.typeid;
      $this.$store.dispatch("api/getchinaproductAction",searchData).then((res) => {
          if (res) {
            if (res.status) {
                if(res.data&&res.data.length>0){
                    var objItem={
                        name:"全部",
                        id:0
                    };
                    res.data.unshift(objItem);
                    var contrastPass=[];
                    res.data.forEach(function(item,index){
                        var itemObj={};
                        item.isOn=false;
                        if($this.isCate){
                            if($this.routTag.productnameId==''){
                                if(index==0){
                                    item.isOn=true;
                                    $this.routTag.productnameId=item.id; 
                                } 
                            }
                        }else{
                            if($this.routTag.productname==item.name){
                                item.isOn=true;
                                $this.routTag.productnameId=item.id;
                                itemObj.isOn=true;
                                itemObj.id=$this.routTag.productnameId;
                                itemObj.name=$this.routTag.productname;
                                itemObj.typeid=$this.routTag.typeid;
                                contrastPass.push(itemObj);
                            }
                        }
                    });
                    $this.contrastPass=contrastPass; 
                    $this.ProList=res.data;
                    $this.isCate=false;
                }
                $this.getCnDepartList();
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
    //获取所有产品列表
    getChinaproductlist(){
      var $this = this;
      $this.$store.dispatch("api/getChinaproductlistAction").then((res) => {
          if (res) {
            if (res.status) {
                if(res.data&&res.data.length>0){
                    res.data.forEach(function(item,index){
                      item.isOn=false;
                      item.isDisplay=false;
                      if(item.son&&item.son.length>0){
                        item.son.forEach(function(items,indexs){
                          items.isOn=false;
                          items.isDisplay=false;
                        });
                      }
                    });
                    $this.AllProList=res.data;
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
    //获取部门信息
    getCnDepartList(){
      var $this = this;
      $this.$store.dispatch("api/getCnDepartAction").then((res) => {
          if (res) {
            if (res.status) {
                if(res.data&&res.data.length>0){
                    var objItem={
                        name:"全部部门",
                        id:0
                    };
                    var contrastDepartArr=res.data;
                    var contrastDepart=[];
                    contrastDepartArr.forEach(function(item,index){
                        item.isOn=false;
                        contrastDepart.push(item);
                    });
                    $this.contrastDepart=contrastDepart;

                    res.data.unshift(objItem);
                    var dept_id=[];
                    res.data.forEach(function(item,index){
                        item.isOn=false;
                        if(index==0){
                            item.isOn=true;
                        }
                        dept_id.push(item.id);
                    });
                    dept_id.shift();
                    $this.department=res.data;
                    $this.allDept_id=dept_id;
                    $this.routTag.dept_id=dept_id;
                }
                $this.handleData();
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
    //清除核心数据
    emptySearch(){
      var $this=this;
      $this.CoreData.enquiriesNum=0;
      $this.CoreData.ClinchNum=0;
      $this.CoreData.ClinchIntegral=0;
      $this.CoreData.average=0;
      $this.CoreData.closing='';
      $this.CoreData.EnquiryPoints='';
      $this.MixData=[];
      $this.ChartTab=[];
      $this.currentMix=[];
      $this.enquirieList=[];
      $this.ChartEnquirie=[];
      $this.ChartAccount=[];
      $this.ChartMap=[];
      $this.EnquirieMap=[];
      $this.intableData=[];
      $this.scoretableData=[];
    },
    //获取产品详情各种统计
    getProFocount(){
      var $this=this;
      $this.emptySearch();
      if($this.MixChart){
          $this.MixChart.dispose();
      }
      if($this.contrastPass&&$this.contrastPass.length>0){ 
          var contrastProname=[];             
          $this.contrastPass.forEach(function(item){
            contrastProname.push(item);
          });
          $this.contrastProname=contrastProname;//关注产品id
          if($this.contrastProname.length>=4){
                $this.contrastBtnShow=false
          }else{
                $this.contrastBtnShow=true
          } 
      }else{
        if($this.contrastName==="departCont"){
          $this.contrastProname=[];
        }
      }
      var searchData={};
      if($this.routTag.dept_id&&$this.routTag.dept_id.length>0){
          searchData.dept_id=$this.routTag.dept_id;
      }
      if($this.routTag.data&&$this.routTag.data.length>0){
            searchData.starttime=$this.routTag.data[0];
            searchData.endtime=$this.routTag.data[1];
            var dataTimeOne=$this.routTag.data[0].split('-');
            var dataTimeTwo=$this.routTag.data[1].split('-');
            if(dataTimeOne[0]!=dataTimeTwo[0]){
                $this.isYearBool=true;
                $this.showLineTime=['询盘','平均值']
            }else{
                $this.isYearBool=false;
                $this.showLineTime=[dataTimeOne[0]-1+'年',dataTimeTwo[0]+'年','平均值']
            }
      }
      var pathUrl = "";
      if($this.contrastName==="overview"){
        if($this.routTag.productnameId!=0){
          searchData.productname=$this.routTag.productname;
        }
        searchData.typeid=$this.routTag.typeid;
        pathUrl = "api/getChinaproductinfocountAction";
      }else if($this.contrastName==="productCont"){
        if($this.contrastProname&&$this.contrastProname.length>0){
            var productname=[];
            $this.contrastProname.forEach(function(item,index){
                if(item.isOn){
                    productname.push(item.name);
                }
            });
            searchData.productname=productname;
        }else{
            searchData.productname=[$this.routTag.productname];
        }
        pathUrl = "api/getChinaproductcompareAction";
      }else if($this.contrastName==="departCont"){
        if($this.routTag.productnameId!=0){
          searchData.productname=$this.routTag.productname;
        }
        searchData.typeid=$this.routTag.typeid;
        pathUrl = "api/getChinaproductdepartcompareAction";
      }else if($this.contrastName==="timeCont"){
        if($this.routTag.productnameId!=0){
          searchData.productname=$this.routTag.productname;
        }
        searchData.cstarttime=$this.routTag.cstarttime;
        searchData.cendtime=$this.routTag.cendtime;
        searchData.typeid=$this.routTag.typeid;
        pathUrl = "api/getChinaproducttimecompareAction";
      }
      $this.$store.dispatch(pathUrl,searchData).then((res) => {
          if (res) {
            if (res.status) {
                if(res.hasfocus){
                    $this.hasfocus=res.hasfocus;
                }
                if(res.xunmaxmonth&&res.xunmaxmonth.length>0){
                    $this.xunmaxmonth=res.xunmaxmonth[0];
                }
                if($this.contrastName==="overview"){
                    //顶部询盘趋势
                    if(res.topxunnumber&&res.topxunnumber.length>0){
                        res.topxunnumber.forEach(function(item,index){
                            item.weekday=item.week;
                            item.productname=$this.routTag.productname;
                        });
                        var topxunnumber=[res.topxunnumber]
                        var tagName=[$this.routTag.productname]
                        $this.enquirieList=$this.echartareaPlug(topxunnumber,tagName,'询盘趋势',$this.contrastName);  
                    }
                    var ChartTab=[];
                    var currentMix=[];
                    var MixData={
                        nowYear:[],
                        lastYear:[],
                    }
                    //询盘个数
                    if(res.xunmonthtong&&res.xunmonthtong.length>0){
                        var totalNum=0;
                        var lasttotalNum=0;
                        var currentMixItem={
                            currentTab:'enquirie',
                            nowYear:[],
                            lastYear:[],
                        }
                        res.xunmonthtong.forEach(function(item,index){
                            var nowYearObj={};
                            totalNum=totalNum+item.number;
                            lasttotalNum=lasttotalNum+item.lastnumber;
                            nowYearObj.time=item.date;
                            nowYearObj.number=item.number;
                            MixData.nowYear.push(nowYearObj);
                            if($this.currentTab=='enquirie'){
                                var lastYearObj={};
                                var lastdate=item.date.split('-');
                                lastYearObj.time=(lastdate[0]-1)+'-'+lastdate[1];
                                lastYearObj.number=item.lastnumber;
                                MixData.lastYear.push(lastYearObj);
                            }
                            currentMixItem.nowYear.push(nowYearObj);
                            currentMixItem.lastYear.push(lastYearObj);
                        });
                        $this.CoreData.enquiriesNum=totalNum;
                        var ChartTabObj={};
                        ChartTabObj.totalNum=totalNum.toFixed(2)*1;
                        ChartTabObj.lasttotalNum=lasttotalNum.toFixed(2)*1;                    
                        ChartTabObj.numSeptotalNum=numSeparate(totalNum.toFixed(2)*1);
                        ChartTabObj.numSeplasttotalNum=numSeparate(lasttotalNum.toFixed(2)*1);
                        ChartTabObj.sequential=numSeparate(Math.abs(totalNum-lasttotalNum).toFixed(2)*1);
                        ChartTabObj.name='总询盘个数';
                        ChartTabObj.unit='（单位：个）';
                        ChartTabObj.tap='enquirie'; 
                        ChartTabObj.isOn=true;
                        ChartTab.push(ChartTabObj);
                        currentMix.push(currentMixItem);
                    }
                    //成交积分
                    if(res.monthscore&&res.monthscore.length>0){
                        var totalNum=0;
                        var lasttotalNum=0;
                        var currentMixItem={
                            currentTab:'clinchScore',
                            nowYear:[],
                            lastYear:[],
                        }               
                        res.monthscore.forEach(function(item,index){
                            var nowYearObj={};
                            var lastYearObj={};
                            totalNum=totalNum+item.score;
                            lasttotalNum=lasttotalNum+item.lastscore;
                            nowYearObj.time=item.date;
                            nowYearObj.number=item.score;
                            currentMixItem.nowYear.push(nowYearObj);

                            var lastdate=item.date.split('-');
                            lastYearObj.time=(lastdate[0]-1)+'-'+lastdate[1];
                            lastYearObj.number=item.lastscore;
                            currentMixItem.lastYear.push(lastYearObj);
                        });
                        $this.CoreData.ClinchIntegral=totalNum.toFixed(2)*1;
                        var ChartTabObj={};
                        ChartTabObj.totalNum=totalNum.toFixed(2)*1;
                        ChartTabObj.lasttotalNum=lasttotalNum.toFixed(2)*1;                    
                        ChartTabObj.numSeptotalNum=numSeparate(totalNum.toFixed(2)*1);
                        ChartTabObj.numSeplasttotalNum=numSeparate(lasttotalNum.toFixed(2)*1);
                        ChartTabObj.sequential=numSeparate(Math.abs(totalNum-lasttotalNum).toFixed(2)*1);
                        ChartTabObj.name='总成交积分';
                        ChartTabObj.unit='（单位：分）';
                        ChartTabObj.tap='clinchScore'; 
                        ChartTabObj.isOn=false;
                        ChartTab.push(ChartTabObj);
                        currentMix.push(currentMixItem);
                    }
                    //年度100万成交个数
                    if(res.monthanumber&&res.monthanumber.length>0){
                        var totalNum=0;
                        var lasttotalNum=0;
                        var currentMixItem={
                            currentTab:'clinchNum',
                            nowYear:[],
                            lastYear:[],
                        }               
                        res.monthanumber.forEach(function(item,index){
                            var nowYearObj={};
                            var lastYearObj={};
                            totalNum=totalNum+item.anumber;
                            lasttotalNum=lasttotalNum+item.lastanumber;
                            nowYearObj.time=item.date;
                            nowYearObj.number=item.anumber;
                            currentMixItem.nowYear.push(nowYearObj);

                            var lastdate=item.date.split('-');
                            lastYearObj.time=(lastdate[0]-1)+'-'+lastdate[1];
                            lastYearObj.number=item.lastanumber;
                            currentMixItem.lastYear.push(lastYearObj);
                        });
                        var ChartTabObj={};
                        ChartTabObj.totalNum=totalNum.toFixed(2)*1;
                        ChartTabObj.lasttotalNum=lasttotalNum.toFixed(2)*1;                    
                        ChartTabObj.numSeptotalNum=numSeparate(totalNum.toFixed(2)*1);
                        ChartTabObj.numSeplasttotalNum=numSeparate(lasttotalNum.toFixed(2)*1);
                        ChartTabObj.sequential=numSeparate(Math.abs(totalNum-lasttotalNum).toFixed(2)*1);
                        ChartTabObj.name='100万成交个数';
                        ChartTabObj.unit='（单位：个）';
                        ChartTabObj.tap='clinchNum'; 
                        ChartTabObj.isOn=false;
                        ChartTab.push(ChartTabObj);
                        currentMix.push(currentMixItem);
                    }
                    //平均成交率
                    if(res.monthscorenumber&&res.monthscorenumber.length>0){
                        var totalNum=0;
                        var totalscoreNum=0;
                        var lasttotalNum=0;
                        var currentMixItem={
                            currentTab:'closing',
                            nowYear:[],
                            lastYear:[],
                        }               
                        res.monthscorenumber.forEach(function(item,index){
                            var nowYearObj={};
                            var lastYearObj={};
                            totalNum=totalNum+item.scorepercenter;
                            totalscoreNum=totalscoreNum+item.scorenumber;
                            lasttotalNum=lasttotalNum+item.lastscorepercenter;

                            nowYearObj.time=item.date;
                            nowYearObj.number=item.scorepercenter;
                            currentMixItem.nowYear.push(nowYearObj);


                            var lastdate=item.date.split('-');
                            lastYearObj.time=(lastdate[0]-1)+'-'+lastdate[1];
                            lastYearObj.number=item.lastscorepercenter;
                            currentMixItem.lastYear.push(lastYearObj);
                        });
                        $this.CoreData.ClinchNum=totalscoreNum;
                        var ChartTabObj={};
                        var timeNum=res.monthscorenumber.length==0?1:res.monthscorenumber.length;
                        ChartTabObj.totalNum=totalNum.toFixed(2)*1;
                        ChartTabObj.lasttotalNum=lasttotalNum.toFixed(2)*1;
                        ChartTabObj.numSeptotalNum=numSeparate((totalNum/timeNum).toFixed(2)*1);
                        ChartTabObj.numSeplasttotalNum=numSeparate(lasttotalNum.toFixed(2)*1);
                        ChartTabObj.sequential=numSeparate((Math.abs(totalNum-lasttotalNum)/timeNum).toFixed(2)*1);
                        ChartTabObj.name='平均成交率';
                        ChartTabObj.unit='';
                        ChartTabObj.tap='closing'; 
                        ChartTabObj.isOn=false;
                        ChartTab.push(ChartTabObj);
                        currentMix.push(currentMixItem);
                    }
                    $this.CoreData.closing='0%';
                    if($this.CoreData.enquiriesNum&&$this.CoreData.ClinchNum){
                        $this.CoreData.closing=($this.CoreData.ClinchNum/$this.CoreData.enquiriesNum).toFixed(2)*1+'%';
                    }
                    $this.CoreData.average=0;
                    if($this.CoreData.ClinchIntegral&&$this.CoreData.ClinchNum){
                        $this.CoreData.average=($this.CoreData.ClinchIntegral/$this.CoreData.ClinchNum).toFixed(2)*1;
                    }
                    $this.CoreData.EnquiryPoints=0;
                    if($this.CoreData.enquiriesNum&&$this.CoreData.ClinchIntegral){
                        $this.CoreData.EnquiryPoints=(($this.CoreData.ClinchIntegral/$this.CoreData.enquiriesNum)*100).toFixed(2)*1;
                    }
                    //
                    $this.MixData=MixData;
                    $this.ChartTab=ChartTab;
                    $this.currentMix=currentMix;
                    // 组合图表
                    $this.getYearInquiryChart();
                    //询盘占比
                    var departcount=[];
                    if(res.departcount&&res.departcount.length>0){
                        var peitit='';
                        if($this.contrastName=='overview'||$this.contrastName=='departCont'){peitit='询盘个数 - 部门占比'}
                        if($this.contrastName=='productCont'){peitit='询盘个数 - 产品占比'}
                        if($this.contrastName=='timeCont'){peitit='询盘个数 - 时间占比'}
                        departcount=departcount.concat($this.piePlug(res.departcount,peitit,'enquirie','总询盘个数'));
                    }
                    //积分占比
                    if(res.departscore&&res.departscore.length>0){
                        var peitit='';
                        if($this.contrastName=='overview'||$this.contrastName=='departCont'){peitit='成交积分 - 部门占比'}
                        if($this.contrastName=='productCont'){peitit='成交积分 - 产品占比'}
                        if($this.contrastName=='timeCont'){peitit='成交积分 - 时间占比'}
                        departcount=departcount.concat($this.piePlug(res.departscore,peitit,'score','总成交积分'));
                    }
                    $this.ChartAccount=departcount;
                    //询盘地图
                    var EnquirieMap=[];
                    if(res.provincecountmap&&res.provincecountmap.length>0){
                        var maxNum=0;
                        maxNum=res.provincecountmap[0].number;
                        $this.mapNum=1;
                        EnquirieMap=EnquirieMap.concat($this.mapPlug(res.provincecountmap,'询盘个数','询盘地区',maxNum));
                    }
                    $this.EnquirieMap=EnquirieMap;
                    //成交地图
                    var ChartMap=[];
                    if(res.provincescoretmap&&res.provincescoretmap.length>0){
                        var maxScore=0;
                        maxScore=res.provincescoretmap[0].number;
                        ChartMap=ChartMap.concat($this.mapPlug(res.provincescoretmap,'成交积分','成交地区',maxScore));
                    }
                    $this.ChartMap=ChartMap;
                    // 成员询盘占比
                    if(res.departcountuser){
                        var indata = res.departcountuser;
                        if(indata.length>0){
                            let totalnum = indata.reduce((a,b) =>{
                                a = a + b.number;
                                return a;
                            },0)
                            indata.forEach(function(item,index){
                                if(totalnum!=0){
                                    if(item.number==0){
                                        item.percent='0%';
                                    }else{
                                        item.percent=(item.number/totalnum*100).toFixed(2)+'%';
                                    }
                                }else{
                                    item.percent='0%';
                                }
                            })
                        }
                        $this.intableData = indata;
                    }                
                    // 成员积分占比
                    if(res.departscoreuser){
                        var scoredata = res.departscoreuser;
                        if(scoredata.length>0){
                            let totalscore = scoredata.reduce((a,b) =>{
                                a = a + b.number;
                                return a;
                            },0)
                            scoredata.forEach(function(item,index){
                                if(totalscore!=0){
                                    if(item.number==0){
                                        item.percent='0%';
                                    }else{
                                        item.percent=(item.number/totalscore*100).toFixed(2)+'%';
                                    }
                                }else{
                                    item.percent='0%';
                                }
                            })
                        }
                        $this.scoretableData = scoredata;
                    }
                }else{
                    //顶部询盘趋势
                    if(res.topxunnumber&&res.topxunnumber.length>0){
                        var tagName=[];
                        res.topxunnumber.forEach(function(item,index){                            
                            item.forEach(function(items,indexs){
                                if($this.contrastName=='productCont'){
                                    if(tagName.indexOf(items.productname)<0){
                                        tagName.push(items.productname);
                                    }
                                }
                                if($this.contrastName=='departCont'){
                                    if(tagName.indexOf(items.departname)<0){
                                        tagName.push(items.departname);
                                    }
                                }
                            });
                        });
                        $this.enquirieList=$this.echartareaPlug(res.topxunnumber,tagName,'询盘趋势',$this.contrastName);
                    }
                    //询盘占比
                    var ChartEnquirie=[];
                    var departcountChart=[];
                    if(res.xunmonthtong&&res.xunmonthtong.length>0){
                        if($this.contrastName=='timeCont'){
                            var timeOne=$this.routTag.data[0]+" ~ "+$this.routTag.data[1];
                            var timeTwo=$this.routTag.cstarttime+" ~ "+$this.routTag.cendtime;
                            var valName=[timeOne,timeTwo]
                            ChartEnquirie = ChartEnquirie.concat($this.dateCompare(res.xunmonthtong,'xunnumber',valName,'询盘趋势'));
                        }else{
                            ChartEnquirie=ChartEnquirie.concat($this.echartareaPlug(res.xunmonthtong,tagName,'询盘个数',$this.contrastName));
                        }
                        var departCount=[];
                        var dataOne=$this.routTag.data;
                        var dataTwo=$this.routTag.csdata;
                        res.xunmonthtong.forEach(function(item,index){
                            var itemObj={
                                departname:'',
                                number:0,
                            }
                            item.forEach(function(items,indexs){
                                if($this.contrastName=='timeCont'){
                                    if(index==0){
                                        itemObj.departname=dataOne[0]+" ~ "+dataOne[1];
                                    }else{
                                        itemObj.departname=dataTwo[0]+" ~ "+dataTwo[1];
                                    }
                                }
                                if($this.contrastName=='productCont'){
                                    itemObj.departname=items.productname;
                                }
                                if($this.contrastName=='departCont'){
                                    itemObj.departname=items.departname;
                                }
                                itemObj.number+=items.number
                            });
                            departCount.push(itemObj);
                        });
                        var peitit='';
                        if($this.contrastName=='overview'||$this.contrastName=='departCont'){peitit='询盘个数 - 部门对比'}
                        if($this.contrastName=='productCont'){peitit='询盘个数 - 产品对比'}
                        if($this.contrastName=='timeCont'){peitit='询盘个数 - 时间对比'}
                        departcountChart=departcountChart.concat($this.piePlug(departCount,peitit,'enquirie','总询盘个数'));
                    }
                    //积分对比
                    if(res.productmonthscore&&res.productmonthscore.length>0){
                        if($this.contrastName=='timeCont'){
                            var timeOne=$this.routTag.data[0]+" ~ "+$this.routTag.data[1];
                            var timeTwo=$this.routTag.cstarttime+" ~ "+$this.routTag.cendtime;
                            var valName=[timeOne,timeTwo]
                            ChartEnquirie = ChartEnquirie.concat($this.dateCompare(res.productmonthscore,'score',valName,'成交积分'));
                        }else{
                            ChartEnquirie=ChartEnquirie.concat($this.echartareaPlug(res.productmonthscore,tagName,'成交积分',$this.contrastName));
                        }                         
                        var departCount=[];
                        res.productmonthscore.forEach(function(item,index){
                            var itemObj={
                                departname:'',
                                score:0,
                            }
                            var dataOne=$this.routTag.data;
                            var dataTwo=$this.routTag.csdata;
                            item.forEach(function(items,indexs){
                                if($this.contrastName=='timeCont'){
                                    if(index==0){
                                        itemObj.departname=dataOne[0]+" ~ "+dataOne[1];
                                    }else{
                                        itemObj.departname=dataTwo[0]+" ~ "+dataTwo[1];
                                    }
                                }
                                if($this.contrastName=='productCont'){
                                    itemObj.departname=items.productname;
                                }
                                if($this.contrastName=='departCont'){
                                    itemObj.departname=items.departname;
                                }
                                itemObj.score+=items.score
                                itemObj.score=itemObj.score.toFixed(2)*1
                            });
                            departCount.push(itemObj);
                        });
                        var peitit='';
                        if($this.contrastName=='overview'||$this.contrastName=='departCont'){peitit='成交积分 - 部门对比'}
                        if($this.contrastName=='productCont'){peitit='成交积分 - 产品对比'}
                        if($this.contrastName=='timeCont'){peitit='成交积分 - 时间对比'}
                        departcountChart=departcountChart.concat($this.piePlug(departCount,peitit,'score','总成交积分'));
                    }
                    $this.ChartEnquirie=ChartEnquirie;
                    $this.ChartAccount=departcountChart;
                    //询盘地图
                    var EnquirieMap=[];
                    if(res.provincecountmap&&res.provincecountmap.length>0){
                        $this.mapNum=res.provincecountmap.length;
                        var ChartMapArr=[];
                        var maxNum=0;
                        res.provincecountmap.forEach(function(item,index){
                            if(item&&item.length>0){
                                item.forEach(function(items,indexs){ 
                                    if(maxNum<items.number){
                                        maxNum=items.number
                                    }
                                });
                            }
                        });
                        res.provincecountmap.forEach(function(item,index){
                            var productname='';
                            if($this.contrastName=='timeCont'){
                                if(index==0){
                                    productname=$this.routTag.data[0]+" ~ "+$this.routTag.data[1];
                                }
                                if(index==1){
                                    productname=$this.routTag.cstarttime+" ~ "+$this.routTag.cendtime;
                                }
                            }
                            if($this.contrastName=='productCont'){
                                productname=item[0].productname;
                            }
                            if($this.contrastName=='departCont'){
                                productname=item[0].departname;
                            }
                            ChartMapArr=ChartMapArr.concat($this.mapPlug(item,'询盘个数',productname+'询盘地区',maxNum));
                        });
                        EnquirieMap=EnquirieMap.concat(ChartMapArr);
                    }
                    $this.EnquirieMap=EnquirieMap;
                    var ChartMap=[];
                    //成交地图
                    if(res.provincescoretmap&&res.provincescoretmap.length>0){
                        var ChartMapArr=[];
                        var maxNum=0;
                        res.provincescoretmap.forEach(function(item,index){
                            if(item&&item.length>0){
                                item.forEach(function(items,indexs){ 
                                    if(maxNum<items.number){
                                        maxNum=items.number
                                    }
                                });
                            }
                        });
                        res.provincescoretmap.forEach(function(item,index){
                            var productname='';
                            if($this.contrastName=='timeCont'){
                                if(index==0){
                                    productname=$this.routTag.data[0]+" ~ "+$this.routTag.data[1];
                                }
                                if(index==1){
                                    productname=$this.routTag.cstarttime+" ~ "+$this.routTag.cendtime;
                                }
                            }
                            if($this.contrastName=='productCont'){
                                productname=item[0].productname;
                            }
                            if($this.contrastName=='departCont'){
                                productname=item[0].departname;
                            }
                            ChartMapArr=ChartMapArr.concat($this.mapPlug(item,'成交积分',productname+'成交地区',maxNum));
                        });
                        ChartMap=ChartMap.concat(ChartMapArr);
                    }
                    $this.ChartMap=ChartMap;
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
    // 时间对比数据封装函数
    dateCompare(dataArr,key,valName,TagName){
      var $this = this;
      var ChartColor=['#044bff','#fe4c46','#fdcb66','#47cbfe'];
      // 默认时间数据条数多于对比时间数据条数
      var tongData = dataArr;
      var backData = {};
      backData.enquirieArr = [];
      backData.TagTime = [];
      backData.ChartColor = ChartColor;
      if(tongData[0].length>=tongData[1].length){  
        var newChartOne=[];
        var newChartTwo=[]; 
        for(var i=0;i<tongData[0].length;i++){ 
          var itemChart0 = {};
          var itemChart1 = {};
          var timeStr='';
          if(tongData[1][i]){
            timeStr=tongData[0][i].xunmonth+"\n"+tongData[1][i].xunmonth;
            itemChart0.color = ChartColor[1];
            itemChart0.name = $this.routTag.data[0]+" ~ "+$this.routTag.data[1];
            itemChart1.color = ChartColor[0];
            itemChart1.name = $this.routTag.cstarttime+" ~ "+$this.routTag.cendtime;
            itemChart1.xunmonth=tongData[1][i].xunmonth;

            if(key=='xunnumber'){
                itemChart1.value=tongData[1][i].number;
            }else{
                itemChart1.value=tongData[1][i].score;
            }
            newChartTwo.push(itemChart1);
          }else{
            timeStr=tongData[0][i].xunmonth;
            itemChart0.color = ChartColor[1];
            itemChart0.name = $this.routTag.data[0]+" ~ "+$this.routTag.data[1];
          }
          itemChart0.xunmonth=tongData[0][i].xunmonth;
          if(key=='xunnumber'){
              itemChart0.value=tongData[0][i].number;
          }else{
              itemChart0.value=tongData[0][i].score;
          }
          backData.TagTime.push(timeStr);
          newChartOne.push(itemChart0);
        }
        backData.enquirieArr.push(newChartOne);
        backData.enquirieArr.push(newChartTwo);
      }else{        
        var newChartOne=[];
        var newChartTwo=[];
        for(var i=0;i<tongData[1].length;i++){   
          var itemChart0 = {};
          var itemChart1 = {};
          var timeStr='';
          if(tongData[0][i]){
            timeStr=tongData[1][i].xunmonth+"\n"+tongData[0][i].xunmonth;
            itemChart0.color = ChartColor[0];
            itemChart0.name = $this.routTag.data[0]+" ~ "+$this.routTag.data[1];
            itemChart0.xunmonth=tongData[0][i].xunmonth;
            itemChart1.color = ChartColor[1];
            itemChart1.name = $this.routTag.cstarttime+" ~ "+$this.routTag.cendtime;
            if(key=='xunnumber'){
                itemChart0.value=tongData[0][i].number;
            }else{
                itemChart0.value=tongData[0][i].score;
            }
            newChartOne.push(itemChart0);
          }else{
            timeStr=tongData[1][i].xunmonth;
            itemChart1.color = ChartColor[1];
            itemChart1.name = $this.routTag.cstarttime+" ~ "+$this.routTag.cendtime;
          }
          itemChart1.xunmonth=tongData[1][i].xunmonth;
          if(key=='xunnumber'){
              itemChart1.value=tongData[1][i].number;
          }else{
              itemChart1.value=tongData[1][i].score;
          }
          backData.TagTime.push(timeStr);
          newChartTwo.push(itemChart1);
        }
        backData.enquirieArr.push(newChartOne);
        backData.enquirieArr.push(newChartTwo);
      }
      backData.randomStr = randomString(4);
      backData.TagName = TagName;
      backData.chartName = valName;
      return backData;
    },
    // 面积图插件
    echartareaPlug(valData,valName,TagName,contrastName){
        var $this = this;
        var ChartColor=['#044bff','#fe4c46','#fdcb66','#47cbfe'];
        var enquirieList=[];
        var enquirieObj={
            TagName:TagName,
            chartName:valName,
            randomStr:randomString(4),
            ChartColor:[],
            enquirieArr:[],
            TagTime:[],
        };
        var newArr=[];
        valData.forEach(function(item,index){
            var newItemArr=[];
            item.forEach(function(items,indexs){
                var itemDate = [];
                if(items.date){
                    itemDate = items.date.split("-");
                    items.time =itemDate[1] + "-" + itemDate[2] + "\n" + items.weekday.replace("星期", "周");
                }else{
                    itemDate = items.xunmonth.split("-");
                    items.time =itemDate[1] + "月";
                }
                if(index==0){
                    enquirieObj.TagTime.push(items.time);
                }
                var itemObj={};
                itemObj.name=items.time;
                itemObj.color=ChartColor[index];
                if(contrastName=='overview'||contrastName=='productCont'){
                  itemObj.itemName=items.productname;
                }
                if(contrastName=='departCont'){
                  itemObj.itemName=items.departname;
                }
                if(TagName!='成交积分'){
                    itemObj.value=items.number;
                }else{
                    itemObj.value=items.score;
                }
                newItemArr.push(itemObj);             
            });
            newArr.push(newItemArr);
        });
        enquirieObj.ChartColor=ChartColor;
        enquirieObj.enquirieArr=newArr;
        enquirieList.push(enquirieObj);
        return enquirieList;

    },
    // 饼图插件
    piePlug(valData,valName,valTag,valUnit){
        var $this = this;
        var departcount=[];
        var totalNum=0;
        var ChartColor=['#2368ff','#49cdff','#ffcb60','#fe443d'];
        if(valTag=='enquirie'){
            valData.forEach(function(item,index){
                totalNum+=item.number;
            });
            valData.sort(function(a,b){
                return b.number - a.number
            });
            var departscoreArr = rankingWithTotalItem(valData,'number');
        }
        if(valTag=='score'){
            valData.forEach(function(item,index){
                totalNum+=item.score;
            });
            valData.sort(function(a,b){
                return b.score - a.score
            });
            var departscoreArr = rankingWithTotalItem(valData,'score');
        }
        var departcountObj={
            currentName:valName,
            currentTag:valTag,
            totalNum:totalNum.toFixed(2)*1,
            totalNumName:valUnit,
            ChartColor:ChartColor,
            itemArr:[],
        };
        departscoreArr.forEach(function(item,index){
            if(valTag=='enquirie'){
                if(totalNum!=0){
                    if(item.number==0){
                        item.percent='0%';
                    }else{
                        item.percent=(item.number/totalNum*100).toFixed(2)+'%';
                    }
                }else{
                    item.percent='0%';
                }
            }            
            if(valTag=='score'){
                if(totalNum!=0){
                    if(item.score==0){
                        item.percent='0%';
                    }else{
                        item.percent=(item.score/totalNum*100).toFixed(2)+'%';
                    }
                }else{
                    item.percent='0%';
                }
                item.number=item.score;
            }
            item.name=item.departname;
            item.color=ChartColor[index];
            departcountObj.itemArr.push(item);
        });
        departcount.push(departcountObj);
        return departcount;
    },
    // 地图插件
    mapPlug(valData,valName,valTag,maxNum){
        var $this = this;
        var ChartMap=[];
        var itemMapData = {};
        itemMapData.mapData = chinaData(valData,"name","number");
        itemMapData.colorData = MapInterval(maxNum);
        if($this.mapNum>2){
            var mapWidth = parseInt(($this.minWidth-40)/$this.mapNum*0.9)-60;
            var mapHeight = parseInt(mapWidth*$this.mapRatio)+30;
            itemMapData.mapWidth = mapWidth;
            itemMapData.mapHeight = mapHeight;
        }
        itemMapData.randomStr = randomString(4);
        itemMapData.width = "50%";
        itemMapData.alias = valName;
        itemMapData.title = valTag;
        itemMapData.topTitle = "热门地区TOP10";
        itemMapData.topTenData = [];
        itemMapData.mapData.forEach(function(item,index){
            if(index<10){
                itemMapData.topTenData.push(item);
            }
        });
        itemMapData.topTenColor = TopTenColor(itemMapData.topTenData,itemMapData.colorData);
        ChartMap.push(itemMapData);
        return ChartMap;
    },
    // 组合图表
    getYearInquiryChart(){
        var $this = this;
        var nowyear = $this.MixData.nowYear;
        var lastyear = $this.MixData.lastYear;
        var timeArr=[];
        var nowDataArr=[];
        var lastDataArr=[];
        nowyear.forEach(function(item,index){
            timeArr.push(item.time.split("-")[1]+"月");
            nowDataArr.push(item.number);
        });
        lastyear.forEach(function(item,index){
            lastDataArr.push(item.number);
        });
        // 平均值
        var avgMark=false;
        if($this.currentTab=='enquirie'){
            avgMark={
                    data: [
                        {type: 'average', name: '平均值'}
                    ],
                    label: {
                        show: true,
                        position: 'insideEndTop',
                    },
                    lineStyle:{
                        normal: {
                            width:1,
                            color:'#01b01d', // 线条颜色
                        },
                    },
                    emphasis:{
                        lineStyle: {
                        width:1,	// hover时的折线宽度
                        }
                    }
                }
        }else{
            avgMark=false;
        }
        var series=[];
        if($this.isYearBool){
            series=[{
                type: 'bar',
                data:nowDataArr,
                barWidth: '28px',
                itemStyle: {
                    color: '#6395f9'
                },
                markLine:avgMark,
                label: {
                    normal: {
                        show: false,
                    }
                },
            }];
        }else{
            series=[{
                type: 'bar',
                data:nowDataArr,
                barWidth: '28px',
                itemStyle: {
                    color: '#6395f9'
                },
                markLine:avgMark,
                label: {
                    normal: {
                        show: false,
                    }
                },
            },{
                type: 'line',
                data:lastDataArr,
                smooth:false,
                showSymbol:false,
                lineStyle:{
                    normal: {
                        width: 2,
                        color:'#efd587', // 线条颜色
                    },
                },
                itemStyle:{
                    normal: {
                        color:'#efd587', // 折点颜色
                    },
                },
                areaStyle:{
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                        offset: 0,
                        color:'#efd587',
                        opacity:1
                        },
                        {
                        offset: 1,
                        color: "rgba(255, 255, 255, 0)",
                        }
                    ]),
                    opacity:0.3
                },
                emphasis:{
                    lineStyle: {
                        width: 2,	// hover时的折线宽度
                    }
                },
                symbolSize:7,
                animationDuration:2800,
                animationEasing:'quadraticOut',
            }]
        }
        var chartDom = document.getElementById('inquirybox');
        var MixChart = echarts.init(chartDom);
        var option;
        option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function (params, ticket, callback) {
                    var showHtm="";
                    var title = '';
                    var showHtmDd='';
                    for(var i=0;i<params.length;i++){
                        if(params[i]&&params[i]!=undefined){
                            var name = '';   
                            var nowyearStr='';
                            var lastyearStr='';
                            nowyear.forEach(function(item,index){
                                if(index==0){                                    
                                    nowyearStr=item.time.split("-")[0]+'-'+params[i].axisValue.replace('月','');
                                }
                            });
                            lastyear.forEach(function(item,index){
                                if(index==0){
                                    lastyearStr=item.time.split("-")[0]+'-'+params[i].axisValue.replace('月','');
                                }
                            });
                            if(i==0){
                                name=nowyearStr;
                            }
                            if(i==1){
                                name=lastyearStr;
                            }
                            var value = params[i].value;
                            if($this.currentTab=='enquirie'){
                                title='询盘个数';
                            }
                            if($this.currentTab=='clinchScore'){
                                title='成交积分';
                            }
                            if($this.currentTab=='clinchNum'){
                                title='100万成交个数';
                            }
                            if($this.currentTab=='closing'){
                                title=name;
                            }
                            showHtmDd+='<dd><i style="background:'+params[i].color+'"></i><span>'+name+'：</span><strong>' + value +'</strong></dd>'
                        }
                    }
                    showHtm='<dl class="columTool"><dt>'+title+'</dt>'+showHtmDd+'</dl>';
                    return showHtm;
                }
            },
            grid: {
                top:'10',
                right:'0',
                left:'35',
                bottom:'30'
            },
            xAxis:{
                type: 'category',
                data:timeArr,
                axisTick: {
                    show: false
                },
                axisLine:{
                    show: true,
                    lineStyle:{
                        type: [4, 0],
                        dashOffset: 3,
                        color: '#e5e5e5',
                        opacity:1,
                        shadowColor: null,
                        shadowBlur: 0,
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                    }
                },
                axisLabel: {
                    color: "#555",
                    fontSize: "13",
                    lineHeight: 18,
                },
                nameTextStyle:{
                    lineHeight:18,
                }
            },
            yAxis:{
                type: 'value',
                axisTick: {
                    show: false
                },
                axisLabel: {
                    color: "#555",
                    fontSize: "13",
                },
                axisLine:{
                    show: false,
                },
                splitLine:{
                    show: true,
                    lineStyle:{
                        type: [4, 2],
                        dashOffset: 3,
                        color: '#e5e5e5',
                        opacity:1,
                        shadowColor: null,
                        shadowBlur: 0,
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                    }
                },
                splitNumber:3,
                nameTextStyle:{
                    lineHeight:18,
                }
            },
            series:series,
        }
        option && MixChart.setOption(option);
        $this.MixChart = MixChart;
    },
    // 点击产品分类获取产品
    handleCategory(valData){
      var $this = this;
      if($this.routTag.typeid!=valData){
        $this.routTag.typeid=valData;
        $this.routTag.productnameId='';
        $this.isCate=true;
        $this.ProCategoryList.forEach(function(item,index){
            item.isOn=false;
            if(item.id==valData){
                item.isOn=true;
                $this.routTag.productname=item.name;
            }
        });
        $this.contrastTab.forEach(function(item,index){
            if(item.tagName=='productCont'){
                item.isDisplay=false;
            }
        });
        $this.getchinaproduct();
      }
    },
    // 点击产品获取详情
    handlePro(valData,valType){
        var $this = this;
        if($this.routTag.productnameId!=valData){
            if(valData==0){
                $this.contrastTab.forEach(function(item,index){
                    if(item.tagName=='productCont'){
                        item.isDisplay=false;
                    }
                });
                $this.ProList.forEach(function(item,index){
                    item.isOn=false;
                    if(item.id==valData){
                        item.isOn=true;
                        $this.routTag.productnameId=item.id;
                    }
                });
                $this.ProCategoryList.forEach(function(item,index){
                    if(item.isOn){
                        $this.routTag.productname=item.name;
                    }
                });
            }else{
                $this.contrastTab.forEach(function(item,index){
                    item.isDisplay=true;
                });
                var contrastPass=[];
                $this.ProList.forEach(function(item,index){
                    item.isOn=false;
                    var itemObj={};
                    if(item.id==valData){
                        item.isOn=true;
                        
                        itemObj.isOn=true;
                        itemObj.id=item.id;
                        itemObj.name=item.name;
                        itemObj.typeid=item.typeid;
                        contrastPass.push(itemObj);

                        $this.routTag.productname=item.name;
                        $this.routTag.productnameId=item.id;
                    }
                });
                $this.contrastPass=contrastPass;  
            }
            $this.getProFocount();
        }
    },
    // 点击部门获取部门ID
    handleDepart(valData){
        var $this=this;
        $this.routTag.dept_id=[];
        var dept_id=[];
        var department=$this.department;
        department.forEach(function(item,index){
            item.isOn=false;
            if(valData==item.id){
                item.isOn=true;
            }
            if(valData!=0&&valData==item.id){
                dept_id.push(item.id);
            }
        });
        $this.department=department;
        if(valData==0){
            $this.routTag.dept_id=$this.allDept_id;
        }
        if(valData!=0){
            $this.routTag.dept_id=dept_id;
        }
        $this.getProFocount();
    },
    //点击时间选择
    handlerTime(varData){
      var $this=this;
      var changeTime=$this.changeTime;
      $this.isTimeSelecte=false;
      if(varData=='今年'){
          $this.isOnTab=true;
      }else{
          $this.isOnTab=false;
      }
      changeTime.forEach(function(item,index){
        item.isOn=false;
        if(item.name==varData){
          $this.routTag.data=item.data;
          item.isOn=true;
        }
      });
      $this.getProFocount();
    },
    //点击时间选择
    handleData(){
      var $this=this;
      var changeTime=$this.changeTime;
      var dataOne=$this.routTag.data.toString();
      $this.isTimeSelecte=true;
      changeTime.forEach(function(item,index){
        var dataTwo=item.data.toString();
        item.isOn=false;
        if(dataOne==dataTwo){
          item.isOn=true;
          $this.isTimeSelecte=false;
          if(item.name=='今年'){
              $this.isOnTab=true;
          }else{
              $this.isOnTab=false;
          }
        }else{
              $this.isOnTab=false;
        }
      });      
      $this.getProFocount();
    },
    //点击对比时间
    handleContData(){
      var $this=this;
      if($this.routTag.csdata&&$this.routTag.csdata.length>0){
          $this.routTag.cstarttime=$this.routTag.csdata[0];
          $this.routTag.cendtime=$this.routTag.csdata[1];
          $this.getProFocount();
      }
    },
    // 点击切换
    handleTab(valData){
        var $this=this;
        var ChartTab=$this.ChartTab;
        $this.MixData=[];
        if(ChartTab&&ChartTab.length>0){
            ChartTab.forEach(function(item,index){
                item.isOn=false;
                if(item.tap==valData){
                    item.isOn=true;
                }
            });
        }
        $this.ChartTab=ChartTab;
        $this.currentTab=valData;
        var MixData={
            nowYear:[],
            lastYear:[],
        }
        if($this.currentMix&&$this.currentMix.length>0){
            $this.currentMix.forEach(function(item,index){
                if(item.currentTab==valData){
                    MixData.nowYear=item.nowYear;
                    MixData.lastYear=item.lastYear;
                }
            });
        }
        $this.MixData=MixData;
        if($this.routTag.data&&$this.routTag.data.length>0){
            var searchData={};
            searchData.starttime=$this.routTag.data[0];
            searchData.endtime=$this.routTag.data[1];
            var dataTimeOne=$this.routTag.data[0].split('-');
            var dataTimeTwo=$this.routTag.data[1].split('-');
            if(dataTimeOne[0]!=dataTimeTwo[0]){
                if($this.currentTab=='enquirie'){
                    $this.showLineTime=['询盘','平均值']
                }else{
                    $this.showLineTime=['询盘']
                }
            }else{
                if($this.currentTab=='enquirie'){
                    $this.showLineTime=[dataTimeOne[0]-1+'年',dataTimeTwo[0]+'年','平均值']
                }else{
                    $this.showLineTime=[dataTimeOne[0]-1+'年',dataTimeTwo[0]+'年']
                }
            }
        }
        $this.getYearInquiryChart();
    },
    // 点击切换标签
    handlecontrastTab(valData){
      var $this=this;
      var contrastTab=$this.contrastTab;
      contrastTab.forEach(function(item,index){
          item.isOn=false;
          if(valData==item.tagName){
              item.isOn=true;
              $this.contrastName=item.tagName;
          }
      });
      $this.contrastTab=contrastTab;
      $this.department.forEach(function(item,index){
        item.isOn=false;
        if(index==0){
            item.isOn=true;
        }
      });
      $this.contrastBtnShow=true;
      $this.routTag.dept_id=$this.allDept_id; //默认选择所有部门
      $this.contrastList=[];       //重置对比搜索列表
      $this.contrastRright=[];     //弹出框右侧数据
      $this.contrastProname=[];    //重置对比搜索名字
      $this.contrastPass=[];      
      $this.contrastItem=[];       //重置对比搜索默认搜索名
      $this.routTag.csdata=[];     //重置对比时间
      $this.routTag.cstarttime=''; //重置对比开始时间
      $this.routTag.cendtime='';   //重置对比结束时间
      if(valData=='overview'){
          $this.getProFocount();
      }
      if(valData=='productCont'){
        var itemObj={};
        itemObj.isOn=true;
        itemObj.id=$this.routTag.productnameId;
        itemObj.name=$this.routTag.productname;
        itemObj.typeid=$this.routTag.typeid;
        $this.contrastPass.push(itemObj);
        var contrastList=$this.AllProList;
        $this.contrastRright=$this.contrastPass;
        contrastList.forEach(function(item,index){            
           if($this.contrastPass&&$this.contrastPass.length>0){
             $this.contrastPass.forEach(function(items,indexs){
               if(item.id==items.typeid){
                 item.isOn=true;
               }
             });
           }
           item.son.forEach(function(itemk,indexk){
              itemk.isOn=false;
              if($this.contrastPass&&$this.contrastPass.length>0){
                $this.contrastPass.forEach(function(items,indexs){
                    if(itemk.id==items.id){
                        itemk.isOn=true;
                    }
                    var objItem={};
                    if($this.routTag.productname==itemk.name){
                        items.isOn = true;
                        objItem.name=itemk.name;
                        objItem.isOn=true;
                        objItem.id=itemk.id;
                        objItem.typeid=item.id;
                        $this.contrastItem.push(objItem);
                        $this.contrastProname.push(objItem);
                    }
                });
              }
           });
        });
        $this.contrastList=contrastList;
      }
      if(valData=='departCont'){
        var contrastList=[];
        $this.department.forEach(function(item,index){
            var itemObj={};
            if(index!=0){
                itemObj.isDisplay = false;
                itemObj.isOn = false;
                itemObj.id = item.id;
                itemObj.name = item.name;
                contrastList.push(itemObj)
            }
        });
        $this.contrastList=contrastList;
      }
    },
    // 弹出添加对比产品
    handleAddcontrast(valData){
        var $this=this;
        $this.dialogFocusProVisible=true;    
        var contrastList=$this.contrastList;
        if(valData=='productCont'){
            $this.focusProTitle='产品对比';        
            $this.contrastRright=$this.contrastPass;
            contrastList.forEach(function(item,index){
                if($this.contrastPass&&$this.contrastPass.length>0){
                    $this.contrastPass.forEach(function(items,indexs){
                    if(item.id==items.typeid){
                        item.isOn=true;
                    }
                    });
                }
                item.son.forEach(function(itemk,indexk){
                    if($this.contrastPass&&$this.contrastPass.length>0){
                        $this.contrastPass.forEach(function(items,indexs){
                        if(itemk.id==items.id){
                            itemk.isOn=true;
                        }
                        });
                    }
                });
            });
        }
        if(valData=='departCont'){
            $this.focusProTitle='部门对比';
            $this.contrastRright=$this.contrastPass;
            contrastList.forEach(function(item,index){
                item.isOn=false;
                if($this.contrastPass&&$this.contrastPass.length>0){
                    $this.contrastPass.forEach(function(items,indexs){
                        if(item.id==items.id){
                            item.isOn=true;
                        }
                    });
                }
            });
        }
        $this.contrastList=contrastList;
    },
    // 点击确定添加对比产品
    saveContrast(){
        var $this=this;
        $this.dialogFocusProVisible=false;
        $this.focusProTitle='';
        $this.contrastPass=$this.contrastRright;
        if($this.contrastName=='departCont'){
            var dept_id=[];
            $this.contrastPass.forEach(function(item){
                dept_id.push(item.id);
            });
            $this.routTag.dept_id=dept_id;
        }
        $this.getProFocount();
    },
    // 添加关注单个产品（产品分析）
    getAddfocuspro(valData){
      var $this = this;
      var searchData={};
      searchData.pname=valData;
      $this.$store.dispatch("api/getChinaAddfocusproductoneAction",searchData).then((res) => {
          if (res) {
            if (res.status) {
                  $this.$message({
                      showClose: true,
                      message: res.info,
                      type: 'success'
                  });
                  $this.getProFocount();
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
    // 取消关注单个产品（产品分析）
    getCancelfocuspro(valData){
      var $this = this;
      var searchData={};
      searchData.pname=valData;
      $this.$store.dispatch("api/getChinafocusproductcancelAction",searchData).then((res) => {
          if (res) {
            if (res.status) {
                  $this.$message({
                      showClose: true,
                      message: res.info,
                      type: 'success'
                  });
                  $this.getProFocount();
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
    // 点击删除对比项
    deleteDefault(valData){
        var $this=this;
        var dept_id=[];
        if(valData.name!=$this.routTag.productname){
            var contrastItem=[];
            var contrastPass=$this.contrastPass;
            contrastPass.forEach(function(item,index){
                if(valData.id!=item.id){
                    contrastItem.push(item);
                    if($this.contrastName=='departCont'){
                        dept_id.push(item.id);
                    }
                }
            });
            $this.contrastPass=contrastItem;
            if($this.contrastName=='departCont'){
                $this.routTag.dept_id=dept_id;
            }
            $this.contrastBtnShow=true;
            $this.contrastList.forEach(function(item,index){
                item.isOn = false;
                contrastItem.forEach(function(items,indexs){
                    if($this.contrastName=='departCont'){
                        if(item.id==items.id){
                            item.isOn = true;
                        }
                    }
                    if($this.contrastName=='productCont'){
                        if(item.id==items.typeid){
                            item.isOn = true;
                        }
                    }
                });
                if($this.contrastName=='productCont'){
                    item.son.forEach(function(items,indexs){
                        items.isOn = false;
                        contrastItem.forEach(function(itemk,indexk){
                            if(items.id==itemk.id){
                                items.isOn = true;
                            }
                        });
                    });
                }
            });
            $this.getProFocount();
        }
    },
    //点击关闭弹出层
    closePopup(){
        var $this=this;
        $this.dialogFocusProVisible=false;
        $this.focusProTitle='';
        var contrastList=$this.contrastList;
        if($this.contrastName=='departCont'){
            if($this.contrastPass&&$this.contrastPass.length>0){
                $this.contrastPass.forEach(function(item,index){
                    contrastList.forEach(function(items,indexs){
                        items.isOn=false;
                        if(item.typeid==items.id){
                            items.isOn=true;
                        }
                    });
                });
            }else{
                contrastList.forEach(function(item,index){
                    item.isOn=false;
                });
            }
        }
        if($this.contrastName=='productCont'){
            if($this.contrastPass&&$this.contrastPass.length>0){
                $this.contrastPass.forEach(function(item,index){
                    contrastList.forEach(function(items,indexs){
                    items.isDisplay=false;
                    items.isOn=false;
                    if(item.typeid==items.id){
                        items.isOn=true;
                    }
                    items.son.forEach(function(itemk,indexk){
                        itemk.isOn=false;
                        if(item.id==itemk.id){
                            itemk.isOn=true;
                        }
                    });
                    });
                });
            }else{
                contrastList.forEach(function(item,index){
                    item.isDisplay=false;
                    item.isOn=false;
                    item.son.forEach(function(items,indexs){
                        items.isOn=false;
                    });
                });
            }
        }
        $this.contrastList=contrastList;
        $this.contrastRright=$this.contrastPass;
        if($this.contrastProname.length>=4){
                $this.contrastBtnShow=false
        }else{
                $this.contrastBtnShow=true
        }
        $this.dialogSearch='';
        $this.dialogSearchList=[];
    },
    // 点击分类折叠展开产品
    transferType(varData){
      var $this=this;
      if($this.contrastName=='productCont'){
        var contrastList=$this.contrastList;
        contrastList.forEach(function(item,index){
            if(item.id==varData){
            item.isOn=false;
            item.isDisplay=!item.isDisplay;
            if($this.contrastRright&&$this.contrastRright.length>0){
                $this.contrastRright.forEach(function(items,indexs){
                if(items.typeid==item.id){
                    item.isOn=true;
                }
                });
            }
            if(item.isDisplay){
                item.isOn=true;
            }
            }
        });
        $this.contrastList=contrastList;
      }
      if($this.contrastName=='departCont'){
        var contrastList=$this.contrastList;
        contrastList.forEach(function(item,index){
            if(item.id==varData){
                item.isOn=!item.isOn;
            }
        });
        var contrastRright=[];
        contrastList.forEach(function(item,index){
            if(item.isOn){
                contrastRright.push(item);
            }
        });
        $this.contrastList=contrastList;
        $this.contrastRright=contrastRright;
      }
    },
    // 点击产品选择
    transferPro(varData){
      var $this=this;
      if($this.contrastRright.length<4){
        var contrastList=$this.contrastList;
        var contrastRright=[];
        contrastList.forEach(function(item,index){
          item.son.forEach(function(items,indexs){
            if(items.name!=$this.routTag.productname){
                if(items.id==varData){
                    items.isOn=!items.isOn;
                }
                var itemObj={};
                itemObj.id=items.id;
                itemObj.isOn=items.isOn;
                itemObj.name=items.name;
                itemObj.typeid=item.id;
                if(items.isOn){
                  contrastRright.push(itemObj);
                }
            }
          });
        });
        $this.contrastList=contrastList;
        $this.contrastRright=$this.contrastItem.concat(contrastRright);
      }
    },
    // 点击右侧取消选项
    cleartransferPro(varData){
      var $this=this;
      var contrastRright=$this.contrastRright;
      var contProList=[];
      if(contrastRright&&contrastRright.length>0){
            contrastRright.forEach(function(item,index){
                if(item.id!=varData){
                   contProList.push(item);
                }
            });
      }
      $this.contrastRright=contProList;      
      var contrastList=$this.contrastList;
      if($this.contrastName=='departCont'){
        contrastList.forEach(function(item,index){
            item.isOn=false;
            if($this.contrastRright&&$this.contrastRright.length>0){
                $this.contrastRright.forEach(function(items,indexs){
                    if(item.id==items.id){
                        item.isOn=true;
                    }
                });
            }
        });
      }
      if($this.contrastName=='productCont'){
        contrastList.forEach(function(item,index){
            item.isOn=false;
            item.son.forEach(function(itemk,indexk){
                itemk.isOn=false;
            });
            $this.contrastRright.forEach(function(items,indexs){
                if(items.typeid==item.id){
                    item.isOn=true;
                }
                item.son.forEach(function(itemk,indexk){
                    if(items.id==itemk.id){
                        itemk.isOn=true;
                    }
                });
            });
            if(item.isDisplay){
                item.isOn=true;
            }
        });
      }
      $this.contrastList=contrastList;
    },
    dialogSearchBtn(){
      var $this=this;
      var dialogSearchList=[];
      if($this.dialogSearch&&$this.dialogSearch!=''){
        $this.contrastList.forEach(function(item,index){
            item.son.forEach(function(items,indexs){
                if(items.name.toLowerCase().indexOf($this.dialogSearch.toLowerCase()) > -1){
                    dialogSearchList.push(items);
                }
            });
        });
      }else{
        dialogSearchList=[];
      }
      $this.dialogSearchList=dialogSearchList;
    },
    clearQuery() {
      var $this=this;
      $this.dialogSearch='';
      $this.dialogSearchList=[];
    },
    cleartransfer(){
      var $this=this;
      if($this.contrastName=='productCont'){
          var contrastRright=$this.contrastRright;
          var contrastLI=[];
          contrastRright.forEach(function(item,index){
              if(item.name==$this.routTag.productname){
                  contrastLI.push(item);
              }
          });
          $this.contrastRright=contrastLI;
          var contrastList=$this.contrastList;
          if($this.contrastRright&&$this.contrastRright.length>0){
            $this.contrastRright.forEach(function(item,index){
                contrastList.forEach(function(items,indexs){
                items.isDisplay=false;
                items.isOn=false;
                if(item.typeid==items.id){
                    items.isOn=true;
                }
                items.son.forEach(function(itemk,indexk){
                    itemk.isOn=false;
                    if(item.id==itemk.id){
                        itemk.isOn=true;
                    }
                });
                });
            });
          }else{
            contrastList.forEach(function(item,index){
                item.isDisplay=false;
                item.isOn=false;
                item.son.forEach(function(items,indexs){
                    items.isOn=false;
                });
            });
          }
          $this.contrastPass=contrastLI;
          $this.contrastList=contrastList;
      };
      if($this.contrastName=='departCont'){
          $this.contrastRright=[];
          $this.contrastPass=[];
      };
    },
    // 竖向滚动条滚动事件
    handleScroll(event){
      var $this = this;
      if(!$this.dialogFocusProVisible){
        var scrTop = event.target.scrollTop;
        var personTopTabHeight = $this.$refs.prodeptPaneBox.offsetTop;
        var personTopTabWidth = $this.$refs.prodeptPane.clientWidth;
        if(scrTop>=personTopTabHeight){
            $this.scrBool=true;
            $this.personTopTabWidth=personTopTabWidth+'px';
        }else{
            $this.scrBool=false;
            $this.personTopTabWidth='auto';
        }           
      }
    },
    departchange(chooseDepart,tag){
        this.chooseData.chooseDepart = chooseDepart;
        this.chooseData.tag = tag;
    },
    echartsSize(){
        if(this.MixChart){
            this.MixChart.resize();
        }
    }
  }
}
</script>