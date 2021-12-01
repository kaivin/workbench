<template>
  <div class="memberInquiry">
      <div class="memberTit">
          <h3>非付费成员-个人年度总<span>询盘个数</span>排行榜</h3>
          <p>（单位：个）</p>
      </div>
      <div class="inquiryRank">
          <ul class="inul"  :style="'height:'+ unpayInquirySet.boxHeight" >
              <li v-for="(item,index) in unpayInquiry" :key="index">
                  <div class="rankNum">
                      <div class="numTop" v-if="index<3" :class="'numTop0'+(index+1)"></div>
                      <div class="numNormal" v-if="index>2 && index < 9">
                          0{{index+1}}
                      </div>
                      <div class="numNormal" v-if="index > 8">
                          {{index+1}}
                      </div>
                  </div>
                  <div class="userImg">
                    <div v-if="item.headimg" class="headImg">
                      <img :src="item.headimg" :alt="item.name" />
                    </div>
                    <div v-else class="nopic"></div>  
                  </div>
                  <div class="userName">
                      {{item.name}}
                  </div>
                  <div class="userInquiry">
                      <span v-if="index<3" :class="'num0'+(index+1)"> 
                        {{item.number}}个
                      </span>
                      <span v-else> 
                        {{item.number}}个
                      </span>
                  </div>
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
          boxHeight = '770px'
        }
        
        $this.$emit("changeSet", $this.unpayInquirySet, isFold, boxHeight);
    },
  }
}
</script>

<style>

</style>