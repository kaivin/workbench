<template>
    <div class="page-root scroll-panel depart-index" ref="boxPane">  
      <div class="filter-panel" ref="filterbox">
        <div class="filter-list">
          <div class="item-filter flex-box group">
            <div class="filter-title"><span class="txt-title">日期：</span></div>
            <div class="filter-content flex-content">
              <div class="item-list">
                <div class="item-date">
                  <el-date-picker
                      v-model="searchData.data"
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
        </div>
      </div>
      <div class="chartShow result-panel">
          <default-chart
          v-if="showChart"
          :itemData="sourceData" 
          ></default-chart>
      </div>
    </div>
  </template>
  <script>
  import {mapGetters} from 'vuex';
  import defaultChart from "../components/scoretrend/defaultChart.vue";
  import {groupColor, singleArrColor, sortByDesc, randomString} from "@/utils/index"
  export default {
    name: 'Fivedepart_scoretrend',
    components: {
      defaultChart,
    },
    data() {
      return {
          menuButtonPermit:[],         //网页权限字段
          searchData:{
            data:[]
          },
          searchTime: '',
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
                start.setMonth(start.getMonth() - 6);
                picker.$emit('pick', [start, end]);
              }
            }]
          },
          scorelist:[],
          sourceData: {},
          showChart: false
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
      $this.searchData.data=$this.getNearMonth();
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
            if(permitData.includes('Fivedepart_scoretrend')){
                $this.getScoreTrendList()
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
      // 获取成交积分列表
      getScoreTrendList(){
        var $this = this;
        var searchData={};
        searchData=$this.initsearch();
        $this.$store.dispatch('depfive/depfiveScoreTrendAction', searchData).then(res=>{
            $this.scorelist = JSON.parse(JSON.stringify(res.monthscoretrendcompare));
            var resSourceData = {}
            resSourceData.name = "各部门成交积分统计";
            resSourceData.chartTitle = "各部门成交积分月趋势对比";
            resSourceData.unit = "（单位：分）";
            resSourceData.chartType = "area";
            var mainData = [];
            var chartData = groupColor(res.monthscoretrendcompare);
            var totalChart = [];
            if(res.monthscoretrendcompare && res.monthscoretrendcompare.length > 0){
              chartData.forEach(function(item,index){
                var newItemArr=[];
                item.forEach(function(item1){
                    var itemChart = {};
                    itemChart.name=item1.depart;
                    itemChart.key = item1.date;
                    itemChart.value = Math.floor(item1.score*100)/100;
                    itemChart.color = item[0].color;
                    newItemArr.push(itemChart);   
                });
                mainData.push(newItemArr);
              });
              res.monthscoretrendcompare.forEach(function(item){
                if(item.length > 0){
                  var itemChart = {};
                  var totalnum = item.reduce((prev,next) => {
                    return prev + Number(next.score)
                  },0);
                  itemChart.name = item[0].depart;
                  itemChart.value = Math.floor(totalnum*100)/100;
                  totalChart.push(itemChart);
                }
              });
            }
            
            resSourceData.mainData = mainData;
            resSourceData.totalChart = singleArrColor(totalChart);
            resSourceData.totalChart.sort(sortByDesc("value"));
            // resSourceData.randomStr = randomString(4);
            resSourceData.randomStr = "yMfy"
            $this.sourceData = resSourceData;
            $this.showChart = true;
        });
      },
      //点击时间搜索
      handleData(){
        var $this=this;
        $this.getScoreTrendList();
      },
      // 重置搜索数据
      ChannelBtn(){
          var $this=this;
          $this.searchData.data=$this.getNearMonth();
      },
      //重组搜索数据
      initsearch(){
        var $this = this;
        var searchData={};
        if($this.searchData.data&&$this.searchData.data.length>0){
          searchData.starttime=$this.searchData.data[0];
          searchData.endtime=$this.searchData.data[1];
          $this.searchTime=$this.searchData.data[0]+' ~ '+$this.searchData.data[1];
        }else{
            $this.searchTime='';
        }
        return searchData;
      },
      // 最近六个月时间周期
      getNearMonth(){
        const end = new Date();
        const start = new Date();
        start.setMonth(start.getMonth() - 5);
        var startYear = start.getFullYear();
        var startMonth = start.getMonth() +1;
        var endYear = end.getFullYear();
        var endMonth = end.getMonth() + 1;
        startMonth = startMonth<10?'0'+startMonth:startMonth;
        endMonth = endMonth<10?'0'+endMonth:endMonth;
        var startDate = startYear+"-"+startMonth;
        var endDate = endYear+"-"+endMonth;
        return [startDate,endDate];
      }
    }
  }
</script>
<style></style>