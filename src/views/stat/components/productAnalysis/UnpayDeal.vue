<template>
  <div class="memberDeal">
      <div class="memberTit">
          <h3 v-if="type==4">成交个数榜单</h3>
          <h3 v-else>成交积分榜单</h3>
          <p><span>全部产品年度排行</span><i v-if="type==4">(单位：个)</i><i v-else>(单位：分)</i></p>
          <div class="btn-group" v-if="lang =='en'">
            <div @click="changeType(4)" class="btn-item" :class="type == 4?'active':''">个数</div>
            <div @click="changeType(5)" class="btn-item" :class="type == 5?'active':''">积分</div>
          </div>
      </div>
      <div class="dealRank">
          <ul class="inquiryUl" :style="'height:'+ dealScoreSet.boxHeight">
                <li class="inquiryUlTit">
                  <div class="proSortTit"><span>排序</span></div>
                  <div class="proName"><span>产品名</span></div>
                  <div class="proNum flex-content" v-if="type==4"><span>个数</span></div>
                  <div class="proPie flex-content" v-if="type==4"><span>产品占比</span></div>
                  <div class="proNum flex-content" v-if="type==5"><span>积分</span></div>
                  <div class="proPie flex-content" v-if="type==5"><span>积分占比</span></div>
                </li>
              <li v-for="(item,index) in dealScore" :key="index">
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
                      <div class="proName"><span>{{item.xunproduct}}</span></div>
                      <div class="proNum" v-if="type==4"><span>{{item.number}}个</span></div>
                      <div class="proPie" v-if="type==4"><span>{{item.percentNum}}%</span></div>
                      <div class="proNum" v-if="type==5"><span>{{item.scorenumber}}分</span></div>
                      <div class="proPie" v-if="type==5"><span>{{item.percentScore}}%</span></div>
                  </router-link>
              </li>
          </ul>
          <div class="deMore" v-if="dealScoreSet.ifFold" :class="!dealScoreSet.isFold? 'inRotate' : 'rowRotate' "  @click="showAll" ></div>
      </div>
  </div>
</template>
<script>
export default {
      name: "UnpayDeal",
  data() {
    return {
        type:5,//4 询盘  5 成交积分
    };
  },
  created(){
  },
  props: {
    dealScore: {
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
    dealScoreSet: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  methods:{
    changeType(val){
      var $this = this;
      $this.type = val;
    },
    showAll(){
        var $this = this;
        var isFold = !$this.dealScoreSet.isFold;
        var boxHeight = '';
        if(isFold){
          boxHeight = "auto";
        }else{
          boxHeight = '616px'
        }
        
        $this.$emit("changeSet", $this.dealScoreSet, isFold, boxHeight);
    },
  }
}
</script>

<style></style>