<template>
  <div class="page-root flex-box no-padding depart-index cn-phone-stat five_depart" ref="boxPane">
    <div class="flex-content relative">
      <div class="abs-panel" ref="mainPane">
        <div class="scroll-panel" ref="scrollPane">
          <el-card class="box-card scroll-card" shadow="hover">
              <div class="card-content ChinaphoneTwoBox" ref="tableContent">
                  <div class="ChinaphoneTwo buttonTwo">
                    <div class="group-body">
                      <div class="team-panel">
                        <div class="team-header">
                          <span class="require">品牌：</span>
                          <el-checkbox class="all-select" :indeterminate="isAllBrand" border size="mini" v-model="checkAllBrand" @change="handleCheckAllBrandChange">全选</el-checkbox>
                          <el-checkbox-group class="team-list" v-model="checkedBrand" @change="handleCheckedBrandChange" size="mini">
                            <el-checkbox class="item-checkbox" v-for="item in brandList" :label="item.value" :key="item.id" border>{{item.label}}</el-checkbox>
                          </el-checkbox-group>
                        </div>

                        <div class="team-header">
                            <div class="team-headerItem">
                              <span class="require">日期：</span>
                              <div class="date_time">
                                <el-date-picker
                                  v-model="searchData.date"
                                  size="mini"
                                  type="monthrange"
                                  align="right"
                                  value-format = "yyyy-MM"
                                  unlink-panels
                                  range-separator="至"
                                  start-placeholder="开始日期"
                                  end-placeholder="结束日期"
                                  :picker-options="pickerRangeOptions"
                                  :class="searchData.date&&searchData.date.length>0?'el-xzstate':''">
                                </el-date-picker> 
                              </div>       
                            </div>
                            <div class="team-headerItem">
                              <span class="require">分类：</span>
                              <div class="date_time">
                                <el-select v-model="searchData.typekey" size="mini" clearable placeholder="分类" :class="searchData.typekey!=''?'el-xzstate':''">
                                      <el-option
                                          v-for="item in productTypeList"
                                          :key="item.value"
                                          :label="item.label"
                                          :value="item.value">
                                      </el-option>
                                </el-select>
                              </div>       
                            </div>
                            <div class="team-headerItem">
                              <span class="require">渠道：</span>
                              <div class="date_time">
                                <el-select v-model="searchData.mode" size="mini" clearable placeholder="渠道" :class="searchData.mode!=''?'el-xzstate':''">
                                      <el-option
                                          v-for="item in sourceList"
                                          :key="item.value"
                                          :label="item.label"
                                          :value="item.value">
                                      </el-option>
                                </el-select>
                              </div>       
                            </div>
                        </div>

                        <div class="team-header">
                          <span class="require">分析项：</span>
                          <el-checkbox class="all-select" :indeterminate="isAllItem" border size="mini" v-model="checkAllItem" @change="handleCheckAllItemChange">全选</el-checkbox>
                          <el-checkbox-group class="team-list" v-model="checkedItem" @change="handleCheckedItemChange" size="mini">
                            <el-checkbox class="item-checkbox" v-for="item in resaultShowList" :label="item.value" :key="item.id" border>{{item.label}}</el-checkbox>
                          </el-checkbox-group>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="card-header WebServerAddEditBtn ChinaphoneTwoBtn">
                      <el-button type="primary" class="updateBtn"  :class="isDisabled?'isDisabled':''" :disabled="isDisabled"  size="small" v-if="menuButtonPermit.includes('Fivedepart_Intentioncount')" v-on:click="getCluesAnalysisData"><i class="svg-i planeWhite" ><svg-icon icon-class="planeWhite" /></i>生成数据</el-button>
                      <el-button type="primary" class="resetBtn" size="small" v-on:click="resetData()">重置</el-button>
                  </div>
              </div>
          </el-card>
          <el-card class="box-card scroll-card result-panel" shadow="hover" v-if="isSearch" id="canvasPane" ref="canvasPane">
              <default-chart
                v-if="checkedItem.includes(1) && searchResult.departxun.length>0"
                :itemData="searchResult.resXunData" 
                ></default-chart>
            
              <default-chart
                v-if="checkedItem.includes(2) && searchResult.avgscore.length>0"
                :itemData="searchResult.resScoreData" 
                ></default-chart>

              <template v-if="checkedItem.includes(3)">
                <template v-if="searchResult.resCountryData.length>0" v-for="item in searchResult.resCountryData">
                  <map-chart
                    :item-data="item" 
                    :judge-data="judgeData"
                    :is-cn="false"
                  ></map-chart>
                </template>
              </template>
          </el-card>
        </div>
      </div>
    </div>
    <el-backtop target=".scroll-panel"></el-backtop>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import * as echarts from 'echarts';
import defaultChart from "../components/Intentioncount/defaultChart.vue";
import mapChart from "../components/Intentioncount/mapChart.vue";
import {groupColor, singleArrColor, sortByDesc, randomString, pickerDayRangeOptions} from "@/utils/index";
import {MapInterval,TopTenColor} from "@/utils/MapColor"
import { worldCountry } from "@/utils/worldCountry";
export default {
  name: 'intentioncount',
  components: {
    defaultChart,
    mapChart
  },
  data() {
    return {
      isSearch:false,
      defaultData:{},
      menuButtonPermit:[],
      searchData:{
        date:[],
        typekey: "",
        mode: ""
      },
      pickerRangeOptions: {
        shortcuts: [{
          text: '本月',
          onClick(picker) {
            picker.$emit('pick', [new Date(), new Date()]);
          }
        }, {
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
      searchResult:{
        departxun:[],
        avgscore:[],
        provincemap:[],
        resXunData: {},
        resScoreData: {},
        resCountryData: []
      },
      isDisabled:false,
      chartlist:{
        trendInqueryPlot:'',
        trendScorePlot:'',
        trendCountryPlot:''
      },
      brandList: [
        {id: 1, value: 1, label: "红星"},
        {id: 2, value: 2, label: "富特"},
        {id: 5, value: 5, label: "中德"}
      ],
      resaultShowList:[
        {id:1,value:1,label:"意向询盘占比"},
        {id:2,value:2,label:"平均意向分"},
        {id:3,value:3,label:"意向询盘国家"}
      ],
      isAllItem:false,
      checkAllItem:false,
      checkedItem:[],
      isAllBrand: false,
      checkAllBrand: false,
      checkedBrand: [],
      tableTitle:[],
      minWidth:"",
      mapRatio:0.45,
      judgeData: {
        singleGroupStatic: false,          // 单基础部门统计
        singleGroupDateCompare: false,     // 单基础部门时间对比
        singleGroupTeamCompare: true,    // 单基础部门与其他部门对比
        pluralGroupStatic: false,         // 多基础部门统计
        pluralGroupDateCompare: false,     // 多基础部门的时间对比
        pluralGroupTeamCompare: false,     // 多基础部门与其他部门对比
        pluralGroupTeamSameCompare: false, // 多基础部门与其他部门对比，且有部门同时存在于基础部门与对比部门
      },
      productTypeList: [],
      sourceList: [],
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'sidebar',
      'menuData'
    ]),
    isCollapse() {
      return this.sidebar.opened
    }
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
  mounted(){
    const $this = this;
    if($this.$refs.boxPane){  
      $this.minWidth = $this.$refs.boxPane.offsetWidth; 
    }
    window.onresize = () => {
      return (() => {
        if($this.$refs.boxPane){
          $this.minWidth = $this.$refs.boxPane.offsetWidth; 
        }
      })()
    }
  },
  created(){
    var $this = this;
    $this.initData();
  },
  methods:{
    // 重置选择项
    resetData(){
      var $this = this;
      $this.isSearch = false;
      $this.searchData.date=[];
      $this.searchData.typekey = "";
      $this.searchData.mode = "";
      $this.searchResult.departxun=[];
      $this.searchResult.avgscore=[];
      $this.searchResult.provincemap=[];
      $this.searchResult.resXunData={};
      $this.searchResult.resScoreData={};
      $this.searchResult.resCountryData={};
      $this.isAllItem = false;
      $this.checkAllItem = false;
      $this.checkedItem = [];
      $this.isAllBrand = false;
      $this.checkAllBrand = false;
      $this.checkedBrand = [];
    },
    // 初始化数据
    initData(){
      var $this = this;
      $this.getUserMenuButtonPermit();
    },
    // 组装搜索接口所需数据
    initSearchData(){
      var $this = this;
      var searchData = {};
      if($this.searchData.date&&$this.searchData.date.length>0){
        searchData.starttime = $this.searchData.date[0];
        searchData.endtime = $this.searchData.date[1];
      }else{
        searchData.starttime = "";
        searchData.endtime = "";
      }
      searchData.type = $this.checkedItem;
      searchData.brand_id = $this.checkedBrand;
      searchData.typekey = $this.searchData.typekey;
      searchData.mode = $this.searchData.mode;
      return searchData;
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
            if(!$this.menuButtonPermit.includes('Fivedepart_Intentioncount')){
              $this.$message({
                showClose: true,
                message: "未被分配该页面的访问权限",
                type: 'error',
                  duration:6000
              });
              $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
            }else{
              $this.getConditionList();
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
    // 获取条件列表
    getConditionList(){
        var $this = this;
        $this.$store.dispatch('depfive/depfiveEnConditionAction', null).then(response=>{
          if(response.status){
            var productTypeList = [];
            if(response.producttype && response.producttype.length > 0){
              response.producttype.forEach(function(item,index){
                var itemData = {};
                itemData.label = item.name;
                itemData.value = item.id;
                productTypeList.push(itemData);
              });
            }
            
            $this.productTypeList = productTypeList;  
            var sourceList = [];
            if(response.source&&response.source.length > 0){
              response.source.forEach(function(item,index){
                var itemData = {};
                itemData.label = item.name;
                itemData.value = item.id;
                sourceList.push(itemData);
              });
            }
            $this.sourceList = sourceList;    
          }
        });
    },
    // 获取统计数据
    getCluesAnalysisData(){
      var $this = this;
      if(!$this.isDisabled){
        var searchData = $this.initSearchData();
        // if(searchData.brand_id.length == 0){
        //   $this.$message({
        //       showClose: true,
        //       message: '错误：请至少选择一个品牌！',
        //       type: 'error'
        //   });
        //   return false;
        // }
        if($this.searchData.date.length == 0){
          $this.$message({
              showClose: true,
              message: '错误：请选择查询时间范围！',
              type: 'error'
          });
          return false;
        }
        if(searchData.type.length == 0){
          $this.$message({
              showClose: true,
              message: '错误：请至少选择一个分析项！',
              type: 'error'
          });
          return false;
        }
        $this.isDisabled=true;
        $this.$store.dispatch('depfive/depfiveIntentionCountAction', searchData).then(response=>{
          if(response){
            if(response.status){
              $this.isSearch=true;
              // 询盘趋势内容处理
              $this.searchResult.departxun = response.departxun ? response.departxun : [];
              var resXunData = {}
              resXunData.name = "意向询盘占比统计";
              resXunData.chartTitle = "意向询盘占比月趋势(意向询盘/部门总询盘)";
              resXunData.unit = "（单位：%）";
              resXunData.chartType = "area";
              var mainXunData = [];
              var totalXunChart = [];
              if(response.departxun && response.departxun.length > 0){
                var chartXunData = groupColor(response.departxun);
                chartXunData.forEach(function(item,index){
                    var newItemArr=[];
                    item.forEach(function(item1){
                        var itemChart = {};
                        itemChart.name=item1.depart;
                        itemChart.key = item1.date;
                        itemChart.value = item1.number;
                        itemChart.number = item1.goodnumber;
                        itemChart.color = item[0].color;
                        newItemArr.push(itemChart);   
                    });
                    mainXunData.push(newItemArr);
                });

                response.departxun.forEach(function(item){
                  if(item.length > 0){
                    var itemChart = {};
                    var totalnum = item.reduce((prev,next) => {
                      return prev + Number(next.number)
                    },0);
                    itemChart.name = item[0].depart;
                    itemChart.value = Math.floor(totalnum/(item.length)*100)/100;
                    totalXunChart.push(itemChart);
                  }
                });
              }
              
              resXunData.mainData = mainXunData;
              resXunData.totalChart = singleArrColor(totalXunChart);
              resXunData.totalChart.sort(sortByDesc("value"));
              resXunData.randomStr = "yMfy";
              resXunData.formatLabel = true;
              $this.searchResult.resXunData = resXunData;
              // 积分趋势内容处理
              $this.searchResult.avgscore = response.avgscore ? response.avgscore : [];
              var resScoreData = {}
              resScoreData.name = "平均意向分统计";
              resScoreData.chartTitle = "平均意向分月趋势";
              resScoreData.unit = "（单位：分）";
              resScoreData.chartType = "area";
              var mainScoreData = [];
              var totalScoreChart = [];
              if(response.avgscore && response.avgscore.length > 0){
                var chartScoreData = groupColor(response.avgscore);
                chartScoreData.forEach(function(item,index){
                    var newItemArr=[];
                    item.forEach(function(item1){
                        var itemChart = {};
                        itemChart.name=item1.depart;
                        itemChart.key = item1.date;
                        itemChart.value = Math.floor(item1.avgsocre*100)/100;
                        itemChart.color = item[0].color;
                        newItemArr.push(itemChart);   
                    });
                    mainScoreData.push(newItemArr);
                });

                response.avgscore.forEach(function(item){
                  if(item.length > 0){
                    var itemChart = {};
                    var totalnum = item.reduce((prev,next) => {
                      return prev + Number(next.avgsocre)
                    },0);
                    itemChart.name = item[0].depart;
                    itemChart.value = Math.floor(totalnum/(item.length)*100)/100;
                    totalScoreChart.push(itemChart);
                  }
                });
              }
              
              resScoreData.mainData = mainScoreData;
              resScoreData.totalChart = singleArrColor(totalScoreChart);
              resScoreData.totalChart.sort(sortByDesc("value"));
              resScoreData.randomStr = "yMfy2";
              resScoreData.formatLabel = false;
              $this.searchResult.resScoreData = resScoreData;
              // 意向询盘国家处理
              $this.searchResult.provincemap = response.provincemap ? response.provincemap : [];
              var inquiryMapData = {};
              var mapData = [];
              var dataArr = [];
              inquiryMapData.mapDataArr = [];
              var maxNumArr = [];
              var departArr = [];
              if(response.provincemap && response.provincemap.length > 0){
                dataArr = response.provincemap;
                dataArr.forEach(function(item){
                  var itemData = worldCountry(item,"country","number");
                  if(item.length > 0){
                    departArr.push(item[0].depart);
                  }else{
                    departArr.push("");
                  }
                  
                  mapData.push(itemData);
                });

                mapData.forEach(function(item,index){
                  maxNumArr.push(item[0].value)
                });
                maxNumArr.sort(function(a,b){return b-a});
                var maxNum = maxNumArr[0];
                mapData.forEach(function(item,index){
                  var itemChart = {};
                  itemChart.title = departArr[index];
                  itemChart.randomStr = randomString(4);
                  itemChart.mapData = item;
                  itemChart.colorData = MapInterval(maxNum);
                  var itemWidth = "50%";
                  var mapWidth = 0;
                  var mapHeight = 0;
                  if(mapData.length>4){
                    itemWidth = "33%";
                    mapWidth = parseInt(($this.minWidth-38)/3)-60;
                  }else{
                    itemWidth = parseInt(1/mapData.length*100)+"%";
                    if(mapData.length==2){
                      mapWidth = parseInt(($this.minWidth-38)/(mapData.length)*0.7)-60;
                    }else{
                      mapWidth = parseInt(($this.minWidth-38)/(mapData.length))-60;
                    }
                  }
                  mapHeight = parseInt(mapWidth*$this.mapRatio)+30;
                  itemChart.width = itemWidth;
                  itemChart.mapWidth = mapWidth;
                  itemChart.mapHeight = mapHeight;
                  itemChart.alias = "意向询盘个数";
                  itemChart.topTitle = "热门国家TOP15";
                  itemChart.topTenData = [];
                  itemChart.mapData.forEach(function(item,index){
                    if(index<15){
                      itemChart.topTenData.push(item);
                    }
                  });
                  itemChart.topTenColor = TopTenColor(itemChart.topTenData,itemChart.colorData);
                  inquiryMapData.mapDataArr.push(itemChart);
                });
              }
              
              inquiryMapData.title = "意向询盘 - 国家排行榜";
              inquiryMapData.unit = "（单位：个）";
              inquiryMapData.isMap = true;
              var mapResData = [];
              var mapInqury = [];
              mapInqury.push(inquiryMapData);
              mapResData.push(mapInqury);
              $this.searchResult.resCountryData = mapResData;

              $this.$nextTick(()=>{
                document.getElementById("canvasPane").scrollIntoView({behavior: "smooth"});
              });
              setTimeout(()=>{
                $this.isDisabled=false;
              },1000);
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
      }
    },
    // 分析项筛选
    handleCheckAllItemChange(e){
      var $this = this;
      if(e){
        var checkedItem = [];
        $this.resaultShowList.forEach(function(item,index){
          checkedItem.push(item.value);
        });
        $this.checkedItem = checkedItem;
        $this.checkAllItem= true;
      }else{
        $this.checkedItem = [];
        $this.checkAllItem = false;
      }
      $this.isAllItem = false;
    },
    handleCheckedItemChange(e){
      var $this = this;
      var checkedCount = e.length;
       if(checkedCount === $this.resaultShowList.length){
          $this.checkAllItem = true;
        }else{
          $this.checkAllItem = false;
        }
        if(checkedCount>0&&checkedCount<$this.resaultShowList.length){
          $this.isAllItem = true;
        }else{
          $this.isAllItem = false;
        }
    },
    // 品牌筛选
    handleCheckAllBrandChange(e){
      var $this = this;
      if(e){
        var checkedBrand = [];
        $this.brandList.forEach(function(item,index){
          checkedBrand.push(item.value);
        });
        $this.checkedBrand = checkedBrand;
        $this.checkAllBrand= true;
      }else{
        $this.checkedBrand = [];
        $this.checkAllBrand = false;
      }
      $this.isAllBrand = false;
    },
    handleCheckedBrandChange(e){
      var $this = this;
      var checkedCount = e.length;
       if(checkedCount === $this.brandList.length){
          $this.checkAllBrand = true;
        }else{
          $this.checkAllBrand = false;
        }
        if(checkedCount>0&&checkedCount<$this.brandList.length){
          $this.isAllBrand = true;
        }else{
          $this.isAllBrand = false;
        }
    },
  }
}
</script>
<style lang="scss" scoped>
.five_depart .team-header {
    margin-bottom: 10px;
}
.five_depart .team-header .date_time {
    display: inline-block;
    vertical-align: middle;
}
</style>