<template>
  <div class="memberDeal">
      <div class="memberTit" v-if="lang =='ch'">
          <h3>非付费成员-个人年度总<span >成交积分</span>排行榜</h3>
          <p>（单位：分）</p>
      </div>
      <div class="memberTit" v-else>
          <h3>非付费成员-个人年度总<span>成交个数</span>排行榜</h3>
          <p>（单位：个）</p>
      </div>
      <div class="dealRank">
          <ul class="deul" :style="'height:'+ dealScoreSet.boxHeight">
              <li v-for="(item,index) in dealScore" :key="index">
                  <div class="rankNum">
                      <div class="numTop" v-if="index==0">
                          <img src="../../../../assets/deal1.png" alt="" />
                      </div>
                      <div class="numTop" v-if="index==1">
                          <img src="../../../../assets/deal2.png" alt="" />
                      </div>
                      <div class="numTop" v-if="index==2">
                          <img src="../../../../assets/deal3.png" alt="" />
                      </div>
                      <div class="numNormal" v-if="index>2 && index < 9">
                          0{{index+1}}
                      </div>
                      <div class="numNormal" v-if="index > 8">
                          {{index+1}}
                      </div>
                  </div>
                  <div class="userImg">
                    <div v-if="item.headimg" class="headImg">
                      <img :src="item.headimg" :alt="item.ownuser" />
                    </div>
                    <div v-else class="nopic"></div>  
                  </div>
                  <div class="userName">
                      {{item.ownuser}}
                  </div>
                  <div class="userInquiry">
                    <div v-if="lang =='ch'">
                        <div v-if="index<3" :class="'num0'+(index+1)"> 
                          {{item.score.toFixed(1)}}分
                        </div>
                        <div v-else> 
                          {{item.score.toFixed(1)}}分
                        </div>
                    </div>
                    <div v-else>
                        <div v-if="index<3" :class="'num0'+(index+1)"> 
                          {{item.score}}个
                        </div>
                        <div v-else> 
                          {{item.score}}个
                        </div>
                    </div>  
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
    },
    lang: {
      type: String,
      default: function () {
        return "";
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