<template>
  <div class="item-row map-wrapper">
    <div class="static-wrapper" v-if="judgeData.singleGroupStatic||judgeData.pluralGroupStatic">
      <template v-if="currentData.length>0">
        <template v-for="item in currentData">
          <div class="item-column" v-if="item[0].isMap=='map'">
            <div class="column-wrap">
              <div class="column-header flex-box">
                <div class="txt-header">
                  <strong>{{item[0].title}}</strong><span>{{item[0].unit}}</span>
                </div>
              </div>
              <div class="column-body">
                <div class="item-map flex-box">
                  <div class="map-panel flex-content">
                    <template v-if="isCn">
                      <cn-map-chart
                        :chart-data="item[0].mapData"
                        :color-data="item[0].colorData"
                        :id-data="item[0].randomStr"
                        :alias-data="item[0].alias"
                        :map-width="item[0].mapWidth"
                        :map-height="item[0].mapHeight"
                      ></cn-map-chart>
                    </template>
                  </div>
                  <div class="region-rank">
                    <div class="txt-header"><strong>{{item[0].topTitle}}</strong></div>
                    <div class="bar-chart" v-if="item[0].topTenData[0].value>0">
                      <top-region
                        :chart-data="item[0].topTenData"
                        :color-data="item[0].topTenColor"
                        :id-data="item[0].randomStr"
                        :alias-data="item[0].alias"
                        :bar-height="280"
                        :is-cn="isCn"
                      ></top-region>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="item-column" v-if="item[0].isMap=='pro'">
            <item-product
              :item-data="item[0]"
            ></item-product>
          </div>
          <div class="item-column" v-if="item[0].isMap=='level'">
            <div class="column-wrap">
              <div class="column-header flex-box">
                <div class="txt-header">
                  <strong>{{item[0].title}}</strong>
                </div>
              </div>
              <div class="column-body">
                  <div class="item-pie">
                      <level-pie-chart
                        :chart-data="item[0].LevelCount"
                        :isCost="item[0].isCost"
                        :id-data="item[0].randomStr"
                        :scoreHeight="300"
                      ></level-pie-chart>
                  </div>
              </div>
            </div>
          </div>
        </template>
      </template>
    </div>
    <template v-else>
      <template v-if="currentData.length>0">
        <div class="compare-wrapper" v-for="item in currentData">
          <div class="compare-wrap" v-if="item.isMap=='map'">
            <div class="compare-header">
              <div class="txt-header">
                <strong>{{item.title}}</strong><span>{{item.unit}}</span>
              </div>
            </div>
            <div class="compare-body">
              <template v-for="item1 in item.mapDataArr">
                <div class="item-chart" v-bind:style="{width:item1.width}">
                  <div class="chart-title">{{item1.title}}</div>
                  <div class="map-panel" v-bind:style="{width:item1.mapWidth+'px',height:item1.mapHeight+'px'}">
                    <template v-if="isCn">
                      <cn-map-chart
                        :chart-data="item1.mapData"
                        :color-data="item1.colorData"
                        :id-data="item1.randomStr"
                        :alias-data="item1.alias"
                        :map-width="item1.mapWidth"
                        :map-height="item1.mapHeight"
                      ></cn-map-chart>
                    </template>
                  </div>
                  <div class="region-rank" v-bind:style="{width:item1.mapWidth+'px',height:'268px'}">
                    <div class="txt-header"><strong>{{item1.topTitle}}</strong></div>
                    <div class="bar-chart" v-if="item1.topTenData[0].value>0">
                      <top-region
                        :chart-data="item1.topTenData"
                        :color-data="item1.topTenColor"
                        :id-data="item1.randomStr"
                        :alias-data="item1.alias"
                        :bar-height="200"
                        :is-cn="isCn"
                      ></top-region>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
          <div class="compare-wrap"  v-if="item.isMap=='pro'">
            <div class="compare-header">
              <div class="txt-header">
                <strong>{{item.title}}</strong>
              </div>
            </div>
            <div class="compare-body">
              <div class="item-column">
                <template v-for="(item1,index) in item.itemData">
                  <template v-if="(index+1)%2===1">
                    <item-product
                      :item-data="item1"
                    ></item-product>
                  </template>
                </template>
              </div>
              <div class="item-column">
                <template v-for="(item1,index) in item.itemData">
                  <template v-if="(index+1)%2===0">
                    <item-product
                      :item-data="item1"
                    ></item-product>
                  </template>
                </template>
              </div>
            </div>
          </div>
          <div class="compare-wrap" v-if="item.isMap=='level'">
            <div class="compare-header">
              <div class="txt-header">
                <strong>{{item.title}}</strong>
              </div>
            </div>
            <div class="compare-body levelMain">
              <template v-for="item1 in item.LevelCount">
                <div class="level-pie" v-bind:style="{width:item1.width}">
                  <div class="chart-title">{{item1.title}}</div>
                  <div class="level-panel">
                    <level-pie-chart
                      :chart-data="item1.mapData"
                      :isCost="item1.isCost"
                      :id-data="item1.randomStr"
                      :scoreHeight="300"
                    ></level-pie-chart>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import cnMapChart from "../../../stat/components/departGroup/cnMapChart.vue";
import topRegion from "../../../stat/components/departGroup/topRegion.vue";
import itemProduct from "../../../stat/components/departGroup/itemProduct.vue";
import levelPieChart from "./levelPieChart.vue";
export default {
  name: "mapChart",
  components: {
    cnMapChart,
    topRegion,
    itemProduct,
    levelPieChart,
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
    isCn:{
      type: Boolean,
      default: true,
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
  methods:{
  },
};
</script>

<style></style>