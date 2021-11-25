<template>
  <div class="personTopTab">
      <div class="chooseDepart">
        <span class="choosetit">部门选择：</span>
        <el-radio-group v-model="departName" @change="departChange" class="departItems">
            <el-radio-button v-for="(item,index) in department" :label="item.name" :key="index"></el-radio-button>
        </el-radio-group>  
      </div>
      <div class="choosePerson">
        <el-checkbox-group v-model="selectedPerson" @change="personChange" class="personItems">
            <div class="decor"></div>
            <el-checkbox v-for="(item,index) in choosePerson" :label="item.name" :key="index" ></el-checkbox>
        </el-checkbox-group>
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