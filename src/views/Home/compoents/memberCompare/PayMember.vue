<template>
  <div class="payMember">
      <div class="memberTit">
          <h3>付费成员-个人年度<span>总排行</span></h3>
          <p>（单位：个）</p>
      </div>
        <el-table
            :data="payMember"
            style="width: 100%"
            class="yearRank"
            :default-sort = "{prop: 'number', order: 'descending'}"
            >
            <el-table-column
                type="index"
                label="名次"
                width="100">
                <template slot-scope="scope">
                    <span class="urank" v-if="scope.$index<9">0{{scope.$index+1}}</span>
                     <span class="urank" v-else>{{scope.$index+1}}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="headimg"
                label="头像"
                min-width="100">
                <template slot-scope="scope">
                    <div v-if="scope.row.headimg">
                      <img :src="scope.row.headimg" :alt="scope.row.name" class="avatar" />
                    </div>
                    <div v-else class="nopic"></div>
                </template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="姓名"
                min-width="100">
                <template slot-scope="scope">
                    <span class="uname">{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="number"
                label="询盘个数"
                sortable
                min-width="100">
                <template slot-scope="scope">
                    <span class="innum">{{scope.row.number}}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="score"
                sortable
                label="询盘积分">
                <template slot-scope="scope">
                    <span class="dealnum">{{scope.row.score}}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="Anumber"
                sortable
                label="百万成交个数"
                >
                <template slot-scope="scope">
                    <span class="milnum">×{{scope.row.Anumber}}</span>
                </template>
            </el-table-column>
        </el-table>
  </div>
</template>

<script>
export default {
  name: "PayMember",
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

  }
}
</script>

<style>

</style>