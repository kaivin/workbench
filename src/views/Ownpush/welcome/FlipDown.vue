<!-- 翻页效果 倒计时组件 -->
<template>
  <div :class="['vue-countdown-component', { theme2: theme !== 1 }, {ie: isIE}]">
    <template v-for="(item, index) in timeArray">
      <div :class="['time-box','time-box'+index]"
           :key="index">
        <!-- 底层基础div -->
        <div class="base">{{ item }}<div class="base-a"><div class="base-b">{{ timeArrayT[index] }}</div></div>
        </div>
        <!-- 翻页动画div -->
        <div :class="['face',{ anime: isAnimate[index] }]"
             @animationend="onAnimateEnd(index)">{{ timeArrayT[index] }}</div>
        <div :class="['back',{ anime: isAnimate[index] }]">{{ item }}</div>
      </div>
      <!-- 文字 -->
      <div class="time-unit" :class="'time-unit'+index"
           :key="`unit-${index}`"
           v-if="isTimeUnitShow(index)">
        {{ setTimeUnit(index) }}
      </div>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isIE: false,
      timeArray:
        this.theme === 2
          ? new Array(this.type * 2).fill("0")
          : new Array(this.type).fill("00"),
      timeArrayT:
        this.theme === 2
          ? new Array(this.type * 2).fill("0")
          : new Array(this.type).fill("00"),
      isAnimate:
        this.theme === 2
          ? new Array(this.type * 2).fill(false)
          : new Array(this.type).fill(false)
    };
  },
  props: {
    endDate: { type: [Date, Number, String], default: 0 }, // 截止时间
    type: { type: [Number, String], default: 4 }, // 时间精度 4/3/2/1
    theme: { type: [Number, String], default: 1 },
    timeUnit: { type: Array, default: () => [] }
  },
  computed: {
    endTime() {
      if (this.endDate instanceof Date) {
        return this.endDate.getTime();
      }
      return Number(this.endDate) > 0 ? Number(this.endDate) : 0;
    },
    step() {
      return this.theme === 1 ? 1 : 2;
    },
    arr() {
      const length = this.timeArray.length;
      const step = this.step;
      const temp = [
        length - 1,
        length - step - 1,
        length - step * 2 - 1,
        length - step * 3 - 1
      ];
      temp.length = this.type > 1 ? this.type : 1;
      return temp;
    }
  },
  watch: {
    timeArray(newV, oldV) {
      const diff = [];
      newV.forEach((value, index) => {
        if (value !== oldV[index]) {
          diff.push({ value, index });
          this.$set(this.isAnimate, index, true);
        }
      });
      setTimeout(() => {
        diff.forEach(item => {
          this.$set(this.timeArrayT, item.index, item.value);
        });
      }, 350);
    },
    endTime(newV) {
      if (newV > 0) {
        this.start();
      }
    }
  },
  mounted() {
    if (
      window.ActiveXObject ||
      "ActiveXObject" in window ||
      window.navigator.userAgent.indexOf("Edge") > -1
    ) {
      this.isIE = true;
    }
    this.start(0);
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
  methods: {
    // 开始倒计时
    start(step = 1000) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        let t = this.endTime - new Date().getTime(); // 剩余的毫秒数
        t = t < 0 ? 0 : t;
        let day = 0; // 剩余的天
        let hour = 0; // 剩余的小时
        let min = 0; // 剩余的分钟
        let second = 0; // 剩余的秒
        const type = Number(this.type);
        if (type >= 4) {
          day = Math.floor(t / 86400000); // 剩余的天
          hour = Math.floor(t / 3600000 - day * 24); // 剩余的小时 已排除天
          min = Math.floor(t / 60000 - day * 1440 - hour * 60); // 剩余的分钟 已排除天和小时
          second = Math.floor(t / 1000 - day * 86400 - hour * 3600 - min * 60); // 剩余的秒
        } else if (type >= 3) {
          hour = Math.floor(t / 3600000); // 剩余的小时
          min = Math.floor(t / 60000 - hour * 60); // 剩余的分钟 已排小时
          second = Math.floor(t / 1000 - hour * 3600 - min * 60); // 剩余的秒
        } else if (type >= 2) {
          min = Math.floor(t / 60000); // 剩余的分钟
          second = Math.floor(t / 1000 - min * 60); // 剩余的秒
        } else {
          second = Math.floor(t / 1000); // 剩余的秒
        }
        let arr = [];
        if (Number(this.theme) === 1) {
          // 不分开
          type >= 4 && arr.push(String(day).padStart(2, "0"));
          type >= 3 && arr.push(String(hour).padStart(2, "0"));
          type >= 2 && arr.push(String(min).padStart(2, "0"));
          arr.push(String(second).padStart(2, "0"));
        } else {
          // 分开
          type >= 4 &&
            arr.push(
              ...String(day)
                .padStart(2, "0")
                .split("")
            );
          type >= 3 &&
            arr.push(
              ...String(hour)
                .padStart(2, "0")
                .split("")
            );
          type >= 2 &&
            arr.push(
              ...String(min)
                .padStart(2, "0")
                .split("")
            );
          arr.push(
            ...String(second)
              .padStart(2, "0")
              .split("")
          );
        }
        this.timeArray = arr;
        if (t > 0) {
          this.start();
        } else {
          this.$emit("timeUp");
        }
      }, step);
    },
    // 动画完毕后，去掉对应的class, 为下次动画做准备
    onAnimateEnd(index) {
      this.$set(this.isAnimate, index, false);
    },
    isTimeUnitShow(index) {
      if (this.arr.includes(index)) {
        if (index === this.timeArray.length - 1 && !this.timeUnit[3]) {
          return false;
        }
        return true;
      }
      return false;
    },
    setTimeUnit(index) {
      switch (index) {
        case this.timeArray.length - 1:
          return this.timeUnit[3] || ""; // 秒
        case this.timeArray.length - this.step - 1:
          return this.timeUnit[2] || ""; // 分
        case this.timeArray.length - this.step * 2 - 1:
          return this.timeUnit[1] || ""; // 时
        default:
          return this.timeUnit[0] || ""; // 天
      }
    }
  }
};
</script>

<style lang="scss">
.vue-countdown-component {
  display: flex;
  @keyframes animate-filp-face {
    0% {
      transform: rotateX(-0.01deg);
      opacity: 1; // 改变opacity 为了QQ浏览器和safari(不支持z-index animate)
    }
    50% {
      opacity: 1;
    }
    51% {
      opacity: 0;
    }
    100% {
      transform: rotateX(-180deg);
      opacity: 0;
    }
  }
  @keyframes animate-filp-back {
    0% {
      transform: rotateX(180deg);
    }
    100% {
      transform: rotateX(-0.01deg);
    }
  }
  &.ie {
    // 为了ie和老版edge（不支持clip-path）
    .base {
      .base-b {
        clip: rect(15px, auto, auto, auto);
      }
    }
    .face {
      clip: rect(auto, auto, 15px, auto);
    }
    .back {
      clip: rect(15px, auto, auto, auto);
    }
  }
  &.theme2 {
    .time-box {
      min-width: 20px;
      & + .time-box {
        margin-left: 1px;
      }
    }
  }
  .time-unit {
    padding: 0 4px;
    color: #222;
    font-size: 14px;
    line-height: 30px;
    white-space: nowrap;
  }
  .time-box {
    position: relative;
    box-sizing: border-box;
    height: 30px;
    min-width: 28px;
    font-size: 14px;
    text-align: center;
    background-color: #f0f0f0;
    perspective: 60px;
    border-radius: 3px;
    padding: 0 2px;
    color: #fff;
    line-height: 30px;
    &:before {
      content: "";
      position: absolute;
      background: #f0f0f0;
      width: 1px;
      height: 6px;
      top: 50%;
      left: -1px;
      margin-top: -3px;
      z-index: -1;
    }
    &:after {
      content: "";
      position: absolute;
      background: #f0f0f0;
      width: 1px;
      height: 6px;
      top: 50%;
      right: -1px;
      margin-top: -3px;
      z-index: -1;
    }
    & + .time-box {
      margin-left: 8px;
    }
    & > div {
      overflow: hidden;
      animation-timing-function: linear;
      animation-duration: 400ms;
      // 为了chrome，需要一个小的角度，否则字体渲染错位
      transform: rotateX(-0.01deg);
      border-radius: 3px;
      &.base {
        position: relative;
        .base-b {
          position: absolute;
          left: 0;
          bottom: 0;
          border-radius: 0 0 3px 3px;
          width: 100%;
          height: 100%;
          background-color: #f0f0f0; // a1比base浅一点点，为了模拟翻页的阴影效果
          // background-color: #0ff;
          clip-path: polygon(0 50%, 100% 50%, 100% 100%, 0 100%);
        }
      }
      &.face {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: #f0f0f0;
        // background-color: #f00;
        backface-visibility: visible;
        clip-path: polygon(0 0, 100% 0, 100% 50%, 0 50%);
        z-index: 2;
        &.anime {
          animation-name: animate-filp-face;
        }
      }
      &.back {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: #f0f0f0; // b0和a1一致
        // background-color: #aa0;
        transform: rotateX(-180deg);
        backface-visibility: visible;
        clip-path: polygon(0 50%, 100% 50%, 100% 100%, 0 100%);
        &.anime {
          animation-name: animate-filp-back;
        }
      }
    }
  }
}
</style>