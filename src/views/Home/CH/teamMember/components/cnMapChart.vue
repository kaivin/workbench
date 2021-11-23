<template>
  <div class="map-panel">
    <div class="map-chart" :id="'map-'+idData"></div>
  </div>
</template>

<script>
import { G2 } from '@antv/g2plot';
import DataSet from '@antv/data-set';
import {MapColor} from "@/utils/MapColor"
export default {
  name: "cnMapChart",
  data:function() {
    return {
      parentData:{},
    };
  },
  props: {
    chartData: {
      type: Array,
      default:[],
    },
    colorData:{
      type: Object,
      default: function () {
        return {};
      },
    },
    idData:{
      type: String,
      default: "",
    },
  },
  computed:{
    currentData(){
      console.log(this.chartData,"图表数据")
      return this.chartData;
    },
  },
  watch: {
    colorData:{
      handler(newValue, oldValue) {
        this.parentData = newValue;
      },
      deep: true,
      immediate:true
    },
  },
  mounted(){
    console.log("执行mounted");
    console.log(this.currentData,"地图数据");
    this.drawMapChart();
  },
  methods:{
    drawMapChart(){
      var $this = this;
      var colorData = MapColor($this.currentData,$this.parentData);
      if(!$this.regionMapChart){   
        fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/china-provinces.geo.json')
        .then(res => res.json())
        .then(GeoJSON => {
          const regionMapChart = new G2.Chart({
            container: 'map-'+$this.idData,
            width:580,
            height:422,
            // 添加 element 选中和激活交互
            interactions: [{ type: 'element-single-selected' }, { type: 'element-active' }],
          });
          regionMapChart.scale({
            latitude: { sync: true },
            longitude: { sync: true }
          });
          regionMapChart.tooltip({
            showTitle: false,
            showMarkers: false,
            shared: true,
          });
          regionMapChart.axis(false);
          regionMapChart.legend('trend', {
            position: 'bottom-left',
          });
          // 绘制中国地图背景
          var ds = new DataSet();
          const geoDv = ds.createView('back').source(GeoJSON, {type: 'GeoJSON'});
          const geoView = regionMapChart.createView();
          geoView.data(geoDv.rows);
          geoView.tooltip(false);
          geoView.polygon()
            .position('longitude*latitude')
            .color('grey')
            .style({
              fill: '#fff',
              stroke: '#ccc',
              lineWidth: 1,
            });
          // 可视化用户数据
          const userData = [];
          $this.currentData.forEach(function(item,index){
            var itemData = {};
            itemData.name = item.name;
            itemData.number = item.number;
            userData.push(itemData);
          });
          
          const userDv = ds.createView().source(userData).transform({
            geoDataView: geoDv,
            field: 'name',
            type: 'geo.region',
            as: ['longitude', 'latitude']
          }).transform({
            type: 'map',
            callback: obj => {
              
                if(obj.number <=$this.parentData.minAverage){
                    obj.trend=$this.parentData.averArr[0];
                }else if(obj.number <=$this.parentData.minAverage*2 && obj.number>$this.parentData.minAverage){
                    obj.trend=$this.parentData.averArr[1];
                }else if(obj.number <=$this.parentData.minAverage*3 && obj.number>$this.parentData.minAverage*2){
                    obj.trend=$this.parentData.averArr[2];
                }else if(obj.number <=$this.parentData.minAverage*4 && obj.number>$this.parentData.minAverage*3){
                    obj.trend=$this.parentData.averArr[3];
                }else{
                    obj.trend=$this.parentData.averArr[4];
                }
                return obj;
            }
          });
          const userView = regionMapChart.createView();
          userView.data(userDv.rows);
          userView.scale({
            number: {
              alias: '数量'
            },
            name:{
              alias:"地区"
            }
          });
          userView.polygon()
            .position('longitude*latitude')     
            .color('trend', colorData)
            .tooltip('name*number')
            .style({
              fillOpacity: 1,
              stroke:"#fff"
            }).state({
              active: {
                style: {
                  lineWidth: 0,
                  stroke:0,
                  fillOpacity:0.8,
                },
              },
            }).animate({
              leave: {
                animation: 'fade-out'
              }
            });
          userView.interaction('element-active');
          $this.regionMapChart = regionMapChart;
          regionMapChart.render();
        });
      }
    }
  },
};
</script>

<style>
</style>