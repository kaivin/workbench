<template> 
<div class="dealRankMainItem">  
    <div class="dealRankMainBox">      
        <el-table
            ref="SimpleTable"
            :data="RankData"
            :header-cell-style="tableHeaderCellStyle"
            tooltip-effect="dark"
            stripe
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
                    <span class="uname">{{scope.row.name}}</span></router-link>
                </template>
            </el-table-column>
            <el-table-column
              prop="postionname"
              label="职位"
              >
            </el-table-column>
            <el-table-column
              prop="comtime"
              label="入职时间"
              sortable
              >
            </el-table-column>
            <el-table-column label="日询盘个数" >
                <el-table-column
                  prop="yesterdaynumber"
                  label="昨天"
                  sortable
                  >
                </el-table-column>
                <el-table-column
                  prop="todaynumber"
                  label="今天"
                  sortable
                  >
                </el-table-column>
            </el-table-column>
            <el-table-column :label="defaultTagData" class="monthStyle">
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
            <el-table-column :label="'本年数据('+yearTime+'年)'" class="yearStyle">
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
    tableHeaderCellStyle({row,column,rowIndex, columnIndex}) {
      console.log(columnIndex,'columnIndex');
        let cellStyle0;
        let cellStyle1;
        let cellStyle2;
        let cellStyle3;
        cellStyle0= "border-color:#fff;"
        cellStyle1= "background:#f6ede6;border-color:#fff;"
        cellStyle2= "background:#e7f3df;border-color:#fff;"
        cellStyle3= "background:#f8f5e4;border-color:#fff;"
        if(columnIndex >= 0 && columnIndex < 2 && rowIndex==1){
          return cellStyle1;
        }
        if(columnIndex >= 2 && columnIndex < 5 && rowIndex==1){
          return cellStyle2;
        }
        if(columnIndex >= 5 && columnIndex < 9 && rowIndex==1){
          return cellStyle3;
        }
        if(columnIndex >= 0 && columnIndex < 5 && rowIndex==0){
          return cellStyle0;
        }
        if(columnIndex == 5 && rowIndex==0){
          return cellStyle1;
        }
        if(columnIndex == 6 && rowIndex==0){
          return cellStyle2;
        }
        if(columnIndex == 7 && rowIndex==0){
          return cellStyle3;
        }
    }
  }
}
</script>

<style></style>