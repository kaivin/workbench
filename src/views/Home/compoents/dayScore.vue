<template>
  <div class="rowOneTwo flex-content">
    <h3>
      {{
        currentCluesData.departID
          ? currentCluesData.departName
          : language == "Module_cnStat"
          ? "中文"
          : "英文"
      }}日询盘
    </h3>
    <ul class="rowOneTwoItem">
      <li
        class="flex-box"
        :class="
          currentCluesData.alltodaynumber <= currentCluesData.alllastdaynumber
            ? 'rowOneColor'
            : ''
        "
      >
        <i class="svg-i"><svg-icon icon-class="homePic" /></i>
        <p class="flex-content">
          今日询盘
          <strong>{{ currentCluesData.alltodaynumber }}</strong>
          <span
            ><i
              :style="'width:' + currentCluesData.alltodaynumberPercent + '%'"
            ></i
          ></span>
        </p>
      </li>
      <li class="flex-box">
        <i class="svg-i"><svg-icon icon-class="homeTime" /></i>
        <p class="flex-content">
          昨日询盘
          <strong>{{ currentCluesData.alllastdaynumber }}</strong>
          <span
            ><i
              :style="'width:' + currentCluesData.alllastdaynumberPercent + '%'"
            ></i
          ></span>
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "demo",
  data() {
    return {};
  },
  props: {
    currentCluesData: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
};
</script>

<style>
</style>