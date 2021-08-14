<template>
  <div class="page-root scroll-panel" ref="boxPane">
    <el-card class="box-card scroll-card" shadow="hover">
        <div class="card-content EnphoneAddEdit" ref="tableContent">
            <div class="EnphoneAddEditMain CnphoneAdd">
                <div class="EnphoneAddEditMainItem phone-list">
                  <dl>
                    <dt>来源电话：<span>*</span></dt>
                    <dd>
                      <div class="clues-list">
                        <span class="item-clues" v-for="item in phoneList" v-bind:class="item.isOn?'active':''" v-bind:key="item.id" v-on:click="phoneClick(item.id)"><i></i>{{item.phonenumber}}</span>
                      </div>
                    </dd>
                  </dl>
                </div>
                <div class="EnphoneAddEditMainItem customer-info">
                    <dl>
                      <dt>来源时间：<span>*</span></dt>
                      <dd>
                        <el-date-picker
                            style="display:block;width:100%;"
                            v-model="formData.xuntime"
                            size="small"
                            type="datetime"
                            placeholder="选择日期时间"
                            value-format = "yyyy-MM-dd HH:mm:ss"
                            align="right"
                            :picker-options="pickerOptions">
                          </el-date-picker>
                      </dd>
                    </dl>
                    <dl>
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
                    <dl>
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
                    <dl>
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
                    <dl>
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
                    <dt>意向设备：<span>*</span></dt>
                    <dd>
                      <div class="clues-list">
                        <span class="item-clues" v-for="item in productList" v-bind:class="item.isOn?'active':''" v-bind:key="item.id" v-on:click="productClick(item.id)"><i></i>{{item.name}}</span>
                      </div>
                    <p>如果为其他生产线、配件、其他产品，请在备注中注明具体产品</p>
                    </dd>
                  </dl>
                </div>
                <div class="EnphoneAddEditMainItem material">
                  <dl>
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
                  <dl>
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
                  <dl>
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
                <div class="EnphoneAddEditMainItem phone-list">
                  <dl>
                    <dt>级别：</dt>
                    <dd>
                      <div class="clues-list">
                        <span class="item-clues" v-for="item in levelList" v-bind:class="item.isOn?'active':''" v-bind:key="item.id" v-on:click="levelClick(item.id)"><i></i>{{item.name}}</span>
                      </div>
                    </dd>
                  </dl>
                </div>
                <div class="EnphoneAddEditMainItem phone-list">
                  <dl>
                    <dt>价格范围：</dt>
                    <dd>
                      <div class="clues-list">
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
                    <dl>
                      <dt>无效原因：</dt>
                      <dd>
                        <el-input
                            placeholder="该项只在无效情况下填写"
                            size="small"
                            v-model="formData.invalidcause"
                            clearable>
                        </el-input>
                      </dd>
                    </dl>
                    <dl>
                      <dt>添加人：</dt>
                      <dd><p>{{userInfo.name}}</p></dd>
                    </dl>
                </div>
            </div>      
          <div class="card-header WebServerAddEditBtn EnphoneAddEditBtn" ref="headerPane">
              <el-button type="primary" class="updateBtn" size="small" v-if="menuButtonPermit.includes('Chinaphone_add')||menuButtonPermit.includes('Chinaphone_edit')" @click="saveData"><i class="svg-i planeWhite" ><svg-icon icon-class="planeWhite" /></i>保存</el-button>
              <el-button type="primary" class="resetBtn" size="small" v-on:click="resetFormData()">重置</el-button>
          </div>
        </div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'addEditClues',
  data() {
    return {
      ID:null,
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
        effective:false,
        keying:[],
        useing:"",
        custormremark:"",
        custormcause:"",
        invalidcause:"",
        phoneid:"",
        level_id:"",
        price_id:"",
      },
      defaultInfo:{},
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'device'
    ]),
  },
  created(){
    var $this = this;
    if($this.$route.query.ID){
      $this.ID = parseInt($this.$route.query.ID);
    }else{
      $this.ID = null;
    }
    $this.initData();
  },
  methods:{
    // 初始化数据
    initData(){
      var $this = this;
      $this.getUserMenuButtonPermit();
    },
    // 初始化页面信息
    initPage(){
      var $this = this;
      $this.getSystemData();
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
            console.log(response,"询盘信息");
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
    },
    // 获取当前登陆用户在该页面的操作权限
    getUserMenuButtonPermit(){
      var $this = this;
      $this.$store.dispatch('api/getMenuButtonPermitAction',{id:$this.$router.currentRoute.meta.id}).then(res=>{
        console.log(res);
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
            console.log(response,"条件信息");
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
    // 判断字符串是否为链接
    isURL(str) {
      var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
      return pattern.test(str);
    },
    // 来源页面变化切换电话
    urlChangePhone(e){
      var $this = this;
      if($this.formData.url!=""&&$this.isURL($this.formData.url)){
        $this.$store.dispatch("chinaphone/cluesUrlGetPhoneAction", {url:$this.formData.url}).then(response=>{
            if(response.status){
              console.log(response);
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
              $this.clearFormData();
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
      $this.formData.effective=false;
      $this.formData.keying=[];
      $this.formData.useing="";
      $this.formData.custormremark="";
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
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
