<template>
  <div class="hxpage">
    <div class="title-view">
      <div class="title">100万成交数量</div>
      <router-link :to="{path:language == '中文'?'/stat/cn/departAnalysis':'/stat/en/departAnalysis',query:{type:9,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}}" tag="a" target="_blank" class="more">详情 <i class="svg-i"><svg-icon icon-class="rt-more"></svg-icon></i></router-link>
    </div>
    <div class="mix_body">
      <div class="contrast-view">
        <div class="redtext">{{totalXpanYears}}</div>
        <div class="redright">
          <div class="conname">环比上年同期</div>
          <div class="num up" v-if="isUp"><i class="svg-i"><svg-icon icon-class="data-up" /></i>{{isUpNum}}</div>
          <div class="num down" v-else><i class="svg-i"><svg-icon icon-class="data-down" /></i>{{isUpNum}}</div>
        </div>
      </div>
      <div class="chart-top" id="DealYearsChartTop"></div>
    </div>   
  </div>
</template>

<script>
import * as echarts from 'echarts';
import {parseTime} from "@/utils";
import { mapGetters } from 'vuex'
export default {
    name:'demo',

    data(){
      return {
        isUp:true,
        isUpNum:0,
        myChart:null,
        startTime:"",
        endTime:"",
        baseDepart:"",
        contrastDepart:"",
      }
    },
    props:{
      language:{
        type:String,
        default:"中文"
      },
      yearsanumbertong:{
        type:Array,
        default:function(){
          return []
        }
      },
      departList:{
        type:Array,
        default:function(){
          return []
        }
      },
      year:{
        type: Number,
        default: new Date().getFullYear()
      },
    },
    watch:{
      yearsanumbertong:{
        handler(val,oldval){
          this.goPage();
          this.costAverageChart(val);
          this.setIsUp(val);
        },
        deep:true
      },
      isCollapse(){
        setTimeout(() => {
          this.echartsSize();
        }, 200)
      }
    },
    computed:{
      totalXpanYears(){
        let total = 0;
        for(let i = 0;i<this.yearsanumbertong.length;i++){
          total+=this.yearsanumbertong[i].a_number
        }
        return total.toLocaleString()
      },
      ...mapGetters([
        'sidebar',
      ]),
      isCollapse() {
        return this.sidebar.opened
      }
    },
    mounted(){
      window.addEventListener('resize',this.echartsSize)
    },
    methods:{
      goPage(){
        var $this = this;
        var newDate = new Date();
        // var newYear = newDate.getFullYear();
        var newYear = $this.year;
        var startTime = newYear + "/01";
        var endTime = newYear + "/12";
        var baseDepart = "";
        var contrastDepartArr = [];
        this.departList.forEach(function(item,index){
          if(index == 0){
            baseDepart = item.id;
          }else{
            contrastDepartArr.push(item.id);
          }
        });
        var contrastDepart = "";
        if(contrastDepartArr.length>0){
          contrastDepart = contrastDepartArr.join(",");
        }
        $this.startTime = startTime;
        $this.endTime = endTime;
        $this.baseDepart = baseDepart;
        $this.contrastDepart = contrastDepart;
      },
      //chart top
      costAverageChart(val){
        var $this = this;
        let chartTopData = JSON.parse(JSON.stringify(val));
        var chartDom = document.getElementById('DealYearsChartTop');
        var myChart = echarts.init(chartDom);
        var option;
        var newlist = [];
        var $this = this;
        for(var i=0; i< chartTopData.length;i++){
            var obj={};
            obj.date = chartTopData[i].date.slice(-2) + '月';
            obj.a_number = chartTopData[i].a_number;
            newlist.push(obj);
        }
        option = {
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "line", 
                },
            },
            grid: {
                left: '-6%',
                right: '0%',
                bottom: '6%',
                top:'8%',
                containLabel: true
            },
            xAxis: {
                type: "category",
                name: "日期",
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false,
                },
                axisLabel: {
                    color: "#999",
                    fontSize: "12",
                },
                nameTextStyle:{
                    color: "transparent"
                }
            },
            yAxis: {
                type: 'value',
                name: "数量",
                show: false
            },
            dataset:{
                source: newlist
            },
            animation: false,
            series: [
                {
                    name: "数量",
                    type: "line",
                    lineStyle: {
                        normal: {
                            width: 1,
                            color: "transparent", // 线条颜色
                        },
                    },
                    areaStyle: {
                        color:{
                            type: 'linear',
                            x: 0,
                            y: 1,
                            x2: 0,
                            y2: 0,
                            colorStops: [{
                                offset: 0, color: "rgba(112, 252, 243, 0.88)"
                            },{
                                offset: 0.5, color: "rgba(66, 200, 251, 0.62)"
                            },{
                                offset: 0.77, color: "rgba(41, 172, 254, 0.49)"
                            },{
                                offset: 1, color: "rgba(41, 172, 254, 0.37)"
                            }]
                        },
                        opacity:0.89
                    },
                    showSymbol: false,
                },
            ],
        };
        option && myChart.setOption(option);
        $this.myChart = myChart;
        myChart.on('click', function (params) {
          let month = params.name.slice(0,2);
          let startTime = $this.year + '/' +  month;
          let endTime = $this.year + '/' + month;
          var baseDepart = "";
          var contrastDepartArr = [];
          $this.departList.forEach(function(item,index){
            if(index == 0){
              baseDepart = item.id;
            }else{
              contrastDepartArr.push(item.id);
            }
          });
          var contrastDepart = "";
          if(contrastDepartArr.length>0){
            contrastDepart = contrastDepartArr.join(",");
          }
          if($this.language == '中文'){
            $this.$router.push({path:'/stat/cn/departAnalysis',query:{type:9,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}});
          }else{
            $this.$router.push({path:'/stat/en/departAnalysis',query:{type:9,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}});
          }
        });
      },
      setIsUp(val){
        let newXpanYears = 0;
        let oldXpanYears = 0;
        for(let i = 0;i<val.length;i++){
          oldXpanYears+=val[i].lasta_number;
          newXpanYears+=val[i].a_number
        }
        if(newXpanYears>=oldXpanYears){
          this.isUp = true;
          this.isUpNum = newXpanYears - oldXpanYears
        }else{
          this.isUp = false;
          this.isUpNum = oldXpanYears - newXpanYears
        }
      },
      getMonthDays(year,month){
        var thisDate = new Date(year,month,0); //当天数为0 js自动处理为上一月的最后一天
        return thisDate.getDate();
      },
      echartsSize(){
        if(this.myChart){
          this.myChart.resize();
        }
      }
    },
    destroyed(){
      window.removeEventListener('resize',this.echartsSize);
      if(this.myChart){
        this.myChart.dispose();
      }
    }
}
</script>
<style lang="scss">
</style>