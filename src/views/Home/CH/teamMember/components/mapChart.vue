<template>
  <div class="item-row map-wrapper">
    <div class="static-wrapper" v-if="judgeData.singleGroupStatic||judgeData.pluralGroupStatic">
      <template v-if="currentData.length>0">
        <template v-for="item in currentData">
          <div class="item-column" v-if="item.isMap">
            <div class="column-wrap">
              <div class="column-header flex-box">
                <div class="txt-header">
                  <strong>{{item.title}}</strong><span>{{item.unit}}</span>
                </div>
              </div>
              <div class="column-body">
                <div class="item-map flex-box">
                  <div class="map-panel flex-content">
                    <cn-map-chart
                      :chart-data="item.mapData"
                      :color-data="item.colorData"
                      :id-data="item.randomStr"
                    ></cn-map-chart>
                  </div>
                  <div class="region-rank"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="item-column" v-else>
            <div class="column-wrap">
              <div class="column-header flex-box">
                <div class="txt-header">
                  <strong>{{item.title}}</strong><span>{{item.unit}}</span>
                </div>
              </div>
              <div class="column-body">
                <div class="item-map flex-box"></div>
                <div class="map-panel flex-content"></div>
                <div class="region-rank"></div>
              </div>
            </div>
          </div>
        </template>
      </template>
    </div>
    <div class="compare-wrapper" v-else></div>
  </div>
</template>

<script>
import cnMapChart from "./cnMapChart.vue";
export default {
  name: "mapChart",
  components: {
    cnMapChart,
  },
  data:function() {
    return {
      parentData:{},
    };
  },
  props: {
    itemData: {
      type: Array,
      default:[],
    },
    judgeData:{
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  computed:{
    currentData(){
      return this.itemData;
    },
  },
  watch: {
    judgeData:{
      handler(newValue, oldValue) {
        this.parentData = newValue;
      },
      deep: true,
      immediate:true
    },
  },
  mounted(){
  },
  methods:{
  },
};
</script>

<style>
</style>