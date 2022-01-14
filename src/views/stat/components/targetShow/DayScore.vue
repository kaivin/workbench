<template>
  <div class="rowDayScore ">
    <div class="rowTitle">
      <div class="title-left">
        <h3 class="tit-h3"><span v-if="lang == 'ch'">中文</span><span v-else>英文</span>日询盘</h3>
        <span class="tit-span">（单位：个）</span>
      </div>
    </div>

    <div class="rowMain">
      <ul class="rowCountItem">
        <li>
          <div class="rowimg rowimg1"></div>
          <p><span>{{ DayScore.allTodayNum }}</span>今日询盘</p>
        </li>
        <li>
          <div class="rowimg rowimg2"></div>
          <p><span>{{ DayScore.allYesterdayNum }}</span>昨日询盘</p>
        </li>
        <li>
          <div class="rowimg rowimg3"></div>
          <p><span>{{ DayScore.dayMaxNum }}</span>本月单日最高</p>
        </li>
        <li>
          <div class="rowimg rowimg4"></div>
          <p><span>{{ DayScore.historyMaxNum }}</span>历史单日最高</p>
        </li>
      </ul>

    </div>
  </div>
</template>

<script>

export default {
  name: "DayScore",
  data() {
    return {

    };
  },
  created(){
    
  },
  props: {
    DayScore: {
      type: Object,
      default: function () {
        return {};
      },
    },
    lang:{
      type: String,
      default: function () {
        return {};
      },
    }
  },
  methods:{

  }
};
</script>

<style></style>