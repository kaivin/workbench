<template>
  <div class="memberInquiry">
      <div class="memberTit">
          <h3>询盘个数榜单<span>({{datetime}})</span></h3>
          <p><span>{{isdep1?"付费":"非付费"}}成员年度排行</span>(单位：个)</p>
      </div>
      <div class="inquiryRank">
          <ul class="inul" :style="'height:'+ unpayInquirySet.boxHeight" >
            <template v-if="unpayInquiry.length > 0">
              <li v-for="(item,index) in unpayInquiry" :key="index">
                <router-link :to="{path: lang == 'ch'?'/stat/cn/memberAnalysis/singlePerson':'/stat/en/memberAnalysis/singlePerson',query:{deptId:item.dept_id,itemId:item.id}}" tag="a" target="_blank"> 
                  <div class="rankNum">
                      <div class="numTop" v-if="item.ranking<4" :class="'numTop0'+(item.ranking)"></div>
                      <div class="numTop" v-if="item.ranking>3 && item.ranking <= 9">
                          0{{item.ranking}}
                      </div>
                      <div class="numTop" v-if="item.ranking > 9">
                          {{item.ranking}}
                      </div>
                  </div>
                  <div class="userImg">
                    <div v-if="item.headimg" class="headImg" :class="item.ranking<4?'headImgBorder':''">
                      <span><img :src="item.headimg" :alt="item.name" /></span>
                    </div>
                    <div v-else class="nopic" :class="item.ranking<4?'headImgBorder':''"><span></span></div>  
                  </div>
                  <div class="userName"><span>{{item.name}} - <span class="dept">{{item.deptName}}</span></span></div>
                  <div class="userInquiry flex-content">
                      <span v-if="item.ranking<4" :class="'num0'+(item.ranking)">{{item.number}}个</span>
                      <span v-else>{{item.number}}个</span>
                  </div>
                  </router-link>
              </li>
            </template>
            <template v-else>
              <li class="nodata">暂无数据</li>
            </template>
          </ul>
          <div class="inMore" v-if="unpayInquirySet.ifFold" :class="!unpayInquirySet.isFold? 'inRotate' : 'rowRotate' "  @click="showAll" ></div>
      </div>
  </div>
</template>

<script>
import {parseTime}  from "@/utils";
export default {
  name: "UnpayInquiry",
  data() {
    return {
    };
  },
  created(){
  },
  props: {
    unpayInquiry: {
      type: Array,
      default: function () {
        return [];
      },
    },
    ByTime:{
      type: String,
      default: function () {
        return "";
      },
    },
    lang:{
      type: String,
      default: function () {
        return "";
      },
    },
    //折叠情况
    unpayInquirySet: {
      type: Object,
      default: function () {
        return {};
      },
    },
    isdep1:{
      type: Boolean,
      default: function () {
        return false;
      },
    }
  },
  computed:{
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
    showAll(){
        var $this = this;
        var isFold = !$this.unpayInquirySet.isFold;
        var boxHeight = '';
        if(isFold){
          boxHeight = "auto";
        }else{
          boxHeight = '630px'
        }
        $this.$emit("changeSet", $this.unpayInquirySet, isFold, boxHeight);
    },
  }
}
</script>

<style></style>