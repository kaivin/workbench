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
      type: Object,
      default: function () {
        return {};
      },
    },
    colorData: {
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
  mounted(){
      var $this = this;
      window.addEventListener('resize',$this.echartsSize);
      this.drawAreaTrendChart();
  },
  methods: {
    drawAreaTrendChart() {
        var $this = this;
        var chartDom = document.getElementById('pie-'+$this.idData);
        var myChart = echarts.init(chartDom);
        var enquirie = $this.chartData.enquirie;
        var money = $this.chartData.money;
        var score = $this.chartData.score;
        let echartData = {
            inner: money,
            mider: score,
            outer: enquirie
        };
        var colorList1=[];
        $this.colorData.forEach(function(item){
            var itemDate={};
            itemDate.x=0;
            itemDate.y=0;
            itemDate.x2=0;
            itemDate.y2=1;
            itemDate.colorStops=[];
            for(var i=0;i<=1;i++){
                var itemObj={};
                itemObj.offset=i;
                itemObj.color=item;
                itemDate.colorStops.push(itemObj);
            }
            colorList1.push(itemDate)
        });
        var option;
        option = {
            tooltip: {
                trigger: 'item'
            },
            series: [{
                    name: '消费月份（元）',
                    color:colorList1,
                    type: 'pie',
                    radius: ['20%', '40%'],
                    itemStyle: {
                        normal: {
                            borderColor: '#ffffff',
                            borderWidth:1,
                        }
                    },
                    label:false,
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: echartData.inner
                },
                {
                    name: '成交积分（分）',
                    color:colorList1,
                    type: 'pie',
                    radius: ['40%', '60%'],
                    itemStyle: {
                        normal: {
                            borderColor: '#ffffff',
                            borderWidth:1,
                        }
                    },
                    label:false,
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: echartData.mider
                },
                {
                    name: '询盘个数（个）',
                    color: colorList1,
                    type: 'pie',
                    radius: ['60%', '80%'],
                    itemStyle: {
                        normal: {
                            borderColor: '#ffffff',
                            borderWidth:1,
                        }
                    },
                    label:false,
                    labelLine: {
                        normal: {
                            length:20,
                            length2: 0,
                            lineStyle: {
                                color: '#ccc'
                            }
                        }
                    },
                    label: {
                        normal: {
                            formatter: params => {
                                return '{name|询盘个数}\n{hr|}\n{percent|' + params.name + '} {percent|' + params.value + '}'
                            },
                            distanceToLabelLine: 0,
                            padding: [0, 0, 0, 0],
                            rich: {
                                name: {
                                    color: "#888",
                                    fontSize: 12,
                                    padding: [5, 5],
                                    align: 'left'
                                },
                                percent: {
                                    color: "#888",
                                    align: 'center',
                                    fontSize: 12,
                                    padding: [5, 5]
                                },
                                hr: {
                                    borderColor: '#ccc',
                                    width: '100%',
                                    borderWidth: 0.5,
                                    height: 0,
                                }
                            }
                        }
                    },
                    data: echartData.outer,
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
  },
}
</script>

<style></style>