<template>
    <div class="chart-column" id="columnChart"></div> 
</template>
<script>
import * as echarts from 'echarts';
export default {
  name: "columnChart",
  props: {
    chartData:{
      type: Object,
      default: function () {
        return {};
      },
    }
  },
  data() {
    return {
        myChart: null
    };
  },
  watch: {
    chartData:{
      handler(newValue, oldValue) {
        this.drawColumnChart();
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
    drawColumnChart(){
        var $this = this;
        if($this.myChart){
            $this.myChart.dispose();
        }
        var colorArr = ["#2259e5","#5f83e1", "#3ebea7","#89d6c8", "#eca12d","#f0bc6d", "#ee4747", "#ff6e6e","#33abda", "#73c0de","#6ec840", "#a3d988","#f57543","#ff8d61","#9a60b4", "#c088da", "#c20cb8", "#ff5ef7","#c8bc12", "#e5d822", "#3759be", "#6d88dc", "#e06430", "#fc8452", "#e2ac34", "#fac858", "#ce3f3f","#ee6666"];
        var chartDom = document.getElementById('columnChart');
        var myChart = echarts.init(chartDom);
        var option;
        var xData = [];
        var series = [];
        if($this.chartData.c_data.length > 0){
          $this.chartData.c_data.forEach((item,index) => {
            var itemObj={};
            var nameindex = Math.floor(index/3);
            if($this.chartData.c_user.length > 0){
              itemObj.name = $this.chartData.c_user[nameindex];
            }else{
              itemObj.name = "";
            }
            itemObj.data = item;
            // 柱状图
            if(index%3 == 0 || index%3 == 1){
              itemObj.type='bar';
              itemObj.barMaxWidth = 25;
              if(index%3 == 0){
                itemObj.label={
                  show: true,
                  position: 'insideTop',
                  distance: 10,
                  color: "#fff"
                };
                itemObj.itemStyle={
                  color: colorArr[nameindex*2],
                  borderColor: colorArr[nameindex*2],
                };
              }else{
                itemObj.label={
                  show: true,
                  position: 'top',
                  distance: 5,
                  formatter:function(params){
                    return params.data.all
                  },
                };
                itemObj.itemStyle={
                  color: colorArr[nameindex*2+1],
                  borderColor: colorArr[nameindex*2+1],
                };
              }
              itemObj.stack = "data"+nameindex;
              series.push(itemObj);
            }else if(index%3 == 2){
              // 折线图
              itemObj.smooth=false;
              itemObj.type='line';
              itemObj.lineStyle={
                  width: 1,
                  color: colorArr[nameindex*2], // 线条颜色
              };
              itemObj.itemStyle={
                  color: '#fff',
                  borderColor: colorArr[nameindex*2], // 折点颜色
                  borderWidth: 1
              };
              itemObj.emphasis={
                lineStyle: {
                  width: 2,	// hover时的折线宽度
                },
                itemStyle:{
                  borderWidth: 2
                }
              };
              itemObj.symbolSize=5;
              itemObj.symbol='circle';
              itemObj.yAxisIndex = 1;
              itemObj.animationDuration=2800;
              itemObj.animationEasing='quadraticOut';
              series.push(itemObj);
            }
          })
        }
        option = {
          tooltip: {
              backgroundColor:'rgba(255,255,255,0.95)',
              trigger: "axis",
              textStyle:{
                fontSize:'12',
                color: '#666'
              },
              formatter(params){
                let returnData = `<div class="toolDiv">
                    <div class="tooltitle">${params[0].name}</div>`;
                params.forEach((item,index) => {
                  if(index%3 == 0 || index%3 == 2){
                    if(index%3 == 0){
                      returnData += `<div class="bar clearfix" style="margin-top:5px">
                        <span style="display:inline-block;vertical-align:middle;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${params[index].borderColor};"></span><span>`;
                        if(params.length > 4){
                          returnData += `${item.seriesName}`;
                        }
                      returnData += `实际完成：</span><span>${item.data.all}积分</span>`;
                      if(item.data.actual_data && item.data.actual_data.length > 0){
                        item.data.actual_data.forEach((sitem,sindex)=> {
                          returnData += `，<span>${sitem.type_name}${sitem.number}个</span>`;
                        })
                      }
                      returnData += `</div><div class="bar clearfix" style="margin-top:5px">
                      <span style="display:inline-block;vertical-align:middle;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${params[index].borderColor};"></span><span>`;
                      if(params.length > 4){
                        returnData += `${item.seriesName}`;
                      }
                      returnData += `有效完成：</span><span>${item.data.value}积分</span>`;
                      if(item.data.effective_data && item.data.effective_data.length > 0){
                        item.data.effective_data.forEach((sitem,sindex)=> {
                          returnData += `，<span>${sitem.type_name}${sitem.number}个</span>`;
                        })
                      }
                      returnData += `</div>`;
                    }
                    if(index%3 == 2){
                      returnData += `<div class="bar clearfix" style="margin-top:5px">
                      <span style="display:inline-block;vertical-align:middle;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${params[index-2].borderColor};"></span><span>`;
                      if(params.length > 4){
                        returnData += `${item.seriesName}`;
                      }
                      returnData += `完成度：</span><span>${item.value}%</span></div>`;
                    }
                  }
                })
                returnData +=`</div>`;
                return returnData;
            }
          },
          grid: {
              top:50,
              right:52,
              bottom:20,
              left:52,
          },
          xAxis: {
              type: 'category',
              data: $this.chartData.c_name,
              axisLine: {
                  show: false,
              },
              axisTick: {
                  show: false,
              },
              axisLine:{
                  show: true,
                  lineStyle:{
                      type: [4, 0],
                      dashOffset: 3,
                      color: '#e5e5e5',
                      opacity: 1,
                      shadowColor: null,
                      shadowBlur: 0,
                      shadowOffsetX: 0,
                      shadowOffsetY: 0,
                  }
              },
              axisLabel: {
                  interval:1,
                  color: "#555",
                  fontSize: "12",
                  lineHeight: 18,
              },
          },
          yAxis:[
            {
              type: 'value',
              name: "单位（分）",
              nameTextStyle: {
                color: "#b4b4b4",
                nameLocation: "start",
              },
              alignTicks: true,
              axisLabel:{
                color: "#888"
              },
              
            },
            {
              type: 'value',
              name: "单位（%）",
              nameTextStyle: {
                color: "#b4b4b4",
                nameLocation: "end",
              },
              alignTicks: true,
              axisLabel:{
                color: "#888"
              },
            },
          ],
          animation: false,
          series:series,
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