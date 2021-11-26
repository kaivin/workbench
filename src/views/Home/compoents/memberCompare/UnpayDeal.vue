<template>
  <div class="memberDeal">
      <div class="memberTit">
          <h3>非付费成员-个人年度总<span>成交积分</span>排行榜</h3>
          <p>（单位：分）</p>
      </div>
      <div class="dealRank">
          <ul class="deul" :style="'height:'+ dealScoreSet.boxHeight">
              <li v-for="(item,index) in dealScore" :key="index">
                  <div class="rankNum">
                      <div class="numTop" v-if="index==0">
                          <img src="../../../../assets/deal1.gif" alt="" />
                      </div>
                      <div class="numTop" v-if="index==1">
                          <img src="../../../../assets/deal2.gif" alt="" />
                      </div>
                      <div class="numTop" v-if="index==2">
                          <img src="../../../../assets/deal3.gif" alt="" />
                      </div>
                      <div class="numNormal" v-if="index>2 && index < 9">
                          0{{index+1}}
                      </div>
                      <div class="numNormal" v-if="index > 8">
                          {{index+1}}
                      </div>
                  </div>
                  <div class="userImg">
                    <div v-if="item.headimg">
                      <img :src="item.headimg" :alt="item.ownuser" />
                    </div>
                    <div v-else class="nopic"></div>  
                  </div>
                  <div class="userName">
                      {{item.ownuser}}
                  </div>
                  <div class="userInquiry">
                      <span v-if="index<3" :class="'num0'+(index+1)"> 
                        {{item.score.toFixed(1)}}分
                      </span>
                      <span v-else> 
                        {{item.score.toFixed(1)}}分
                      </span>
                  </div>
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
    //折叠情况
    dealScoreSet: {
      type: Object,
      default: function () {
        return {};
      },
    }
  },
  methods:{
    showAll(){
        var $this = this;
        var isFold = !$this.dealScoreSet.isFold;
        var boxHeight = '';
        if(isFold){
          boxHeight = "auto";
        }else{
          boxHeight = '770px'
        }
        
        $this.$emit("changeSet", $this.dealScoreSet, isFold, boxHeight);
    },
  }
}
</script>

<style>

</style>