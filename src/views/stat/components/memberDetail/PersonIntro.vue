<template>
  <div class="personalCard">
      <div class="personMsg">
          <div class="personAvatar">
              <img src="../../../../assets/clinchIcon01.png" alt="" />
          </div>
          <h3 class="personName">袁丹丹</h3>
          <p class="workTime">在河南红星机器有限公司工作了108天</p>
          <div class="rate_num">
              <span class="num01">P10</span>
              <span class="num02">组长</span>
          </div>
      </div>
      <div class="personMore">
          <div class="pHistory">历史成就</div>
          <div class="pCompare">对比</div>
      </div>
      <div class="personDepart">
          <div class="pdname">
              <p><span>部门：</span>电商一部-中文推广1组 </p>
          </div>
          <div class="pdsub">
              <p><span>入职时间：</span>2016-11-23</p>
              <p><span>主管：</span>李玉娟</p>
          </div>
      </div>
      <div class="clear:both"></div>
      <div class="monthResult">
          <div class="mtit">个人10月份数据表现：</div>
          <ul class="monthUl">
              <li>
                  <div class="mon01">询盘个数</div>
                  <span class="res">5824</span>
              </li>
              <li>
                  <div class="mon02">成交积分</div>
                  <span class="res">963</span>
              </li>
              <li>
                  <div class="mon03">100万成交个数</div>
                  <span class="res">-</span>
              </li>
              <li>
                  <div class="mon04">个人奖金 (元)</div>
                  <span class="res">18696</span>
              </li>
          </ul>
      </div>
  </div>
</template>

<script>
export default {
  name: "TopTab",
  data() {
    return {
        
      }
  },
  created(){
  },
  props: {
    payMember: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  methods:{
      departChange(){

      },
      personChange(){

      }
  }
}
</script>

<style></style>