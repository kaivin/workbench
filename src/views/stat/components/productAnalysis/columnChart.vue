<template>
    <div class="chart-pie" style="height:280px;" id="columnChart"></div> 
</template>
<script>
import {Column} from '@antv/g2plot';
export default {
  name: "columnChart",
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
        this.drawColumnChart();
      },
      deep: true
    },
  },
  mounted(){
  },
  methods: {
    // 占比图例
    drawColumnChart(){
      var $this = this;
      if(!$this.columnPlot){
          //别名设置
          var aliasName='';
          if($this.chartList.pick=='enquirie'){
              aliasName='询盘个数';
          }
          if($this.chartList.pick=='score'){
              aliasName='成交积分';
          }
          const columnPlot = new Column('columnChart', {
            data:$this.chartList.chartList,
            xField: 'name',
            yField: 'number',
            xAxis: {
              tickCount:15,
              grid:null,
              line:{
                style:{
                    stroke: '#e9e9e9',
                    strokeOpacity: 0.2,
                }
              },
              tickLine:null,
              label: {
                autoHide: false,
                autoRotate: true,
                style: {
                  fill: '#444444',
                  opacity: 1,
                  fontSize: 13,
                  lineHeight:18,
                },
              },
            },
            yAxis: {
                tickCount:3,
                line:{
                    style:{
                        stroke: '#e9e9e9',
                        strokeOpacity:1,
                    }
                },
                grid:{
                    line:{
                        style:{
                            stroke: '#f2f2f2',
                            lineWidth: 1,
                            strokeOpacity: 1,
                        }
                    }
                },
                label: {
                    style:{
                        fontSize:12,
                        lineHeight:18,
                        fill:'#444444',
                    }
                },
            },
            maxColumnWidth:14,
            columnStyle:{
              fill:'#044bff',
              cursor: 'pointer',
              fillOpacity:1,
              opacity:1,
            },
            tooltip: { 
                shared: true,
                title:aliasName,
                customItems: (originalItems) => {
                    console.log(originalItems);
                    originalItems.forEach(function(item){
                        item.name = item.data.name;
                    });
                    return originalItems;
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
        $this.columnPlot = columnPlot;
        columnPlot.render();
      }
    },
  }
}
</script>



