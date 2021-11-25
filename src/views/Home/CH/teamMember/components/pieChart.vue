<template>
    <div class="pie-chart" :id="'pie-'+idData"></div>
</template>

<script>
import { Pie } from '@antv/g2plot';
export default {
  name: "pieChart",
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
    fontData:{
      type: String,
      default: "",
    },
  },
  computed:{
    currentData(){
      return this.chartData;
    },
  },
  mounted(){
    console.log("执行画环图")
    this.drawPieChart();
  },
  methods:{
    drawPieChart(){
      var $this = this; 
      if(!$this.piePlot){
        const piePlot = new Pie('pie-'+$this.idData, {
          appendPadding: 30,
          data:$this.currentData,
          angleField: 'value',
          colorField: 'name',
          radius: 1,
          innerRadius: 0.64,
          width: 280,
          height: 340,
          legend:false,
          animation: {
            // 配置图表第一次加载时的入场动画
            appear: {
              animation: 'zoom-in', // 动画效果
              duration: 500,  // 动画执行时间
            },
          },
          label: false,
          state:{
            active: {
              style: {
                lineWidth: 0,
                stroke:0,
                fillOpacity:0.8,
              },
            },
          },
          statistic: {
            title: false,
            content: {
              style: {
                fill:"#666666",
                lineHeight:1.4,
                opacity:.6,
                fillOpacity:.4,
                fontSize: 14,
                whiteSpace: 'pre-wrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              },
              content: $this.fontData,
            },
          },
          // 添加 中心统计文本 交互
          interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
        });
        piePlot.render();
        $this.piePlot = piePlot;
      }
    }
  },
};
</script>

<style>
</style>