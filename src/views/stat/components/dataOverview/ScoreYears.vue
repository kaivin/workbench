<template>
  <div class="hxpage">
      <div class="title-view">
        <div class="title">成交{{language=='英文'&&type==1?'个数':'积分'}}</div>
        <router-link :to="{path:language == '中文'?'/stat/cn/departAnalysis':'/stat/en/departAnalysis',query:{type:type==0?2:8,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}}" tag="a" target="_blank" class="more">详情 <i class="svg-i"><svg-icon icon-class="rt-more"></svg-icon></i></router-link>
        <div class="btn-group" v-if="language=='英文'">
          <div @click="changeType(0)" class="btn-item" :class="type == 0?'active':''">积分</div>
          <div @click="changeType(1)" class="btn-item" :class="type == 1?'active':''">个数</div>
        </div>
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
        <div class="chart-top" id="ScoreYearsChartTop"></div>
      </div>   
  </div>
</template>

<script>
import * as echarts from 'echarts';
import {parseTime} from "@/utils";
import { mapGetters } from 'vuex'
import { parse } from 'qs';
export default {
    name:'demo',
    data(){
      return {
        type:0,
        isUp:true,
        isUpNum:0,
        totalXpanYears:0,
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
      yearscoretong:{
        type:Array,
        default:function(){
          return []
        }
      },
      yearscorenumbertong:{
        type:Array,
        default:function(){
          return []
        }
      },
      yearscorenumbercount:{
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
      type:function(newval,oldval){
        this.costAverageChart();
        this.setIsUp();
      },
      yearscoretong:{
        handler(newval,oldval){
          this.goPage();
          this.costAverageChart();
          this.setIsUp();
        },
        deep:true
      },
      isCollapse(){
        setTimeout(() => {
          this.echartsSize();
        }, 200)
      }
    },
    mounted(){
      var $this = this;
      window.addEventListener('resize',$this.echartsSize);
    },
    computed:{
      ...mapGetters([
        'sidebar',
      ]),
      isCollapse() {
        return this.sidebar.opened
      }
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
      changeType(val){
        this.type = val;
      },
      //chart top
      costAverageChart(){
        var $this = this;
        let chartTopData = [];
        var newlist = [];
        if(this.type == 0){
          chartTopData = JSON.parse(JSON.stringify(this.yearscoretong));
          for(var i=0; i< chartTopData.length;i++){
              var obj={};
              obj.date = chartTopData[i].date.slice(-2) + '月';
              obj.score = chartTopData[i].score;
              newlist.push(obj);
          }
        }else{
           chartTopData = JSON.parse(JSON.stringify(this.yearscorenumbertong));
           for(var i=0; i< chartTopData.length;i++){
              var obj={};
              obj.date = chartTopData[i].date.slice(-2) + '月';
              obj.score = chartTopData[i].number;
              newlist.push(obj);
          }
        }
        var chartDom = document.getElementById('ScoreYearsChartTop');
        var myChart = echarts.init(chartDom);
        var option;
        
        option = {
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "line", 
                },
                formatter(params){
                  return `<div class="toolDiv">
                    <div class="tooltitle">${params[0].name}</div>
                    <div class="bar clearfix">
                      <span style="display:inline-block;vertical-align:middle;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#518dff;"></span>
                      <span>${params[0].seriesName}：</span>
                      <span>${params[0].value.score}</span>
                    </div>
                  </div>`;
                }
            },
            grid: {
                left: '-8%',
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
                name: $this.type == 0 ? "积分" : "个数",
                show: false
            },
            dataset:{
                source: newlist
            },
            animation: false,
            series: [
                {
                    name: $this.type == 0 ? "积分" : "个数",
                    type: 'line',
                    lineStyle: {
                        normal: {
                            width: 1,
                            color: "#518dff", // 线条颜色
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
                                offset: 0, color: "#2678ff"
                            }, {
                                offset: 0.77, color: "rgba(16, 95, 255, 0.55)"
                            }, {
                                offset: 1, color: "rgba(16, 95, 255, 0.41)"
                            }]
                        },
                        opacity: 0.66
                    },
                    showSymbol: false,
                    symbolSize: 5,
                    symbol:'circle',
                    itemStyle : { 
                      normal: {
                        color: "#fff",
                        borderColor:'#4f8afa',
                        borderWidth:1,
                      },
                    }
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
            $this.$router.push({path:'/stat/cn/departAnalysis',query:{type:$this.type==0?2:8,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}});
          }else{
            $this.$router.push({path:'/stat/en/departAnalysis',query:{type:$this.type==0?2:8,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}});
          }
        });
      },

      costAverageChart2(){
        var $this = this;
        let chartTopData = [];
        if(this.type == 0){
           chartTopData = JSON.parse(JSON.stringify(this.yearscoretong));
        }else{
           chartTopData = JSON.parse(JSON.stringify(this.yearscorenumbertong));
        }
          for(let i = 0;i<chartTopData.length;i++){
            chartTopData[i].date = chartTopData[i].date.slice(-2) + '月'
          }
          if($this.chartTop&&!$this.chartTop.chart.destroyed){
              $this.chartTop.destroy();
             
          } 
          const chartTop = new Area('ScoreYearsChartTop', {
            data:chartTopData,
            xField: 'date',
            yField: $this.type == 0?'score':'number',
            appendPadding: [5, 0, 5, 0],
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
                  cursor: 'pointer'
                },
              },
            },
            yAxis: {
              grid:null,
              line:null,
              label:null
            },
            color:'#2569ff',
            
            areaStyle: () => {
              return {
                fill: 'l(270) 0:#ffffff 0.5:#2569ff 1:#2569ff',
                lineWidth:1,
                
              };
            },
            point: {
              size: 3,
              shape: 'circle',
              style: {
                fill: 'white',
                stroke: '#5470c6',
                lineWidth: 1,
              },
            },
            meta: {
              score: {
                alias: '积分',
              },
              number: {
                alias: '数量',
              },
            },
            
          });
          
           chartTop.on('axis-label:click', (args) => {
            let data = args.gEvent.delegateObject.item.name;
            
            let month = data.slice(0,2);
            let startTime = parseTime(new Date(),'{y}') + '/' +  month;
            let endTime = parseTime(new Date(),'{y}') + '/' + month;
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
              $this.$router.push({path:'/stat/cn/departAnalysis',query:{type:2,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}});
            }else{
              if(this.type == 0){
                $this.$router.push({path:'/stat/en/departAnalysis',query:{type:2,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}});
              }else{
                $this.$router.push({path:'/stat/en/departAnalysis',query:{type:8,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}});
              }
            }
          });
          $this.chartTop = chartTop;
          chartTop.render();
      },
      setIsUp(){
        let val = [];
        if(this.type == 0){
           val = JSON.parse(JSON.stringify(this.yearscoretong));
        }else{
           val = JSON.parse(JSON.stringify(this.yearscorenumbertong));
        }
        let newXpanYears = 0;
        let oldXpanYears = 0;
        if(this.type == 0){
          for(let i = 0;i<val.length;i++){
            oldXpanYears+=val[i].lastscore;
            newXpanYears+=val[i].score;
          }
          var newnum = newXpanYears.toFixed(2).split(".");
          newnum = parseInt(newnum[0]).toLocaleString()+'.'+newnum[1];
          this.totalXpanYears= newnum;
        }else{
          for(let i = 0;i<val.length;i++){
            oldXpanYears+=val[i].lastnumber;
            newXpanYears+=val[i].number;
          }
          var newnum = newXpanYears.toLocaleString();
          this.totalXpanYears= newnum;
        }
        
        if(newXpanYears>=oldXpanYears){
          this.isUp = true;
          if(this.type == 0){
            this.isUpNum = (newXpanYears - oldXpanYears).toFixed(2)
          }else{
            this.isUpNum = newXpanYears - oldXpanYears
          }
          
        }else{
          this.isUp = false;
          if(this.type == 0){
            this.isUpNum = (oldXpanYears - newXpanYears).toFixed(2)
          }else{
            this.isUpNum = oldXpanYears - newXpanYears
          }
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

<style scoped lang="scss">
</style>