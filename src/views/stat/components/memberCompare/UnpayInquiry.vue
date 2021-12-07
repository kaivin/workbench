<template>
  <div class="memberInquiry">
      <div class="memberTit">
          <h3>询盘个数榜单</h3>
          <p><span>非付费成员年度排行</span>(单位：个)</p>
      </div>
      <div class="inquiryRank">
          <ul class="inul"  :style="'height:'+ unpayInquirySet.boxHeight" >
              <li v-for="(item,index) in unpayInquiry" :key="index" @click="handleContrast(item.dept_id,item.id)">
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
                  <div class="userName"><span>{{item.name}}-{{item.deptName}}</span></div>
                  <div class="userInquiry flex-content">
                      <span v-if="item.ranking<4" :class="'num0'+(item.ranking)">{{item.number}}个</span>
                      <span v-else>{{item.number}}个</span>
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
          boxHeight = '630px'
        }
        
        $this.$emit("changeSet", $this.unpayInquirySet, isFold, boxHeight);
    },
    // 跳转到个人详情
    handleContrast(deptId,itemId){
      var $this=this;
      if($this.lang=='ch'){
        var routeUrl =  $this.$router.resolve({path: "/stat/cn/memberAnalysis/singlePerson",query:{deptId:deptId,itemId:itemId}});
      }else{
        var routeUrl =  $this.$router.resolve({path: "/stat/en/memberAnalysis/singlePerson",query:{deptId:deptId,itemId:itemId}});
      }
      window.open(routeUrl.href,'_blank');
    },
  }
}
</script>

<style></style>