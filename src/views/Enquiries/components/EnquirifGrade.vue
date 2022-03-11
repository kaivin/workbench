<template> 
<div class="flex-content EnquirieGradesItem">  
    <div class="EnquirieGradesBox" v-if="RankData.itemData.length>0"> 
      <el-table
        ref="SimpleTable"
        :data="RankData.itemData"
        tooltip-effect="dark"
        class="SiteTable EntableColor"
        style="width: 100%"
        row-key="id"
        key="a"
      >
        <el-table-column
          :label="RankData.isOld==1?'新员工组':'老员工组'" >
          <el-table-column
            label="序号" 
            type="index"
            width='80'>
          </el-table-column>
          <el-table-column
            prop="uname"
            label="姓名">
          </el-table-column>
          <!-- 动态生成列 -->
          <el-table-column
            v-for="(item,index) in RankData.tableHeader"
            :key="index"
            :label="item"
          >
            <template slot-scope="scope">
              <div v-if="item.indexOf(scope.row.threemonth)>=0">{{scope.row.threemonthnumber}}</div>
              <div v-if="item.indexOf(scope.row.twomonth)>=0">{{scope.row.twomonthnumber}}</div>
              <div v-if="item.indexOf(scope.row.month)>=0">{{scope.row.monthnumber}}</div>
            </template>
          </el-table-column>
          <!-- 动态生成列结束 -->
          <el-table-column
            label="累计排名">
            <template slot-scope="scope">
              <span v-if="scope.row.continuous<4&&scope.row.continuous>0" class="pos">
                    <i v-for="item in scope.row.continuous"></i>
              </span>
              <span v-if="scope.row.lastcontinuous<4&&scope.row.lastcontinuous>0" class="neg">
                    <i v-for="item in scope.row.lastcontinuous"></i>
              </span>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div> 
</div>
</template>

<script>
export default {
  name: "EnquirifGrade",  
  data() {
    return {
    };
  },
  created(){
  },
  props: {
    RankData:{
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  computed:{
  },
  methods:{
  }
}
</script>

<style></style>