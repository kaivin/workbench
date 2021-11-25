<template>
  <div class="personScoreNum">
      <h3 class="stitle">个人成绩统计</h3>
      <div class="scoreTable">
            <el-table
                :data="scoreCount"
                border
                style="width: 100%">
                <el-table-column
                    prop="date"
                    label="日期">
                </el-table-column>
                <el-table-column
                    prop="number"
                    label="询盘个数">
                </el-table-column>
                <el-table-column
                    prop="score"
                    label="成交积分">
                </el-table-column>
                <el-table-column
                    prop="anumber"
                    label="百万个数">
                    <template slot-scope="scope">
                        <div v-if="scope.row.anumber>0">
                            <div class="awardicon" v-for="(item,index) in scope.row.anumber" :key="index"></div>
                        </div>
                        <div v-else class="line"></div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="award"
                    label="个人奖金">
                    <template slot-scope="scope">
                        {{scope.row.award.toFixed(1)}}
                    </template>
                </el-table-column>
            </el-table>
      </div>
      <div class="scoreSepcount">
          <ul class="countul">
              <li class="i1">
                  <p>最高月询盘数量</p>
                  <span>698</span>
              </li>
              <li class="i2">
                  <p>最高月成交积分</p>
                  <span>99</span>
              </li>
              <li class="i3">
                  <p>最高月成交百万个数</p>
                  <span>2</span>
              </li>
              <li class="i4">
                  <p>最高月奖金</p>
                  <span>8692</span>
              </li>
          </ul>
      </div>
  </div>
</template>

<script>
export default {
  name: "ScoreNum",
  data() {
    return {
        scoreCount:[
            {
                date:"1月",
                number: 200,
                score: 68.5,
                anumber: 3,
                award: 2024.45
            },
            {
                date:"2月",
                number: 200,
                score: 68.5,
                anumber: 0,
                award: 2024.45
            },
            {
                date:"3月",
                number: 200,
                score: 68.5,
                anumber: 1,
                award: 2024.45
            },
            {
                date:"4月",
                number: 200,
                score: 68.5,
                anumber: 2,
                award: 2024.45
            },
            {
                date:"5月",
                number: 200,
                score: 68.5,
                anumber: 0,
                award: 2024.45
            },
        ]
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

<style>

</style>