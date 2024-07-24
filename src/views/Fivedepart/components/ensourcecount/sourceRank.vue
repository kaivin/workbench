<template>
  <div class="memberInquiry flex-content">
      <div class="memberTit">
          <h3>{{currentData.name}}<span style="font-size:12px">{{currentData.isavg}}</span></h3>
          <p>({{datetime}})
            <span class="totalNum">总计：{{currentData.allscore}}{{currentData.unit}}</span>
            <!-- <span class="memberBtn"><i v-if='YSort' v-on:click="fallSort(currentData.name)">排序</i></span> -->
          </p>
      </div>
      <div class="inquiryRank">
          <ul class="inul" :style="'height:'+ currentData.boxHeight">
            <template v-if="currentData.mainArr.length > 0">
              <li v-for="(item,index) in currentData.mainArr" :key="index">
                <!-- <router-link :to="{path:'/Ownpush/chinasourcecount/channelAnalysis',query:{itemId:item.id,startTime:ByTime?startTime:'',endTime:ByTime?endTime:''}}" tag="a" target="_blank">  -->
                <a href="javaScript:;">
                  <div class="rankNum">
                      <div :style="item.emptyDivisor?'color:red;font-weight:bold;':''" class="numTop" v-if="item.ranking<numItem&&item.value>0" :class="'numTop0'+(item.ranking)"></div>
                      <div :style="item.emptyDivisor?'color:red;font-weight:bold;':''" class="numTop" v-if="item.ranking>(numItem-1) && item.ranking <= 9">
                          0{{item.ranking}}
                      </div>
                      <div :style="item.emptyDivisor?'color:red;font-weight:bold;':''" class="numTop" v-if="item.ranking > 9">
                          {{item.ranking}}
                      </div>
                  </div>
                  <div class="userName" :style="item.emptyDivisor?'color:red;font-weight:bold;':''">
                    <span v-if="item.country && item.country.length > 0">
                      <el-popover
                      placement="right"
                      width="330"
                      trigger="hover">
                      <el-table 
                        :data="item.country" 
                        :border="true" 
                        :style="'width:100%'"
                        max-height="400"
                        stripe
                        class="country_table"
                        :default-sort = "{prop: 'score', order: 'descending'}"
                      >
                        <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
                        <el-table-column prop="country" label="国家"></el-table-column>
                        <el-table-column prop="score" label="积分" sortable width="80" align="center"></el-table-column>
                      </el-table>
                      <span slot="reference">{{item.name}}</span>
                    </el-popover>
                      
                    </span>
                    <span v-else>{{item.name}}</span>
                  </div>
                  <div class="userInquiry flex-content">
                      <span :style="item.emptyDivisor?'color:red;font-weight:bold;':''" v-if="item.ranking<numItem&&item.value>0" :class="'num0'+(item.ranking)">{{item.number}}<span v-if='currentData.unit'>{{currentData.unit}}</span></span>
                      <span :style="item.emptyDivisor?'color:red;font-weight:bold;':''" v-else>{{item.number}}<span v-if='currentData.unit'>{{currentData.unit}}</span></span>
                  </div>
                </a>
                <!-- </router-link> -->
              </li>
            </template>
            <template v-else>
              <li class="nodata">暂无数据</li>
            </template>
          </ul>
          <div class="inMore" v-if="currentData.ifFold" :class="!currentData.isFold? 'inRotate' : 'rowRotate' "  @click="showAll" ></div>
          <div v-if="!currentData.isLevel">
              <pie-simple
                        :chart-data="currentData.mainArr"
                        :id-data="currentData.randomStr"
                        :scoreHeight="350"></pie-simple>
          </div>
      </div>
  </div>
</template>

<script>
import {parseTime}  from "@/utils";
import pieSimple from "./pieSimple.vue";
export default {
  name: "sourceRank",
  components: {
    pieSimple,
  },
  data() {
    return {
    };
  },
  created(){
  },
  props: {
    itemData: {
      type: Object,
      default: function () {
        return {};
      },
    },
    ByTime:{
      type: String,
      default: function () {
        return "";
      },
    },
    YSort:{
      type: Boolean,
      default: true,
    },
  },
  computed:{
    numItem(){
      var numItem=1;
      this.itemData.mainArr.forEach(function(item,index){
        if(item.ranking<4&&item.value>0&&index<4){
          numItem++
        }
      });
      return numItem;
    },
    currentData(){
      return this.itemData;
    },
    startTime(){
      if(this.ByTime&&this.ByTime!=''){
        var timeArr=this.ByTime.split(' ~ ');
        var startTime=timeArr[0];
        return startTime;
      }else{
          return '';
      }
    },
    endTime(){
      if(this.ByTime&&this.ByTime!=''){
        var timeArr=this.ByTime.split(' ~ ');
        var endTime=timeArr[1];
        return endTime;
      }else{
          return '';
      }
    },
    datetime(){
      if(this.ByTime&&this.ByTime!=''){
        return this.ByTime;
      }else{      
          var datetime = '截至'+parseTime(new Date(),'{y}.{m}.{d}');
          return datetime;
      }
    }
  },
  methods:{
    fallSort(dateArr){
      var $this=this;
      $this.$emit('fallSort',$this.currentData.name);
    },
    showAll(){
        var $this = this;
        var isFold = !$this.currentData.isFold;
        var boxHeight = '';
        if(isFold){
          boxHeight = "auto";
        }else{
          if($this.currentData.mainArr.length>6){
              boxHeight = $this.currentData.normalHeight;
          }else{
              boxHeight = $this.currentData.boxHeight;
          }
        }
        $this.$emit("changeSet",isFold, boxHeight,$this.currentData.name);
    },
  }
}
</script>

<style>
.memberTit p .totalNum{
  float: right;
  color: #0749f3;
  font-size: 14px;
}
.country_ul{
  max-height: 400px;
  overflow: scroll;
}
.country_ul li{
  font-size: 14px;
  color: #666;
  padding: 6px;
}
.country_table th.is-leaf{
    background:#e2e9ed;
    font-size: 14px;
    color:#555;
    font-weight:normal;
    border-bottom:1px solid #ebeff1;
    border-right:1px solid #ebeff1;
    line-height:20px;
    padding: 6px 0;
  }
.country_table  .el-table__body-wrapper{
  max-height: 353px!important;
}
</style>