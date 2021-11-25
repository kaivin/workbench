<template>
    <div :id="id"></div>
</template>
<script>
import { Column} from '@antv/g2plot';
export default {
  props: ["ManyDepartData"],
  data() {
    return {
      chartArr: null,
      newlist:[],
      id: Math.random()
        .toString(36)
        .substr(2)
    };
  },
  // 生命周期 - 载入后, Vue 实例挂载到实际的 DOM 操作完成，一般在该过程进行 Ajax 交互
  mounted() {
    var $this=this;
    $this.newlist=$this.ManyDepartData;
    console.log($this.newlist,'$this.newlist');
    $this.columnManyChart();
  },
  // 方法集合
  methods: {
    columnManyChart() {
      var $this = this;
      if ($this.newlist.length > 0) {
        if ($this.chartArr && !$this.chartArr.chart.destroyed) {
          $this.chartArr.changeData($this.newlist);
        } else {
          const chartArr = new Column($this.id, {
            data: $this.newlist,
            xField: 'name',
            yField: 'value',
           
            appendPadding: [15, 0, 0, 0],
            height:285,
            color: '#81a8f1',
            label: {
              position: 'top', 
              offset:4,
              // 配置样式
              style: {
                fill: '#333333',
                fontSize:13
              },
            },
            xAxis: {
              label: {
                offset:11,
                autoHide: true,
                autoRotate: false,
                style: {
                  fill: '#a1a1a1',
                  opacity: 1,
                  fontSize: 12,
                  lineHeight:18,
                },
              },
            },
            yAxis: {
              tickCount:4,
              grid: {
                line: {
                  style: {
                    stroke: '#cccccc',
                    lineWidth: 1,
                    lineDash: [3, 2],
                    strokeOpacity: 0.5,
                    shadowColor: null,
                    shadowBlur: 0,
                    shadowOffsetX:0,
                    shadowOffsetY:0,
                    cursor: 'pointer'
                  }
                }
              },
            },
            meta: {
              avgallmoney: {
                alias: '成本均价',
              },
            },
            statistic: null,
            minColumnWidth:20,
            maxColumnWidth:25,
            annotations: [
              {
                type: 'image',
                src: 'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*ELYbTIVCgPoAAAAAAAAAAABkARQnAQ',
                /** 位置 */
                position: ['50%', '50%'],
                /** 图形样式属性 */
                style: {
                  width: 50,
                  height: 50,
                },
                /** x 方向的偏移量 */
                offsetX: -25,
                /** y 方向的偏移量 */
                offsetY: 40,
              },
            ],
          });
          $this.chartArr = chartArr;
          chartArr.render();
        }
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