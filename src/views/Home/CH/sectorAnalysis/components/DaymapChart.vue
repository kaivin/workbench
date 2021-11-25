<template>
    <div class="MapRowItem" :class="MapNum>2?'MapRowclass':''">
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
      regionMapChart: null,
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
          $this.MapHeight=$this.MapWidth*218/300;
          $this.TopWidth = $this.$el.clientWidth*0.3;
          $this.TopHeight = $this.$el.clientWidth*0.3*218/200;
        }else{
          $this.MapWidth = $this.$el.clientWidth;
          $this.MapHeight=$this.MapWidth*218/300;
          $this.TopWidth = $this.$el.clientWidth;
          if($this.MapNum==3){
            $this.TopHeight = $this.$el.clientWidth*0.6;
          }
          if($this.MapNum==4){
            $this.TopHeight = $this.$el.clientWidth*0.8;
          }
          if($this.MapNum==5){
            $this.TopHeight = $this.$el.clientWidth*1;
          }
          if($this.MapNum==6){
            $this.TopHeight = $this.$el.clientWidth*1.2;
          }
        }
        if ($this.regionMapChart &&!$this.regionMapChart.destroyed) {
            $this.regionMapChart.destroy();
        }
        if ($this.pieSourcePlot &&!$this.pieSourcePlot.chart.destroyed) {
            $this.pieSourcePlot.chart.destroy();
        }
        $this.drawCnCluesRegionChart();
        $this.drawTopTen();
    },
    // 中文地区询盘地图
    drawCnCluesRegionChart(){     
      var $this = this;
      if($this.MapArr.length>0){   
          fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/china-provinces.geo.json')
          .then(res => res.json())
          .then(GeoJSON => {
          const regionMapChart = new G2.Chart({
              container:'regionMapChart'+$this.id,
              width:$this.MapWidth,
              height:$this.MapHeight,
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
          $this.MapArr.forEach(function(items,index){
              var itemData = {};
              itemData.name = items.name;
              itemData.number = items.number;
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