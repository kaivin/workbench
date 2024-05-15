<template>
  <div class="rowDayCount">
    <div class="rowTitle">
      <div class="title-left">
        <h3 class="tit-h3">日均花费</h3>
        <span class="tit-span">（单位：元）</span>
      </div>
    </div>
    <div class="rowMain">
        <div id="dayTarget"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import { mapGetters } from 'vuex'
export default {
    name: "DayTarget",
    data() {
        return {
          myChart: "",
        }
    },
    props:{
        DayData:{
          type: Object,
          default: function () {
            return {};
          },
        }
    },
    created(){
    },
    computed:{
      ...mapGetters([
        'sidebar',
      ]),
      isCollapse() {
        return this.sidebar.opened
      }
    },
    watch:{
        DayData:{
            handler(val, oldVal){
                this.drawColumn(val)
            },
            deep: true
        },
        isCollapse(){
          setTimeout(() => {
            this.echartsSize();
          }, 200)
        }
    },
    mounted(){
      window.addEventListener('resize',this.echartsSize)
    },
    methods:{
      drawColumn(){
        var $this = this;
        if($this.myChart){
          $this.myChart.dispose();
        }
        var chartDom = document.getElementById('dayTarget');
        var myChart = echarts.init(chartDom);
        var daydata = $this.DayData;
        var Dep1DayNum = $this.Dep1DayNum;
        var option={
            grid: {
              left: '0',
              right: '0',
              bottom: '0',
              top: '10',
              containLabel: true
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              },
              formatter(items){
                var tooltext = `<div class="deptoolTip"><div class="title">${items[0].name}</div>`;
                  items.forEach(function(item,index){
                    tooltext += `<div class="bar clearfix">
                                ${item.marker}
                                <span class="name">${item.seriesName}：</span>
                                <span class="num">${item.value}</span>
                              </div>`;
                  })
                  tooltext +='</div>';
                  return tooltext;
              }
            },
            color: [ '#7fb3ff', '#a0c7ff', '#4d7eff','#ffb420'],
            barMaxWidth: 22,
            barMinWidth: 22,
            xAxis: [
              {
                type: 'category',
                data: daydata.departArr,
                axisTick: {
                  show: false
                },
                axisLine:{
                  lineStyle:{
                    color:"#dedede"
                  }
                },
                axisLabel:{
                  color:"#333"
                }
              }
            ],
            yAxis: [
              {
                type: 'value',
                splitNumber: 3,
                splitLine: {
                  lineStyle:{
                    color:"#dedede"
                  }
                }
              }
            ],
            series: [
              {
                name: '搜索询盘',
                type: 'bar',
                stack: '询盘数量',
                data: daydata.searchArr,
                label: {
                  show: true,
                  position: 'top',
                  formatter:function(params){
                    if(params.name == "电商一部"){
                      if(Dep1DayNum-params.value >10){
                        return '{a|'+params.value+"}";
                      }else{
                        return ""
                      }
                    }else{
                      return '{b|'+params.value+"}";
                    }
                  },
                  rich:{
                    a:{
                      color: "#fff"
                    },
                    b:{
                      color: "#7fb3ff",
                    }
                  }
                },
              },
              {
                name: '询盘数量',
                type: 'bar',
                stack: '询盘数量',
                data: daydata.unsearchArr,
                label: {
                  position: 'top',
                  show: true,
                  formatter:function(params){
                    if(params.name == "电商一部"){
                      return '{a|'+Dep1DayNum+'}';
                    }else{
                      return ""
                    }
                  },
                  rich:{
                    a:{
                      color: "#7fb3ff"
                    }
                  }
                },
              },
              {
                name: '本月最高',
                type: 'bar',
                data: daydata.monthArr,
                label: {
                  show: true,
                  position: 'top',
                  color: "#4d7eff"
                },
              },
              {
                name: '历史最高',
                type: 'bar',
                data: daydata.historyArr,
                label: {
                  show: true,
                  position: 'top',
                  color: "#ffb420"
                },
              },
              {
                type: 'custom',
                name: '平均',
                z:"3",
                tooltip:{
                  show: false
                },
                renderItem: function(param, api) {
                  var bandWidth = api.size([0, 0])[0] * 0.5;
                  var point = api.coord([api.value(0), api.value(1)]);
                  return {
                    type: 'line',
                    transition: ['shape'],
                    shape: {
                      x1: point[0] - bandWidth / 2,
                      x2: point[0] + bandWidth / 2,
                      y1: point[1],
                      y2: point[1]
                    },
                    style: api.style({
                      fill: null,
                      // stroke: '#f43131',
                      stroke: new echarts.graphic.LinearGradient(1, 0, 0, 0,[
                          {offset: 0.02,color: '#f43131'},
                          {offset: 0.09,color: '#f43131'},
                          {offset: 0.09,color: 'transparent'},
                          {offset: 0.13,color: 'transparent'},
                          {offset: 0.13,color: '#f43131'},
                          {offset: 0.2,color: '#f43131'},
                          {offset: 0.2,color: 'transparent'},
                          {offset: 0.24,color: 'transparent'},
                          {offset: 0.24,color: '#f43131'},
                          {offset: 0.31,color: '#f43131'},
                          {offset: 0.31,color: 'transparent'},
                          {offset: 0.35,color: 'transparent'},
                          {offset: 0.35,color: '#f43131'},
                          {offset: 0.42,color: '#f43131'},
                          {offset: 0.42,color: 'transparent'},
                          {offset: 0.46,color: 'transparent'},
                          {offset: 0.46,color: '#f43131'},
                          {offset: 0.53,color: '#f43131'},
                          {offset: 0.53,color: 'transparent'},
                          {offset: 0.57,color: 'transparent'},
                          {offset: 0.57,color: '#f43131'},
                          {offset: 0.64,color: '#f43131'},
                          {offset: 0.64,color: 'transparent'},
                          {offset: 0.68,color: 'transparent'},
                          {offset: 0.68,color: '#f43131'},
                          {offset: 0.75,color: '#f43131'},
                          {offset: 0.75,color: 'transparent'},
                          {offset: 0.79,color: 'transparent'},
                          {offset: 0.79,color: '#f43131'},
                          {offset: 0.86,color: '#f43131'},
                          {offset: 0.86,color: 'transparent'},
                          {offset: 0.91,color: 'transparent'},
                          {offset: 0.91,color: '#f43131'},
                          {offset: 0.98,color: '#f43131'}
                      ]),
                      LineWidth: 1,
                    }),
                  }
                },
                label:{
                  normal:{
                    show: true,
                    position: "right",
                    color: "#f43131"
                  }
                },
                encode: {
                  x: 0,
                  y: 1
                },
                data: daydata.targetArr
              },
            ]
        };
        option && myChart.setOption(option);
        $this.myChart = myChart;
      },
      echartsSize(){
        if(this.myChart){
          this.myChart.resize();
        }
      },
    },
    destroyed(){
      window.removeEventListener('resize',this.echartsSize);
      if(this.myChart){
        this.myChart.dispose();
      }
    }
}
</script>

<style>

</style>