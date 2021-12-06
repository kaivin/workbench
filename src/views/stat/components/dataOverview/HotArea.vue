<template>
  <div class="hxpage">
    <div class="module-top">
      <div class="title-view">
        <div class="title">{{language=="中文"?'中文年度热门地区TOP5':'英文年度热门国家TOP5'}}</div>
        <div class="unit">{{type == 1?'（单位：分）':'（单位：个）'}}</div>
        <div class="more" @click="goPage">详情 <i class="svg-i"><svg-icon icon-class="rt-more"></svg-icon></i></div>
        <div class="btn-group">
          <div @click="changeType(0)" class="btn-item" :class="type == 0?'active':''">询盘</div>
          <div @click="changeType(1)" class="btn-item" :class="type == 1?'active':''">成交积分</div>
          <div v-if="language=='英文'" @click="changeType(2)" class="btn-item" :class="type == 2?'active':''">成交个数</div>
        </div>
      </div>
      <div class="rowTwoOneItem">
        <div class="map-chart">
          <div
            v-if="language == '中文'"
            id="regionMapChart"
            class="chart-canvas"
          ></div>
          <div v-else id="worldRegionMapChart" class="chart-canvas"></div>
        </div>
        <div class="top-ten">
          <div id="topTen" class="chart-canva"></div>
        </div>
      </div>

    </div>
  </div>
  
</template>

<script>
import { Bar,P,G2,} from '@antv/g2plot';
import { worldCountry } from "@/utils/worldCountry";
import DataSet from '@antv/data-set';
import {MapInterval,MapColor,TopTenColor} from "@/utils/MapColor";
export default {
    name:'demo',
    data(){
      return {
        mapDateData:'',
        numList:[],
        sumColor:[],
        type:0,//0 询盘  1 成交积分  2 成交个数
        worldRegionMapChart:null,//世界地图
        regionMapChart:null,//中国地图
        pieSourcePlot:null,//热门地区TOP10
      }
    },
    props:{
      language:{
        type:String,
        default:"中文"
      },
      provincecountmap:{//询盘地图
          type:Array,
          default:function(){
            return []
          } 
      }, 
      provincescoretmap:{//成交积分地图
        type:Array,
        default:function(){
          return []
        } 
      },
      provincescorenumbertmap:{//成交个数地图
        type:Array,
        default:function(){
          return []
        } 
      },
      departList:{
        type:Array,
        default:function(){
          return []
        }
      }

    },
    watch:{
      provincecountmap:{
        handler(newval,oldval){
          if(this.language == '中文'){
            this.drawCnCluesRegionChart(newval);
          }else{
            this.drawEnCluesRegionChart(newval);
          }
          
          this.drawTopTen();
        },
        deep:true
      },
      type:function(newval,oldval){
        if(this.language == '中文'){
            this.drawCnCluesRegionChart(newval);
          }else{
            this.drawEnCluesRegionChart(newval);
          }
        this.drawTopTen();
      }
    },
    mounted(){
     
    },
    methods:{
      goPage(){
        var newDate = new Date();
        var newYear = newDate.getFullYear();
        var startTime = newYear + "/01";
        var endTime = newYear + "/12";
        var baseDepart = "";
        var contrastDepartArr = [];
        this.departList.forEach(function(item,index){
          if(index == 0){
            baseDepart = item.id;
          }else{
            contrastDepartArr.push(item.id);
          }
        });
        var contrastDepart = "";
        if(contrastDepartArr.length>0){
          contrastDepart = contrastDepartArr.join(",");
        }
       if(this.language == '中文'){
         if(this.type == 0){
           this.$router.push({path:'/stat/cn/departAnalysis',query:{type:4,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}});
         }else if(this.type == 1){
           this.$router.push({path:'/stat/cn/departAnalysis',query:{type:5,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}});
         }
       }else{
         if(this.type == 0){
           this.$router.push({path:'/stat/en/departAnalysis',query:{type:4,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}});
         }else if(this.type == 1){
           this.$router.push({path:'/stat/en/departAnalysis',query:{type:5,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}});
         }else if(this.type == 2){
           this.$router.push({path:'/stat/en/departAnalysis',query:{type:7,startTime:startTime,endTime:endTime,baseDepart:baseDepart,contrastDepart:contrastDepart}});
         }
       }
      },
      changeType(val){
        this.type = val;
      },
      // 中文地区询盘地图
      drawCnCluesRegionChart(newval){
        var $this = this;
        var maxNum='';
        var minAverage='';
        let mapCountData = [];
        if(this.type == 0){
          mapCountData = $this.provincecountmap;
        }else{
          mapCountData = $this.provincescoretmap;
         
          mapCountData.sort(function(a,b){
            return a.number-b.number
          }).reverse();
        }
        if($this.worldRegionMapChart&&!$this.worldRegionMapChart.destroyed){
        $this.worldRegionMapChart.destroy();
        }
        if($this.regionMapChart&&!$this.regionMapChart.destroyed){
          $this.regionMapChart.destroy();
        }
        mapCountData.forEach(function(item,index){
            if(maxNum<item.number){
              maxNum=item.number;
            }
        });
        let mapInterval = MapInterval(maxNum);
        let mapColor = MapColor(mapCountData,mapInterval)
        
        if(mapCountData.length>0){   
          fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/china-provinces.geo.json')
          .then(res => res.json())
          .then(GeoJSON => {
            const regionMapChart = new G2.Chart({
              container: 'regionMapChart',
              width:300,
              height:240,
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
              flipPage:false,
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
            mapCountData.forEach(function(item,index){
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
                  if(obj.number <=mapInterval.minAverage){
                      obj.trend=mapInterval.averArr[0];
                  }else if(obj.number <=mapInterval.minAverage*2 && obj.number>mapInterval.minAverage){
                      obj.trend=mapInterval.averArr[1];
                  }else if(obj.number <=mapInterval.minAverage*3 && obj.number>mapInterval.minAverage*2){
                      obj.trend=mapInterval.averArr[2];
                  }else if(obj.number <=mapInterval.minAverage*4 && obj.number>mapInterval.minAverage*3){
                      obj.trend=mapInterval.averArr[3];
                  }else{
                      obj.trend=mapInterval.averArr[4];
                  }
                  return obj;
              }
            });
            const userView = regionMapChart.createView();
            userView.data(userDv.rows);
            userView.scale({
              number: {
                alias: $this.type == 0?'数量':'积分'
              },
              name:{
                alias:"地区"
              }
            });
            
            userView.polygon()
              .position('longitude*latitude')     
              .color('trend', mapColor)
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
        
        if($this.pieSourcePlot&&!$this.pieSourcePlot.destroyed){
          $this.pieSourcePlot.destroy();
        }
         let mapCountData = [];
        if(this.type == 0){
          mapCountData = $this.provincecountmap;
        }else if(this.type == 1){
          mapCountData = $this.provincescoretmap;
          
          mapCountData.sort(function(a,b){
            return a.number-b.number
          }).reverse();
        }else if(this.type == 2){
          mapCountData = $this.provincescorenumbertmap;
          mapCountData.sort(function(a,b){
            return a.number-b.number
          }).reverse();
        }
        mapCountData = mapCountData.slice(0,5);
        const maxNum =  mapCountData[0].number;
        const mapInterval = MapInterval(maxNum);
        const topTenColor = TopTenColor(mapCountData,mapInterval);
        if(mapCountData.length>0){
          const pieSourcePlot = new Bar('topTen', {
          data:mapCountData,
          xField: 'number',
          yField: $this.language =='中文'?'name':'country',
          seriesField: $this.language =='中文'?'name':'country',
          barWidthRatio: 0.4,
          height:240,
          legend: false,
          appendPadding:[0, 30, 0, 10],
          xAxis:{
            grid: {
              line: {
                style: {
                  stroke: "#cccccc",
                  lineWidth: 1,
                  lineDash: [3, 2],
                  strokeOpacity: 0.3,
                  shadowColor: null,
                  shadowBlur: 0,
                  shadowOffsetX: 0,
                  shadowOffsetY: 0,
                },
              },
            },
            line:null,
          },
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
              alias: $this.type == 0?'数量':'积分'
            },
          },
        });
        $this.pieSourcePlot = pieSourcePlot;
        pieSourcePlot.render();
        }
      },
      // 英文地区询盘地图
      drawEnCluesRegionChart(){
        var $this = this;
        var maxNum='';
        var minAverage='';
        let mapCountData = [];
        if(this.type == 0){
          mapCountData = worldCountry($this.provincecountmap);
        }else if(this.type == 1){
          mapCountData = worldCountry($this.provincescoretmap);
        }else{
          mapCountData = worldCountry($this.provincescorenumbertmap);
        }
        mapCountData.sort(function(a,b){return a.number-b.number}).reverse();
        if($this.worldRegionMapChart&&!$this.worldRegionMapChart.destroyed){
          $this.worldRegionMapChart.destroy();
        }
        if($this.regionMapChart&&!$this.regionMapChart.destroyed){
          $this.regionMapChart.destroy();
        }
        $this.numList='';
        $this.sumColor=[];
        mapCountData.forEach(function(item,index){
            if(maxNum<item.number){
              maxNum=item.number;
            }
        });
        let mapInterval = MapInterval(maxNum);
        let mapColor = MapColor(mapCountData,mapInterval)
       
        fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/world.geo.json')
        .then(res => res.json())
        .then(mapData => {
          const worldRegionMapChart = new G2.Chart({
            container: 'worldRegionMapChart',
            width: 400,
            height: 240,
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
            flipPage:false,
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
          const userData = mapCountData;
          
          const userDv = ds.createView().source(userData).transform({
            // sizeByCount: true,
            geoDataView: worldMap,
            field: 'country',
            type: 'geo.region',
            as: ['longitude', 'latitude']
          }).transform({
            type: 'map',
            callback: obj => {
              if(obj.number <=mapInterval.minAverage){
                  obj.trend=mapInterval.averArr[0];
              }else if(obj.number <=mapInterval.minAverage*2 && obj.number>mapInterval.minAverage){
                  obj.trend=mapInterval.averArr[1];
              }else if(obj.number <=mapInterval.minAverage*3 && obj.number>mapInterval.minAverage*2){
                  obj.trend=mapInterval.averArr[2];
              }else if(obj.number <=mapInterval.minAverage*4 && obj.number>mapInterval.minAverage*3){
                  obj.trend=mapInterval.averArr[3];
              }else{
                  obj.trend=mapInterval.averArr[4];
              }
              return obj;
            }
          });
          const userView = worldRegionMapChart.createView();
          userView.data(userDv.rows);
          userView.scale({
            number: {
              alias: $this.type == 1?'积分':'数量'
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
            .color('trend', mapColor)
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
}
</script>

<style></style>