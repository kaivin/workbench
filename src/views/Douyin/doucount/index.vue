<template>
  <div class="page-root scroll-panel group-index" ref="boxPane"> 
    <p class="breadcrumb" ref="breadcrumbPane">
      <router-link class="breadcrumb-link" to="/"><span>首页</span></router-link>
      <template v-for="item in breadcrumbList">
        <router-link class="breadcrumb-link" :to="item.router" v-bind:key="item.id" v-if="item.router!=''"><b>-</b><span>{{item.title}}</span></router-link>
        <span v-else class="breadcrumb-link" v-bind:key="'last-' + item.id"><b>-</b><span>{{item.title}}</span></span>
      </template>
    </p>
    <div class="filter-panel" ref="filterbox">
      <div class="filter-list">
        <div class="item-filter flex-box group">
          <div class="filter-title"><span class="txt-title">账号：</span></div>
          <div class="filter-content flex-content">
            <div class="checked_item">
              <el-checkbox
                v-model="checkAll"
                :indeterminate="isIndeterminate"
                @change="handleCheckAllChange"
                ><span class="c_tit">全选</span></el-checkbox>
            </div>
            <div class="checked_item">
              <el-checkbox-group
                v-model="searchData.ids"
                @change="handleCheckedChange"
              >
                  <el-checkbox
                    v-for="item in groupList"
                    :key="item.id"
                    :label="item.id"
                    :value="item.id"
                    >
                    <span class="c_tit">{{item.name}}</span><b  class="c_name">[{{item.uname}}]</b>
                  </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="chartShow result-panel">
        <div id="chart"></div>
    </div>
  </div>
</template>
<script>
import {mapGetters} from 'vuex';
import * as echarts from 'echarts';
export default {
  name: 'Douyin_doucount',
  data() {
    return {
        menuButtonPermit:[],         //网页权限字段
        searchData:{
          ids:[]
        },
        scorelist:[],
        showChart: false,
        myChart:null,
        groupList: [],
        isIndeterminate: false,
        checkAll: false,
    };
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'menuData'
    ]),
    isOpen() {
      return this.sidebar.opened;
    },
  },
  created() {
    var $this = this;
    $this.getBreadcrumbList();
    $this.initData();
  },
  mounted(){
    const $this = this;
    window.addEventListener('resize',$this.echartsSize);
  },
  destroyed(){
    const $this = this;
    window.removeEventListener('resize', $this.echartsSize);
  },
  methods: {
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
          if(permitData.includes('Douyin_doucount')){
              $this.getDepartList();
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
    initData(){
      var $this = this;
      $this.getUserMenuButtonPermit();
    },
    // 获取部门列表
    getDepartList(){
      var $this = this;
      $this.$store.dispatch('douyin/douyinDepartlist', null).then(response=>{
        if(response){
          if(response.status){
            if(response.data){
              if(response.data.length > 0){
                var resList = [];
                response.data.forEach(item => {
                  var obj = {};
                  obj.id = item.id;
                  obj.name = item.name;
                  obj.uname = item.uname;
                  obj.department = item.department;
                  obj.isOn = false;
                  resList.push(obj);
                })
              }
              $this.groupList = resList;
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
                $this.isSaveData=false;
              },1000);
            }
          }
        }
      });
    },
    // 点击选中
    handleCheckedChange(e){
      var $this = this;
      var checkedCount = e.length;
      if(checkedCount === $this.groupList.length){
        $this.checkAll = true;
      }else{
        $this.checkAll = false;
      }
      if(checkedCount>0&&checkedCount<$this.groupList.length){
        $this.isIndeterminate = true;
      }else{
        $this.isIndeterminate = false;
      }
      $this.getDouyinCountData();
    },
    // 全选
    handleCheckAllChange(e){
      var $this = this;
      var checkedList = [];
      if(e){
        $this.groupList.forEach((item) =>{
          checkedList.push(item.id);
        })
        $this.searchData.ids = checkedList;
        $this.checkAll= true;
      }else{
        $this.searchData.ids = [];
        $this.checkAll= false;
      }
      $this.isIndeterminate = false;
      $this.getDouyinCountData();
    },
    // 获取抖音数据
    getDouyinCountData(){
      var $this = this;
      var formData = {};
      formData.ids = $this.searchData.ids;
      $this.$store.dispatch('douyin/douyinCountData', formData).then(response=>{
        if(response){
          if(response.status){
            if(response.data){
              var resList = []
              if(response.data.length > 0){
                response.data.forEach(item => {
                  var obj = {};
                  obj.addtime = item.addtime;
                  obj.user_data = item.user_data;
                  resList.push(obj);
                })
              }
              $this.scorelist = resList;
              if($this.myChart){
                $this.myChart.dispose();
                $this.drawAreaChart();
              }else{
                $this.drawAreaChart();
              }
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
                $this.isSaveData=false;
              },1000);
            }
          }
        }
      });
    },
    // 曲线图
    drawAreaChart(){
      var $this = this;
      if($this.scorelist.length>0){
        var chartDom = document.getElementById('chart');
        var myChart = echarts.init(chartDom);
        var option;
        option = {
          grid:{
            left: '45',
            top:'25',
            right:'15',
            bottom: '25'
          },
          tooltip:{
            show: true,
            trigger: "axis",
            axisPointer: {
              type: "line", 
              lineStyle:{
                color: "#5b8ff9"
              }
            },
            textStyle:{
                fontSize:12,
                color: '#666'
            },
            formatter(params){
              return `<div class="toolDiv">
                    <div class="tooltitle">${params[0].name}</div>
                    <div class="bar clearfix">
                      <span style="display:inline-block;vertical-align:middle;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#0970ff;"></span>
                      <span>${params[0].seriesName}：</span>
                      <span>${params[0].data.user_data}</span>
                    </div>
                  </div>`;
            }
          },
          xAxis: {
            type: 'category',
            name: "次数",
            axisLine:{
              lineStyle:{
                color: "#dedede"
              }
            },
            axisLabel:{
              color: "#888"
            }
          },
          yAxis: {
            type: 'value',
            axisLabel:{
              color: "#888"
            }
          },
          dataset:{
            source: $this.scorelist,  
          },
          animation: false,
          series: [
            {
              name: "积分",
              type: 'line',
              symbol: 'circle',
              symbolSize: '5',
              label:{
                show: true,
                position: 'top',
                distance: '5'
              },
              itemStyle:{
                color: '#fff',
                borderColor: "#0970ff",
                borderWidth: 1
              },
              lineStyle:{
                color: "#0970ff",
                width: 1
              },
              emphasis:{
                lineStyle: {
                  width: 2,
                },
                itemStyle:{
                  borderWidth: 2
                }
              }
            }
          ]
        };

        option && myChart.setOption(option);
        $this.myChart = myChart;
      }
    },
    echartsSize(){
      if(this.myChart){
          this.myChart.resize();
      }
    }
  }
}
</script>
<style scoped>

  .chartShow{
    margin-top: 20px;
    padding: 20px;
    background-color: #fff;
    height: calc(100vh - 396px);
    #chart{
      height: calc(100vh - 436px);
    }
  }
  .checked_item .c_tit, .checked_item .c_name{
    font-size: 14px;
    display: inline-block;
    height: 28px;
    line-height: 28px;
    color: #1a1a1a;
  }
  .checked_item .c_name {
    font-weight: normal;
    color: #808080;
    margin-left: 4px;
  }
  .checked_item .el-checkbox{
    min-width: 280px;
    margin: 3px;
  }
  .checked_item .is-checked .c_tit, .checked_item .is-checked .c_name{
    color: #0970ff;
  }
</style>