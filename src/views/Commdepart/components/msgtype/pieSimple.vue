<template>
    <div class="pie-chart" :id="'pie-'+idData" :style="'height:'+scoreHeight+'px'" ></div>
</template>

<script>
import * as echarts from 'echarts';
export default {
  name: "pieChart",
  data:function() {
    return {
        myChart:null,
    };
  },
  props: {
    chartData: {
      type: Array,
      default:[],
    },
    scoreHeight:{
      type: Number,
      default: "",
    },
    idData:{
      type: String,
      default: "",
    },
  },
  destroyed(){
    window.removeEventListener('resize',this.echartsSize);
    if(this.myChart){
        this.myChart.dispose();
    }
  },
  watch: {
    chartData:{
      handler(newValue, oldValue) {
        window.addEventListener('resize',this.echartsSize);
        var colorList1=[];
        var newList=[];
        newValue.forEach(function(item,index){
          if(item.value!=0){
            colorList1.push(item.color);
            newList.push(item);
          }
        });
        var option;
        option = {
            tooltip: {
                trigger: 'item'
            },
            legend:false,
            color:colorList1,
            animation: false,
            series: [
                {
                    type: 'pie',
                    radius: '60%',
                    radius: '50%',
                    avoidLabelOverlap: true,
                    label: {
                      show: true,
                      formatter: '{a|{b}：{d}%}',
                      rich: {
                          a: {
                            lineHeight: 20,
                            padding: [5, 0, 5, 0],
                            color: '#6E7079',
                          }
                      }
                    },
                    labelLine: {
                        length: 20,
                        length2: 30,
                        lineStyle: {
                            width: 1
                        }
                    },
                    itemStyle: {
                        borderColor: '#fff',
                        borderWidth:1,
                    },
                    emphasis: {
                        itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.2)'
                        }
                    },
                    data:newList,
                }
            ]
        };
        this.myChart.setOption(option,true);
      },
      deep: true
    },
  },
  mounted(){
      var $this = this;
      window.addEventListener('resize',$this.echartsSize);
      this.drawAreaTrendChart($this.chartData);
  },
  methods: {
    drawAreaTrendChart(dataArr) {
        var $this = this;
        var chartDom = document.getElementById('pie-'+$this.idData);
        var myChart = echarts.init(chartDom);
        var colorList1=[];
        var dataList=[];
        dataArr.forEach(function(item,index){
          if(item.value!=0){
            colorList1.push(item.color);
            dataList.push(item);
          }
        });
        var option;
        option = {
            tooltip: {
                trigger: 'item'
            },
            legend:false,
            color:colorList1,
            animation: false,
            series: [
                {
                    type: 'pie',
                    radius: '50%',
                    avoidLabelOverlap: true,
                    label: {
                        show: true,
                        formatter: '{a|{b}：{d}%}',
                        rich: {
                            a: {
                              lineHeight: 20,
                              padding: [5, 0, 5, 0],
                              color: '#6E7079',
                            }
                        }
                    },
                    labelLine: {
                        length: 20,
                        length2: 30,
                        lineStyle: {
                            width: 1
                        }
                    },
                    itemStyle: {
                        borderColor: '#fff',
                        borderWidth:1,
                    },
                    emphasis: {
                        itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.2)'
                        }
                    },
                    data:dataList,
                }
            ]
        };
        option && myChart.setOption(option,true);
        $this.myChart = myChart;
    },
    echartsSize(){
        if(this.myChart){
            this.myChart.resize();
        }
    }
  },
}
</script>

<style></style>