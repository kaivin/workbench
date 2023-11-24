<template>
    <div class="page-root scroll-panel depart-index" ref="boxPane">  
        <div class="ChannelTab">
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
                        @change="handleData"
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
                      <i class="ChannelBtn" v-on:click="ChannelBtn">重置</i>
                  </div>                
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
                $this.getContientList()
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
        $this.getSearchData();
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
          $this.getSearchData();
      },
      //点击时间搜索
      handleData(){
        var $this=this;
        $this.getSearchData();
      },
      // 重置搜索数据
      ChannelBtn(){
          var $this=this;
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
        return searchData;
      },
      getSearchData(){
        var $this = this;
        var searchData={};
        searchData=$this.initsearch();
        $this.$store.dispatch('depcomm/depcomCountryXunAction', searchData).then(res=>{
            if(res.status){
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
      }
    }
  }
</script>
<style scoped lang="scss">
.el-checkbox.is-bordered{
  margin-right: 0
}
.depart-index .ChannelTab .ChannelMain .ChannelItem .date-range{
  width: 220px;
}
.depart-index .ChannelTab .ChannelMain .Channeltit{
  width:auto;
}
.depart-index .ChannelTab .ChannelMain .ChannelItem .team-list{
  display: inline-block;
  margin-left: 10px;
}
</style>