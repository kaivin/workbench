<template>
    <div class="item-row year-chart flex-box">
      <div class="item-column flex-content flex-box flex-column">
          <div class="item-quality">
              <div class="column-header">
                  <div class="txt-header">
                      <strong>{{currentData.title}}</strong>
                  </div>
              </div>
              <div class="column-body">
                    <div class="colum-panel">
                        <item-year
                          :chart-data="currentData.inquiryYearCount"
                          :departArr="currentData.departArr"
                          :yarnArr="currentData.yarnArr"
                          :yarnClinch="currentData.yarnClinch"
                          :id-data="currentData.randomStr"
                          :scoreHeight="350"
                        ></item-year>
                    </div>
              </div>
          </div>
      </div>
      <div class="item-column flex-content">          
          <template v-if="currentData.tableData.length<3">
            <div class="qualityTable">
                <div class="qualityTableFl">
                    <p class="quaTit">日期</p>
                    <span v-for='(item,index) in currentData.yarnArr' :key='index'>{{item}}</span>
                </div>
                <div class="qualityTableFr flex-box">
                    <div class="qualityTableFrBom flex-content" v-for='(item,index) in currentData.tableData' :key='index'>
                          <p class="quaTit">{{item.name}}</p>
                          <p class="quaYear flex-box">
                            <span v-for='(itemk,indexk) in currentData.yarnClinch' :key='indexk'>{{itemk}}</span>
                          </p>
                          <p class="quaMain flex-box" v-for='(items,indexs) in item.mainArr' :key='indexs'>
                              <span v-for='(itemk,indexk) in items' :key='indexk'>{{itemk.score}}
                              </span>
                          </p>
                    </div>
                </div>
            </div> 
          </template>   
          <template v-if="currentData.tableData.length>2">
            <div class="qualityTable">
                <div class="qualityTableFl">
                    <p class="quaTit">日期</p>
                    <span v-for='(item,index) in currentData.yarnArr' :key='index'>{{item}}</span>
                </div>
                <div class="qualityTableFr flex-box">
                    <div class="qualityTableFrBom flex-content"v-for='(item,index) in currentData.tableData' v-if="index<2" :key='index'>
                          <p class="quaTit">{{item.name}}</p>
                          <p class="quaYear flex-box">
                            <span v-for='(itemk,indexk) in currentData.yarnClinch' :key='indexk'>{{itemk}}</span>
                          </p>
                          <p class="quaMain flex-box" v-for='(items,indexs) in item.mainArr' :key='indexs'>
                              <span v-for='(itemk,indexk) in items' :key='indexk'>{{itemk.score}}
                              </span>
                          </p>
                    </div>
                </div>
            </div> 
            <div class="qualityTable">
                <div class="qualityTableFl">
                    <p class="quaTit">日期</p>
                    <span v-for='(item,index) in currentData.yarnArr' :key='index'>{{item}}</span>
                </div>
                <div class="qualityTableFr flex-box">
                    <div class="qualityTableFrBom flex-content" v-for='(item,index) in currentData.tableData' v-if="index>1" :key='index'>
                          <p class="quaTit">{{item.name}}</p>
                          <p class="quaYear flex-box">
                            <span v-for='(itemk,indexk) in currentData.yarnClinch' :key='indexk'>{{itemk}}</span>
                          </p>
                          <p class="quaMain flex-box" v-for='(items,indexs) in item.mainArr' :key='indexs'>
                              <span v-for='(itemk,indexk) in items' :key='indexk'>{{itemk.score}}
                              </span>
                          </p>
                    </div>
                </div>
            </div> 
          </template> 
      </div>
    </div>
</template>
<script>
import itemYear from "./itemYear.vue";
export default {
  name: "qualityChart",
  components: {
    itemYear,
  },
  data:function() {
    return {
      parentData:{},      
    };
  },
  props: {
    itemData: {
      type: Object,
      default:{},
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
  methods:{
  },
};
</script>

<style></style>