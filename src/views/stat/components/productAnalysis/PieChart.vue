<template>
    <div class="chart-pie" style="height:290px;" id="chartpie"></div> 
</template>
<script>
import {Pie} from '@antv/g2plot';
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
  mounted(){
  },
  methods: {
    // 占比图例
    drawPieChart(){
      var $this = this;
      if(!$this.piePlot){
        const piePlot = new Pie('chartpie', {
          appendPadding:[30,10,20,10],
          data:$this.chartList.chartList,
          angleField: 'number',
          colorField: 'name',
          radius: 0.75,
          width:300,
          height: 290,
          radius: 1,
          innerRadius: 0.65,
          color:$this.chartList.ChartColor,
          animation: {
            // 配置图表第一次加载时的入场动画
            appear: {
              animation: 'zoom-in', // 动画效果
              duration: 500,  // 动画执行时间
            },
          },
          label: {
            type:'spider',
            labelHeight: 28,
            style:{
              fill:'#252525',
              fontSize: 13,
              lineHeight:18,
            },
            content:(data)=>{
              return data.name+'：'+ Math.floor(data.percent * 10000) / 100+"%";
            } ,
          },
          legend:false,
          pieStyle:{
            stroke:0,
          },
          state: {
            active: {
              style: {
                fill:'#90a6e8',
                lineWidth:0,
                fillOpacity: 0.65,
              },
            },
          },
          interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
          statistic:false,
        });
        $this.piePlot = piePlot;
        piePlot.render();
      }
    },
  }
}
</script>



