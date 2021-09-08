 <template> 
  <div class="page-root flex-box no-padding SaleCard" ref="boxPane">
    <div class="sub-router SaleCardFl"  ref="SaleCardFl">
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <div class="sub-wrapper">
          <div class="side-button">
            <dl class="Sales-list">
                <dt><span>业务员数据统计</span></dt>
                <dt ><span>等待分配</span><i>(3)</i></dt>
                <dt><span>所有已分配询盘</span><i>(4)</i></dt>
            </dl>
          </div>
          <dl class="Salelist">
              <dt><span>个人所有询盘</span><i>(5)</i></dt>
              <dt><span>等待处理</span><i>(5)</i></dt>
              <dt><span>月底前需反馈</span><i>(5)</i></dt>
              <dt><span>所有未反馈</span><i>(5)</i></dt>
              <dt><span>等待添加富通ID</span><i>(5)</i></dt>
              <dt><span>已处理</span><i>(5)</i></dt>
              <dt><span>已做反馈</span><i>(5)</i></dt>
          </dl>
          <div class="side-button">
            <dl class="Sales-list">
                <dt><span>数据分析</span></dt>
            </dl>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <div class="flex-content SaleCardFr">
      <div class="abs-panel" ref="mainPane">
          <div class="scroll-panel">
               <div class="true-height" ref="scrollPane">
                  <el-card class="box-card scroll-card SaleCardFlFrTable tipsHas" shadow="hover">
                    <div slot="header">  
                    <div class="card-header" ref="headerPane">                      
                        <div class="tips-list" ref="tipsPane">
                            <div class="item-tips type-1">
                                <i>1</i>
                                <strong>ID：2524</strong>
                                <span>内部提醒</span>
                            </div>
                            <div class="item-tips type-2">
                                <i>1</i>
                                <strong>ID：2524</strong>
                                <span>内部提醒</span>
                            </div>
                        </div>
                        <div class="tipsHasItem">      
                            <div class="search-wrap" style="height:150px">
                            </div>
                            <div class="clues-info flex-box">
                            <div class="clues-infoFl flex-content">
                                <p><span>当前结果集状态：当前共有<strong class="color1">3</strong>条信息。</span><span>昨天共分配<strong class="color2">4</strong>个询盘，当前共有<strong class="color3">5</strong>条未处理</span><span class="item-span-4" style="cursor: pointer;">点击查看昨天未处理询盘</span><span>||</span><span>今天天共分配<strong class="color2">6</strong>个询盘，当前共有<strong class="color3">7</strong>条未处理</span><span class="item-span-4" style="cursor: pointer;">点击查看今天未处理询盘</span></p>
                            </div>
                            <div class="clues-title-btn">
                                <el-button class="item-input" size="small" type="primary">分配撤回</el-button>
                            </div>
                            </div>
                        </div>
                    </div>
                    </div>                    
                    <div class="card-content" ref="tableContent">
                        <div class="frist-table" :style="'height:'+minHeight+'px'">
                            <div class="frist-content">
                                <el-table
                                ref="simpleTable"
                                tooltip-effect="dark"
                                class="SiteTable EntableColor table"
                                :data="tableData">
                                    <el-table-column prop="date" label="日烦烦烦期" width="130"></el-table-column>
                                    <el-table-column prop="name" label="姓的方法名" width="130"></el-table-column>
                                    <el-table-column prop="address" width="130" label="地覆盖址"></el-table-column>
                                    <el-table-column prop="name" label="姓规范化名" width="130"></el-table-column>
                                    <el-table-column prop="address" width="130" label="地豆腐干址"></el-table-column>
                                    <el-table-column prop="name" label="姓的方法名" width="130"></el-table-column>
                                    <el-table-column prop="name" label="姓的风格和名" width="130"></el-table-column>
                                    <el-table-column prop="address" width="130" label="地的风格和址"></el-table-column>
                                    <el-table-column prop="name" label="姓的风格和名" width="130"></el-table-column>
                                    <el-table-column prop="address" width="130" label="地覆盖址"></el-table-column>
                                    <el-table-column prop="name" label="姓规范化名" width="130"></el-table-column>
                                    <el-table-column prop="address" width="130" label="地豆腐干址"></el-table-column>
                                    <el-table-column prop="name" label="姓的方法名" width="130"></el-table-column>
                                    <el-table-column prop="name" label="姓的风格和名" width="130"></el-table-column>
                                    <el-table-column prop="address" width="130" label="地的风格和址"></el-table-column>
                                    <el-table-column prop="name" label="姓的风格和名1" width="130"></el-table-column>
                                    <el-table-column prop="address" width="130" label="操作">
                                    <template slot="scope">
                                        <p>
                                        <a>操作11</a>
                                        </p>
                                        <p>
                                        <a>操作22</a>
                                        </p>
                                        <p>
                                        <a>操作33</a>
                                        </p>
                                    </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                            <!-- 表头 -->
                            <div class="out_Table" ref="out_Table">
                                <el-table
                                class="SiteTable in_Table" ref="in_Table"
                                tooltip-effect="dark">
                                    <el-table-column label="日烦烦烦期" width="130"></el-table-column>
                                    <el-table-column label="姓的方法名" width="130"></el-table-column>
                                    <el-table-column width="130" label="地覆盖址"></el-table-column>
                                    <el-table-column label="姓规范化名" width="130"></el-table-column>
                                    <el-table-column width="130" label="地豆腐干址"></el-table-column>
                                    <el-table-column label="姓的方法名" width="130"></el-table-column>
                                    <el-table-column label="姓的风格和名" width="130"></el-table-column>
                                    <el-table-column width="130" label="地的风格和址"></el-table-column>
                                    <el-table-column label="姓的风格和名" width="130"></el-table-column>
                                    <el-table-column width="130" label="地覆盖址"></el-table-column>
                                    <el-table-column label="姓规范化名" width="130"></el-table-column>
                                    <el-table-column width="130" label="地豆腐干址"></el-table-column>
                                    <el-table-column label="姓的方法名" width="130"></el-table-column>
                                    <el-table-column label="姓的风格和名" width="130"></el-table-column>
                                    <el-table-column width="130" label="地的风格和址"></el-table-column>
                                    <el-table-column label="姓的风格和名1" width="130"></el-table-column>
                                    <el-table-column width="130" label="操作"></el-table-column>
                                </el-table>
                            </div>
                            <!-- 滚动条 -->
                            <div class="out_box" :class="isClass?'fixed':'abso'"
                            ref="out_box">
                                <div
                                    class="in_box"
                                    @mousedown="mouseDown"
                                    @mouseup="mouseUp"
                                    @mouseout="mouseUp"
                                    :style="old_new"
                                    ref="in_box"
                                ></div>
                            </div>
                        </div>
                    </div>
                  </el-card>
               </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'Scroll',
  data() {
    return {
      //滚动条参数
      newx: "", // 第一次坐标
      oldx: "", // 移动的坐标
      outBoxWidth: "", // 滚动条长度
      moveWidth: "", // 可移动的长度
      old_new: {
        // 滚动条偏移量
        left: 0,
      },
      windowWidth: document.body.clientWidth - 480, //table宽度
      f: 0,
      leftstr: "",
      //滚动条参数
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
      ],
      minHeight:"auto",
      isClass:false,
      isTableClass:false,
      isFixed:false,
      isH:false,
    };
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'device',
      'sidebar'
    ]),
  },
  mounted() {
    var $this = this;
    console.log($this.sidebar.opened,'sidebar')
    $this.$nextTick(function () {
        $this.setHeight();
        $this.ifmove();
        window.addEventListener('scroll',$this.handleScroll,true);
    });
    window.onresize = function () {
      //监听浏览器窗口
      $this.setHeight();
      $this.ifmove();
    };
    window.onmouseup = () => {
      $this.mouseUp();
    };
  },
  methods: {
    // 设置table高度
    setHeight(){
      var $this = this;
      $this.minHeight = "auto";
      $this.$nextTick(()=>{
        var trueHeight = $this.$refs.scrollPane.offsetHeight;
        var headerHeight = $this.$refs.headerPane.offsetHeight;
        var screenHeight = $this.$refs.boxPane.offsetHeight;
        console.log(trueHeight,"真实高度");
        console.log(headerHeight,"头部高度");
        console.log(screenHeight,"视窗高度");
        if(trueHeight<=screenHeight){
          $this.minHeight = screenHeight-headerHeight-30;
          $this.isClass = false;
        }else{
          $this.minHeight = "auto";
          $this.isClass = true;
        }
        console.log($this.minHeight,"表格高度");
      });
    },
    //滚动事件
    handleScroll(event){
      var $this = this;
	    var scrTop = event.target.scrollTop;
      var headerHeight = $this.$refs.headerPane.offsetHeight;
      console.log(scrTop,'scrTop');
      $this.$nextTick(()=>{
        console.log($this.isH,'$this.isH');
        if(!$this.isH&&scrTop>0){
          if(scrTop>headerHeight){
            $this.isFixed=true;
          }else{
            $this.isFixed=false;    
          }
        }
        console.log($this.isFixed,'$this.isFixed');
        $this.ifmove();
      })
    },
    //滚动条事件
    mouseDown(event) {
      var $this = this;
      document.oncopy = function(){ return false; };
      if(event.target.scrollTop>0){
        $this.isH=true;
      }
      $this.$nextTick(()=>{
        var mainArr=document.querySelectorAll(".page-root");
        mainArr[0].className = 'page-root flex-box no-padding SaleCard forbid';
        let e = event || window.event;
        $this.f = 1;
        $this.newx = e.clientX;
        $this.leftstr = $this.old_new.left;
        var tableArr=document.querySelectorAll(".el-table__body-wrapper");
        var tablescrWidth=tableArr[0].scrollWidth;  //table滚动宽度

        $this.$refs.in_box.addEventListener("mousemove", function (event) {
            let e = event || window.event;
            $this.oldx = e.clientX;
            $this.OfftDis();
            $this.moveWidth = (1 - $this.windowWidth / tablescrWidth) * $this.windowWidth - parseFloat($this.leftstr); //模拟滚动条可移动长度
            if ($this.f) {
              $this.old_new.left =
                  $this.oldx - $this.newx <= -parseFloat($this.leftstr)
                  ? "0px"
                  : $this.oldx - $this.newx >= $this.moveWidth
                  ? $this.moveWidth + parseFloat($this.leftstr) + "px"
                  : $this.oldx - $this.newx + parseFloat($this.leftstr) + "px"; //模拟滚动条偏移量
              document.querySelectorAll(".el-table__body-wrapper")[0].scrollLeft =
                  $this.oldx - $this.newx <= -parseFloat($this.leftstr)
                  ? 0
                  : $this.oldx - $this.newx >= $this.moveWidth
                  ? ($this.moveWidth + parseFloat($this.leftstr)) *
                      (tablescrWidth / $this.windowWidth)
                  : ($this.oldx - $this.newx + parseFloat($this.leftstr)) *
                      (tablescrWidth / $this.windowWidth); //实际滚动条偏移量
                document.querySelectorAll(".out_Table")[0].scrollLeft =
                    $this.oldx - $this.newx <= -parseFloat($this.leftstr)
                    ? 0
                    : $this.oldx - $this.newx >= $this.moveWidth
                    ? ($this.moveWidth + parseFloat($this.leftstr)) *
                        (tablescrWidth / $this.windowWidth)
                    : ($this.oldx - $this.newx + parseFloat($this.leftstr)) *
                        (tablescrWidth / $this.windowWidth); //实际滚动条偏移量
            }
        });
        //表头

      });
    },
    mouseUp() {
      var $this = this;
      $this.f = 0;
      $this.isH=false;
      var mainArr=document.querySelectorAll(".page-root");
      mainArr[0].className = 'page-root flex-box no-padding SaleCard';
    },
    ifmove() {
        //防止window.onresize 滥用
        var $this = this;
        $this.$nextTick(()=>{
            var tableArr=document.querySelectorAll(".el-table__body-wrapper");
            tableArr[0].style.overflow = "hidden";
            var tablescrWidth=tableArr[0].scrollWidth;  //table滚动宽度
       
            console.log(tablescrWidth,'scrollWidth');
            $this.OfftDis();
            $this.$refs.in_box.style.width = ($this.windowWidth / tablescrWidth) * $this.windowWidth + "px"; //显示区域占百分比，在滚动条显示
            $this.moveWidth = (1 - $this.windowWidth / tablescrWidth) * $this.windowWidth; //可移动宽度
        });
    },
    //偏移函数
    OfftDis(){
        var $this = this;
        var widthMenu=230;
        var widthAuMenu=$this.$refs.SaleCardFl.clientWidth;
        if($this.sidebar.opened){
            widthMenu=230;
        }else{
            widthMenu=60;
        }
        //定位偏移距离
        var OffsetDis=widthAuMenu+widthMenu+15;
        $this.windowWidth = document.body.clientWidth - OffsetDis-20;
        if($this.isClass){
            $this.$refs.out_box.style.width = $this.windowWidth + "px";
            $this.$refs.out_box.style.left = OffsetDis + "px";
            console.log($this.windowWidth,'fixed');
            $this.$refs.out_Table.style.width = $this.windowWidth + "px";
            $this.$refs.out_Table.style.left = OffsetDis + "px";
        }else{
            $this.windowWidth = $this.$refs.out_Table.clientWidth;
            $this.windowWidth = $this.$refs.out_box.clientWidth;
            console.log($this.windowWidth,'abso');
        };
        //表头可视区域长度和位置
        var tableTit=document.querySelectorAll(".out_Table");
        tableTit[0].style.opacity = 0;      
        if($this.isFixed){
          tableTit[0].style.opacity = 1; 
        }else{
          tableTit[0].style.opacity = 0; 
        }
    }
    //滚动条事件
  },
};
</script>
<style scoped>
.frist-table{position: relative;background:#fff;}
.frist-table .fixed{position: fixed; bottom:5px;}
.frist-table .abso{position: absolute;left:0px; bottom:0px; width:100%;}
.out_box {
  height: 10px;
  background:none;
  z-index: 9;
  left:0px;
  bottom: 0px;
  border-radius: 5px;
  overflow: hidden;
  will-change:scroll-position;
}
.in_box {
  position: absolute;
  z-index: 9;
  left: 0px;
  top:0px;
  height: 10px;
  background: #bebdbd;
  cursor: pointer;
  border-radius: 5px;
  overflow: hidden;
  opacity: 0.6;
}
.in_box:hover {
    opacity: 0.4;
}
.table{will-change:scroll-position;overflow: visible!important;}
.out_Table{  
    position: fixed;
    left: 0px;
    top:60px;
    width: 100%;
    background: #e2e9ed;
    overflow: hidden;
    border-radius: 5px 5px 0px 0px;
    opacity:0;
    transition:opacity 0.5s;
}
.out_Table .in_Table{
    clear: both;
    display: table;
    vertical-align: inherit;
    border-color: inherit;
    color: #909399;
    
}
</style>