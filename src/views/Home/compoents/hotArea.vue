<template>
  <div
    class="rowTwoOne"
   :class="language=='Module_cnStat'?'mapCNpad':'mapENpad'"
  >
    <div class="map-Top-chartTit flex-wrap">
      <h3>
        {{
          currentCluesData.departID
            ? currentCluesData.departName
            : language == "Module_cnStat"
            ? "中文"
            : "英文"
        }}热门{{ language == "Module_cnStat" ? "地区" : "国家" }}TOP10
      </h3>
      <div class="item-search flex-content">
        <el-date-picker
          v-model="mapDateData"
          size="mini"
          type="daterange"
          class="date-range"
          align="right"
          style="width: 220px"
          value-format="yyyy-MM-dd"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="dateRangeChangeHandler"
          :picker-options="pickerRangeOptions"
        >
        </el-date-picker>
      </div>
    </div>
    <div class="rowTwoOneItem">
      <div class="map-chart">
        <div
          v-if="language == 'Module_cnStat'"
          id="regionMapChart"
          class="chart-canvas"
        ></div>
        <div v-else id="worldRegionMapChart" class="chart-canvas"></div>
      </div>
      <div class="top-ten">
        <h3>热门地区TOP10</h3>
        <div id="topTen" class="chart-canva"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { Bullet,RadialBar,Liquid,Line,Area,measureTextWidth,Pie,Bar,Column,Mix,P,G2,Rose} from '@antv/g2plot';
import DataSet from '@antv/data-set';
import {MapInterval,TopTenColor,MapColor} from "@/utils/MapColor"
export default {
  name: "demo",
  data() {
    return {
        mapDateData:'',
        pickerRangeOptions: this.$pickerRangeOptions,
        numList:[],
        sumColor:[],
        worldRegionMapChart:null,//世界地图
        regionMapChart:null,//中国地图
        pieSourcePlot:null,//热门地区TOP10
    };
  },
  props: {
    language: {
      type: String,
      default: "",
    },
    mapDate:{
      type: Array,
      default: function () {
        return [];
      },
    },
    permitModules: {
      type: Array,
      default: function () {
        return [];
      },
    },
    zusuercount:{
      type: Object,
      default: function () {
        return {};
      },
    },
    currentCluesData: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  watch:{
    mapDate:function(newval){
      this.setDate(newval)
    }
  },
  created(){
  },
  methods:{
      // 中文地区日期选择改变事件
    dateRangeChangeHandler(val){
      this.$emit('dateRangeChangeHandlerDemo',val)
    },
    setDate(val){
      this.mapDateData = val
    },
    clearChat(){
      let $this = this;
      if($this.worldRegionMapChart&&!$this.worldRegionMapChart.destroyed){
        $this.worldRegionMapChart.destroy();
      }
      if($this.regionMapChart&&!$this.regionMapChart.destroyed){
        $this.regionMapChart.destroy();
      }
      if($this.pieSourcePlot&&!$this.pieSourcePlot.chart.destroyed){
        $this.pieSourcePlot.chart.destroy();
      }
    },
    // 中文地区询盘地图
    drawCnCluesRegionChart(){      
      var $this = this;  
      var colorObj = MapInterval($this.currentCluesData.cluesRegionData[0].number);
      var colorData = MapColor($this.currentCluesData.cluesRegionData,colorObj);
      $this.sumColor=colorData;      
      if($this.currentCluesData.cluesRegionData.length>0){   
        fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/china-provinces.geo.json')
        .then(res => res.json())
        .then(GeoJSON => {
          const regionMapChart = new G2.Chart({
            container: 'regionMapChart',
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
          geoView.legend({
            flipPage:false,
          })
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
          $this.currentCluesData.cluesRegionData.forEach(function(item,index){
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
                if(obj.number <=colorObj.minAverage){
                    obj.trend=colorObj.averArr[0];
                }else if(obj.number <=colorObj.minAverage*2 && obj.number>colorObj.minAverage){
                    obj.trend=colorObj.averArr[1];
                }else if(obj.number <=colorObj.minAverage*3 && obj.number>colorObj.minAverage*2){
                    obj.trend=colorObj.averArr[2];
                }else if(obj.number <=colorObj.minAverage*4 && obj.number>colorObj.minAverage*3){
                    obj.trend=colorObj.averArr[3];
                }else{
                    obj.trend=colorObj.averArr[4];
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
          userView.legend({
            flipPage:false,
          })
          userView.polygon()
            .position('longitude*latitude')     
            .color('trend', $this.sumColor)
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
    },
    // 热门地区TOP10
    drawTopTen(){
      var $this = this;
      if($this.currentCluesData.topTenRegionData.length>0){
        if($this.pieSourcePlot&&!$this.pieSourcePlot.chart.destroyed){
          $this.pieSourcePlot.changeData($this.currentCluesData.topTenRegionData);
        }else{ 
          var colorObj = MapInterval($this.currentCluesData.topTenRegionData[0].number);
          var topTenColor = TopTenColor($this.currentCluesData.topTenRegionData,colorObj);
          const pieSourcePlot = new Bar('topTen', {
            data:$this.currentCluesData.topTenRegionData,
            xField: 'number',
            yField: 'name',
            seriesField: 'name',
            barWidthRatio: 0.4,
            height:340,
            legend: false,
            appendPadding:[0, 50, 0, 30],
            xAxis:false,
            yAxis:{
              line:null,
              grid:null,
              tickLine:null,
              subTickLine:null
            },
            color:topTenColor,
            label: {
              style: {
                fill: '#999999',
                opacity: 1,
                fontSize: 12
              },
              position: 'right',
              offset:10,
            },
            meta: {
              name: {
                alias: '地区',
              },
              number: {
                alias: '数量',
              },
            },
          });
          $this.pieSourcePlot = pieSourcePlot;
          pieSourcePlot.render();
        }
      }
    },
    // 英文地区询盘地图
    drawEnCluesRegionChart(){
      var $this = this;
      var colorObj = MapInterval($this.currentCluesData.cluesRegionData[0].number);
      var colorData = MapColor($this.currentCluesData.cluesRegionData,colorObj);
      $this.sumColor=colorData;
      fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/world.geo.json')
      .then(res => res.json())
      .then(mapData => {
        const worldRegionMapChart = new G2.Chart({
          container: 'worldRegionMapChart',
          width: 800,
          height: 380,
        });
        worldRegionMapChart.tooltip({
          showTitle: false,
          showMarkers: false,
          shared: true,
        });
        // 同步度量
        worldRegionMapChart.scale({
          longitude: {
            sync: true
          },
          latitude: {
            sync: true
          }
        });
        worldRegionMapChart.axis(false);
        worldRegionMapChart.legend('trend', {
          position: 'bottom-left',
          itemHeight:20,
        });
        // 绘制世界地图背景
        var ds = new DataSet();
        const worldMap = ds.createView('back').source(mapData, {type: 'GeoJSON'});
        const worldMapView = worldRegionMapChart.createView();
        worldMapView.data(worldMap.rows);
        worldMapView.tooltip(false);
        worldMapView.polygon()
          .position('longitude*latitude')
          .color('grey')
          .style({
            fill: '#fff',
            stroke: '#ccc',
            lineWidth: 1,
          });
        // 可视化用户数据
        const userData = $this.currentCluesData.cluesRegionData;
        
        const userDv = ds.createView().source(userData).transform({
          // sizeByCount: true,
          geoDataView: worldMap,
          field: 'country',
          type: 'geo.region',
          as: ['longitude', 'latitude']
        }).transform({
          type: 'map',
          callback: obj => {
            if(obj.number <=colorObj.minAverage){
                obj.trend=colorObj.averArr[0];
            }else if(obj.number <=colorObj.minAverage*2 && obj.number>colorObj.minAverage){
                obj.trend=colorObj.averArr[1];
            }else if(obj.number <=colorObj.minAverage*3 && obj.number>colorObj.minAverage*2){
                obj.trend=colorObj.averArr[2];
            }else if(obj.number <=colorObj.minAverage*4 && obj.number>colorObj.minAverage*3){
                obj.trend=colorObj.averArr[3];
            }else{
                obj.trend=colorObj.averArr[4];
            }
            return obj;
          }
        });
        const userView = worldRegionMapChart.createView();
        userView.data(userDv.rows);
        userView.scale({
          number: {
            alias: '数量'
          },
          name:{
            alias:"国家"
          },
          country:{
            alias:"英文名"
          }
        });
        userView.polygon()
          .position('longitude*latitude')         
          .color('trend', $this.sumColor)
          .tooltip('name*country*number')
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
        $this.worldRegionMapChart = worldRegionMapChart;
        worldRegionMapChart.render();
      });
    },
  }
};
</script>

<style>
</style>