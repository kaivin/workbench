<template>
  <div class="rowDayCount">
    <div class="rowTitle">
      <div class="title-left">
        <h3 class="tit-h3"><span v-if="lang == 'ch'">中文</span><span v-else>英文</span>各部门日目标</h3>
        <span class="tit-span">（单位：个）</span>
      </div>
    </div>
    <div class="rowMain">
        <div id="dayTarget"></div>
        <div class="legendFly">
          <span class="legendItem1">目标询盘</span>
          <span class="legendItem2">询盘数量</span>
          <span class="legendItem6">非搜索询盘</span>
          <span class="legendItem5">本月最高</span>
          <span class="legendItem4">历史最高</span>
        </div>
    </div>
  </div>
</template>

<script>
import { each, groupBy } from '@antv/util';
import { Mix } from '@antv/g2plot';
export default {
    name: "DayTarget",
    data() {
        return {
            
        }
    },
    props:{
        DayTarget:{
          type: Array,
          default: function () {
            return [];
          },
        },
        Dep1DayNum:{
          type: Number,
          default: function () {
            return [];
          },
        },
        DayAim:{
          type: Array,
          default: function () {
            return [];
          },
        },
        lang:{
          type: String,
          default: function () {
            return {};
          },
        }
    },
    created(){
    },
    watch:{
        DayTarget:{//深度监听，可监听到对象、数组的变化
            handler(val, oldVal){
                this.drawColumn(val)
            },
            deep:true //true 深度监听
        }
    },
    mounted(){
    },
    methods:{
      drawColumn(){
        var $this = this;
        var data = $this.DayTarget;
        var aimArr = $this.DayAim;
        var Dep1DayNum = $this.Dep1DayNum;
        var annotations = [];
        each(aimArr, (value, k) => {
          var number = value.number;
          var snum = k - 0.30;
          var endnum = k + 0.30;
          
          var line={
            type: 'line',
            start: [snum, number],
            end: [endnum, number],
            text: {
              content: number,
              position: 'right',
              offsetX: 18,
              offsetY: 6,
              style: {
                textAlign: 'right',
                fontWeight: "bold",
                fill: "#ff4848"
              },
            },
            style: {
              lineDash: [9, 4],
              stroke: "#ff4848",
              shadowColor: '#ff4848',
              shadowBlur: 10,
              shadowOffsetX: 5,
              shadowOffsetY: 5,
            },
          }
          annotations.push(line);
        });
  
        each(groupBy(data, 'departname'), (values, k) => {
          for(var i=0; i<values.length;i++){
            if(k!="电商一部" &&　values[i].name == "搜索询盘"){
              annotations.push({
                type: 'text',
                position: [k, values[i].number],
                content: `${values[i].number}`,
                style: { textAlign: 'center', fontSize: 12, fill: '#ebaa46' },
                offsetY: -10,
                offsetX: -27
              });
            }
            if(k=="电商一部" &&　values[i].name == "搜索询盘"){
              annotations.push({
                type: 'text',
                position: [k, Dep1DayNum],
                content: `${Dep1DayNum}`,
                style: { textAlign: 'center', fontSize: 12, fill: '#ebaa46' },
                offsetY: -10,
                offsetX: -27
              });
              if(Dep1DayNum - values[i].number > 10){
                annotations.push({
                  type: 'text',
                  position: [k, values[i].number],
                  content: `${values[i].number}`,
                  style: { textAlign: 'center', fontSize: 12, fill: '#fff' },
                  offsetY: -10,
                  offsetX: -27
                });
              }
              
            }
            if(values[i].name == "本月最高"){
              annotations.push({
                type: 'text',
                position: [k, values[i].number],
                content: `${values[i].number}`,
                style: { textAlign: 'center', fontSize: 12, fill: '#225ae5' },
                offsetY: -10,
              });
            }
            if(values[i].name == "历史最高"){
              annotations.push({
                type: 'text',
                position: [k, values[i].number],
                content: `${values[i].number}`,
                style: { textAlign: 'center', fontSize: 12, fill: '#f47070' },
                offsetY: -10,
                offsetX: 27
              });
            }
          }
        });

        if( $this.plot && !$this.plot.chart.destroyed){
          $this.plot.destroy();
        }
        const plot = new Mix('dayTarget', {
            tooltip: {
            shared: true,
              customItems: (originalItems) => {
                var isdep1 = 0;
                for (let i = 0; i < originalItems.length; i++) {
                    if(originalItems[i].title != "电商一部" && originalItems[i].name == "搜索询盘"){
                      originalItems[i].name = "询盘数量"
                    }else if(originalItems[i].title == "电商一部"){
                      isdep1 = 1
                    }
                }
                if(isdep1 == 1){
                  originalItems.unshift({
                    title: "电商一部",
                    name: "询盘数量",
                    value: Dep1DayNum,
                    color: "#89b2ff"
                  })
                }  
                return originalItems;
              },
            },
            plots: [
              {
                type: 'column',
                options: {
                  data,
                  xField: 'departname',
                  yField: 'number',
                  isGroup: true,
                  color: [ '#ebaa46', '#3ebea7', '#225ae5','#f47070'],
                  minColumnWidth: 22,
                  maxColumnWidth: 22,
                  legend: false,
                  dodgePadding: 6,
                  isStack: true,
                  seriesField: 'name',
                  groupField: 'stack',
                  yAxis: {
                    label:{
                      style:{
                        fill:"#111111",
                        opacity:1,
                      }
                    },
                    grid: {
                      line: {
                        style: {
                          stroke: '#e7e7e7',
                          lineWidth: 1,
                          lineDash: [3, 2],
                        },
                        
                      },
                    },
                    tickCount: 4,
                    tickInterval: 50,
                  },
                  annotations
                }
              }
            ]
        })
        $this.plot = plot;
        plot.render();
      }
    }
}
</script>

<style>
  #dayTarget{
    height: 200px;
  }
</style>