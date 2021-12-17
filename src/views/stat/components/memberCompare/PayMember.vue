<template>
  <div class="payMember">
      <div class="payMemberTit">
          <h3>付费成员-个人年度<span>总排行</span></h3>
      </div>
        <el-table
            :data="payMember"
            style="width: 100%"
            class="yearRank"
            :default-sort = "{prop: 'number', order: 'descending'}"
            >
            <el-table-column
                type="index"
                label="排行"
                width="100">
                <template slot-scope="scope">
                    <span class="urank" :class="'urank0'+(scope.$index+1)" v-if="scope.$index<4">{{scope.$index+1}}</span>
                    <span class="urank" v-if="scope.$index>3 && scope.$index<=9">{{scope.$index+1}}</span>
                    <span class="urank" v-if="scope.$index > 9">{{scope.$index+1}}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="headimg"
                label="头像"
                min-width="100">
                <template slot-scope="scope">
                    <div v-if="scope.row.headimg" class="headImg">
                      <router-link :to="{path: lang == 'ch'?'/stat/cn/memberAnalysis/singlePerson':'/stat/en/memberAnalysis/singlePerson',query:{deptId:scope.row.dept_id,itemId:scope.row.id}}" tag="a" target="_blank">
                      <img :src="scope.row.headimg" :alt="scope.row.name" class="avatar" />
                      </router-link>
                    </div>
                    <div v-else class="nopic"></div>
                </template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="姓名"
                min-width="100">
                <template slot-scope="scope">
                  <router-link :to="{path: lang == 'ch'?'/stat/cn/memberAnalysis/singlePerson':'/stat/en/memberAnalysis/singlePerson',query:{deptId:scope.row.dept_id,itemId:scope.row.id}}" tag="a" target="_blank">
                    <span class="uname">{{scope.row.name}}</span></router-link>
                </template>
            </el-table-column>
            <el-table-column
                prop="number"
                label="询盘个数"
                sortable
                min-width="100">
                <template slot-scope="scope">
                    <span class="innum">{{scope.row.numberStr}}</span>
                </template>
            </el-table-column>

            <el-table-column
                v-if="lang=='ch'"
                prop="score"
                sortable
                label="成交积分">
                <template slot-scope="scope">
                    <span class="dealnum">{{scope.row.score}}</span>
                </template>
            </el-table-column>
            <el-table-column
                v-if="lang=='en'"
                prop="score"
                sortable
                label="成交个数">
                <template slot-scope="scope">
                    <span class="dealnum">{{scope.row.score}}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="Anumber"
                sortable
                label="百万成交"
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
    lang:{
      type: String,
      default: function () {
        return "";
      },
    }
  },
  methods:{
  }
}
</script>

<style></style>