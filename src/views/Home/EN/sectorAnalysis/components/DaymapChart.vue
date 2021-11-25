<template>
    <div class="MapRowItem">
        <div class="DayMapRowFl" :id="'regionMapChart'+id">
        </div>
        <div class="DayMapRowFr">
            <h4>热门地区TOP10</h4>
            <div :id="'topTen'+id" class="chartTen"></div>
        </div>
    </div>
</template>
<script>
import {MapInterval} from '@/utils/MapColor';
import {G2,Bar} from '@antv/g2plot';
import DataSet from '@antv/data-set';
export default {
  props: {
    searchcompare: {
      type: String,
      default: "",
    },
    mapanychart: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      worldRegionMapChart: null,
      pieSourcePlot: null,
      MapArr:this.mapanychart.MapArr,
      MapTopTen:this.mapanychart.MapTopTen,
      is_compare:this.mapanychart.is_compare,
      MapNum:this.mapanychart.MapNum,
      MapHeight:'',
      MapWidth:'',
      TopHeight:'',
      TopWidth:'',
      numList:this.mapanychart.numList,
      averArr:this.mapanychart.averArr,
      sumColor:this.mapanychart.defaulColor,
      minAverage:this.mapanychart.minAverage,
      id: Math.random()
        .toString(36)
        .substr(2)
    };
  },
  // 生命周期 - 载入后, Vue 实例挂载到实际的 DOM 操作完成，一般在该过程进行 Ajax 交互
  mounted() {
    this.init();
  },
  watch:{
      mapanychart(newVal,oldVal){
        this.MapArr=newVal.MapArr;
        this.MapTopTen=newVal.MapTopTen;
        this.is_compare=newVal.is_compare;
        this.MapNum=newVal.MapNum;
        this.numList=newVal.numList;
        this.averArr=newVal.averArr;
        this.sumColor=newVal.defaulColor;
        this.minAverage=newVal.minAverage;
        this.init();
      },
  },
  // 方法集合
  methods: {
    init(){
        var $this=this;
        if(($this.is_compare=='1'||$this.is_compare=='2')&&$this.MapNum<3){
          $this.MapWidth = $this.$el.clientWidth*0.5;
          $this.MapHeight=$this.MapWidth*380/700;
          $this.TopWidth = $this.$el.clientWidth*0.3;
          $this.TopHeight = $this.$el.clientWidth*0.3*380/600;
        }else{
          $this.MapWidth = $this.$el.clientWidth;
          $this.MapHeight=$this.MapWidth*380/700;
          $this.TopWidth = $this.$el.clientWidth;
          if($this.MapNum==3){
            $this.TopHeight = $this.$el.clientWidth*0.6;
          }
          if($this.MapNum==4){
            $this.TopHeight = $this.$el.clientWidth*0.6;
          }
          if($this.MapNum==5){
            $this.TopHeight = $this.$el.clientWidth*0.8;
          }
        }
        if ($this.worldRegionMapChart &&!$this.worldRegionMapChart.destroyed) {
            $this.worldRegionMapChart.destroy();
        }
        if ($this.pieSourcePlot &&!$this.pieSourcePlot.chart.destroyed) {
            $this.pieSourcePlot.chart.destroy();
        }
        $this.drawEnCluesRegionChart();
        $this.drawTopTen();
    },
    // 英文地区询盘地图
    drawEnCluesRegionChart(){
      var $this = this;
      if($this.MapArr.length>0){        
        fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/world.geo.json')
        .then(res => res.json())
        .then(mapData => {
          const worldRegionMapChart = new G2.Chart({
            container:'regionMapChart'+$this.id,
            width:$this.MapWidth,
            height:$this.MapHeight,
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
          const userData = $this.MapArr;
          const userDv = ds.createView().source(userData).transform({
            // sizeByCount: true,
            geoDataView: worldMap,
            field: 'country',
            type: 'geo.region',
            as: ['longitude', 'latitude']
          }).transform({
            type: 'map',
            callback: obj => {              
                  if(obj.number <=$this.minAverage){
                      obj.trend=$this.averArr[0];
                  }else if(obj.number <=$this.minAverage*2 && obj.number>$this.minAverage){
                      obj.trend=$this.averArr[1];
                  }else if(obj.number <=$this.minAverage*3 && obj.number>$this.minAverage*2){
                      obj.trend=$this.averArr[2];
                  }else if(obj.number <=$this.minAverage*4 && obj.number>$this.minAverage*3){
                      obj.trend=$this.averArr[3];
                  }else{
                      obj.trend=$this.averArr[4];
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
      }
    },
    // 热门地区TOP10
    drawTopTen(){
      var $this = this;
      if($this.MapTopTen&&$this.MapTopTen.length>0){
          var numList=$this.numList;  
          var defaulColor=$this.sumColor;          
          var rel=$this.MapTopTen;
          var topTenColor=[];          
          $this.MapTopTen.forEach(function(items,index){
              if(defaulColor.length>=5){
                  for(var i=0;i<numList.length;i++){
                  if(items.number>=numList[i]){
                      topTenColor.push(defaulColor[i]);
                      break;
                  }
                  if(items.number<numList[numList.length-1]){
                      topTenColor.push(defaulColor[numList.length-1]);
                      break;
                  }
                  }
              }else{              
                  for(var i=0;i<numList.length;i++){
                  if(items.number>numList[i]){
                      topTenColor.push(defaulColor[i]);
                      break;
                  }
                  if(items.number<=numList[numList.length-1]){
                      topTenColor.push(defaulColor[numList.length-1]);
                      break;
                  }
                  }
              }
          });
          topTenColor=topTenColor.reverse();
          const pieSourcePlot = new Bar('topTen'+$this.id, {
              data:$this.MapTopTen,
              xField: 'number',
              yField: 'name',
              seriesField: 'name',
              barWidthRatio: 0.4,
              width:$this.TopWidth,
              height:$this.TopHeight,
              legend: false,
              appendPadding:[0, 50, 0, 0],
              xAxis:false,
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