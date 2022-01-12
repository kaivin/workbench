<template>
    <div class="column-chart" :id="'column-'+idData"></div>
</template>

<script>
import { Column } from '@antv/g2plot';
export default {
  name: "columnChart",
  data:function() {
    return {
    };
  },
  props: {
    chartData: {
      type: Array,
      default:[],
    },
    idData:{
      type: String,
      default: "",
    },
    iscost:{
      type:Boolean,
      default:false,
    },
  },
  computed:{
    currentData(){
      return this.chartData;
    },
  },
  mounted(){
    this.drawColumnChart();
  },
  methods:{
    drawColumnChart(){
      var $this = this; 
      if(!$this.columnPlot){
        var xField='';
        var isGroup=false;
        if($this.iscost){
            xField='name';
            isGroup=true;
        }else{
            xField='time';
            isGroup=false;
        }
        const columnPlot = new Column('column-'+$this.idData, {
          data:$this.currentData,
          xField:xField,
          yField: 'value',
          isStack: true,
          seriesField: 'yeartime',
          isGroup:isGroup,
          groupField: 'time',
          legend:false,
          tooltip:false,
          minColumnWidth: 22,
          maxColumnWidth: 30,
          dodgePadding:2,
          xAxis:{
            line:{
              style:{
                stroke: '#ddd',
                lineWidth:1,
                lineDash:[6,0],
                strokeOpacity:1,
              }
            },
          },
          yAxis:{
            tickCount:3,
            grid:{
              line:{
                style:{
                  stroke: '#eee',
                  lineWidth:1,
                  lineDash:[6,3],
                  strokeOpacity:1,
                  shadowBlur:0
                }
              }
            },
          },
        });
        columnPlot.render();
        $this.columnPlot = columnPlot;
      }
    }
  },
};
</script>

<style></style>