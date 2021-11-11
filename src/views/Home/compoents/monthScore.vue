<template>
  <div class="rowOneThree">
        <h3>{{currentCluesData.departID?currentCluesData.departName:language=='Module_cnStat'?'中文':'英文'}}月询盘</h3>
        <div class="rowOneThreeTop">
            <span>本月询盘</span>
            <strong>{{currentCluesData.allmonthnumber}}</strong>
            <p :class="currentCluesData.monthGrowth>0?'rising':'falling'">环比上月同期<span v-if="currentCluesData.monthGrowth>0">上升</span><span v-else>下降</span>{{currentCluesData.monthGrowthTxt}}</p>
        </div>
        <div class="rowOneThreeBom">
            <div id="rowOneThreeArea" class="chart-canvas"></div>
        </div>
  </div>
</template>

<script>
import {Area} from '@antv/g2plot';
export default {
    name:'demo',
    data(){
        return {

        }
    },
    props:{
        currentCluesData:{
            type:Object,
            default:function(){
                return {}
            }
        }
    },
    created(){
        
    },
    methods:{
 // 月询盘数据图
    monthtongChart(){
      var $this = this;
      if($this.currentCluesData.monthtongArr.length>0){
          if($this.monthtongArea&&!$this.monthtongArea.chart.destroyed){
            $this.monthtongArea.changeData($this.currentCluesData.monthtongArr);
          }else{
            var laseXunchange='';
            var monthtongLength=$this.currentCluesData.monthtongArr.length;
            laseXunchange=$this.currentCluesData.monthtongArr[monthtongLength-1].xunchange;

            const monthtongArea = new Area('rowOneThreeArea', {
              data:$this.currentCluesData.monthtongArr,
              xField: 'date',
              yField: 'xunnumber',
              height:100,
              padding:[20,25,22,15],
              xAxis: {
                range: [0, 1],
                tickCount: 6,
                title:{
                  style:{
                    fill: '#719ef6',
                    fontsize:'12',
                  }
                },
                tickLine:null,
                label:{
                  //offsetY:-30,
                  style: {
                    fill: '#5B8FF9',
                    
                    fontsize:'12',
                  },
                }
              },
              yAxis:false,
              label: {
                layout: [{ type: 'hide-overlap' }], // 隐藏重叠label
                style: {
                  textAlign: 'center',
                  color:'#9e9e9e',
                  fontsize:12,
                },
                formatter: (item) => {
                  return item.xunnumber
                },
              },
              point: {
                size:3,
                shape: 'circle',
                style: (res) => {
                  var obj = {
                    opacity: 0.5,
                    stroke: '#6392ec',
                    fill: '#fff',
                  }
                  return obj;
                },
              },
              tooltip: {
                //fields:['date','xunnumber', 'xunchange'],
                customContent: (title, data) => {
                  
                  if(data.length>0){
                    if(laseXunchange - data[0].data.xunchange>=0){
                       return `<div class='tooltip_fly'>
                      <div class='tip_item'><span class='tip_name'>${title}同期 ：</span><span class='tip_value'>${data[0].data.xunchange}</span><span class="rising">${laseXunchange - data[0].data.xunchange}</span></div>
                      <div class='tip_item'><span class='tip_name'>${title}总询盘：</span><span class='tip_value'>${data[0].data.xunnumber}</span></div>
                      
                      </div>`;
                    }else{
                      return `<div class='tooltip_fly'>
                      <div class='tip_item'><span class='tip_name'>${title}同期：</span><span class='tip_value'>${data[0].data.xunchange}</span><span class="falling">${Math.abs(laseXunchange - data[0].data.xunchange)}</div>
                      <div class='tip_item'><span class='tip_name'>${title}总询盘：</span><span class='tip_value'>${data[0].data.xunnumber}</span></div>
                      
                      </div>`;
                    }                   
                  }else{
                    return ''
                  }
                  
                }
              },
              areaStyle: () => {
                return {
                  fill: '#e4edfd',
                  fillOpacity:1,
                };
              },
            });
            $this.monthtongArea = monthtongArea;
            monthtongArea.render();
          }
      }
    },
    }
}
</script>

<style>

</style>