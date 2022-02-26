<template> 
<div class="dealRankMainItem">  
    <div class="dealRankMainBox">      
        <el-table
            ref="SimpleTable"
            :data="RankData"
            tooltip-effect="dark"
            stripe
            class="SiteTable EntableColor"
            style="width: 100%"
            row-key="id"
            key="a"
            >
            <el-table-column
              prop="ranking"
              label="排名"
              width='50'
              >
            </el-table-column>
            <el-table-column
              prop="name"
              label="姓名"
              >
                <template slot-scope="scope">
                  <router-link :to="{path: lang == 'ch'?'/stat/cn/memberAnalysis/singlePerson':'/stat/en/memberAnalysis/singlePerson',query:{deptId:scope.row.dept_id,itemId:scope.row.id}}" tag="a" target="_blank">
                    <span class="uname">{{scope.row.name}}</span></router-link>
                </template>
            </el-table-column>
            <el-table-column
              prop="departname"
              label="所属部门"
              >
            </el-table-column>
            <el-table-column
              prop="comtime"
              label="入职时间"
              sortable
              >
            </el-table-column>
            <el-table-column :label="defaultTagData">
                <el-table-column
                  prop="monthnumber"
                  label="询盘个数"
                  sortable
                  >
                </el-table-column>
                <el-table-column
                  prop="monthscore"
                  label="成交积分"
                  sortable
                  >
                </el-table-column>
                <el-table-column
                  prop="monthAnumber"
                  label="100万个数"
                  sortable
                  >
                </el-table-column>
            </el-table-column>
            <el-table-column :label="'本年数据('+yearTime+'年)'">
                <el-table-column
                  prop="yearnumber"
                  label="询盘个数"
                  sortable
                  >
                </el-table-column>
                <el-table-column
                  prop="yearAvgnumber"
                  label="平均月询盘个数"
                  sortable
                  >
                </el-table-column>
                <el-table-column
                  prop="yearscore"
                  label="成交积分"
                  sortable
                  >
                </el-table-column>
                <el-table-column
                  prop="yearAnumber"
                  label="100万个数"
                  sortable
                  >
                </el-table-column>
            </el-table-column>
        </el-table>
    </div> 
</div>
</template>

<script>
export default {
  name: "AwardRank",
  data() {
    return {
    };
  },
  created(){
  },
  props: {
    RankData: {
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
    defaultTagData:{
      type: String,
      default: function () {
        return "";
      },
    },
  },
  computed:{
    yearTime(){
        return new Date().getFullYear();
    },
    monthTime(){
        return new Date().getMonth() + 1;
    }
  },
  methods:{
  }
}
</script>

<style></style>