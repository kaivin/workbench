<template>
    <div class="page-root scroll-panel depart-index" ref="boxPane">  
        <div class="ChannelTab">
            <div class="ChinaphoneTwo buttonTwo">
              <div class="group-header">
                  <el-checkbox class="all-select" :indeterminate="isAllPhone" border size="mini" v-model="checkAllPhone" @change="handleCheckAllPhoneChange">电话全选</el-checkbox>
              </div>
              <div class="group-body">
                <div class="team-panel" v-for="item in phoneList" v-bind:key="item.id">
                  <div class="team-header" v-if="item.icon=='i1'">
                    <span class="require">{{item.name}}：</span>
                    <el-checkbox class="all-select" :indeterminate="isAllSemPhone" border size="mini" v-model="checkAllSemPhone" @change="handleCheckAllSemPhoneChange">全选</el-checkbox>
                    <el-checkbox-group class="team-list" v-model="checkedSem" @change="handleCheckedSemChange" size="mini">
                      <el-checkbox class="item-checkbox" v-for="phone in item.children" :label="phone.value" :key="phone.value" border>{{phone.label}}</el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <div class="team-header" v-else-if="item.icon=='i2'">
                    <span class="require">{{item.name}}：</span>
                    <el-checkbox class="all-select" :indeterminate="isAllSeoPhone" border size="mini" v-model="checkAllSeoPhone" @change="handleCheckAllSeoPhoneChange">全选</el-checkbox>
                    <el-checkbox-group class="team-list" v-model="checkedSeo" @change="handleCheckedSeoChange" size="mini">
                      <el-checkbox class="item-checkbox" v-for="phone in item.children" :label="phone.value" :key="phone.value" border>{{phone.label}}</el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <div class="team-header" v-else-if="item.icon=='i3'">
                    <span class="require">{{item.name}}：</span>
                    <el-checkbox class="all-select" :indeterminate="isAllMediaPhone" border size="mini" v-model="checkAllMediaPhone" @change="handleCheckAllMediaPhoneChange">全选</el-checkbox>
                    <el-checkbox-group class="team-list" v-model="checkedMedia" @change="handleCheckedMediaChange" size="mini">
                      <el-checkbox class="item-checkbox" v-for="phone in item.children" :label="phone.value" :key="phone.value" border>{{phone.label}}</el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <div class="team-header" v-else-if="item.icon=='i4'">
                    <span class="require">{{item.name}}：</span>
                    <el-checkbox class="all-select" :indeterminate="isAllSnsPhone" border size="mini" v-model="checkAllSnsPhone" @change="handleCheckAllSnsPhoneChange">全选</el-checkbox>
                    <el-checkbox-group class="team-list" v-model="checkedSns" @change="handleCheckedSnsChange" size="mini">
                      <el-checkbox class="item-checkbox" v-for="phone in item.children" :label="phone.value" :key="phone.value" border>{{phone.label}}</el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <div class="team-header" v-else-if="item.icon=='i5'">
                    <span class="require">{{item.name}}：</span>
                    <el-checkbox class="all-select" :indeterminate="isAllNewPhone" border size="mini" v-model="checkAllNewPhone" @change="handleCheckAllNewPhoneChange">全选</el-checkbox>
                    <el-checkbox-group class="team-list" v-model="checkedNew" @change="handleCheckedNewChange" size="mini">
                      <el-checkbox class="item-checkbox" v-for="phone in item.children" :label="phone.value" :key="phone.value" border>{{phone.label}}</el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <div class="team-header" v-else>
                    <span class="require">{{item.name}}：</span>
                    <el-checkbox class="all-select" :indeterminate="isAllOtherPhone" border size="mini" v-model="checkAllOtherPhone" @change="handleCheckAllOtherPhoneChange">全选</el-checkbox>
                    <el-checkbox-group class="team-list" v-model="checkedOther" @change="handleCheckedOtherChange" size="mini">
                      <el-checkbox class="item-checkbox" v-for="phone in item.children" :label="phone.value" :key="phone.value" border>{{phone.label}}</el-checkbox>
                    </el-checkbox-group>
                  </div>
                </div>
              </div>
            </div>
            <div class="ChinaphoneTwo buttonTwo">
              <div class="group-header"><el-checkbox class="all-select" :indeterminate="isAllProduct" border size="mini" v-model="checkAllProduct" @change="handleCheckAllProductChange">产品全选</el-checkbox>
              </div>
              <div class="group-body">
                <div class="team-panel" v-for="item in productList" v-bind:key="item.id">
                  <div class="team-header" v-if="item.icon=='a1'">
                    <span class="require">{{item.name}}：</span>
                    <el-checkbox class="all-select" :indeterminate="isAllA1Product" border size="mini" v-model="checkAllA1Product" @change="handleCheckAllA1ProductChange">全选</el-checkbox>
                    <el-checkbox-group class="team-list" v-model="checkedA1Product" @change="handleCheckedA1ProductChange" size="mini">
                      <el-checkbox class="item-checkbox" v-for="product in item.children" :label="product.value" :key="product.value" border>{{product.label}}</el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <div class="team-header" v-else-if="item.icon=='a2'">
                    <span class="require">{{item.name}}：</span>
                    <el-checkbox class="all-select" :indeterminate="isAllA2Product" border size="mini" v-model="checkAllA2Product" @change="handleCheckAllA2ProductChange">全选</el-checkbox>
                    <el-checkbox-group class="team-list" v-model="checkedA2Product" @change="handleCheckedA2ProductChange" size="mini">
                      <el-checkbox class="item-checkbox" v-for="product in item.children" :label="product.value" :key="product.value" border>{{product.label}}</el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <div class="team-header" v-else-if="item.icon=='a3'">
                    <span class="require">{{item.name}}：</span>
                    <el-checkbox class="all-select" :indeterminate="isAllA3Product" border size="mini" v-model="checkAllA3Product" @change="handleCheckAllA3ProductChange">全选</el-checkbox>
                    <el-checkbox-group class="team-list" v-model="checkedA3Product" @change="handleCheckedA3ProductChange" size="mini">
                      <el-checkbox class="item-checkbox" v-for="product in item.children" :label="product.value" :key="product.value" border>{{product.label}}</el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <div class="team-header" v-else-if="item.icon=='a4'">
                    <span class="require">{{item.name}}：</span>
                    <el-checkbox class="all-select" :indeterminate="isAllA4Product" border size="mini" v-model="checkAllA4Product" @change="handleCheckAllA4ProductChange">全选</el-checkbox>
                    <el-checkbox-group class="team-list" v-model="checkedA4Product" @change="handleCheckedA4ProductChange" size="mini">
                      <el-checkbox class="item-checkbox" v-for="product in item.children" :label="product.value" :key="product.value" border>{{product.label}}</el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <div class="team-header" v-else-if="item.icon=='a5'">
                    <span class="require">{{item.name}}：</span>
                    <el-checkbox class="all-select" :indeterminate="isAllA5Product" border size="mini" v-model="checkAllA5Product" @change="handleCheckAllA5ProductChange">全选</el-checkbox>
                    <el-checkbox-group class="team-list" v-model="checkedA5Product" @change="handleCheckedA5ProductChange" size="mini">
                      <el-checkbox class="item-checkbox" v-for="product in item.children" :label="product.value" :key="product.value" border>{{product.label}}</el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <div class="team-header" v-else-if="item.icon=='a6'">
                    <span class="require">{{item.name}}：</span>
                    <el-checkbox class="all-select" :indeterminate="isAllA6Product" border size="mini" v-model="checkAllA6Product" @change="handleCheckAllA6ProductChange">全选</el-checkbox>
                    <el-checkbox-group class="team-list" v-model="checkedA6Product" @change="handleCheckedA6ProductChange" size="mini">
                      <el-checkbox class="item-checkbox" v-for="product in item.children" :label="product.value" :key="product.value" border>{{product.label}}</el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <div class="team-header" v-else-if="item.icon=='a7'">
                    <span class="require">{{item.name}}：</span>
                    <el-checkbox class="all-select" :indeterminate="isAllA7Product" border size="mini" v-model="checkAllA7Product" @change="handleCheckAllA7ProductChange">全选</el-checkbox>
                    <el-checkbox-group class="team-list" v-model="checkedA7Product" @change="handleCheckedA7ProductChange" size="mini">
                      <el-checkbox class="item-checkbox" v-for="product in item.children" :label="product.value" :key="product.value" border>{{product.label}}</el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <div class="team-header" v-else-if="item.icon=='a8'">
                    <span class="require">{{item.name}}：</span>
                    <el-checkbox class="all-select" :indeterminate="isAllA8Product" border size="mini" v-model="checkAllA8Product" @change="handleCheckAllA8ProductChange">全选</el-checkbox>
                    <el-checkbox-group class="team-list" v-model="checkedA8Product" @change="handleCheckedA8ProductChange" size="mini">
                      <el-checkbox class="item-checkbox" v-for="product in item.children" :label="product.value" :key="product.value" border>{{product.label}}</el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <div class="team-header" v-else-if="item.icon=='a9'">
                    <span class="require">{{item.name}}：</span>
                    <el-checkbox class="all-select" :indeterminate="isAllA9Product" border size="mini" v-model="checkAllA9Product" @change="handleCheckAllA9ProductChange">全选</el-checkbox>
                    <el-checkbox-group class="team-list" v-model="checkedA9Product" @change="handleCheckedA9ProductChange" size="mini">
                      <el-checkbox class="item-checkbox" v-for="product in item.children" :label="product.value" :key="product.value" border>{{product.label}}</el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <div class="team-header" v-else-if="item.icon=='a10'">
                    <span class="require">{{item.name}}：</span>
                    <el-checkbox class="all-select" :indeterminate="isAllA10Product" border size="mini" v-model="checkAllA10Product" @change="handleCheckAllA10ProductChange">全选</el-checkbox>
                    <el-checkbox-group class="team-list" v-model="checkedA10Product" @change="handleCheckedA10ProductChange" size="mini">
                      <el-checkbox class="item-checkbox" v-for="product in item.children" :label="product.value" :key="product.value" border>{{product.label}}</el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <div class="team-header" v-else-if="item.icon=='a11'">
                    <span class="require">{{item.name}}：</span>
                    <el-checkbox class="all-select" :indeterminate="isAllA11Product" border size="mini" v-model="checkAllA11Product" @change="handleCheckAllA11ProductChange">全选</el-checkbox>
                    <el-checkbox-group class="team-list" v-model="checkedA11Product" @change="handleCheckedA11ProductChange" size="mini">
                      <el-checkbox class="item-checkbox" v-for="product in item.children" :label="product.value" :key="product.value" border>{{product.label}}</el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <div class="team-header" v-else-if="item.icon=='a12'">
                    <span class="require">{{item.name}}：</span>
                    <el-checkbox class="all-select" :indeterminate="isAllA12Product" border size="mini" v-model="checkAllA12Product" @change="handleCheckAllA12ProductChange">全选</el-checkbox>
                    <el-checkbox-group class="team-list" v-model="checkedA12Product" @change="handleCheckedA12ProductChange" size="mini">
                      <el-checkbox class="item-checkbox" v-for="product in item.children" :label="product.value" :key="product.value" border>{{product.label}}</el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <div class="team-header" v-else-if="item.icon=='a13'">
                    <span class="require">{{item.name}}：</span>
                    <el-checkbox class="all-select" :indeterminate="isAllA13Product" border size="mini" v-model="checkAllA13Product" @change="handleCheckAllA13ProductChange">全选</el-checkbox>
                    <el-checkbox-group class="team-list" v-model="checkedA13Product" @change="handleCheckedA13ProductChange" size="mini">
                      <el-checkbox class="item-checkbox" v-for="product in item.children" :label="product.value" :key="product.value" border>{{product.label}}</el-checkbox>
                    </el-checkbox-group>
                  </div>
                </div>
              </div>
            </div>
            <div class="ChannelMain flex-box">
                  <span class="Channeltit">大洲：</span>
                  <div class="ChannelItem">
                      <el-checkbox class="all-select" :indeterminate="isAllContinent" border size="mini" v-model="checkAllContinent" @change="handleCheckAllContinentChange">全选</el-checkbox>
                      <el-checkbox-group class="team-list" v-model="checkedContinent" @change="handleCheckedContinentChange" size="mini">
                        <el-checkbox class="item-checkbox" v-for="item in continentList" :label="item.name" :key="item.id" border>{{item.name}}</el-checkbox>
                      </el-checkbox-group>
                      <span class="Channeltit" style="margin-left:20px">时间选择：</span>                     
                      <el-date-picker
                        v-model="searchData.data"
                        type="daterange"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        key="b"
                        size="mini"
                        class="date-range"
                        range-separator="～"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerDateRangeOptions">
                      </el-date-picker>
                  </div>                
            </div>
            <div class="card-header WebServerAddEditBtn ChinaphoneTwoBtn">
                <el-button type="primary" class="updateBtn"  :class="isDisabled?'isDisabled':''" :disabled="isDisabled"  size="small" v-on:click="getSearchData"><i class="svg-i planeWhite" ><svg-icon icon-class="planeWhite" /></i>生成数据</el-button>
                <el-button type="primary" class="resetBtn" size="small" :disabled="isDisabled" v-on:click="ChannelBtn">重置</el-button>
            </div>
        </div>
        <div class="el-card box-card scroll-card result-panel is-hover-shadow">
            <template v-if="sourceData.length>0" v-for="(item,index) in sourceData">
              <default-chart 
                :itemData="item" 
                ></default-chart>
            </template>
        </div>
    </div>
  </template>
  <script>
  import {mapGetters} from 'vuex';
  import defaultChart from "../components/country_xun/defaultChart.vue";
  import {randomString,numSeparate,sortByDesc,rankingWithTotalItem,singleArrColor, parseTime} from "@/utils/index";
  export default {
    name: 'country_type',
    components: {
      defaultChart,
    },
    data() {
      return {
          menuButtonPermit:[],         //网页权限字段
          continentList:[],              //渠道数据
          searchData:{
            data:[],
            continent: []
          },
          searchTime: '',
          pickerDateRangeOptions: this.$pickerRangeOptions,
          sourceData:[],
          isAllContinent: false,
          checkAllContinent: false,
          checkedContinent: [],
          productList: [],
          productCount: 0,
          phoneList: [],
          phoneCount: 0,
          isAllPhone:false,
          checkAllPhone:false,
          isAllSemPhone:false,
          checkAllSemPhone:false,
          isAllSeoPhone:false,
          checkAllSeoPhone:false,
          isAllMediaPhone:false,
          checkAllMediaPhone:false,
          isAllSnsPhone:false,
          checkAllSnsPhone:false,
          isAllOtherPhone:false,
          checkAllOtherPhone:false,
          isAllNewPhone:false,
          checkAllNewPhone:false,
          checkedSem:[],
          checkedSeo:[],
          checkedMedia:[],
          checkedSns:[],
          checkedOther:[],
          checkedNew: [],
          isAllProduct:false,
          checkAllProduct:false,
          isAllA1Product:false,
          checkAllA1Product:false,
          isAllA2Product:false,
          checkAllA2Product:false,
          isAllA3Product:false,
          checkAllA3Product:false,
          isAllA4Product:false,
          checkAllA4Product:false,
          isAllA5Product:false,
          checkAllA5Product:false,
          isAllA6Product:false,
          checkAllA6Product:false,
          isAllA7Product:false,
          checkAllA7Product:false,
          isAllA8Product:false,
          checkAllA8Product:false,
          isAllA9Product:false,
          checkAllA9Product:false,
          isAllA10Product:false,
          checkAllA10Product:false,
          isAllA11Product:false,
          checkAllA11Product:false,
          isAllA12Product:false,
          checkAllA12Product:false,
          isAllA13Product:false,
          checkAllA13Product:false,
          checkedA1Product:[],
          checkedA2Product:[],
          checkedA3Product:[],
          checkedA4Product:[],
          checkedA5Product:[],
          checkedA6Product:[],
          checkedA7Product:[],
          checkedA8Product:[],
          checkedA9Product:[],
          checkedA10Product:[],
          checkedA11Product:[],
          checkedA12Product:[],
          checkedA13Product:[],
          isDisabled: false
      };
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'menuData'
      ]),
    },
    created() {
      var $this = this;
      $this.searchData.data=$this.getNearDate();
      $this.getUserMenuButtonPermit();
    },
    mounted(){
      const $this = this;
      if(!$this.sidebar.opened){
        $this.$store.dispatch('app/toggleSideBar');
      }  
    },
    methods: {
      // 判断浏览器类型
      getBrowserType(){
        var ua =  navigator.userAgent;
        if(ua){
          if(ua.indexOf('Mobile')!=-1){
            this.scrollPosition.isPC = false;
          }else{
            this.scrollPosition.isPC = true;
          }
        }else{
          this.scrollPosition.isPC = true;
        }
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
            if(permitData.includes('Commdepart_country_xun')){
                $this.getContientList();
                $this.getSearchSystemData();
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
      // 获取部门列表
      getContientList(){
        var $this = this;
        $this.$store.dispatch('depcomm/depcomContinentAction', null).then(res=>{
          var continentList = [];
          if(res.continent && res.continent.length > 0){
            res.continent.forEach(function(item,index){
              var itemData = {};
              itemData.id = item.ContinentID;
              itemData.name = item.ContinentName;
              continentList.push(itemData);
            });        
          }
          $this.continentList = JSON.parse(JSON.stringify(continentList));
          $this.getSearchData();
        });
      },
      // 大洲点击事件
      handleCheckAllContinentChange(e){
        var $this = this;
        if(e){
          var checkedContinent = [];
          $this.continentList.forEach(function(item,index){
            checkedContinent.push(item.name);
          });
          $this.checkedContinent = checkedContinent;
          $this.checkAllContinent= true;
        }else{
          $this.checkedContinent = [];
          $this.checkAllContinent = false;
        }
        $this.isAllContinent = false;
        // $this.getSearchData();
      },
      handleCheckedContinentChange(e){
        var $this = this;
        var checkedCount = e.length;
        if(checkedCount === $this.continentList.length){
            $this.checkAllContinent = true;
          }else{
            $this.checkAllContinent = false;
          }
          if(checkedCount>0 && checkedCount<$this.continentList.length){
            $this.isAllContinent = true;
          }else{
            $this.isAllContinent = false;
          }
          // $this.getSearchData();
      },
      //点击时间搜索
      handleData(){
        var $this=this;
        $this.getSearchData();
      },
      // 重置搜索数据
      ChannelBtn(){
          var $this=this;
          $this.isAllPhone=false;
          $this.checkAllPhone=false;
          $this.isAllSemPhone=false;
          $this.checkAllSemPhone=false;
          $this.isAllSeoPhone=false;
          $this.checkAllSeoPhone=false;
          $this.isAllMediaPhone=false;
          $this.checkAllMediaPhone=false;
          $this.isAllSnsPhone=false;
          $this.checkAllSnsPhone=false;
          $this.isAllOtherPhone=false;
          $this.checkAllOtherPhone=false;
          $this.isAllNewPhone=false;
          $this.checkAllNewPhone=false;
          $this.checkedSem=[];
          $this.checkedSeo=[];
          $this.checkedMedia=[];
          $this.checkedSns=[];
          $this.checkedOther=[];
          $this.checkedNew=[];
          $this.phoneCount=0;
          $this.productCount=0;
          $this.isAllProduct=false;
          $this.checkAllProduct=false;
          $this.isAllA1Product=false;
          $this.checkAllA1Product=false;
          $this.isAllA2Product=false;
          $this.checkAllA2Product=false;
          $this.isAllA3Product=false;
          $this.checkAllA3Product=false;
          $this.isAllA4Product=false;
          $this.checkAllA4Product=false;
          $this.isAllA5Product=false;
          $this.checkAllA5Product=false;
          $this.isAllA6Product=false;
          $this.checkAllA6Product=false;
          $this.isAllA7Product=false;
          $this.checkAllA7Product=false;
          $this.isAllA8Product=false;
          $this.checkAllA8Product=false;
          $this.isAllA9Product=false;
          $this.checkAllA9Product=false;
          $this.isAllA10Product=false;
          $this.checkAllA10Product=false;
          $this.isAllA11Product=false;
          $this.checkAllA11Product=false;
          $this.isAllA12Product=false;
          $this.checkAllA12Product=false;
          $this.isAllA13Product=false;
          $this.checkAllA13Product=false;
          $this.checkedA1Product=[];
          $this.checkedA2Product=[];
          $this.checkedA3Product=[];
          $this.checkedA4Product=[];
          $this.checkedA5Product=[];
          $this.checkedA6Product=[];
          $this.checkedA7Product=[];
          $this.checkedA8Product=[];
          $this.checkedA9Product=[];
          $this.checkedA10Product=[];
          $this.checkedA11Product=[];
          $this.checkedA12Product=[];
          $this.checkedA13Product=[];
          $this.searchData.continent= [];
          $this.isAllContinent = false;
          $this.checkAllContinent = false;
          $this.checkedContinent = [];
          $this.searchData.data=$this.getNearDate();
          $this.isAllOn = false;
          $this.getSearchData();
      },
      //重组搜索数据
      initsearch(){
        var $this = this;
        var searchData={};
        searchData.continent = $this.checkedContinent;
        if($this.searchData.data&&$this.searchData.data.length>0){
          searchData.starttime=$this.searchData.data[0];
          searchData.endtime=$this.searchData.data[1];
          $this.searchTime=$this.searchData.data[0]+' ~ '+$this.searchData.data[1];
        }else{
            $this.searchTime='';
        }
        var checkedSem = $this.checkedSem;
        var checkedSeo = $this.checkedSeo;
        var checkedMedia = $this.checkedMedia;
        var checkedSns = $this.checkedSns;
        var checkedOther = $this.checkedOther;
        var checkedNew = $this.checkedNew;
        var allphone = checkedSem.concat(checkedSeo).concat(checkedMedia).concat(checkedSns).concat(checkedOther).concat(checkedNew);
        if(allphone.length > 0){
          searchData.phoneid = allphone;
        }
        var checkedA1Product = $this.checkedA1Product;
        var checkedA2Product = $this.checkedA2Product;
        var checkedA3Product = $this.checkedA3Product;
        var checkedA4Product = $this.checkedA4Product;
        var checkedA5Product = $this.checkedA5Product;
        var checkedA6Product = $this.checkedA6Product;
        var checkedA7Product = $this.checkedA7Product;
        var checkedA8Product = $this.checkedA8Product;
        var checkedA9Product = $this.checkedA9Product;
        var checkedA10Product = $this.checkedA10Product;
        var checkedA11Product = $this.checkedA11Product;
        var checkedA12Product = $this.checkedA12Product;
        var checkedA13Product = $this.checkedA13Product;
        var allproduct=checkedA1Product.concat(checkedA2Product).concat(checkedA3Product).concat(checkedA4Product).concat(checkedA5Product).concat(checkedA6Product).concat(checkedA7Product).concat(checkedA8Product).concat(checkedA9Product).concat(checkedA10Product).concat(checkedA11Product).concat(checkedA12Product).concat(checkedA13Product)
        if(allproduct.length > 0){
          searchData.productid = allproduct;
        }
        return searchData;
      },
      getSearchData(){
        var $this = this;
        var searchData={};
        $this.isDisabled = true;
        searchData=$this.initsearch();
        $this.$store.dispatch('depcomm/depcomCountryXunAction', searchData).then(res=>{
            if(res.status){
              $this.isDisabled = false;
              $this.sourceData = [];
              // 询盘趋势内容处理
              var resXunData = {}
              resXunData.chartTitle = "大洲平均小时询盘量";
              resXunData.unit = "（单位：个）";
              resXunData.chartType = "column";
              resXunData.chartName = "询盘个数"
              var numHoursArr = [];
              var totalXunChart = [];
              if(res.data && res.data.length > 0){
                res.data.forEach(function(item,index){
                  numHoursArr.push(item.number);
                  var newObj = {};
                  newObj.name = item.hours;
                  newObj.value = item.number;
                  totalXunChart.push(newObj);
                });
                var maxHoursNum = Math.max(...numHoursArr);
                var minHoursNum = Math.min(...numHoursArr);
                var maxHours = [];
                var minHours = [];
                res.data.forEach(function(item,index){
                  if(item.number === maxHoursNum){
                    maxHours.push(item.hours)
                  }else if(item.number === minHoursNum){
                    minHours.push(item.hours);
                  }
                });
                resXunData.maxHours = maxHours;
                resXunData.minHours = minHours;
              }
              resXunData.totalChart = totalXunChart;
              resXunData.randomStr = "yMfy";
              resXunData.formatLabel = false;
              resXunData.percentLabel = false;
              $this.sourceData.push(resXunData);
            }else{
              $this.isDisabled = false;
              $this.$message({
                showClose: true,
                message: res.info,
                type: 'error',
                duration:6000
              });
            }
        });
      },
      // 默认今天
      getNearDate(){
        const end = parseTime(new Date(), '{y}-{m}-{d}');
        const start = parseTime(new Date(), '{y}-{m}-{d}');
        return [start,end];
      },
      // 获取询盘统计的搜索条件数据
      getSearchSystemData(){
        var $this = this;
        $this.$store.dispatch('enphone/inquiryItemAction').then(response=>{
          if(response){
            if(response.status){
              var productList = [];
              var productCount = 0;
              response.producttype.forEach(function(item,index){
                var itemData = {};
                itemData.name = item.name;
                itemData.id = item.id;
                itemData.icon = "a"+item.id;
                itemData.children = [];
                productCount += item.product.length;
                item.product.forEach(function(item1,index1){
                  var itemChildren = {};
                  itemChildren.label = item1.name;
                  itemChildren.value = item1.id;
                  itemData.children.push(itemChildren);
                });
                productList.push(itemData);
              });
              $this.productList = productList;
              $this.productCount = productCount;
              var phoneList = [];
              var phoneCount = 0;
              var newPhone = [];
              response.phone.forEach(function(item,index){
                if(newPhone.indexOf(item.departname) == -1){
                  newPhone.push(item.departname);
                }
              })
              var newPhoneArr=[];
              var nowindex = 1;
              newPhone.forEach(function(item,index){
                  var newobj={};
                  newobj.id = nowindex;
                  newobj.icon="i"+ nowindex;
                  newobj.name = item;
                  newobj.children=[];
                  nowindex++;
                  newPhoneArr.push(newobj)
              })
              response.phone.forEach(function(item,index){
                newPhoneArr.forEach(function(item1,index1){
                  if(item.departname==item1.name){
                    var newobj={};
                    newobj.label=item.phonenumber;
                    newobj.value=item.id;
                    item1.children.push(newobj);
                    phoneCount++;
                  }
                });
              })
              
              $this.phoneList = newPhoneArr;
              $this.phoneCount = phoneCount;
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
      // 选中所有电话事件 注！sem->i1;seo->i2;we-media->i3;sns->i4;other未修改
      handleCheckAllPhoneChange(e){
        var $this = this;
        if(e){
          $this.phoneList.forEach(function(item,index){
            var checkedList = [];
            if(item.icon=="i1"){
              item.children.forEach(function(item1,index1){
                checkedList.push(item1.value);
              });
              $this.checkedSem = checkedList;
              $this.checkAllSemPhone = true;
            }else if(item.icon=="i2"){
              item.children.forEach(function(item1,index1){
                checkedList.push(item1.value);
              });
              $this.checkedSeo = checkedList;
              $this.checkAllSeoPhone = true;
            }else if(item.icon=="i3"){
              item.children.forEach(function(item1,index1){
                checkedList.push(item1.value);
              });
              $this.checkedMedia = checkedList;
              $this.checkAllMediaPhone = true;
            }else if(item.icon=="i4"){
              item.children.forEach(function(item1,index1){
                checkedList.push(item1.value);
              });
              $this.checkedSns = checkedList;
              $this.checkAllSnsPhone = true;
            }else if(item.icon=="i5"){
              item.children.forEach(function(item1,index1){
                checkedList.push(item1.value);
              });
              $this.checkedNew = checkedList;
              $this.checkAllNewPhone = true;
            }else{
              item.children.forEach(function(item1,index1){
                checkedList.push(item1.value);
              });
              $this.checkedOther = checkedList;
              $this.checkAllOtherPhone = true;
            }
          });
        }else{
          $this.checkedSem = [];
          $this.checkedSeo = [];
          $this.checkedMedia = [];
          $this.checkedSns = [];
          $this.checkedOther = [];
          $this.checkedNew = [];
          $this.checkAllSemPhone = false;
          $this.checkAllSeoPhone = false;
          $this.checkAllMediaPhone = false;
          $this.checkAllSnsPhone = false;
          $this.checkAllOtherPhone = false;
          $this.checkAllNewPhone = false;
        }
        $this.isAllPhone = false;
        $this.isAllSemPhone = false;
        $this.isAllSeoPhone = false;
        $this.isAllMediaPhone = false;
        $this.isAllSnsPhone = false;
        $this.isAllOtherPhone = false;
        $this.isAllNewPhone = false;
      },
      handleCheckAllSemPhoneChange(e){
        var $this = this;
        if(e){
          var checkedList = [];
          $this.phoneList.forEach(function(item,index){
            if(item.icon=="i1"){
              item.children.forEach(function(item1,index1){
                checkedList.push(item1.value);
              });
            }
          });
          $this.checkedSem = checkedList;
        }else{
          $this.checkedSem = [];
        }
        $this.isAllSemPhone = false;
        $this.allPhoneSelectedStatus();
      },
      handleCheckAllSeoPhoneChange(e){
        var $this = this;
        if(e){
          var checkedList = [];
          $this.phoneList.forEach(function(item,index){
            if(item.icon=="i2"){
              item.children.forEach(function(item1,index1){
                checkedList.push(item1.value);
              });
            }
          });
          $this.checkedSeo = checkedList;
        }else{
          $this.checkedSeo = [];
        }
        $this.isAllSeoPhone = false;
        $this.allPhoneSelectedStatus();
      },
      handleCheckAllMediaPhoneChange(e){
        var $this = this;
        if(e){
          var checkedList = [];
          $this.phoneList.forEach(function(item,index){
            if(item.icon=="i3"){
              item.children.forEach(function(item1,index1){
                checkedList.push(item1.value);
              });
            }
          });
          $this.checkedMedia = checkedList;
        }else{
          $this.checkedMedia = [];
        }
        $this.isAllMediaPhone = false;
        $this.allPhoneSelectedStatus();
      },
      handleCheckAllSnsPhoneChange(e){
        var $this = this;
        if(e){
          var checkedList = [];
          $this.phoneList.forEach(function(item,index){
            if(item.icon=="i4"){
              item.children.forEach(function(item1,index1){
                checkedList.push(item1.value);
              });
            }
          });
          $this.checkedSns = checkedList;
        }else{
          $this.checkedSns = [];
        }
        $this.isAllSnsPhone = false;
        $this.allPhoneSelectedStatus();
      },
      handleCheckAllOtherPhoneChange(e){
        var $this = this;
        if(e){
          var checkedList = [];
          $this.phoneList.forEach(function(item,index){
            if(item.icon=="i6"){
              item.children.forEach(function(item1,index1){
                checkedList.push(item1.value);
              });
            }
          });
          $this.checkedOther = checkedList;
        }else{
          $this.checkedOther = [];
        }
        $this.isAllOtherPhone = false;
        $this.allPhoneSelectedStatus();
      },
      handleCheckAllNewPhoneChange(e){
        var $this = this;
        if(e){
          var checkedList = [];
          $this.phoneList.forEach(function(item,index){
            if(item.icon=="i5"){
              item.children.forEach(function(item1,index1){
                checkedList.push(item1.value);
              });
            }
          });
          $this.checkedNew = checkedList;
        }else{
          $this.checkedNew = [];
        }
        $this.isAllNewPhone = false;
        $this.allPhoneSelectedStatus();
      },
      handleCheckedSemChange(e){
        var $this = this;
        var checkedCount = e.length;
        $this.phoneList.forEach(function(item,index){
          if(item.icon=="i1"){
            if(checkedCount === item.children.length){
              $this.checkAllSemPhone = true;
            }else{
              $this.checkAllSemPhone = false;
            }
            if(checkedCount>0&&checkedCount<item.children.length){
              $this.isAllSemPhone = true;
            }else{
              $this.isAllSemPhone = false;
            }
          }
        });
        $this.allPhoneSelectedStatus();
      },
      handleCheckedSeoChange(e){
        var $this = this;
        var checkedCount = e.length;
        $this.phoneList.forEach(function(item,index){
          if(item.icon=="i2"){
            if(checkedCount === item.children.length){
              $this.checkAllSeoPhone = true;
            }else{
              $this.checkAllSeoPhone = false;
            }
            if(checkedCount>0&&checkedCount<item.children.length){
              $this.isAllSeoPhone = true;
            }else{
              $this.isAllSeoPhone = false;
            }
          }
        });
        $this.allPhoneSelectedStatus();
      },
      handleCheckedMediaChange(e){
        var $this = this;
        var checkedCount = e.length;
        $this.phoneList.forEach(function(item,index){
          if(item.icon=="i3"){
            if(checkedCount === item.children.length){
              $this.checkAllMediaPhone = true;
            }else{
              $this.checkAllMediaPhone = false;
            }
            if(checkedCount>0&&checkedCount<item.children.length){
              $this.isAllMediaPhone = true;
            }else{
              $this.isAllMediaPhone = false;
            }
          }
        });
        $this.allPhoneSelectedStatus();
      },
      handleCheckedSnsChange(e){
        var $this = this;
        var checkedCount = e.length;
        $this.phoneList.forEach(function(item,index){
          if(item.icon=="i4"){
            if(checkedCount === item.children.length){
              $this.checkAllSnsPhone = true;
            }else{
              $this.checkAllSnsPhone = false;
            }
            if(checkedCount>0&&checkedCount<item.children.length){
              $this.isAllSnsPhone = true;
            }else{
              $this.isAllSnsPhone = false;
            }
          }
        });
        $this.allPhoneSelectedStatus();
      },
      handleCheckedOtherChange(e){
        var $this = this;
        var checkedCount = e.length;
        $this.phoneList.forEach(function(item,index){
          if(item.icon=="i6"){
            if(checkedCount === item.children.length){
              $this.checkAllOtherPhone = true;
            }else{
              $this.checkAllOtherPhone = false;
            }
            if(checkedCount>0&&checkedCount<item.children.length){
              $this.isAllOtherPhone = true;
            }else{
              $this.isAllOtherPhone = false;
            }
          }
        });
        $this.allPhoneSelectedStatus();
      },
      handleCheckedNewChange(e){
        var $this = this;
        var checkedCount = e.length;
        $this.phoneList.forEach(function(item,index){
          if(item.icon=="i5"){
            if(checkedCount === item.children.length){
              $this.checkAllNewPhone = true;
            }else{
              $this.checkAllNewPhone = false;
            }
            if(checkedCount>0&&checkedCount<item.children.length){
              $this.isAllNewPhone = true;
            }else{
              $this.isAllNewPhone = false;
            }
          }
        });
        $this.allPhoneSelectedStatus();
      },
      // 全选按钮状态事件
      allPhoneSelectedStatus(){
        var $this = this;
        var totalCheckedCount = $this.checkedSem.length+$this.checkedSeo.length+$this.checkedMedia.length+$this.checkedSns.length+$this.checkedOther.length+$this.checkedNew.length;
        if(totalCheckedCount>0&&totalCheckedCount<$this.phoneCount){
          $this.isAllPhone = true;
        }else{
          $this.isAllPhone = false;
        }
        if(totalCheckedCount == $this.phoneCount){
          $this.checkAllPhone = true;
        }else{
          $this.checkAllPhone = false;
        }
      },
      // 选中所有产品事件
      handleCheckAllProductChange(e){
        var $this = this;
        if(e){
          $this.productList.forEach(function(item,index){
            var checkedList = [];
            if(item.icon=="a1"){
              item.children.forEach(function(item1,index1){
                checkedList.push(item1.value);
              });
              $this.checkedA1Product = checkedList;
              $this.checkAllA1Product= true;
            }else if(item.icon=="a2"){
              item.children.forEach(function(item1,index1){
                checkedList.push(item1.value);
              });
              $this.checkedA2Product = checkedList;
              $this.checkAllA2Product = true;
            }else if(item.icon=="a3"){
              item.children.forEach(function(item1,index1){
                checkedList.push(item1.value);
              });
              $this.checkedA3Product = checkedList;
              $this.checkAllA3Product = true;
            }else if(item.icon=="a4"){
              item.children.forEach(function(item1,index1){
                checkedList.push(item1.value);
              });
              $this.checkedA4Product = checkedList;
              $this.checkAllA4Product = true;
            }else if(item.icon=="a5"){
              item.children.forEach(function(item1,index1){
                checkedList.push(item1.value);
              });
              $this.checkedA5Product = checkedList;
              $this.checkAllA5Product = true;
            }else if(item.icon=="a6"){
              item.children.forEach(function(item1,index1){
                checkedList.push(item1.value);
              });
              $this.checkedA6Product = checkedList;
              $this.checkAllA6Product = true;
            }else if(item.icon=="a7"){
              item.children.forEach(function(item1,index1){
                checkedList.push(item1.value);
              });
              $this.checkedA7Product = checkedList;
              $this.checkAllA7Product = true;
            }else if(item.icon=="a8"){
              item.children.forEach(function(item1,index1){
                checkedList.push(item1.value);
              });
              $this.checkedA8Product = checkedList;
              $this.checkAllA8Product = true;
            }else if(item.icon=="a9"){
              item.children.forEach(function(item1,index1){
                checkedList.push(item1.value);
              });
              $this.checkedA9Product = checkedList;
              $this.checkAllA9Product = true;
            }else if(item.icon=="a10"){
              item.children.forEach(function(item1,index1){
                checkedList.push(item1.value);
              });
              $this.checkedA10Product = checkedList;
              $this.checkAllA10Product = true;
            }else if(item.icon=="a11"){
              item.children.forEach(function(item1,index1){
                checkedList.push(item1.value);
              });
              $this.checkedA11Product = checkedList;
              $this.checkAllA11Product = true;
            }else if(item.icon=="a12"){
              item.children.forEach(function(item1,index1){
                checkedList.push(item1.value);
              });
              $this.checkedA12Product = checkedList;
              $this.checkAllA12Product = true;
            }else if(item.icon=="a13"){
              item.children.forEach(function(item1,index1){
                checkedList.push(item1.value);
              });
              $this.checkedA13Product = checkedList;
              $this.checkAllA13Product = true;
            }
          });
        }else{
          $this.checkedA1Product = [];
          $this.checkedA2Product = [];
          $this.checkedA3Product = [];
          $this.checkedA4Product = [];
          $this.checkedA5Product = [];
          $this.checkedA6Product = [];
          $this.checkedA7Product = [];
          $this.checkedA8Product = [];
          $this.checkedA9Product = [];
          $this.checkedA10Product = [];
          $this.checkedA11Product = [];
          $this.checkedA12Product = [];
          $this.checkedA13Product = [];
          $this.checkAllA1Product = false;
          $this.checkAllA2Product = false;
          $this.checkAllA3Product = false;
          $this.checkAllA4Product = false;
          $this.checkAllA5Product = false;
          $this.checkAllA6Product = false;
          $this.checkAllA7Product = false;
          $this.checkAllA8Product = false;
          $this.checkAllA9Product = false;
          $this.checkAllA10Product = false;
          $this.checkAllA11Product = false;
          $this.checkAllA12Product = false;
          $this.checkAllA13Product = false;
        }
        $this.isAllProduct = false;
        $this.isAllA1Product = false;
        $this.isAllA2Product = false;
        $this.isAllA3Product = false;
        $this.isAllA4Product = false;
        $this.isAllA5Product = false;
        $this.isAllA6Product = false;
        $this.isAllA7Product = false;
        $this.isAllA8Product = false;
        $this.isAllA9Product = false;
        $this.isAllA10Product = false;
        $this.isAllA11Product = false;
        $this.isAllA12Product = false;
        $this.isAllA13Product = false;
      },
      handleCheckAllA1ProductChange(e){
        var $this = this;
        if(e){
          var checkedList = [];
          $this.productList.forEach(function(item,index){
            if(item.icon=="a1"){
              item.children.forEach(function(item1,index1){
                checkedList.push(item1.value);
              });
            }
          });
          $this.checkedA1Product = checkedList;
        }else{
          $this.checkedA1Product = [];
        }
        $this.isAllA1Product = false;
        $this.allProductSelectedStatus();
      },
      handleCheckAllA2ProductChange(e){
        var $this = this;
        if(e){
          var checkedList = [];
          $this.productList.forEach(function(item,index){
            if(item.icon=="a2"){
              item.children.forEach(function(item1,index1){
                checkedList.push(item1.value);
              });
            }
          });
          $this.checkedA2Product = checkedList;
        }else{
          $this.checkedA2Product = [];
        }
        $this.isAllA2Product = false;
        $this.allProductSelectedStatus();
      },
      handleCheckAllA3ProductChange(e){
        var $this = this;
        if(e){
          var checkedList = [];
          $this.productList.forEach(function(item,index){
            if(item.icon=="a3"){
              item.children.forEach(function(item1,index1){
                checkedList.push(item1.value);
              });
            }
          });
          $this.checkedA3Product = checkedList;
        }else{
          $this.checkedA3Product = [];
        }
        $this.isAllA3Product = false;
        $this.allProductSelectedStatus();
      },
      handleCheckAllA4ProductChange(e){
        var $this = this;
        if(e){
          var checkedList = [];
          $this.productList.forEach(function(item,index){
            if(item.icon=="a4"){
              item.children.forEach(function(item1,index1){
                checkedList.push(item1.value);
              });
            }
          });
          $this.checkedA4Product = checkedList;
        }else{
          $this.checkedA4Product = [];
        }
        $this.isAllA4Product = false;
        $this.allProductSelectedStatus();
      },
      handleCheckAllA5ProductChange(e){
        var $this = this;
        if(e){
          var checkedList = [];
          $this.productList.forEach(function(item,index){
            if(item.icon=="a5"){
              item.children.forEach(function(item1,index1){
                checkedList.push(item1.value);
              });
            }
          });
          $this.checkedA5Product = checkedList;
        }else{
          $this.checkedA5Product = [];
        }
        $this.isAllA5Product = false;
        $this.allProductSelectedStatus();
      },
      handleCheckAllA6ProductChange(e){
        var $this = this;
        if(e){
          var checkedList = [];
          $this.productList.forEach(function(item,index){
            if(item.icon=="a6"){
              item.children.forEach(function(item1,index1){
                checkedList.push(item1.value);
              });
            }
          });
          $this.checkedA6Product = checkedList;
        }else{
          $this.checkedA6Product = [];
        }
        $this.isAllA6Product = false;
        $this.allProductSelectedStatus();
      },
      handleCheckAllA7ProductChange(e){
        var $this = this;
        if(e){
          var checkedList = [];
          $this.productList.forEach(function(item,index){
            if(item.icon=="a7"){
              item.children.forEach(function(item1,index1){
                checkedList.push(item1.value);
              });
            }
          });
          $this.checkedA7Product = checkedList;
        }else{
          $this.checkedA7Product = [];
        }
        $this.isAllA7Product = false;
        $this.allProductSelectedStatus();
      },
      handleCheckAllA8ProductChange(e){
        var $this = this;
        if(e){
          var checkedList = [];
          $this.productList.forEach(function(item,index){
            if(item.icon=="a8"){
              item.children.forEach(function(item1,index1){
                checkedList.push(item1.value);
              });
            }
          });
          $this.checkedA8Product = checkedList;
        }else{
          $this.checkedA8Product = [];
        }
        $this.isAllA8Product = false;
        $this.allProductSelectedStatus();
      },
      handleCheckAllA9ProductChange(e){
        var $this = this;
        if(e){
          var checkedList = [];
          $this.productList.forEach(function(item,index){
            if(item.icon=="a9"){
              item.children.forEach(function(item1,index1){
                checkedList.push(item1.value);
              });
            }
          });
          $this.checkedA9Product = checkedList;
        }else{
          $this.checkedA9Product = [];
        }
        $this.isAllA9Product = false;
        $this.allProductSelectedStatus();
      },
      handleCheckAllA10ProductChange(e){
        var $this = this;
        if(e){
          var checkedList = [];
          $this.productList.forEach(function(item,index){
            if(item.icon=="a10"){
              item.children.forEach(function(item1,index1){
                checkedList.push(item1.value);
              });
            }
          });
          $this.checkedA10Product = checkedList;
        }else{
          $this.checkedA10Product = [];
        }
        $this.isAllA10Product = false;
        $this.allProductSelectedStatus();
      },
      handleCheckAllA11ProductChange(e){
        var $this = this;
        if(e){
          var checkedList = [];
          $this.productList.forEach(function(item,index){
            if(item.icon=="a11"){
              item.children.forEach(function(item1,index1){
                checkedList.push(item1.value);
              });
            }
          });
          $this.checkedA11Product = checkedList;
        }else{
          $this.checkedA11Product = [];
        }
        $this.isAllA11Product = false;
        $this.allProductSelectedStatus();
      },
      handleCheckAllA12ProductChange(e){
        var $this = this;
        if(e){
          var checkedList = [];
          $this.productList.forEach(function(item,index){
            if(item.icon=="a12"){
              item.children.forEach(function(item1,index1){
                checkedList.push(item1.value);
              });
            }
          });
          $this.checkedA12Product = checkedList;
        }else{
          $this.checkedA12Product = [];
        }
        $this.isAllA12Product = false;
        $this.allProductSelectedStatus();
      },
      handleCheckAllA13ProductChange(e){
        var $this = this;
        if(e){
          var checkedList = [];
          $this.productList.forEach(function(item,index){
            if(item.icon=="a13"){
              item.children.forEach(function(item1,index1){
                checkedList.push(item1.value);
              });
            }
          });
          $this.checkedA13Product = checkedList;
        }else{
          $this.checkedA13Product = [];
        }
        $this.isAllA13Product = false;
        $this.allProductSelectedStatus();
      },
      handleCheckedA1ProductChange(e){
        var $this = this;
        var checkedCount = e.length;
        $this.productList.forEach(function(item,index){
          if(item.icon=="a1"){
            if(checkedCount === item.children.length){
              $this.checkAllA1Product = true;
            }else{
              $this.checkAllA1Product = false;
            }
            if(checkedCount>0&&checkedCount<item.children.length){
              $this.isAllA1Product = true;
            }else{
              $this.isAllA1Product = false;
            }
          }
        });
        $this.allProductSelectedStatus();
      },
      handleCheckedA2ProductChange(e){
        var $this = this;
        var checkedCount = e.length;
        $this.productList.forEach(function(item,index){
          if(item.icon=="a2"){
            if(checkedCount === item.children.length){
              $this.checkAllA2Product = true;
            }else{
              $this.checkAllA2Product = false;
            }
            if(checkedCount>0&&checkedCount<item.children.length){
              $this.isAllA2Product = true;
            }else{
              $this.isAllA2Product = false;
            }
          }
        });
        $this.allProductSelectedStatus();
      },
      handleCheckedA3ProductChange(e){
        var $this = this;
        var checkedCount = e.length;
        $this.productList.forEach(function(item,index){
          if(item.icon=="a3"){
            if(checkedCount === item.children.length){
              $this.checkAllA3Product = true;
            }else{
              $this.checkAllA3Product = false;
            }
            if(checkedCount>0&&checkedCount<item.children.length){
              $this.isAllA3Product = true;
            }else{
              $this.isAllA3Product = false;
            }
          }
        });
        $this.allProductSelectedStatus();
      },
      handleCheckedA4ProductChange(e){
        var $this = this;
        var checkedCount = e.length;
        $this.productList.forEach(function(item,index){
          if(item.icon=="a4"){
            if(checkedCount === item.children.length){
              $this.checkAllA4Product = true;
            }else{
              $this.checkAllA4Product = false;
            }
            if(checkedCount>0&&checkedCount<item.children.length){
              $this.isAllA4Product = true;
            }else{
              $this.isAllA4Product = false;
            }
          }
        });
        $this.allProductSelectedStatus();
      },
      handleCheckedA5ProductChange(e){
        var $this = this;
        var checkedCount = e.length;
        $this.productList.forEach(function(item,index){
          if(item.icon=="a5"){
            if(checkedCount === item.children.length){
              $this.checkAllA5Product = true;
            }else{
              $this.checkAllA5Product = false;
            }
            if(checkedCount>0&&checkedCount<item.children.length){
              $this.isAllA5Product = true;
            }else{
              $this.isAllA5Product = false;
            }
          }
        });
        $this.allProductSelectedStatus();
      },
      handleCheckedA6ProductChange(e){
        var $this = this;
        var checkedCount = e.length;
        $this.productList.forEach(function(item,index){
          if(item.icon=="a6"){
            if(checkedCount === item.children.length){
              $this.checkAllA6Product = true;
            }else{
              $this.checkAllA6Product = false;
            }
            if(checkedCount>0&&checkedCount<item.children.length){
              $this.isAllA6Product = true;
            }else{
              $this.isAllA6Product = false;
            }
          }
        });
        $this.allProductSelectedStatus();
      },
      handleCheckedA7ProductChange(e){
        var $this = this;
        var checkedCount = e.length;
        $this.productList.forEach(function(item,index){
          if(item.icon=="a7"){
            if(checkedCount === item.children.length){
              $this.checkAllA7Product = true;
            }else{
              $this.checkAllA7Product = false;
            }
            if(checkedCount>0&&checkedCount<item.children.length){
              $this.isAllA7Product = true;
            }else{
              $this.isAllA7Product = false;
            }
          }
        });
        $this.allProductSelectedStatus();
      },
      handleCheckedA8ProductChange(e){
        var $this = this;
        var checkedCount = e.length;
        $this.productList.forEach(function(item,index){
          if(item.icon=="a8"){
            if(checkedCount === item.children.length){
              $this.checkAllA8Product = true;
            }else{
              $this.checkAllA8Product = false;
            }
            if(checkedCount>0&&checkedCount<item.children.length){
              $this.isAllA8Product = true;
            }else{
              $this.isAllA8Product = false;
            }
          }
        });
        $this.allProductSelectedStatus();
      },
      handleCheckedA9ProductChange(e){
        var $this = this;
        var checkedCount = e.length;
        $this.productList.forEach(function(item,index){
          if(item.icon=="a9"){
            if(checkedCount === item.children.length){
              $this.checkAllA9Product = true;
            }else{
              $this.checkAllA9Product = false;
            }
            if(checkedCount>0&&checkedCount<item.children.length){
              $this.isAllA9Product = true;
            }else{
              $this.isAllA9Product = false;
            }
          }
        });
        $this.allProductSelectedStatus();
      },
      handleCheckedA10ProductChange(e){
        var $this = this;
        var checkedCount = e.length;
        $this.productList.forEach(function(item,index){
          if(item.icon=="a10"){
            if(checkedCount === item.children.length){
              $this.checkAllA10Product = true;
            }else{
              $this.checkAllA10Product = false;
            }
            if(checkedCount>0&&checkedCount<item.children.length){
              $this.isAllA10Product = true;
            }else{
              $this.isAllA10Product = false;
            }
          }
        });
        $this.allProductSelectedStatus();
      },
      handleCheckedA11ProductChange(e){
        var $this = this;
        var checkedCount = e.length;
        $this.productList.forEach(function(item,index){
          if(item.icon=="a11"){
            if(checkedCount === item.children.length){
              $this.checkAllA11Product = true;
            }else{
              $this.checkAllA11Product = false;
            }
            if(checkedCount>0&&checkedCount<item.children.length){
              $this.isAllA11Product = true;
            }else{
              $this.isAllA11Product = false;
            }
          }
        });
        $this.allProductSelectedStatus();
      },
      handleCheckedA12ProductChange(e){
        var $this = this;
        var checkedCount = e.length;
        $this.productList.forEach(function(item,index){
          if(item.icon=="a12"){
            if(checkedCount === item.children.length){
              $this.checkAllA12Product = true;
            }else{
              $this.checkAllA12Product = false;
            }
            if(checkedCount>0&&checkedCount<item.children.length){
              $this.isAllA12Product = true;
            }else{
              $this.isAllA12Product = false;
            }
          }
        });
        $this.allProductSelectedStatus();
      },
      handleCheckedA13ProductChange(e){
        var $this = this;
        var checkedCount = e.length;
        $this.productList.forEach(function(item,index){
          if(item.icon=="a13"){
            if(checkedCount === item.children.length){
              $this.checkAllA13Product = true;
            }else{
              $this.checkAllA13Product = false;
            }
            if(checkedCount>0&&checkedCount<item.children.length){
              $this.isAllA13Product = true;
            }else{
              $this.isAllA13Product = false;
            }
          }
        });
        $this.allProductSelectedStatus();
      },
      // 全选按钮状态事件
      allProductSelectedStatus(){
        var $this = this;
        var totalCheckedCount = $this.checkedA1Product.length+$this.checkedA2Product.length+$this.checkedA3Product.length+$this.checkedA4Product.length+$this.checkedA5Product.length+$this.checkedA6Product.length+$this.checkedA7Product.length+$this.checkedA8Product.length+$this.checkedA9Product.length+$this.checkedA10Product.length+$this.checkedA11Product.length+$this.checkedA12Product.length+$this.checkedA13Product.length;
        if(totalCheckedCount>0&&totalCheckedCount<$this.productCount){
          $this.isAllProduct = true;
        }else{
          $this.isAllProduct = false;
        }
        if(totalCheckedCount == $this.productCount){
          $this.checkAllProduct = true;
        }else{
          $this.checkAllProduct = false;
        }
      },
    }
  }
</script>
<style scoped lang="scss">
.el-checkbox.is-bordered{
  margin-right: 0
}
.depart-index .ChannelTab .ChannelMain .ChannelItem .date-range{
  width: 220px;
  margin: 3px;
}
.depart-index .ChannelTab .ChannelMain .Channeltit{
    font-size: 15px;
    line-height: 28px;
    margin-right: 10px;
    margin-top: 4px;
    margin-bottom: 4px;
    vertical-align: top;
    display: inline-block;
    width: 90px;
    text-align: right;
    color: #000;
}
.depart-index .ChannelTab .ChannelMain .ChannelItem .team-list{
  display: inline-block;
}
.depart-index .ChannelTab .ChannelMain .ChannelItem .el-checkbox{
  margin: 4px!important;
}
.depart-index .team-list {
    display: inline-block;
    vertical-align: middle;
}
.WebServerAddEditBtn.ChinaphoneTwoBtn{
  margin-top: 10px;
}
</style>