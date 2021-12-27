<template>
    <div class="promapBoxFl">
      <div class="proAccountBox" v-for='(item,index) in currentData'>
            <p class="proAccountTit">{{item.title}}</p>
            <div class="item-map" :style="'width:'+item.mapWidth">
                <div class="map-panel">
                    <template v-if="isCn">
                        <cn-map-chart
                        :chart-data="item.mapData"
                        :color-data="item.colorData"
                        :id-data="item.randomStr"
                        :alias-data="item.alias"
                        :map-width="item.mapWidth"
                        :map-height="item.mapHeight"
                        ></cn-map-chart>
                    </template>
                    <template v-else>
                        <word-map-chart
                        :chart-data="item.mapData"
                        :color-data="item.colorData"
                        :id-data="item.randomStr"
                        :alias-data="item.alias"
                        :map-width="item.mapWidth"
                        :map-height="item.mapHeight"
                        ></word-map-chart>
                    </template>
                </div>
                <div class="region-rank">
                    <div class="txt-header"><strong>{{item.topTitle}}</strong></div>
                    <div class="bar-chart" v-if="item.topTenData[0].value>0">
                        <top-region
                        :chart-data="item.topTenData"
                        :color-data="item.topTenColor"
                        :id-data="item.randomStr"
                        :alias-data="item.alias"
                        :bar-height="270"
                        :is-cn="isCn"
                        ></top-region>
                    </div>
                </div>
            </div>
      </div>
    </div>
</template>

<script>
import cnMapChart from "../departGroup/cnMapChart.vue";
import wordMapChart from "../departGroup/wordMapChart.vue";
import topRegion from "../departGroup/topRegion.vue";
export default {
  name: "proMapChart",
  components: {
    wordMapChart,
    topRegion,
  },
  data:function() {
    return {
    };
  },
  props: {
    ChartMapArr:{
      type: Array,
      default:[],
    },
    isCn:{
      type: Boolean,
      default: true,
    },
  },
  computed:{
    currentData(){
      return this.ChartMapArr;
    },
  },
  methods:{
  },
};
</script>

<style></style>