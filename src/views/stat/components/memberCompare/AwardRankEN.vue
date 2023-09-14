<template> 
<div class="dealRankMainItem">  
    <div class="dealRankMainBox">      
        <el-table
            ref="SimpleTable"
            :data="RankData"
            tooltip-effect="dark"
            class="SiteTable EntableColor"
            style="width: 100%"
            row-key="id"
            key="a"
            >
            <el-table-column
              label="序号" 
              type="index"
              width='50'
              >
            </el-table-column>
            <el-table-column
              prop="departname"
              label="所属部门"
              >
            </el-table-column>
            <el-table-column
              prop="name"
              label="姓名"
              >
                <template slot-scope="scope">
                  <router-link :to="{path: lang == 'ch'?'/stat/cn/memberAnalysis/singlePerson':'/stat/en/memberAnalysis/singlePerson',query:{deptId:scope.row.dept_id,itemId:scope.row.id}}" tag="a" target="_blank">
                    <span class="uname" :style="scope.row.postionname=='组长'||scope.row.postionname=='主管'?'color:red;font-weight:bold':''">{{scope.row.name}}</span></router-link>
                </template>
            </el-table-column>
            <el-table-column
              prop="postionname"
              label="职位"
              >
                <template slot-scope="scope">
                    <span class="uname" :style="scope.row.postionname=='组长'||scope.row.postionname=='主管'?'color:red;font-weight:bold':''">{{scope.row.postionname}}</span>
                </template>
            </el-table-column>
            <el-table-column
              prop="comtime"
              label="入职时间"
              sortable              
              >
                <template slot-scope="scope">
                    <span :class="scope.row.comtimeShow?'':'inTime'">{{scope.row.comtime}}</span>
                </template>
            </el-table-column>
            <el-table-column label="日询盘个数">
                <el-table-column
                  prop="todaynumber"
                  label="今天"
                  sortable
                  class-name="dayStyle"
                  >
                </el-table-column>
                <el-table-column
                  prop="yesterdaynumber"
                  label="昨天"
                  sortable
                  class-name="dayStyle"
                  >
                </el-table-column>
            </el-table-column>
            <el-table-column :label="defaultTagData">
                <el-table-column
                  prop="monthnumber"
                  label="询盘个数"
                  sortable
                  class-name="monthStyle"
                  >
                </el-table-column>
                <el-table-column
                  prop="monthtruescore"
                  label="意向客户分"
                  sortable
                  width='110'
                  class-name="monthStyle"
                  >
                </el-table-column>
                <el-table-column
                  prop="monthscore"
                  label="成交积分"
                  sortable
                  class-name="monthStyle"
                  >
                </el-table-column>
                <el-table-column
                  prop="monthAnumber"
                  label="100万个数"
                  width='110'
                  sortable
                  class-name="monthStyle"
                  >
                </el-table-column>
            </el-table-column>
            <el-table-column :label="'本年数据 ('+yearTime+'年)'">
                <el-table-column
                  prop="yearnumber"
                  label="询盘个数"
                  sortable
                  class-name="yearStyle"
                  >
                </el-table-column>
                <el-table-column
                  prop="yearAvgnumber"
                  label="平均月询盘个数"
                  width='140'
                  sortable
                  class-name="yearStyle"
                  >
                </el-table-column>
                <el-table-column
                  prop="yeartruescore"
                  label="意向客户分"
                  width='110'
                  sortable
                  class-name="yearStyle"
                  >
                </el-table-column>
                <el-table-column
                  prop="yearscore"
                  label="成交积分"
                  sortable
                  class-name="yearStyle"
                  >
                </el-table-column>
                <el-table-column
                  prop="yearAnumber"
                  label="100万个数"
                  width='110'
                  sortable
                  class-name="yearStyle"
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