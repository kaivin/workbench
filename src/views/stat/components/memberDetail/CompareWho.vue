<template>
  <div class="compareWho">
      <div class="user_img">
          <img src="../../../../assets/clinchIcon01.png" alt="" />
      </div>
      <div class="user_name">
          <h4>袁丹丹</h4>
          <p>电商一部-中文推广1组 </p>
      </div>
      <div class="delIt"></div>
  </div>
</template>

<script>
export default {
  name: "CompareWho",
  data() {
    return {

      }
  },
  created(){
      
  },
  mounted(){
      var $this = this;
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

  }
}
</script>

<style></style>