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
                label="组员"
                min-width="100">
                <template slot-scope="scope">
                    <div v-if="scope.row.headimg" class="headImg" @click="handleContrast(scope.row.dept_id,scope.row.id)">
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
                    <span class="uname" @click="handleContrast(scope.row.dept_id,scope.row.id)">{{scope.row.name}}</span>
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