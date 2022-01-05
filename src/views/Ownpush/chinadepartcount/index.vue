<template>
  <div class="page-root scroll-panel depart-index" ref="boxPane" v-resize="changeSize">
        <div class="filter-panel" ref="filterbox">
        <div class="filter-list">
            <div class="item-filter flex-box depart">
            <div class="filter-title"><span class="txt-title">部门：</span></div>
            <div class="filter-content flex-content">
                <div class="item-list depart">
                <div class="item-checkbox" v-bind:class="item.isOn?'active':''" v-for="item in departList" v-bind:key="item.id"><i></i><span>{{item.name}}</span></div>
                </div>
            </div>
            </div>
            <div class="item-filter flex-box date">
            <div class="filter-title"><span class="txt-title">日期：</span></div>
            <div class="filter-content flex-content">
                <div class="item-list">
                <div class="item-change">
                    <div class="item-font" v-bind:class="item.isOn?'active':''" v-for="item in dateDimension" v-bind:key="item.value">{{item.label}}</div>
                </div>
                <div class="item-date">
                    <el-date-picker
                    v-if="!selectedData.isMonth"
                    v-model="selectedData.dateDefault"
                    :disabled="!dateSelected"
                    type="daterange"
                    format="yyyy/MM/dd"
                    value-format="yyyy/MM/dd"
                    key="a"
                    size="mini"
                    class="date-range"
                    range-separator="～"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerDateRangeOptions">
                    </el-date-picker>
                    <el-date-picker
                    v-else
                    v-model="selectedData.dateDefault"
                    type="monthrange"
                    format="yyyy/MM"
                    value-format="yyyy/MM"
                    key="b"
                    size="mini"
                    class="date-range"
                    range-separator="～"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerMonthRangeOptions">
                    </el-date-picker>
                </div>
                <div class="item-checkbox" v-bind:class="[selectedData.contrastGroupID.length>0||!dateSelected?'is-disabled':'',selectedData.isDateCompare?'active':'']"><i></i><span>日期对比</span></div>
                <div class="item-date" v-if="selectedData.isDateCompare" style="margin-right: 20px;">
                    <el-date-picker
                    v-if="!selectedData.isMonth"
                    v-model="selectedData.dateContrast"
                    type="daterange"
                    format="yyyy/MM/dd"
                    value-format="yyyy/MM/dd"
                    key="c"
                    size="mini"
                    class="date-range"
                    range-separator="～"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerDateRangeOptions">
                    </el-date-picker>
                    <el-date-picker
                    v-else
                    v-model="selectedData.dateContrast"
                    type="monthrange"
                    format="yyyy/MM"
                    value-format="yyyy/MM"
                    key="d"
                    size="mini"
                    class="date-range"
                    range-separator="～"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerMonthRangeOptions">
                    </el-date-picker>
                </div>
                </div>
            </div>
            </div>
            <div class="item-filter flex-box filter">
            <div class="filter-title"><span class="txt-title">分析项：</span></div>
            <div class="filter-content flex-content">
                <div class="item-list">
                <div class="item-checkbox" v-for="item in contrastList" v-bind:class="[item.isOn?'active':'', item.disabled?'is-disabled':'']" v-bind:key="item.value" v-on:click="analysisItemChangeHandler(item)"><i></i><span>{{item.label}}</span></div>
                <div class="item-reset" v-if="isFilter"><span v-on:click="resetData">全部重置</span></div>
                </div>
            </div>
            </div>
        </div>
        <div class="filter-tips"><p><i class="svg-i"><svg-icon icon-class="tips" class-name="disabled" /></i>{{tipsInfo}}</p></div>
        </div>
        <div class="contrast-panel flex-box" :class="isFix ? 'contrast-fixed' : ''" :style="'width:'+ boxWidth + 'px' " v-if="!selectedData.isDateCompare&&selectedData.groupID.length>0">
        <div class="title-font"><span class="txt-title">对比项：</span></div>
        <div class="contrast-content flex-content">
            <div class="item-list">
            <div class="item-contrast" v-if="selectedData.groupID.length>0"><span>{{groupName}}</span><i v-on:click="deleteDefaultGroup" class="svg-i"><svg-icon icon-class="close" class-name="disabled" /></i></div>
            <template v-if="selectedData.contrastGroupID.length>0">
                <div class="item-contrast" v-if="item.isOn" v-for="item in contrastGroupList" v-bind:key="item.id"><span>{{item.name}}</span><i class="svg-i"><svg-icon icon-class="close" class-name="disabled" /></i></div>
            </template>
            <div class="item-button">
                <div class="button-click"><i class="svg-i"><svg-icon icon-class="s-add" class-name="disabled" /></i><span>添加对比</span></div>
                <div class="group-contrast depart" v-show="isContrastShow" v-bind:style="{width:contrastWidth+'px'}">
                <div class="item-checkbox" v-bind:class="[item.disabled?'is-disabled':'',item.isOn?'active':'']" v-for="item in contrastGroupList" v-bind:key="item.id"><i></i><span>{{item.name}}</span></div>
                <div class="item-sure">确定</div>
                </div>
            </div>
            </div>
        </div>
        </div>
        <div class="result-panel" :class="isFix ? 'resulttop' : ''">
        </div>
  </div>
</template>
<script>
export default {
  name: 'Ownpush_chinadepartcount',
  data() {
    return {
        minWidth:"",
        departList:[       //部门数据
            {disabled: false,id: 12,isOn: false,name: "电商一部"},
            {disabled: false,id: 14,isOn: false,name: "电商三部"},
            {disabled: false,id: 15,isOn: false,name: "电商四部"},
            {disabled: false,id: 16,isOn: false,name: "电商五部"}
        ],
        dateDimension:[       //日月数据
            {label:"日",value:"day",isOn:false},
            {label:"月",value:"month",isOn:false},
        ],
        contrastList:[
            {label:"询盘数",id:1,value:"enquiriesFew",isOn:false,disabled:false},
            {label:"成交数",id:2,value:"clinchNumber",isOn:false,disabled:false},
            {label:'询盘年份',id:3,value:"enquiriesYear",isOn:false,disabled:true},
            {label:"地区询盘",id:4,value:"regionEnquiries",isOn:false,disabled:true},
            {label:"地区成交个数",id:5,value:"regionClinchNumber",isOn:false,disabled:true},
            {label:"地区成交积分",id:6,value:"regionClinchScore",isOn:false,disabled:true},
            {label:"询盘产品",id:7,value:"enquiriesProduct",isOn:false,disabled:true},
            {label:"成交产品",id:8,value:"clinchProduct",isOn:false,disabled:true},
            {label:"质量分析",id:9,value:"qualityAnalysis",isOn:false,disabled:true},
        ],
        groupName:"",
        dateSelected:false,  //控制获取日期或月份
        isFilter:false,      //是否显示重置按钮
        tipsInfo:"当前部门分析页面，展示为：本年度数据信息。",
        selectedData:{      //搜索数据
            dateDefault:[],
            dateContrast:[],
            groupID:[],
            contrastGroupID:[],
            isMonth:false,
            isDateCompare:false,
            type:[],
        },
        pickerDateRangeOptions: {
            shortcuts: [{
            text: '最近一个月',
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                end.setTime(end.getTime() + 3600 * 1000 * 24 * 1);
                picker.$emit('pick', [start, end]);
            }
            }, {
                text: '上月',
                onClick(picker) {
                var date = new Date();
                var year = date.getFullYear().toString();
                //获取月份，由于月份从0开始，此处要加1，判断是否小于10，如果是在字符串前面拼接'0'
                var month = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1).toString():(date.getMonth()+1).toString();
                var end = year + '/' + month + '/01';
                var start = '';
                
                if(month == '01'){
                    start = (parseInt(year) - 1) + '/12/01';
                }else{
                    start = parseInt(month) - 1>9 ? year + '/' + (parseInt(month) - 1)  + '/01':year + '/0' + (parseInt(month) - 1)  + '/01';
                }
                picker.$emit('pick', [start, end]);
                }
            }, {
            text: '本月',
            onClick(picker) {
                var date = new Date();
                var year = date.getFullYear().toString();
                //获取月份，由于月份从0开始，此处要加1，判断是否小于10，如果是在字符串前面拼接'0'
                var month = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1).toString():(date.getMonth()+1).toString();
                var end = '';
                var start = year + '/' + month + '/01';
                if(month == '12'){
                end = (parseInt(year) + 1) + '/01/01';
                }else{
                end = parseInt(month) + 1>9 ? year + '/' + (parseInt(month) + 1)  + '/01':year + '/0' + (parseInt(month) + 1)  + '/01';
                }
                picker.$emit('pick', [start, end]);
            }
            }]
        },
        pickerMonthRangeOptions: {
            shortcuts: [{
            text: '今年至今',
            onClick(picker) {
                const end = new Date();
                const start = new Date(new Date().getFullYear(), 0);
                picker.$emit('pick', [start, end]);
            }
            }, {
            text: '最近六个月',
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setMonth(start.getMonth() - 6);
                picker.$emit('pick', [start, end]);
            }
            }]
        },
        contrastGroupList:[],//对比部门数据
        contrastWidth:120,//对比项宽度
        isContrastShow:false,
        isFix:false,
        boxWidth:0,
    };
  },
  created() {
    var $this = this;
  },
  watch:{
    minWidth(val) {
      if (!this.timer) {
        this.minWidth = val
        this.timer = true
        const $this = this
        setTimeout(function() {
          $this.timer = false
        }, 400)
      }
    },
    boxWidth(val) {
      if (!this.timer) {
        this.boxWidth = val
        this.timer = true
        const $this = this
        setTimeout(function() {
          $this.timer = false
        }, 400)
      }
    },
  },
  mounted(){
    const $this = this;
    if($this.$refs.boxPane){  
      $this.minWidth = $this.$refs.boxPane.offsetWidth;
      $this.boxWidth = $this.$refs.boxPane.offsetWidth - 48;
      $this.$refs.boxPane.addEventListener('scroll', $this.getScroll);
    }
    window.onresize = () => {
      return (() => {
        if($this.$refs.boxPane){
          $this.minWidth = $this.$refs.boxPane.offsetWidth; 
          $this.boxWidth = $this.$refs.boxPane.offsetWidth -48;
        }
      })()
    }
  },
  directives: {  // 使用局部注册指令的方式
      resize: { // 指令的名称
        bind(el, binding) { // el为绑定的元素，binding为绑定给指令的对象
          let width = '', height = '';
          function isReize() {
            const style = document.defaultView.getComputedStyle(el);
            if (width !== style.width || height !== style.height) {
              binding.value();  // 关键
            }
            width = style.width;
            height = style.height;
          }
          el.__vueSetInterval__ = setInterval(isReize, 300);
        },
        unbind(el) {
          clearInterval(el.__vueSetInterval__);
        }
      }
  },
  methods: {
    changeSize(){
      var $this = this;
      $this.boxWidth = $this.$refs.boxPane.offsetWidth -48;
    }
  }
}
</script>



