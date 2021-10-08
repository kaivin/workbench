<template>
  <div class="page-root flex-box no-padding cn-phone-index" ref="boxPane">
    <div class="sub-router">
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <div class="sub-wrapper">
          <div class="side-button">
            <el-button type="primary" plain size="mini" v-if="menuButtonPermit.includes('Chinaphone_search')" v-on:click="searchStatisticsData()"><i class="svg-i" ><svg-icon icon-class="serch_en" /></i>搜索数据</el-button>
            <el-button type="primary" plain size="mini" v-if="menuButtonPermit.includes('Chinaphone_countlist')" v-on:click="statisticsClues()"><i class="svg-i" ><svg-icon icon-class="analy_en" /></i>统计分析</el-button>
          </div>
          <dl class="phone-list" v-for="(item,index) in phoneBrandList" v-bind:key="index">
            <dt><span>{{item.name}}</span></dt>
            <dd v-for="phone in item.phone" class="tipphone" v-bind:class="phone.isOn?'active':''" :key="phone.id" v-on:click="phoneJump(phone.id)">           
                <el-tooltip placement="right" class="el-tooltip" effect="light">
                  <div slot="content">
                    <span v-if="phone.phonenumber&&phone.phonenumber!=''">电话：{{phone.phonenumber}}</span><br v-if="phone.othername&&phone.othername!=''" />
                    <span v-if="phone.othername&&phone.othername!=''">别名：{{phone.othername}}</span><br v-if="phone.departname&&phone.departname!=''" />
                    <span v-if="phone.departname&&phone.departname!=''">部门：{{phone.departname}}</span><br v-if="phone.user&&phone.user!=''" />
                    <span v-if="phone.user&&phone.user!=''">负责人：{{phone.user}}</span>
                  </div>
                  <el-button><span>{{phone.shortPhonenumber}}</span><i>({{phone.nowmonthnumber}})</i><em>({{phone.lastdaynumber}})</em><b>({{phone.nownumber}})</b> </el-button>
                </el-tooltip>
            </dd>
          </dl>
        </div>
      </el-scrollbar>
    </div>
    <div class="flex-content relative">
      <div class="abs-panel" ref="mainPane">
        <div class="scroll-panel" ref="scrollPane">
          <p class="breadcrumb" ref="breadcrumbPane">
            <router-link class="breadcrumb-link" to="/"><span>首页</span></router-link>
            <template v-for="item in breadcrumbList">
              <router-link class="breadcrumb-link" :to="item.router" v-bind:key="item.id" v-if="item.router!=''"><b>-</b><span>{{item.title}}</span></router-link>
              <span class="breadcrumb-link" v-bind:key="item.id" v-else><b>-</b><span>{{item.title}}</span></span>
            </template>
            <span class="breadcrumb-link"><b>-</b><span>添加|编辑询盘</span></span>
          </p>
          <el-card class="box-card scroll-card" shadow="hover">
              <div class="card-content EnphoneAddEdit" :style="'min-height:'+minHeight+'px;'" ref="tableContent">
                  <div class="EnphoneAddEditMain CnphoneAdd">
                      <div class="EnphoneAddEditMainItem phone-list">
                        <dl>
                          <dt>来源电话：<span>*</span></dt>
                          <dd>
                            <div class="clues-list customRadio">
                              <span class="item-clues" v-for="item in phoneList" v-bind:class="item.isOn?'active':''" v-bind:key="item.id" v-on:click="phoneClick(item.id)"><i></i>{{item.phonenumber}}</span>
                            </div>
                          </dd>
                        </dl>
                      </div>
                      <div class="EnphoneAddEditMainItem customer-info">
                          <dl style="width: 190px;">
                            <dt>来源时间：<span>*</span></dt>
                            <dd>
                              <el-date-picker
                                  v-model="formData.xuntime"
                                  class="date-time"
                                  size="small"
                                  type="datetime"
                                  placeholder="选择日期时间"
                                  value-format = "yyyy-MM-dd HH:mm:ss"
                                  align="right"
                                  :picker-options="pickerOptions">
                                </el-date-picker>
                            </dd>
                          </dl>
                          <dl style="width: 100px;">
                            <dt>客户省份：</dt>
                            <dd>
                              <el-input
                                  placeholder="地区"
                                  @blur="provinceChangeHandler"
                                  size="small"
                                  v-model="formData.province"
                                  clearable>
                              </el-input>
                            </dd>
                          </dl>
                          <dl style="width: 120px;">
                            <dt>客户城市：</dt>
                            <dd>
                              <el-input
                                  placeholder="号码归属地"
                                  @blur="cityChangeHandler"
                                  size="small"
                                  v-model="formData.city"
                                  clearable>
                              </el-input>
                            </dd>
                          </dl>
                          <dl style="width: 100px;">
                            <dt>来源渠道：<span>*</span></dt>
                            <dd>
                              <el-select v-model="formData.mode" size="small" clearable placeholder="设备">
                                  <el-option
                                  v-for="item in sourceList"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                  </el-option>
                              </el-select>
                            </dd>
                          </dl>
                          <dl style="width: 250px;">
                            <dt>来源网页：</dt>
                            <dd>
                              <el-input
                                  placeholder="来源页面"
                                  size="small"
                                  v-model="formData.url"
                                  @blur="urlChangePhone"
                                  clearable>
                              </el-input>
                            </dd>
                          </dl>
                      </div>
                      <div class="EnphoneAddEditMainItem CnIntentionEquipment">
                        <dl>
                          <dt>意向设备：<span>* （注：如果为其他生产线、配件、其他产品，请在备注中注明具体产品）</span></dt>
                          <dd>
                            <div class="clues-list">
                              <span class="item-clues" v-for="item in productList" v-bind:class="item.isOn?'active':''" v-bind:key="item.id" v-on:click="productClick(item.id)"><i></i>{{item.name}}</span>
                            </div>
                          </dd>
                        </dl>
                      </div>
                    <div class="EnphoneAddEditMainItem material">
                      <dl style="width: 250px;">
                        <dt>用途：</dt>
                        <dd>
                            <el-input
                              placeholder="用途"
                              type="textarea"
                              resize="none"
                              :rows="4"
                              size="small"
                              v-model="formData.useing"
                              clearable>
                            </el-input>
                        </dd>
                      </dl>
                      <dl style="width: 250px;">
                        <dt>备注：</dt>
                        <dd>
                          <el-input
                              placeholder="备注"
                              type="textarea"
                              :rows="4"
                              resize="none"
                              size="small"
                              v-model="formData.custormremark"
                              clearable>
                          </el-input>
                        </dd>
                      </dl>
                      <dl style="width: 250px;">
                        <dt>纷享销客编号：</dt>
                        <dd>
                          <el-input
                              placeholder="纷享销客编号"
                              type="textarea"
                              :rows="4"
                              resize="none"
                              size="small"
                              v-model="formData.shareinfo"
                              clearable>
                          </el-input>
                        </dd>
                      </dl>
                      <dl style="width: 250px;">
                        <dt>原因：</dt>
                        <dd>
                          <el-input
                              placeholder="原因"
                              type="textarea"
                              resize="none"
                              :rows="4"
                              size="small"
                              v-model="formData.custormcause"
                              clearable>
                          </el-input>
                        </dd>
                      </dl>
                    </div>
                    <div class="EnphoneAddEditMainItem">
                      <dl>
                        <dt>级别：</dt>
                        <dd>
                          <div class="clues-list customRadio">
                            <span class="item-clues" v-for="item in levelList" v-bind:class="item.isOn?'active':''" v-bind:key="item.id" v-on:click="levelClick(item.id)"><i></i>{{item.name}}</span>
                          </div>
                        </dd>
                      </dl>
                    </div>
                    <div class="EnphoneAddEditMainItem">
                      <dl>
                        <dt>价格范围：</dt>
                        <dd>
                          <div class="clues-list customRadio">
                            <span class="item-clues" v-for="item in priceList" v-bind:class="item.isOn?'active':''" v-bind:key="item.id" v-on:click="priceClick(item.id)"><i></i>{{item.name}}</span>
                          </div>
                        </dd>
                      </dl>
                    </div>
                    <div class="EnphoneAddEditMainItem author">
                        <dl>
                          <dt>是否有效：</dt>
                          <dd>
                            <el-checkbox v-model="formData.effective" label="有效" border size="small"></el-checkbox>
                          </dd>
                        </dl>
                        <dl style="width: 200px;">
                          <dt>无效原因：</dt>
                          <dd>
                            <el-input
                                placeholder="该项只在无效情况下填写"
                                size="small"
                                v-model="formData.invalidcause"
                                :disabled="formData.effective"
                                clearable>
                            </el-input>
                          </dd>
                        </dl>
                        <dl>
                          <dt>添加人：</dt>
                          <dd>
                            <el-input
                                size="small"
                                v-model="defaultInfo.addusername"
                                v-if="ID&&defaultInfo.addusername"
                                disabled>
                            </el-input>
                            <el-input
                                size="small"
                                v-else
                                v-model="userInfo.name"
                                disabled>
                            </el-input>
                          </dd>
                        </dl>
                    </div>
                    <div class="EnphoneAddEditMainItem btn-item">
                        <dl>
                          <dd>
                            <el-button type="primary" class="updateBtn" size="large" v-if="menuButtonPermit.includes('Chinaphone_add')||menuButtonPermit.includes('Chinaphone_edit')" @click="saveData"><i class="svg-i planeWhite"><svg-icon icon-class="planeWhite" /></i>保存</el-button>
                          </dd>
                        </dl>
                        <dl>
                          <dd>
                            <el-button type="info" plain class="resetBtn" size="large" v-on:click="resetFormData()">重置</el-button>
                          </dd>
                        </dl>
                    </div>
                  </div>
              </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'addEditClues',
  data() {
    return {
      ID:null,
      minHeight:0,
      phoneBrandList:[],
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
      phoneList:[],
      productList:[],
      sourceList:[],
      priceList:[],
      levelList:[],
      formData:{
        id:0,
        province:"",
        mode:"",
        url:"",
        city:"",
        xuntime:"",
        effective:true,
        keying:[],
        useing:"",
        custormremark:"",
        shareinfo:'',
        custormcause:"",
        invalidcause:"",
        phoneid:"",
        level_id:"",
        price_id:"",
      },
      defaultInfo:{},
      isLoading:null,
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'menuData'
    ]),
  },
  mounted(){
      const $this = this;
      this.$nextTick(function () {
          $this.minHeight = $this.$refs.boxPane.offsetHeight-30;
      });
      window.onresize = () => {
          return (() => {
              $this.minHeight = $this.$refs.boxPane.offsetHeight-30;
          })()
      }
  },
  watch: {
      tableHeight(val) {
        if (!this.timer) {
          this.tableHeight = val
          this.timer = true
          const $this = this
          setTimeout(function() {
            $this.timer = false
          }, 400)
        }
      },
  },
  created(){
    var $this = this;
    if($this.$route.query.ID){
      $this.ID = parseInt($this.$route.query.ID);
    }else{
      $this.ID = null;
      $this.currentTime();
    }
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
    // 初始化数据
    initData(){
      var $this = this;
      $this.loadingFun();
      $this.getUserMenuButtonPermit();
    },
    // 初始化页面信息
    initPage(){
      var $this = this;
      $this.getPhoneListNum();
    },
    // 组装搜索接口所需数据
    initFormData(){
      var $this = this;
      var formData = {};
      formData.province = $this.formData.province;
      formData.city = $this.formData.city;
      formData.effective = $this.formData.effective?1:2;
      formData.useing = $this.formData.useing;
      formData.custormremark = $this.formData.custormremark;
      formData.shareinfo = $this.formData.shareinfo;      
      formData.custormcause = $this.formData.custormcause;
      formData.invalidcause = $this.formData.invalidcause;
      formData.xuntime = $this.formData.xuntime;
      formData.url = $this.formData.url;
      formData.mode = $this.formData.mode;
      formData.price_id = $this.formData.price_id;
      formData.phoneid = $this.formData.phoneid;
      formData.level_id = $this.formData.level_id;
      formData.keying = $this.formData.keying;
      formData.id = $this.formData.id;
      return formData;
    },
    // 询盘编辑获取初始化询盘信息
    initCluesInfo(){
      var $this = this;
      $this.$store.dispatch('chinaphone/initCluesEditInfoAction', {id:$this.ID}).then(response=>{
        if(response){
          if(response.status){
            $this.defaultInfo = response.data;
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
      $this.formData.id = $this.defaultInfo.id;
      $this.formData.province = $this.defaultInfo.province;
      $this.formData.city = $this.defaultInfo.city;
      $this.formData.effective = $this.defaultInfo.effective==1?true:false;
      $this.formData.useing = $this.defaultInfo.useing;
      $this.formData.custormremark = $this.defaultInfo.custormremark;
      $this.formData.shareinfo = $this.defaultInfo.shareinfo;
      $this.formData.custormcause = $this.defaultInfo.custormcause;
      $this.formData.invalidcause = $this.defaultInfo.invalidcause;
      $this.formData.xuntime = $this.defaultInfo.xuntime;
      $this.formData.url = $this.defaultInfo.url;
      $this.formData.mode = $this.defaultInfo.mode;
      $this.formData.price_id = $this.defaultInfo.price_id;
      $this.formData.phoneid = $this.defaultInfo.phoneid;
      $this.formData.level_id = $this.defaultInfo.level_id;
      $this.formData.keying = [];
      if($this.defaultInfo.keying.indexOf(",")!=-1){
        var keyArr = $this.defaultInfo.keying.split(",");
        keyArr.forEach(function(item,index){
          $this.formData.keying.push(parseInt(item));
        });
      }else{
        $this.formData.keying.push(parseInt($this.defaultInfo.keying));
      }
      var priceList = $this.priceList;
      priceList.forEach(function(item,index){
        if(item.id == $this.formData.price_id){
          item.isOn = true;
        }else{
          item.isOn = false;
        }
      });
      $this.priceList = priceList;
      var phoneList = $this.phoneList;
      phoneList.forEach(function(item,index){
        if(item.id == $this.formData.phoneid){
          item.isOn = true;
        }else{
          item.isOn = false;
        }
      });
      $this.phoneList = phoneList;
      var levelList = $this.levelList;
      levelList.forEach(function(item,index){
        if(item.id == $this.formData.level_id){
          item.isOn = true;
        }else{
          item.isOn = false;
        }
      });
      $this.levelList = levelList;
      var productList = $this.productList;
      productList.forEach(function(item,index){
        if($this.formData.keying.includes(item.id)){
          item.isOn = true;
        }else{
          item.isOn = false;
        }
      });
      $this.productList = productList;
      $this.isLoading.close();
    },
    // 获取当前登陆用户在该页面的操作权限
    getUserMenuButtonPermit(){
      var $this = this;
      $this.$store.dispatch('api/getMenuButtonPermitAction',{id:$this.$router.currentRoute.meta.id}).then(res=>{
        if(res.status){
          if(res.data.length>0){
            res.data.forEach(function(item,index){
              $this.menuButtonPermit.push(item.action_route);
            });
            if($this.ID){
              if(!$this.menuButtonPermit.includes('Chinaphone_edit')){
                $this.$message({
                  showClose: true,
                  message: "未被分配该页面的编辑权限",
                  type: 'error',
                    duration:6000
                });
                $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
              }
            }else{
              if(!$this.menuButtonPermit.includes('Chinaphone_add')){
                $this.$message({
                  showClose: true,
                  message: "未被分配该页面的添加权限",
                  type: 'error',
                    duration:6000
                });
                $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
              }
            }
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
            message: response.info,
            type: 'error'
          });
        }
      });
    },
    // 获取当前页面的条件数据
    getSystemData(){
      var $this = this;
      $this.$store.dispatch('chinaphone/cluesAddEditDataAction', null).then(response=>{
        if(response){
          if(response.status){
            var sourceList = [];
            response.source.forEach(function(item,index){
              var itemData = {};
              itemData.label = item.name;
              itemData.value = item.id;
              sourceList.push(itemData);
            });
            $this.sourceList = sourceList;
            response.phonelist.forEach(function(item,index){
              item.isOn = false;
            });
            response.level.forEach(function(item,index){
              item.isOn = false;
              item.name = item.levelname+"级别";
            });
            var itemLevel={id:0,levelname:"未标记",name:"未标记",isOn:false}
            response.level.push(itemLevel);
            response.price.forEach(function(item,index){
              item.isOn = false;
            });
            response.product.forEach(function(item,index){
              item.isOn = false;
            });
            $this.productList = response.product;
            $this.levelList = response.level;
            $this.priceList = response.price;
            $this.phoneList = response.phonelist;
            if($this.ID){
              $this.initCluesInfo();
            }else{
              $this.isLoading.close();
            }
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
    // 电话点击跳转列表
    phoneJump(id){
      var $this=this;
      var queryObj = {};
      queryObj.phoneID = id;
      $this.$router.push({path:'/Chinaphone/phoneindex',query:queryObj});
    },
    // 搜索统计数据跳转
    searchStatisticsData(){
      var $this = this;
      $this.$router.push({path:'/Chinaphone/searchClues'});
    },
    // 统计分析跳转
    statisticsClues(){
      var $this = this;
      $this.$router.push({path:'/Chinaphone/statisticChart'});
    },
    // 获取电话列表及电话统计数字
    getPhoneListNum(){
      var $this = this;
      $this.$store.dispatch('chinaphone/cluesPhoneStatDataAction', null).then(response=>{
        if(response){
          if(response.status){
            var phoneArr=response.data;
            phoneArr.forEach(function(item,index){
               item.phone.forEach(function(item01,index01){
                   var tagphone='-';
                   item01.isOn = false;
                　　if(item01.phonenumber.indexOf(tagphone)!=-1){
                       item01.shortPhonenumber=item01.phonenumber.split("-")[1];
                　　}else{
                      item01.shortPhonenumber=item01.phonenumber;
                    }
               });
            });
            $this.phoneBrandList = phoneArr;
            $this.getSystemData();
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
    // 来源页面变化切换电话
    urlChangePhone(e){
      var $this = this;
      if($this.formData.url!=""){
        $this.$store.dispatch("chinaphone/cluesUrlGetPhoneAction", {url:$this.formData.url}).then(response=>{
            if(response.status){
              if(response.phone){
                var phoneList = $this.phoneList;
                phoneList.forEach(function(item,index){
                  if(item.id == response.phone.id){
                    item.isOn = true;
                    $this.formData.phoneid = response.phone.id;
                  }else{
                    item.isOn = false;
                  }
                });
                $this.phoneList = phoneList;
              }
            }else{
              $this.$message({
                showClose: true,
                message: response.info,
                type: 'error'
              });
            }
        });
      }
    },
    // 省份失焦验证事件
    provinceChangeHandler(e){
      var $this = this;
      if($this.formData.province!=''){
        $this.$store.dispatch("chinaphone/cluesRegionValidAction", {name:$this.formData.province}).then(response=>{
            if(!response.status){
              $this.$message({
                showClose: true,
                message: response.info,
                type: 'warning',
                duration:0
              });
            }
        });
      }
    },
    // 城市失焦验证事件
    cityChangeHandler(e){
      var $this = this;
      if($this.formData.city!=''){
        $this.$store.dispatch("chinaphone/cluesRegionValidAction", {name:$this.formData.city}).then(response=>{
            if(!response.status){
              $this.$message({
                showClose: true,
                message: response.info,
                type: 'warning',
                duration:0
              });
            }
        });
      }
    },
    // 电话点击事件
    phoneClick(id){
      var $this = this;
      var phoneList = $this.phoneList;
      phoneList.forEach(function(item,index){
        if(item.id == id){
          if(item.isOn){
            item.isOn = false;
          }else{
            item.isOn = true;
            $this.formData.phoneid = id;
          }
        }else{
          item.isOn = false;
        }
      });
      $this.phoneList = phoneList;
    },
    // 产品点击事件
    productClick(id){
      var $this = this;
      var productList = $this.productList;
      productList.forEach(function(item,index){
        if(item.id == id){
          if(item.isOn){
            item.isOn = false;
          }else{
            item.isOn = true;
          }
        }
      });
      var keyList = [];
      productList.forEach(function(item,index){
        if(item.isOn){
          keyList.push(item.id);
        }
      });
      $this.formData.keying = keyList;
      $this.productList = productList;
    },
    // 级别点击事件
    levelClick(id){
      var $this = this;
      var levelList = $this.levelList;
      levelList.forEach(function(item,index){
        if(item.id == id){
          if(item.isOn){
            item.isOn = false;
          }else{
            item.isOn = true;
            $this.formData.level_id = id;
          }
        }else{
          item.isOn = false;
        }
      });
      $this.levelList = levelList;
    },
    // 价格点击事件
    priceClick(id){
      var $this = this;
      var priceList = $this.priceList;
      priceList.forEach(function(item,index){
        if(item.id == id){
          if(item.isOn){
            item.isOn = false;
          }else{
            item.isOn = true;
            $this.formData.price_id = id;
          }
        }else{
          item.isOn = false;
        }
      });
      $this.priceList = priceList;
    },
    // 保存添加/编辑数据
    saveData(){
      var $this = this;
      if(!$this.validationForm()){
        return false;
      }
      var formData = $this.initFormData();
      var pathUrl = "";
      if($this.formData.id==0){
        pathUrl = "chinaphone/cluesAddAction";
      }else{
        pathUrl = "chinaphone/cluesEditAction";
      }
      $this.$store.dispatch(pathUrl, formData).then(response=>{
          if(response.status){
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'success'
            });
            if($this.formData.id!=0){
              $this.initCluesInfo();
            }else{
              var queryObj = {};
              queryObj.phoneID = $this.formData.phoneid;
              var routeUrl =  $this.$router.resolve({path:'/Chinaphone/phoneindex',query:queryObj});
              window.open(routeUrl.href,'_self');
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
    // 清空添加数据表单
    clearFormData(){
      var $this = this;
      $this.formData.id = 0;
      $this.formData.province="";
      $this.formData.mode="";
      $this.formData.url="";
      $this.formData.city="";
      $this.formData.xuntime="";
      $this.formData.effective=true;
      $this.formData.keying=[];
      $this.formData.useing="";
      $this.formData.custormremark="";
      $this.formData.shareinfo = "";
      $this.formData.custormcause="";
      $this.formData.invalidcause="";
      $this.formData.phoneid="";
      $this.formData.level_id="";
      $this.formData.price_id="";
      var priceList = $this.priceList;
      priceList.forEach(function(item,index){
        item.isOn = false;
      });
      $this.priceList = priceList;
      var phoneList = $this.phoneList;
      phoneList.forEach(function(item,index){
        item.isOn = false;
      });
      $this.phoneList = phoneList;
      var levelList = $this.levelList;
      levelList.forEach(function(item,index){
        item.isOn = false;
      });
      $this.levelList = levelList;
      var productList = $this.productList;
      productList.forEach(function(item,index){
        item.isOn = false;
      });
      $this.productList = productList;
    },
    // 验证是否为空
    validationForm(){
      var $this = this;
      if($this.formData.phoneid == ""){
        $this.$message({
            showClose: true,
            message: '错误：来源电话不能为空！',
            type: 'error'
        });
        return false;
      }
      if($this.formData.xuntime == ""||!$this.formData.xuntime){
        $this.$message({
            showClose: true,
            message: '错误：来源时间不能为空！',
            type: 'error'
        });
        return false;
      }
      if($this.formData.mode == ""||!$this.formData.mode){
        $this.$message({
            showClose: true,
            message: '错误：来源渠道不能为空！',
            type: 'error'
        });
        return false;
      }
      if($this.formData.keying.length == 0){
        $this.$message({
            showClose: true,
            message: '错误：意向设备不能为空！',
            type: 'error'
        });
        return false;
      }
      return true;
    },
    // 重置表单
    resetFormData(){
      var $this = this;
      if($this.formData.id==0){
        $this.clearFormData();
      }else{
        $this.setCluesInfo();
      }
    },
    // 默认当前日期时间
    currentTime(){
      var $this=this;
      var getTime=new Date();
      var year=getTime.getFullYear();
      var month=getTime.getMonth()+1;
      if(month<10){
         month='0' + month
      }
      var day=getTime.getDate();
      if(day<10){
         day='0' + day
      }
      var hh=getTime.getHours();
      if(hh<10){
         hh='0' + hh
      }
      var mm=getTime.getMinutes();
      if(mm<10){
         mm='0' + mm
      }
      $this.formData.xuntime= year + '-' + month + '-' + day + ' ' + hh + ':' + mm;
    },
  }
}
</script>
<style lang="scss" scoped>
</style>
