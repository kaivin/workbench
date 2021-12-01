<template>
  <div class="personTopTab">
      <div class="chooseDepart flex-box">
        <span class="choosetit">部门选择：</span>
        <div class="departItems flex-content">
          <span v-bind:class="item.isOn?'active':''" v-for="(item,index) in department" :key="index" v-on:click="departChange()">{{item.name}}</span>
        </div>
      </div>
      <div class="choosePerson">
          <div class="decor"></div>
          <div class="departItems">
              <p class="item-checkbox" v-bind:class="item.isOn?'active':''" v-for="(item,index) in choosePerson" v-bind:key="index"><i></i><span>{{item.name}}</span></p>
          </div>
      </div>
  </div>
</template>

<script>
export default {
  name: "TopTab",
  data() {
    return {
        department:[
            {
                id:1,
                name:"电商一部"
            },
            {
                id:2,
                name:"电商二部"
            },
            {
                id:3,
                name:"电商三部"
            },
            {
                id:4,
                name:"电商四部"
            }
        ],
        choosePerson:[
            {
                id:1,
                name:"袁丹丹"
            },
            {
                id:2,
                name:"赵雪伟"
            },
            {
                id:3,
                name:"高艳蕊"
            }
        ],
        departName:'',
        selectedPerson:[]
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

<style>

</style>