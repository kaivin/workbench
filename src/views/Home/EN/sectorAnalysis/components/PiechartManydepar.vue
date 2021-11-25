<template>
    <div :id="id"></div>
</template>
<script>
import { Pie } from '@antv/g2plot';
export default {
  props: ["ManyDepartData"],
  data() {
    return {
      chartArr: null,
      newlist:this.ManyDepartData,
      id: Math.random()
        .toString(36)
        .substr(2)
    };
  },
  // 生命周期 - 载入后, Vue 实例挂载到实际的 DOM 操作完成，一般在该过程进行 Ajax 交互
  mounted() {
    this.pieManyChart();
  },
  watch: {
    ManyDepartData: function(val) {
      this.chartArr.changeData(val);
    }
  },
  // 方法集合
  methods: {
    pieManyChart() {
      var $this = this;
      if ($this.newlist.length > 0) {         
        const chartArr = new Pie($this.id, {
          appendPadding: 10,
          data: $this.newlist,
          angleField: 'value',
          colorField: 'name',
          radius: 0.9,
          legend:{
            position: 'bottom'
          },
          label: {
            name: 'inner',
            offset: '-30%',
            content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
            style: {
              fontSize: 14,
              textAlign: 'center',
            },
          },
          interactions: [{ name: 'element-active' }],
        });
        $this.chartArr = chartArr;
        chartArr.render();
      }else{        
        if ($this.chartArr&&!$this.chartArr.chart.destroyed){
          $this.chartArr.chart.destroy();
        }
      }
    },
  }
};
</script>

<style  scoped>
#c1 {
  margin: 20px auto;
  width: 100%;
  position: relative;
}
</style>