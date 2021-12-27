<template>
  <div class="memberInquiry">
      <div class="memberTit">
          <h3>询盘个数榜单</h3>
          <p><span>全部产品年度排行</span>(单位：个)</p>
      </div>
      <div class="inquiryRank">
          <ul class="inquiryUl" :style="'height:'+ unpayInquirySet.boxHeight">
              <li class="inquiryUlTit">
                  <div class="proSortTit"><span>排序</span></div>
                  <div class="proName"><span>产品名</span></div>
                  <div class="proNum flex-content"><span>个数</span></div>
                  <div class="proPie flex-content"><span>产品占比</span></div>
              </li>
              <li v-for="(item,index) in unpayInquiry" :key="index">
                  <router-link :to="{path: lang == 'ch'?'/stat/cn/productAnalysis/ProAccount':'/stat/en/productAnalysis/ProAccount',query:{starttime:item.starttime,endtime:item.endtime,productname:item.productname,typeid:item.typeid}}" tag="a" target="_blank"> 
                    <div class="proSort">
                        <div class="numTop" v-if="item.ranking<4" :class="'numTop0'+(item.ranking)"></div>
                        <div class="numTop" v-if="item.ranking>3 && item.ranking <= 9">
                            0{{item.ranking}}
                        </div>
                        <div class="numTop" v-if="item.ranking > 9">
                            {{item.ranking}}
                        </div>
                    </div>
                    <div class="proName"><span>{{item.keyproduct}}</span></div>
                    <div class="proNum flex-content"><span>{{item.number}}个</span></div>
                    <div class="proPie flex-content">
                        <span>{{item.percentNum}}%</span>
                    </div>
                  </router-link>
              </li>
          </ul>
          <div class="inMore" v-if="unpayInquirySet.ifFold" :class="!unpayInquirySet.isFold? 'inRotate' : 'rowRotate' "  @click="showAll" ></div>
      </div>
  </div>
</template>

<script>
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
          boxHeight = '616px'
        }
        $this.$emit("changeSet", $this.unpayInquirySet, isFold, boxHeight);
    },
  }
}
</script>

<style></style>