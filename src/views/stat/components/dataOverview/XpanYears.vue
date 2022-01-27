<template>
  <div class="hxpage" ref="page">
    <div class="title-view">
      <div class="title">询盘个数</div>
      <router-link :to="{path:language == '中文'?'/stat/cn/departAnalysis':'/stat/en/departAnalysis',query:{type:type,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}}" tag="a" target="_blank" class="more">详情 <i class="svg-i"><svg-icon icon-class="rt-more"></svg-icon></i></router-link>
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
      <div class="chart-top" id="XpanYearsChartTop"></div>  
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
        startTime:"",
        endTime:"",
        baseDepart:"",
        contrastDepart:"",
        type:1,
        myChart:null,
      }
    },
    props:{
      language:{
        type:String,
        default:"中文"
      },
      yeartong:{
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
      yeartong:{
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
        for(let i = 0;i<this.yeartong.length;i++){
          total+=this.yeartong[i].xunnumber
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
      var $this = this;
      window.addEventListener('resize',$this.echartsSize);
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
            var chartDom = document.getElementById('XpanYearsChartTop');
            var myChart = echarts.init(chartDom);
            var option;
            var newlist = [];
            let chartTopData = JSON.parse(JSON.stringify(val));
            var $this = this;
            for(var i=0; i< chartTopData.length;i++){
                var obj={};
                obj.month =  chartTopData[i].date.slice(-2)+"月";
                obj.xunnumber = chartTopData[i].xunnumber;
                newlist.push(obj);
            }
            option = {
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "shadow", 
                    },
                },
                grid: {
                    left: '-10%',
                    right: '0%',
                    bottom: '6%',
                    top:'10%',
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
                    name: "询盘数量",
                    show: false
                },
                dataset:{
                    source: newlist
                },
                series: [
                    {
                        name: "询盘数量",
                        type: "bar",
                        barWidth: "14",
                        itemStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: '#70fcf3'
                                }, {
                                    offset: 0.5,
                                    color: '#54ddf7'
                                },{
                                    offset: 1,
                                    color: '#24a5ff'
                                }]),
                            },
                        }
                    },
                ],
            };
            option && myChart.setOption(option);
            $this.myChart = myChart;
            myChart.on('click', function (params) {
              let month = params.name.slice(0,2);
              // let startTime = parseTime(new Date(),'{y}') + '/' +  month + '/01';
              // let endTime = parseTime(new Date(),'{y}') + '/' + month + '/' + $this.getMonthDays(parseTime(new Date(),'{y}'),month);
              let startTime = $this.year + '/' +  month + '/01';
              let endTime = $this.year + '/' + month + '/' + $this.getMonthDays($this.year,month);
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
                $this.$router.push({path:'/stat/cn/departAnalysis',query:{type:1,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}});
              }else{
                $this.$router.push({path:'/stat/en/departAnalysis',query:{type:1,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}});
              }
            });
      },

      // 原图表
      costAverageChart2(val){
        var $this = this;
          let chartTopData = JSON.parse(JSON.stringify(val));
          for(let i = 0;i<chartTopData.length;i++){
            chartTopData[i].date = chartTopData[i].date.slice(-2) + '月'
          }
          if($this.chartTop&&!$this.chartTop.chart.destroyed){
              $this.chartTop.changeData(chartTopData);
              return ;
          } 
          const chartTop = new Column('XpanYearsChartTop', {
            data:chartTopData,
            xField: 'date',
            yField: 'xunnumber',
            xAxis: {
              grid:null,
              line:null,
              tickLine:null,
              label: {
                autoHide: true,
                autoRotate: false,
                style: {
                  fill: '#bfbfbf',
                  opacity: 1,
                  fontSize: 12,
                  lineHeight:18,
                },
              },
            },
            yAxis: {
              grid:null,
              line:null,
              label:null
            },
            maxColumnWidth:16,
            columnStyle:{
              fill:'#b0c9ff',
              cursor: 'pointer',
              fillOpacity:1,
              opacity:1,
            },
            meta: {
              xunnumber: {
                alias: '询盘数量',
              },
            },
            state: {
              interactions: [{ type: 'element-active' }],
              // 设置 active 激活状态的样式
              active: {
                columnStyle:{
                  fill:'#83aafc',
                },
              },
            }
            
            
          });

          chartTop.on('element:click', (args) => {
            let data = args.data.data;
            let month = data.date.slice(0,2);
            let startTime = parseTime(new Date(),'{y}') + '/' +  month + '/01';
            let endTime = parseTime(new Date(),'{y}') + '/' + month + '/' + $this.getMonthDays(parseTime(new Date(),'{y}'),month);
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
              $this.$router.push({path:'/stat/cn/departAnalysis',query:{type:1,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}});
            }else{
              $this.$router.push({path:'/stat/en/departAnalysis',query:{type:1,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}});
            }
          });
          $this.chartTop = chartTop;
          chartTop.render();
        
      },

      getMonthDays(year,month){
        var thisDate = new Date(year,month,0); //当天数为0 js自动处理为上一月的最后一天
        return thisDate.getDate();
      },
      setIsUp(val){
        let newXpanYears = 0;
        let oldXpanYears = 0;
        for(let i = 0;i<val.length;i++){
          oldXpanYears+=val[i].lastxunnumber;
          newXpanYears+=val[i].xunnumber
        }
        if(newXpanYears>=oldXpanYears){
          this.isUp = true;
          this.isUpNum = newXpanYears - oldXpanYears
        }else{
          this.isUp = false;
          this.isUpNum = oldXpanYears - newXpanYears
        }
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

<style scoped lang="scss">
</style>