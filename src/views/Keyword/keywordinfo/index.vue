<template>
  <div class="page-root" ref="boxPane">
    <div class="abs-panel" ref="mainPane">
      <div class="scroll-panel" ref="scrollDom" style="will-change:scroll-position">
        <div class="true-height" ref="scrollPane">
          <p class="breadcrumb" ref="breadcrumbPane">
            <router-link class="breadcrumb-link" to="/"><span>首页</span></router-link>
            <template v-for="item in breadcrumbList">
              <router-link class="breadcrumb-link" :to="item.router" v-bind:key="item.id" v-if="item.router!=''"><b>-</b><span>{{item.title}}</span></router-link>
              <span v-else class="breadcrumb-link" v-bind:key="'last-' + item.id"><b>-</b><span>{{item.title}}</span></span>
            </template>
            <span class="breadcrumb-link"><b>-</b><span>搜索词趋势</span></span>
          </p>
          <el-card class="box-card" shadow="hover">
            <div slot="header">
              <div class="card-header" ref="headerPane">
                <div class="search-wrap" ref="searchPane">
                  <div class="item-search">
                    <el-date-picker
                      v-model="searchData.dateValue"
                      @change="searchResult"
                      type="daterange"
                      format="yyyy/MM/dd"
                      value-format="yyyy/MM/dd"
                      key="a"
                      size="mini"
                      class="date-range"
                      range-separator="～"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      :picker-options="pickerDateRangeMonthOptions">
                    </el-date-picker>
                  </div>
                  <div class="item-search">
                    <el-button class="item-input" :class="isSearchResult?'isDisabled':''" :disabled="isSearchResult" type="primary" size="small" icon="el-icon-search" @click="searchResult">查询</el-button>
                    <el-button type="info" class="resetBtn" size="small" v-on:click="resetData()">重置</el-button>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="chartData" class="card-content" ref="tableContent">
              <div v-for="(item, index) in chartData" :key="index" class="item-chart">
                <div class="chart-header">{{ keyword }} - {{ item.typeName }}</div>
                <div class="chart-wrap">
                  <lineChart :chart-data="item.data" :id="item.type"></lineChart>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
    <el-backtop target=".scroll-panel"></el-backtop>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { indices } from '@/api/keyword'
import { pickerDateRangeMonthOptions } from "@/utils/index"
import lineChart from "../components/lineChart";
export default {
  name: 'Keyword_keywordinfo',
  components:{
    lineChart,
  },
  data() {
    return {
      breadcrumbList:[],
      menuButtonPermit:[],
      chartData:[],
      keyword: '',
      searchData:{
        id: '',
        dateValue: []
      },
      pickerDateRangeMonthOptions: pickerDateRangeMonthOptions,
      isSearchResult:false,
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'menuData'
    ]),
  },
  mounted(){
    const $this = this;
    if(!$this.sidebar.opened){
      $this.$store.dispatch('app/toggleSideBar');
    }
  },
  created(){
    var $this = this;
    $this.searchData.dateValue = $this.getNearDay();
    $this.getRouterQuery()
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
    // 搜索点击事件
    searchResult(){
      var $this = this;
      if(!$this.isSearchResult){
        $this.isSearchResult=true;
        // $this.searchData.page = 1;
        $this.initPage();
      }
    },
    // 重置表单
    resetData(){
        var $this = this;
        $this.searchData.dateValue = $this.getNearDay();
        // $this.searchData.page=1;
        // $this.searchData.limit=50;
        $this.searchResult();
    },
    // 获取路由参数
    getRouterQuery(){
      var $this = this;
      var id = $this.$route.query.id;
      if(id&&id!=''){
        $this.searchData.id=id;
      }
    },
    // 初始化数据
    initData(){
      var $this = this;
      $this.getUserMenuButtonPermit();
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
            if($this.menuButtonPermit.includes('Keyword_keywordinfo')){
              $this.initPage()
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
    // 初始化页面信息
    initPage(){
      var $this = this;
      if ($this.searchData.id && $this.searchData.id !== '') {
        var formData = {}
        formData.id = $this.searchData.id;
        if ($this.searchData.dateValue && $this.searchData.dateValue.length > 0) {
          formData.starttime = $this.searchData.dateValue[0]
          formData.endtime = $this.searchData.dateValue[1]
        } else {
          formData.starttime = ''
          formData.endtime = ''
        }
        document.getElementsByClassName("scroll-panel")[0].scrollTop = 0;
        indices.stats.info(formData).then(response=>{
          console.log(response, '指数趋势')
            if(response){
              if(response.status){
                if(response.data){
                  $this.keyword = response.data['baidu'][0].word
                  var chartDataBaidu=[];
                  response.data['baidu'].forEach(function(item,index){
                    var itemObj={};
                    var itemTime=item.time.split('-');
                    itemObj.name = itemTime[1]+'-'+itemTime[2]+"\n"+item.week.replace("星期","周");
                    itemObj.value = item.number ? item.number : 0;
                    chartDataBaidu.push(itemObj);
                  });
                  $this.chartData.push({
                    type: 'baidu',
                    typeName: '百度指数',
                    data: chartDataBaidu
                  })
                  var chartDataTouTiao=[];
                  response.data['toutiao'].forEach(function(item,index){
                    var itemObj={};
                    var itemTime=item.time.split('-');
                    itemObj.name = itemTime[1]+'-'+itemTime[2]+"\n"+item.week.replace("星期","周");
                    itemObj.value = item.number ? item.number : 0;
                    chartDataTouTiao.push(itemObj);
                  });
                  $this.chartData.push({
                    type: 'toutiao',
                    typeName: '巨量（头条）指数',
                    data: chartDataTouTiao
                  })
                  var chartDataDouyin=[];
                  response.data['douyin'].forEach(function(item,index){
                    var itemObj={};
                    var itemTime=item.time.split('-');
                    itemObj.name = itemTime[1]+'-'+itemTime[2]+"\n"+item.week.replace("星期","周");
                    itemObj.value = item.number ? item.number : 0;
                    chartDataDouyin.push(itemObj);
                  });
                  $this.chartData.push({
                    type: 'douyin',
                    typeName: '巨量（抖音）指数',
                    data: chartDataDouyin
                  })
                  var chartData360=[];
                  response.data['360'].forEach(function(item,index){
                    var itemObj={};
                    var itemTime=item.time.split('-');
                    itemObj.name = itemTime[1]+'-'+itemTime[2]+"\n"+item.week.replace("星期","周");
                    itemObj.value = item.number ? item.number : 0;
                    chartData360.push(itemObj);
                  });
                  $this.chartData.push({
                    type: '360',
                    typeName: '360指数',
                    data: chartData360
                  })
                  setTimeout(()=>{
                    $this.isSearchResult=false;
                  },1000);
                }
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
                  setTimeout(()=>{
                    $this.isSearchResult=false;
                  },1000);
                }
              }
            }
        });
      }
    },
    // 重置搜索数据
    resetSearchData(){
      var $this = this;
      $this.searchData.dateValue = [];
      // $this.searchData.page = 1;
      // $this.searchData.limit = 50;
    },
    getNearDay(){
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      // end.setTime(end.getTime());
      // end.setTime(end.getTime() + 3600 * 1000 * 24 * 1);
      var startYear = start.getFullYear();
      var startMonth = start.getMonth() +1;
      var startDay = start.getDate();
      var endYear = end.getFullYear();
      var endMonth = end.getMonth() + 1;
      // var endDay = end.getDate()-1;
      var endDay = end.getDate();
      startMonth = startMonth<10?'0'+startMonth:startMonth;
      startDay = startDay<10?'0'+startDay:startDay;
      endMonth = endMonth<10?'0'+endMonth:endMonth;
      endDay = endDay<10?'0'+endDay:endDay;
      var startDate = startYear+"/"+startMonth+"/"+startDay;
      var endDate = endYear+"/"+endMonth+"/"+endDay;
      return [startDate,endDate];
    }
  }
}
</script>
<style lang="scss" scoped>
.search-wrap{
  .item-search{
    float:left;
    padding: 10px 10px 10px 0;
  }
  .input-panel{
    width: 190px;
  }
  .select-panel{
    width: 150px;
  }
}
.item-chart{
  width: 100%;
  height: 400px;
  background: #fff;
  display: flex;
  padding: 20px;
  flex-direction: column;
  .chart-header{
    padding-bottom: 10px;
    text-align: center;
    font-weight: bold;
  }
  .chart-wrap{
    flex: 1;
    position: relative;

  }
}
.item-chart+.item-chart{
  margin-top: 20px;
}
</style>