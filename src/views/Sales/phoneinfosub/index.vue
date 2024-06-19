<template>
  <div class="page-root flex-box no-padding SaleCard" ref="boxPane">
    <div class="sub-router SaleCardFl" ref="SaleCardFl">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <div class="sub-wrapper">
          <div class="side-button">
            <dl class="Sales-list">
                <dt v-if="menuButtonPermit.includes('Sales_lookphoneall')||menuButtonPermit.includes('Sales_phonecount')">
                  <router-link :to="{path:'/Sales/phonecount'}">
                    <span>业务员数据统计</span>
                  </router-link>
                </dt>
                <dt v-if="menuButtonPermit.includes('Sales_waitphone')||menuButtonPermit.includes('Sales_lookphoneall')" v-bind:class="currentStatus === 'waitcount'?'active':''">
                  <router-link :to="{path:'/Sales/index',query:{Status:'waitcount'}}">
                    <span>等待分配</span><i>({{defaultData.waitcount}})</i>
                  </router-link>
                </dt>
                <dt v-if="menuButtonPermit.includes('Sales_allphone')||menuButtonPermit.includes('Sales_lookphoneall')" v-bind:class="currentStatus === 'allotcount'?'active':''">
                  <router-link :to="{path:'/Sales/index',query:{Status:'allotcount'}}">
                    <span>所有已分配询盘</span><i>({{defaultData.allotcount}})</i>
                  </router-link>
                </dt>
            </dl>
          </div>
          <dl class="Salelist">
              <dt v-if="menuButtonPermit.includes('Sales_index')" v-bind:class="currentStatus === 'personcount'?'active':''">
                <router-link :to="{path:'/Sales/index',query:{Status:'personcount'}}">
                <span>个人所有询盘</span><i>({{defaultData.personcount}})</i>
                </router-link>
              </dt>
              <dt v-if="menuButtonPermit.includes('Sales_waitdeal')||menuButtonPermit.includes('Sales_lookphoneall')" v-bind:class="currentStatus === 'waitdealcount'?'active':''">
                <router-link :to="{path:'/Sales/index',query:{Status:'waitdealcount'}}">
                <span>等待处理</span><i class="redsale">({{defaultData.waitdealcount}})</i>
                </router-link>
              </dt>
              <dt v-if="menuButtonPermit.includes('Sales_monthsay')||menuButtonPermit.includes('Sales_lookphoneall')" v-bind:class="currentStatus === 'monthsaycount'?'active':''">
                <router-link :to="{path:'/Sales/index',query:{Status:'monthsaycount'}}">
                <span>月底前需反馈</span><i>({{defaultData.monthsaycount}})</i>
                </router-link>
              </dt>
              <dt v-if="menuButtonPermit.includes('Sales_hasnosay')||menuButtonPermit.includes('Sales_lookphoneall')" v-bind:class="currentStatus === 'hasnosaycount'?'active':''">
                <router-link :to="{path:'/Sales/index',query:{Status:'hasnosaycount'}}">
                <span>所有未反馈</span><i>({{defaultData.hasnosaycount}})</i>
                </router-link>
              </dt>
              <dt v-if="menuButtonPermit.includes('Sales_waitftword')||menuButtonPermit.includes('Sales_lookphoneall')" v-bind:class="currentStatus === 'waitftwordcount'?'active':''">
                <router-link :to="{path:'/Sales/index',query:{Status:'waitftwordcount'}}">
                <span>等待添加富通ID</span><i>({{defaultData.waitftwordcount}})</i>
                </router-link>
              </dt>
              <dt v-if="menuButtonPermit.includes('Sales_hasdeal')||menuButtonPermit.includes('Sales_lookphoneall')" v-bind:class="currentStatus === 'hasdealcount'?'active':''">
                <router-link :to="{path:'/Sales/index',query:{Status:'hasdealcount'}}">
                <span>已处理</span><i>({{defaultData.hasdealcount}})</i>
                </router-link>
              </dt>
              <dt v-if="menuButtonPermit.includes('Sales_hassay')||menuButtonPermit.includes('Sales_lookphoneall')" v-bind:class="currentStatus === 'hassaycount'?'active':''">
                <router-link :to="{path:'/Sales/index',query:{Status:'hassaycount'}}">
                <span>已做反馈</span><i>({{defaultData.hassaycount}})</i>
                </router-link>
              </dt>
          </dl>
          <div class="side-button">
            <dl class="Sales-list">
                <dt v-if="menuButtonPermit.includes('Sales_search')">
                  <router-link :to="{path:'/Sales/search'}">
                    <span>数据分析</span>
                  </router-link>
                </dt>
            </dl>
          </div>
        </div>
        </el-scrollbar>
      </div>
      <div class="flex-content SaleCardFr">
        <div class="abs-panel" ref="mainPane">
            <div class="scroll-panel" ref="scrollDom" style="will-change:scroll-position">
                <div class="true-height" ref="scrollPane">
                  <p class="breadcrumb" ref="breadcrumbPane">
                    <router-link class="breadcrumb-link" to="/"><span>首页</span></router-link>
                    <template v-for="item in breadcrumbList">
                      <router-link class="breadcrumb-link" :to="item.router+'?Status=personcount'" v-bind:key="item.id" v-if="item.router!=''"><b>-</b><span>{{item.title}}</span></router-link>
                      <span class="breadcrumb-link" v-bind:key="item.id" v-else><b>-</b><span>{{item.title}}</span></span>
                    </template>
                    <span class="breadcrumb-link"><b>-</b><span>询盘信息</span></span>
                  </p>
                  <el-card class="box-card scroll-card" shadow="hover">
                      <ul class="SaleTips" v-if="menuButtonPermit.includes('Sales_warnread')&&ID&&isSalesman">
                          <li><i class="svg-i tips" ><svg-icon icon-class="prompt" /></i><b>{{formData.givesaleswarn}}</b><el-button class="item-input" size="mini" type="primary" @click="salesmanWarnRead">已了解/解决(取消提醒)</el-button><em>*注意：请先修改并点击下方保存后再点击取消提醒</em></li>
                      </ul>
                      <div class="card-content SaleAddEdit" ref="tableContent">
                          <div class="SaleAddEditMain">
                              <div class="SaleAddEditMainItem timeArr">
                                    <dl>
                                      <dt><span>信息分配时间：</span><strong>{{formData.allottime}}</strong></dt>
                                      <dt><span>级别判定时间：</span><strong>{{formData.leveltime}}</strong> </dt>
                                      <dt><span>最近修改时间：</span><strong>{{formData.updatetime}}</strong> </dt>
                                    </dl>
                                    <dl>
                                      <dt><span><i>*</i>处理业务员：</span><strong>{{formData.dealusername}}</strong> </dt>
                                      <dt><span>来自地区：</span><strong>{{formData.continent}}-{{formData.country}}</strong></dt>
                                      <dt><span>需求产品：</span><strong>{{formData.producttypename}}-{{formData.keyproduct}}</strong> </dt>
                                    </dl>
                                    <dl>
                                      <dt><span>客户姓名/称呼：</span><strong>{{formData.custormname}}</strong> </dt>
                                      <dt><span>客户Email：</span><strong><em v-for="(item,index) in formData.custormemail" v-bind:key="index" @click="textCopy(item,$event)">{{item}}</em></strong></dt>
                                      <dt><span>客户电话：</span><strong><em v-for="(item,index) in formData.custormphone" v-bind:key="index" @click="textCopy(item,$event)">{{item}}</em></strong></dt>
                                    </dl>
                              </div>
                              <div class="SaleAddEditMainItem needCustomers">
                                    <dl>
                                      <dt>客户需求详情：<span v-if="formData.contentedittime"><i class="svg-i" ><svg-icon icon-class="prompt" /></i>注意：内容有修改，修改时间：{{formData.contentedittime}}</span></dt>
                                      <dd>
                                          <div class="needCustomersBox">
                                            {{formData.custormneedinfo}}
                                          </div>    
                                          <p><span>特别说明：{{formData.otherremark}}</span><el-link target="_blank" style='display:inline-block; padding-left:15px;vertical-align: top;' :underline="false" :href="formData.custormfiles" v-if="formData.custormfiles">附件：{{formData.custormfilesname}}</el-link></p>                     
                                      </dd>
                                    </dl>
                              </div>
                              <div class="SaleAddEditMainItem divider">
                                  <i class="svg-i" ><svg-icon icon-class="prompt" /></i>收到询盘10天后进行询盘反馈，请根据实际情况选择对应类型判定！<strong>当前：{{feedback}}</strong>
                              </div>
                              <div class="SaleAddEditMainItem SaleFoot">
                                    <dl class="SaleFootFl">
                                      <dd class="flex-wrap">
                                        <span>富通编号：</span>
                                        <div class="flex-content">                          
                                            <el-input
                                                size="small"
                                                style="width:150px"
                                                v-model="formData.ftword_id"
                                                clearable>
                                            </el-input>  
                                        </div>                        
                                      </dd>
                                      <dd class="flex-wrap">
                                        <span>标记处理：</span>
                                        <div class="flex-content">
                                            <el-checkbox 
                                                  v-model="formData.managestatus"
                                                  class="remind"
                                                  clearable>已处理</el-checkbox>
                                        </div>                         
                                      </dd>
                                      <dd class="flex-wrap">                            
                                        <span>是否回复<i>*</i>：
                                        </span>
                                        <div class="flex-content">
                                            <el-checkbox-group v-model="replystatusArr" @change="replystatusClick">
                                              <!-- :disabled="item.value== 4||item.value==5?formData.is_select==1?false:true:false" -->
                                              <el-checkbox v-for="item in replystatusList" :label="item.value" :key="item.value" :disabled="item.value== 4||item.value==5?true:false">
                                                {{item.label}}
                                                <template v-if="item.value == 4||item.value ==5">
                                                  <el-popover
                                                    placement="top-start"
                                                    trigger="hover"
                                                    content="选择此项，客服会二次分配此询盘。2024.4.2号以后分配的询盘可操作此项"
                                                    >
                                                    <svg-icon slot="reference" class="tips_div" icon-class="tips"></svg-icon>
                                                  </el-popover>
                                                </template>
                                              </el-checkbox>
                                            </el-checkbox-group>                         
                                        </div>                       
                                      </dd>
                                      <!-- <dd class="flex-wrap">                             
                                        <span>延时反馈：</span>
                                        <div class="flex-content">
                                          <el-checkbox v-model="formData.ask_feedback">申请延时反馈</el-checkbox>                     
                                        </div>                       
                                      </dd>
                                      <dd class="flex-wrap">                             
                                        <span>延时反馈原因：</span>
                                        <div class="flex-content">
                                          <el-input
                                            type="textarea"
                                            :rows="3"
                                            placeholder="请输入延时反馈原因"
                                            v-model="formData.feedback_info">
                                          </el-input>                   
                                        </div>                       
                                      </dd> -->
                                      <dd class="flex-wrap" v-if="replystatusArr.includes(5)">                             
                                        <span>客户真实需求<i>*</i>：</span>
                                        <div class="flex-content">
                                          <el-input
                                            type="textarea"
                                            :rows="3"
                                            placeholder="请输入客户真实需求"
                                            v-model="formData.true_ask">
                                          </el-input>                   
                                        </div>                       
                                      </dd>
                                    </dl>
                                    <dl class="SaleFootMid">
                                      <dt>
                                        <span>务必认真标注！</span>
                                        <span>客户性质：</span>                          
                                      </dt>
                                      <dd class="flex-wrap">       
                                          <el-radio-group style="margin-bottom:10px;" v-model="formData.ennature" :disabled="selectedDisabled">
                                            <el-radio v-for="item in ennatureList" :label="item.value" :key="item.value">{{item.label}}</el-radio>
                                          </el-radio-group>              
                                      </dd>
                                    </dl>
                                    <dl class="SaleFootFr">
                                      <dt>
                                        <span>沟通后客户需求设备价格范围<i>（单位：人民币RMB）</i>：</span>                        
                                      </dt>
                                      <dd class="SaleFootFrTop">       
                                          <el-radio-group style="margin-bottom:10px;" v-model="formData.enxunprice" :disabled="selectedDisabled">
                                            <el-radio v-for="item in enxunpriceList" :label="item.value" :key="item.value">{{item.label}}</el-radio>
                                          </el-radio-group>             
                                      </dd>
                                    </dl>
                                    <dl class="SaleFootBak">
                                      <dt>
                                        <span>个人备注：</span>                        
                                      </dt>
                                      <dd class="SaleFootFrTop">
                                          <el-input
                                            type="textarea"
                                            :rows="3"
                                            placeholder="请输入内容"
                                            v-model="formData.salesremark">
                                          </el-input>           
                                      </dd>
                                    </dl>
                              </div>
                              <div class="SaleAddEditMainItem SaleAddEditBtn">
                                <p>备注：(在此填写内容可提醒推广人员，如需提醒请勾选提醒)</p>
                                <el-checkbox 
                                      v-model="formData.custormwarnstatus"
                                      class="remind"
                                      clearable>提醒</el-checkbox>
                                <el-input
                                  type="textarea"
                                  :rows="1"
                                  placeholder="请输入内容"
                                  style="display:inline-block; width:300px;"
                                  v-model="formData.givecustormwarn">
                                </el-input>
                                <el-button type="primary" class="updateBtn" :class="isDisabled?'isDisabled':''" :disabled="isDisabled" size="small" v-if="menuButtonPermit.includes('Sales_phoneinfosub')" @click="saveData"><i class="svg-i planeWhite" ><svg-icon icon-class="planeWhite" /></i>保存</el-button>
                              </div>
                          </div>
                      </div>
                  </el-card>
                </div>
            </div>
        </div>
      </div>
    <el-backtop target=".scroll-panel"></el-backtop>
  </div>
</template>

<script>
import copyText from '@/utils/clipboard';
import { mapGetters } from 'vuex';
export default {
  name: 'Sales_phoneinfosub',
  data() {
    return {
      ID:null,
      status:null,
      breadcrumbList:[],
      menuButtonPermit:[],
        permitStatus:[],
        currentStatus:'',
        defaultData:{},
      pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
     
      formData:{
        id:0,
        allottime:'',
        leveltime:'',
        updatetime:'',
        salesuserid:'',
        continent:'',
        country:'',
        producttypename:'',
        keyproduct:'',
        custormname:'',
        custormemail:[],
        custormphone:[],
        custormneedinfo:'',
        dealusername:'',
        otherremark:'',
        custormfiles:'',
        custormfilesname:'',
        ftword_id:'',
        managestatus:'',
        replystatus:'',
        ennature:'',
        enxunprice:'',
        salesremark:'',
        givecustormwarn:'',
        custormwarnstatus:false,
        givesaleswarn:'',
        saleswarnstatus:'',
        ask_feedback: false,
        feedback_info: '',
        true_ask: '',
        is_select: ''
      },      
      formValidate:{
        id:null,
        status:null,
      },
      salesuseridList:[],
      ennatureList:[],
      enxunpriceList:[],
      replystatusArr:[],
      replystatusList:[
        {label:"未标记",value:1},
        {label:"已回复",value:2},
        {label:"未回复",value:3},
        {label:"五天内未回复",value:4},
        {label:"回复后非公司产品",value:5}
      ],
      defaultInfo:{},
      formSaveData:{
        id: "",
        ftword_id: "",
        replystatus: "",
        managestatus: "",
        ennature: "",
        enxunprice: "",
        givecustormwarn: "",
        custormwarnstatus:false,
        ask_feedback: false,
        feedback_info: "",
        true_ask: ""
      },      
      isSalesman:false,
      feedback:'未反馈',
      isDisabled:false,
      selectedDisabled:true,
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'sidebar',
      'menuData'
    ]),
  },
  mounted(){
    const $this = this;
    if($this.sidebar.opened){
      $this.$store.dispatch('app/toggleSideBar');
    }    
  },
  created(){
    var $this = this;
    if($this.$route.query.ID){
      $this.ID = parseInt($this.$route.query.ID);
    }else{
      $this.ID = null;
    }
    if($this.$route.query.status){
      $this.status = parseInt($this.$route.query.status);
    }else{
      $this.status = null;
    }
    var formValidate={};
    formValidate.status=$this.status;
    formValidate.id=$this.ID;
    $this.formValidate=formValidate;
    $this.getBreadcrumbList();
    $this.initData();
  },
  methods:{
    // 复制文本
    textCopy(text,event) {
        copyText(text,event)
    },
    // 获取面包屑路径
    getBreadcrumbList(){
      var $this = this;
      var breadcrumbList = [];
      var currentID = ""+$this.$router.currentRoute.meta.id;
      var pageID = 0;
      if(currentID.indexOf('-')!=-1){
        pageID = parseInt(currentID.split("-")[1]);
      }else{
        pageID = parseInt(currentID);
      }
      $this.menuData.forEach(function(item,index){
        if(item.meta.id == pageID){
          var itemData = {};
          itemData.id = item.meta.id;
          itemData.router = item.path;
          itemData.title = item.meta.title;
          breadcrumbList.push(itemData);
        }else{
          if(item.children.length>0){
            item.children.forEach(function(item1,index1){
              if(item1.meta.id == pageID){
                var itemData = {};
                itemData.id = item.meta.id;
                itemData.router = item.path;
                itemData.title = item.meta.title;
                breadcrumbList.push(itemData);
                var itemData2 = {};
                itemData2.id = item1.meta.id;
                itemData2.router = item1.path;
                itemData2.title = item1.meta.title;
                breadcrumbList.push(itemData2);
              }else{
                if(item1.children.length>0){
                  item1.children.forEach(function(item2,index2){
                    if(item2.meta.id == pageID){
                      var itemData = {};
                      itemData.id = item.meta.id;
                      itemData.router = item.path;
                      itemData.title = item.meta.title;
                      breadcrumbList.push(itemData);
                      var itemData2 = {};
                      itemData2.id = item1.meta.id;
                      itemData2.router = item1.path;
                      itemData2.title = item1.meta.title;
                      breadcrumbList.push(itemData2);
                      var itemData3 = {};
                      itemData3.id = item2.meta.id;
                      itemData3.router = item2.path;
                      itemData3.title = item2.meta.title;
                      breadcrumbList.push(itemData3);
                    }
                  });
                }
              }
            });
          }
        }
      });
      $this.breadcrumbList = breadcrumbList;
    },
    // 初始化数据
    initData(){
      var $this = this;
      $this.getUserMenuButtonPermit();
    },
    // 初始化页面信息
    initPage(){
      var $this = this;
      $this.getLeftData();
    },
    // 询盘编辑获取初始化询盘信息
    initCluesInfo(){
      var $this = this;
      $this.$store.dispatch('Sales/getSalesDetailsAction',$this.formValidate).then(response=>{
        if(response){
          if(response.status){           
            $this.defaultInfo = response.data;
            if(response.data.saleswarnstatus==3){
              $this.isSalesman=true;
            }else{
              $this.isSalesman=false;
            }
            var ennatureList=[];
            response.ennature.forEach(function(item,index){
              var itemData = {};
              itemData.label = item.name;
              itemData.value = item.id;
              ennatureList.push(itemData);
            });
            $this.ennatureList=ennatureList;
            var enxunpriceList=[];
            response.enprice.forEach(function(item,index){
              var itemData = {};
              itemData.label = item.name;
              itemData.value = item.id;
              enxunpriceList.push(itemData);
            });
            $this.enxunpriceList=enxunpriceList;
            $this.setCluesInfo();
          }else{
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'error'
            });
            setTimeout(()=>{
              $this.isDisabled=false;
            },1000);
          }
        }
      });
    },
    // 设置询盘初始化信息
    setCluesInfo(){
      var $this = this;
      $this.formData.id = $this.defaultInfo.id;
      $this.formData.allottime = $this.defaultInfo.allottime;
      $this.formData.leveltime = $this.defaultInfo.leveltime;
      $this.formData.updatetime = $this.defaultInfo.updatetime;
      $this.formData.dealusername = $this.defaultInfo.dealusername;
      if($this.salesuseridList.length>0){
        $this.salesuseridList.forEach(function(item,index){
            if(item.value==$this.defaultInfo.salesuserid){
              $this.formData.salesuserid=item.label;
            }
        });
      }
      $this.formData.continent = $this.defaultInfo.continent;
      $this.formData.country = $this.defaultInfo.country;
      $this.formData.country = $this.defaultInfo.country;
      $this.formData.producttypename = $this.defaultInfo.producttypename;
      $this.formData.keyproduct = $this.defaultInfo.keyproduct;
      $this.formData.custormname = $this.defaultInfo.custormname;
      if($this.defaultInfo.custormemail){
        if($this.defaultInfo.custormemail.indexOf(",")!=-1){
          $this.formData.custormemail = $this.defaultInfo.custormemail.split(",");
        }else{
          $this.formData.custormemail = [$this.defaultInfo.custormemail];
        }
      }else{
        $this.formData.custormemail = [];
      }
      if($this.defaultInfo.custormphone){
        if($this.defaultInfo.custormphone.indexOf(",")!=-1){
          $this.formData.custormphone = $this.defaultInfo.custormphone.split(",");
        }else{
          $this.formData.custormphone = [$this.defaultInfo.custormphone];
        }
      }else{
        $this.formData.custormphone = [];
      }
      $this.formData.contentedittime = $this.defaultInfo.contentedittime;
      $this.formData.custormneedinfo = $this.defaultInfo.custormneedinfo;
      $this.formData.otherremark = $this.defaultInfo.otherremark;
      $this.formData.custormfiles = $this.defaultInfo.custormfiles;
      $this.formData.custormfilesname = $this.defaultInfo.custormfilesname;
      $this.formData.ftword_id = $this.defaultInfo.ftword_id;
      $this.formData.managestatus=$this.defaultInfo.managestatus==1?false:true;
      $this.replystatusArr=[];
      $this.replystatusList.forEach(function(item,index){
          if(item.value==$this.defaultInfo.replystatus){
            $this.formData.replystatus=item.value;
            $this.replystatusArr.push(item.value);
          }
      });
      $this.formData.ennature = $this.defaultInfo.ennature==0?'':$this.defaultInfo.ennature;
      $this.formData.enxunprice = $this.defaultInfo.enxunprice==0?'':$this.defaultInfo.enxunprice;
      $this.feedback=$this.defaultInfo.ennature||$this.defaultInfo.enxunprice?'已反馈':'未反馈';
      $this.formData.givecustormwarn = $this.defaultInfo.givecustormwarn;
      $this.formData.custormwarnstatus=$this.defaultInfo.custormwarnstatus==2?false:true;
      $this.formData.givesaleswarn = $this.defaultInfo.givesaleswarn;
      $this.formData.saleswarnstatus = $this.defaultInfo.saleswarnstatus;
      $this.formData.salesremark = $this.defaultInfo.salesremark;
      $this.formData.ask_feedback = $this.defaultInfo.ask_feedback == 2 ? true : false;
      $this.formData.feedback_info = $this.defaultInfo.feedback_info;
      $this.formData.true_ask = $this.defaultInfo.true_ask;
      $this.formData.is_select = $this.defaultInfo.is_select;
      $this.compareDate();
      setTimeout(()=>{
        $this.isDisabled=false;
      },1000);
    },
    // 获取左侧数据
    getLeftData(){
      var $this = this;
      $this.$store.dispatch('Sales/getSalesPublicDataAction', null).then(response=>{
        if(response){        
          var defaultData = {};
          defaultData.waitcount=response.waitcount;
          defaultData.allotcount=response.allotcount;
          defaultData.personcount=response.personcount;
          defaultData.waitdealcount=response.waitdealcount;
          defaultData.monthsaycount=response.monthsaycount;
          defaultData.hasnosaycount=response.hasnosaycount;
          defaultData.waitftwordcount=response.waitftwordcount;
          defaultData.hasdealcount=response.hasdealcount;
          defaultData.hassaycount=response.hassaycount;
          defaultData.warning=response.warning;
          defaultData.warningcount=response.warningcount;
          $this.defaultData = defaultData;         
          $this.getSystemData();
        }
      });
    },
    // 获取当前登陆用户在该页面的操作权限
    getUserMenuButtonPermit(){
      var $this = this;
      $this.$store.dispatch('api/getMenuButtonPermitAction',{id:$this.$router.currentRoute.meta.id}).then(res=>{
        if(res.status){
          if(res.data.length>0){
            res.data.forEach(function(item,index){
              $this.menuButtonPermit.push(item.action_route);
              if(item.action_route=="Sales_waitphone"){
                $this.permitStatus.push("waitcount");
              }
              if(item.action_route=="Sales_allphone"){
                $this.permitStatus.push("allotcount");
              }
              if(item.action_route=="Sales_index"){
                $this.permitStatus.push("personcount");
              }
              if(item.action_route=="Sales_waitdeal"){
                $this.permitStatus.push("waitdealcount");
              }
              if(item.action_route=="Sales_monthsay"){
                $this.permitStatus.push("monthsaycount");
              }
              if(item.action_route=="Sales_hasnosay"){
                $this.permitStatus.push("hasnosaycount");
              }
              if(item.action_route=="Sales_waitftword"){
                $this.permitStatus.push("waitftwordcount");
              }
              if(item.action_route=="Sales_hasdeal"){
                $this.permitStatus.push("hasdealcount");
              }
              if(item.action_route=="Sales_hassay"){
                $this.permitStatus.push("hassaycount");
              }
            });
            if($this.menuButtonPermit.includes('Sales_phoneinfosub')){
              $this.initPage();
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
        }else{
          $this.$message({
            showClose: true,
            message: response.info,
            type: 'error'
          });
        }
      });
    },
    // 获取当前页面的条件数据
    getSystemData(){
      var $this = this;
      $this.$store.dispatch('Sales/getSalesSearchListAction', null).then(response=>{
        if(response){
          if(response.status){
            var salesuseridList=[];
            response.dealuser.forEach(function(item,index){
              var itemData = {};
              itemData.label = item.name;
              itemData.value = item.id;
              salesuseridList.push(itemData);
            });
            $this.salesuseridList=salesuseridList;
            $this.initCluesInfo();
          }else{
            if(response.permitstatus&&response.permitstatus==2){
              $this.$message({
                showClose: true,
                message: "未被分配该页面访问权限",
                type: 'error',
                duration:6000
              });
              $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
            }else{
              $this.$message({
                showClose: true,
                message: response.info,
                type: 'error'
              });
            }
          }
        }
      });
    },
    // 组装修改接口所需数据
    initFormData(){
      var $this = this;
      var formSaveData = {};
      formSaveData.id = $this.formData.id.toString();
      formSaveData.ftword_id = $this.formData.ftword_id;
      formSaveData.replystatus = $this.formData.replystatus;
      formSaveData.managestatus = $this.formData.managestatus==true?'2':'1';
      formSaveData.ennature = $this.formData.ennature.toString();
      formSaveData.enxunprice = $this.formData.enxunprice.toString();
      formSaveData.givecustormwarn = $this.formData.givecustormwarn;
      formSaveData.custormwarnstatus = $this.formData.custormwarnstatus==true?'3':'2';
      formSaveData.salesremark = $this.formData.salesremark;
      formSaveData.ask_feedback = $this.formData.ask_feedback ? 2 : 1;
      formSaveData.feedback_info = $this.formData.feedback_info;
      formSaveData.true_ask = $this.formData.true_ask;
      return formSaveData;
    },
    // 保存添加/编辑数据
    saveData(){
      var $this = this;
      if($this.formData.ask_feedback && $this.formData.feedback_info == ""){
          $this.$message({
            showClose: true,
            message: "请填写延时反馈原因",
            type: 'error'
          });
          return false;
      }
      if($this.formData.replystatus == 5 && !$this.formData.true_ask){
          $this.$message({
            showClose: true,
            message: "请填写客户真实需求",
            type: 'error'
          });
          return false;
      }
      if(!$this.isDisabled){
        $this.isDisabled=true;
        var formSaveData = $this.initFormData();      
        $this.formSaveData = formSaveData;
        $this.$store.dispatch("Sales/getSalesDetailsModifyAction", formSaveData).then(response=>{
            if(response.status){
              $this.$message({
                showClose: true,
                message: response.info,
                type: 'success'
              });
              $this.initCluesInfo();
            }else{
              $this.$message({
                showClose: true,
                message: response.info,
                type: 'error'
              });
              setTimeout(()=>{
                $this.isDisabled=false;
              },1000);
            }
        });
      }
    },  
    // 是否回复点击事件
    replystatusClick(){
      var $this = this;
      var replystatusArr = $this.replystatusArr;
      if (replystatusArr.length > 1) {
        replystatusArr.shift();
      }
      $this.replystatusArr = replystatusArr;
      if($this.replystatusArr.length>0){
         $this.formData.replystatus = $this.replystatusArr[0];
      }else{
         $this.formData.replystatus="";
      }
    },
    // 确认阅读业务员提醒
    salesmanWarnRead(){
      var $this = this;
      var resultData = {};
      resultData.id = $this.formData.id;
      $this.$store.dispatch("Sales/getSalesConfirmrRemindAction", resultData).then(response=>{
          if(response.status){
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'success'
            });
            $this.initCluesInfo();
          }else{
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'error'
            });
          }
      });
    },
    // 页面自跳转
    jumpLink(status){
        var $this = this;
        $this.$router.push({path:'/Sales/index',query:{Status:status}});
    },
    // 跳转数据分析页面
    dataStatistic(){
      var $this = this;
      $this.$router.push({path:'/Sales/search'});
    },
    // 跳转数据统计页面
    datastatisticClues(){
      var $this = this;
      $this.$router.push({path:'/Sales/phonecount'});
    },
    // 设置反馈时间
    setFeedbackDate(){
      var t = new Date(this.formData.allottime)
      var t_s = t.getTime();
      t.setTime(t_s+1000*60*60*24*10)
      var t_ss = t.getTime();
      return t_ss;
    },
    // 获取现在时间
    getNowDate(){
      var t = new Date()
      var t_s = t.getTime();
      return t_s;
    },
    // 比较现在与反馈时间大小
    compareDate(){
      var isDisabled = false;
      var feedBackDate = this.setFeedbackDate();
      var nowDate = this.getNowDate();
      if(feedBackDate>nowDate){
        isDisabled = true;
      }
      this.selectedDisabled = isDisabled;
    }
  }
}
</script>
<style lang="scss" scoped>
.tips_div{margin-left:3px;}
// .SaleAddEdit .SaleAddEditMain .SaleAddEditMainItem.SaleAddEditBtn{
//   padding-top: 0;
//   margin-top: -40px;
// }
.SaleAddEdit .SaleAddEditMain .SaleAddEditMainItem.SaleFoot dl{
  width: 22.3%;
  margin-left: 3.6%;
}
.SaleAddEdit .SaleAddEditMain .SaleAddEditMainItem.SaleFoot dl:first-child{
  margin-left: 0
}
.SaleAddEdit .SaleAddEditMain .SaleAddEditMainItem.timeArr dl dt span{
  width: 104px;
}
</style>
