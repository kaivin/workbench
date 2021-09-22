<template>
  <div class="page-root scroll-panel" ref="boxPane">
    <p class="breadcrumb" ref="breadcrumbPane">
        <router-link class="breadcrumb-link" to="/">首页</router-link>
        <template v-for="item in breadcrumbList">
          <router-link class="breadcrumb-link" :to="item.router" v-bind:key="item.id"><b>-</b><span>{{item.title}}</span></router-link>
        </template>
        <span class="breadcrumb-link"><b>-</b><span>详情</span></span>
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
                        <dt><span>需求产品：</span><strong>{{formData.producttype_id}}-{{formData.keying}}</strong> </dt>
                      </dl>
                      <dl>
                        <dt><span>客户姓名/称呼：</span><strong>{{formData.custormname}}</strong> </dt>
                        <dt><span>客户Email：</span><strong>{{formData.custormemail}}</strong></dt>
                        <dt><span>客户电话：</span><strong>{{formData.custormphone}}</strong></dt>
                      </dl>
                </div>
                <div class="SaleAddEditMainItem needCustomers">
                      <dl>
                        <dt>客户需求详情：<span v-if="formData.contentedittime"><i class="svg-i" ><svg-icon icon-class="prompt" /></i>注意：内容有修改，修改时间：{{formData.contentedittime}}</span></dt>
                        <dd>
                            <div class="needCustomersBox">
                               {{formData.custormneedinfo}}
                            </div>    
                            <p><span>特别说明：{{formData.otherremark}}</span><el-link target="_blank" style='display:inline-block; padding-left:15px;' :underline="false" :href="formData.custormfiles" v-if="formData.custormfiles">附件：{{formData.custormfilesname}}</el-link></p>                     
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
                          <span>是否回复<i>*</i>：</span>
                          <div class="flex-content">
                              <el-checkbox-group v-model="replystatusArr" @change="replystatusClick">
                                <el-checkbox v-for="item in replystatusList" :label="item.value" :key="item.value">{{item.label}}</el-checkbox>
                              </el-checkbox-group>                         
                          </div>                       
                        </dd>
                      </dl>
                      <dl class="SaleFootMid">
                        <dt>
                           <span>务必认真标注！</span>
                           <span>客户性质：</span>                          
                        </dt>
                        <dd class="flex-wrap">       
                            <el-radio-group style="margin-bottom:10px;" v-model="formData.ennature">
                              <el-radio v-for="item in ennatureList" :label="item.value" :key="item.value">{{item.label}}</el-radio>
                            </el-radio-group>              
                        </dd>
                      </dl>
                      <dl class="SaleFootFr">
                        <dt>
                           <span>沟通后客户需求设备价格范围<i>（单位：人民币RMB）</i>：</span>                        
                        </dt>
                        <dd class="SaleFootFrTop">       
                            <el-radio-group style="margin-bottom:10px;" v-model="formData.enxunprice">
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
                    <el-button type="primary" class="updateBtn" size="small" v-if="menuButtonPermit.includes('Sales_phoneinfosub')" @click="saveData"><i class="svg-i planeWhite" ><svg-icon icon-class="planeWhite" /></i>保存</el-button>
                </div>
            </div>
        </div>
    </el-card>
    <el-backtop target=".scroll-panel"></el-backtop>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'Sales_phoneinfosub',
  data() {
    return {
      ID:null,
      status:null,
      breadcrumbList:[],
      menuButtonPermit:[],
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
        keying:[],
        producttype_id:'',
        custormname:'',
        custormemail:'',
        custormphone:'',
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
      },      
      formValidate:{
        id:null,
        status:null,
      },
      salesuseridList:[],
      productidList:[],
      producttype_idList:[],
      ennatureList:[],
      enxunpriceList:[],
      replystatusArr:[],
      replystatusList:[
        {label:"未标记",value:1},
        {label:"已回复",value:2},
        {label:"未回复",value:3},
      ],
      SandGravelList:[],//沙石
      OreDressList:[],//选矿建材
      FlourList:[],//磨粉
      otherList:[],//其它
      keying:[],
      defaultInfo:{},
      formSaveData:{
        id: "",
        ftword_id: "",
        replystatus: "",
        managestatus: "",
        ennature: "",
        enxunprice: "",
        givecustormwarn: "",
        custormwarnstatus:false
      },      
      isSalesman:false,
      feedback:'未反馈',
        isLoading:null,
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'device',
      'menuData'
    ]),
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
      console.log($this.breadcrumbList,"面包屑数据");
    },
    // 初始化数据
    initData(){
      var $this = this;
      $this.loadingFun();
      $this.getUserMenuButtonPermit();
    },
    // 初始化页面信息
    initPage(){
      var $this = this;
      $this.getSystemData();
    },
    // loading自定义
    loadingFun(){
      var $this = this;
      $this.isLoading = $this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
    },
    // 询盘编辑获取初始化询盘信息
    initCluesInfo(){
      var $this = this;
      $this.$store.dispatch('Sales/getSalesDetailsAction',$this.formValidate).then(response=>{
        if(response){
          if(response.status){
            console.log(response,"初始化询盘信息");            
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
          }
        }
      });
    },
    // 设置询盘初始化信息
    setCluesInfo(){
      var $this = this;
      console.log($this.defaultInfo,'$this.defaultInfo');
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
      $this.formData.keying = [];
      var keyArr=[];
      if($this.defaultInfo.keying){
          if($this.defaultInfo.keying.indexOf(",")!=-1){
              keyArr = $this.defaultInfo.keying.split(",");              
          }else{
              keyArr = [$this.defaultInfo.keying]
          }
          keyArr.forEach(function(item,index){
            $this.keying.forEach(function(item01,index01){
               if(parseInt(item)==item01.value){
                 $this.formData.keying.push(item01.label);
               }
            });
          });
      }
      if($this.producttype_idList.length>0){
        $this.producttype_idList.forEach(function(item,index){
            if(item.value==$this.defaultInfo.producttype_id){
              $this.formData.producttype_id=item.label;
            }
        });
      }
      $this.formData.custormname = $this.defaultInfo.custormname;
      $this.formData.custormemail = $this.defaultInfo.custormemail;
      $this.formData.custormphone = $this.defaultInfo.custormphone;
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
      $this.isLoading.close();
    },
    // 获取当前登陆用户在该页面的操作权限
    getUserMenuButtonPermit(){
      var $this = this;
      $this.$store.dispatch('api/getMenuButtonPermitAction',{id:$this.$router.currentRoute.meta.id}).then(res=>{
        console.log(res);
        if(res.status){
          console.log(res,"操作权限")
          if(res.data.length>0){
            res.data.forEach(function(item,index){
              $this.menuButtonPermit.push(item.action_route);
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
            var producttype_idList=[];
            response.producttype.forEach(function(item,index){
              var itemData = {};
              itemData.label = item.name;
              itemData.value = item.id;
              producttype_idList.push(itemData);
            });
            $this.producttype_idList=producttype_idList;
            var salesuseridList=[];
            response.dealuser.forEach(function(item,index){
              var itemData = {};
              itemData.label = item.name;
              itemData.value = item.id;
              salesuseridList.push(itemData);
            });
            $this.salesuseridList=salesuseridList;
            console.log(response,"搜索条件");
            $this.getProductData();
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
    // 获取当前页面的产品数据
    getProductData(){
      var $this = this;
      $this.$store.dispatch('enphone/cluesAddEditDataAction', null).then(response=>{
        if(response){
          if(response.status){
            console.log(response.product,"获取当前页面的产品数据");
            var SandGravelList=[];
            response.product[0].product.forEach(function(item,index){
                var itemChildren = {};
                itemChildren.label = item.name;
                itemChildren.value = item.id;
                SandGravelList.push(itemChildren);
            });
            $this.SandGravelList = SandGravelList;
            var OreDressList=[];
            response.product[1].product.forEach(function(item,index){
                var itemChildren = {};
                itemChildren.label = item.name;
                itemChildren.value = item.id;
                OreDressList.push(itemChildren);
            });
            $this.OreDressList = OreDressList;
            var FlourList=[];
            response.product[2].product.forEach(function(item,index){
                var itemChildren = {};
                itemChildren.label = item.name;
                itemChildren.value = item.id;
                FlourList.push(itemChildren);
            });
            $this.FlourList = FlourList;
            var otherList=[];
            response.product[3].product.forEach(function(item,index){
                var itemChildren = {};
                itemChildren.label = item.name;
                itemChildren.value = item.id;
                otherList.push(itemChildren);
            });
            $this.otherList = otherList;
            var keying=[];
            keying=keying.concat($this.SandGravelList,$this.OreDressList,$this.FlourList,$this.otherList);
            $this.keying=keying;
          }else{
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'error'
            });
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
      return formSaveData;
    },
    // 保存添加/编辑数据
    saveData(){
      var $this = this;
      var formSaveData = $this.initFormData();      
      $this.formSaveData = formSaveData;
      console.log(formSaveData,"formSaveData 添加保存")
      $this.$store.dispatch("Sales/getSalesDetailsModifyAction", formSaveData).then(response=>{
          if(response.status){
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'success'
            });
            console.log(response,'formSaveData 添加保存结果01');
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
          console.log(response,'阅读提醒')
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
  }
}
</script>
<style lang="scss" scoped>
</style>
