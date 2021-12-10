<template>
  <div class="memberDeal">
      <div class="memberTit" v-if="lang =='ch'">
          <h3>成交积分榜单</h3>
          <p><span>非付费成员年度排行</span>(单位：分)</p>
      </div>
      <div class="memberTit" v-else>
          <h3>成交个数榜单</h3>
          <p><span>非付费成员年度排行</span>(单位：个)</p>
      </div>
      <div class="dealRank">
          <ul class="deul" :style="'height:'+ dealScoreSet.boxHeight">
              <li v-for="(item,index) in dealScore" :key="index">
                <router-link :to="{path: lang == 'ch'?'/stat/cn/memberAnalysis/singlePerson':'/stat/en/memberAnalysis/singlePerson',query:{deptId:item.dept_id,itemId:item.uid}}" tag="a" target="_blank"> 
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
                      <span><img :src="item.headimg" :alt="item.ownuser" /></span>
                    </div>
                    <div v-else class="nopic" :class="item.ranking<4?'headImgBorder':''"><span></span></div>  
                  </div>
                  <div class="userName"><span>{{item.ownuser}} - <span class="dept">{{item.deptName}}</span></span></div>
                  <div class="userInquiry flex-content" v-if="lang =='ch'">
                      <span v-if="item.ranking<4" :class="'num0'+(item.ranking)"> 
                        {{item.score}}分
                      </span>
                      <span v-else> 
                        {{item.score}}分
                      </span>  
                  </div>
                  <div class="userInquiry flex-content" v-else>
                      <span v-if="item.ranking<4" :class="'num0'+(item.ranking)"> 
                        {{item.score}}个
                      </span>
                      <span v-else> 
                        {{item.score}}个
                      </span>
                  </div>
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
    lang:{
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
          boxHeight = '630px'
        }
        
        $this.$emit("changeSet", $this.dealScoreSet, isFold, boxHeight);
    },
  }
}
</script>

<style></style>