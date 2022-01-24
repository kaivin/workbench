<template>
    <div class="chart-pie" style="height:290px;" id="chartpie"></div> 
</template>
<script>
import * as echarts from 'echarts';
export default {
  name: "chartpie",
  props: {
    chartList:{
      type: Object,
      default: function () {
        return {};
      },
    }
  },
  data() {
    return {
    };
  },
  watch: {
    chartList:{
      handler(newValue, oldValue) {
        this.drawPieChart();
      },
      deep: true
    },
  },
  destroyed(){
    window.removeEventListener('resize',this.echartsSize);
    if(this.myChart){
        this.myChart.dispose();
    }
  },
  mounted(){
    var $this = this;
    window.addEventListener('resize',$this.echartsSize);
  },
  methods: {
    // 占比图例
    drawPieChart(){
      var $this = this;
        var chartDom = document.getElementById('chartpie');
        var myChart = echarts.init(chartDom);
        var colorList1=[];
        $this.chartList.ChartColor.forEach(function(item,index){
            var itemObj={};
            itemObj.x=0;
            itemObj.y=0;
            itemObj.x2=0;
            itemObj.y2=1;
            itemObj.colorStops=[];
            var colorOne={};
            colorOne.offset=0;
            colorOne.color=item;            
            itemObj.colorStops.push(colorOne);
            var colorTwo={};
            colorTwo.offset=1;
            colorTwo.color=item;
            itemObj.colorStops.push(colorTwo);
            colorList1.push(itemObj);
        });
        var option;
        option = {
            tooltip: {
                trigger: 'item'
            },
            series: [
                {
                    color:colorList1,
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        normal: {
                            borderColor: '#ffffff',
                            borderWidth:1,
                        }
                    },
                    labelLine: {
                        normal: {
                            length: 20,
                            length2: 30,
                            lineStyle: {
                                width: 1
                            }
                        }
                    },
                    label: {
                        show: true,
                        position: 'outside',
                        formatter: '{a|{b}：{d}%}',
                        rich: {
                            a: {
                                padding: [-30, 15, -20, 15]
                            }
                        }
                    },
                    data:$this.chartList.chartList
                }
            ]
        };
        option && myChart.setOption(option);
        $this.myChart = myChart;
    },
    echartsSize(){
        if(this.myChart){
            this.myChart.resize();
        }
    }
  }
}
</script>



