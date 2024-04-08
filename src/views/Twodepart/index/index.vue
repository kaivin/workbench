<template>
	<div class="page-root" ref="boxPane">
	  <div class="abs-panel" ref="mainPane">
		<div class="scroll-panel" ref="scrollDom" style="will-change:scroll-position">
		  <div class="true-height" ref="scrollPane">
			<p class="breadcrumb" ref="breadcrumbPane">
			  <router-link class="breadcrumb-link" to="/"><span>首页</span></router-link>
			  <template v-for="item in breadcrumbList">
				<router-link class="breadcrumb-link" :to="item.router" v-bind:key="item.id" v-if="item.router!=''"><b>-</b><span>{{item.title}}</span></router-link>
				<span v-else class="breadcrumb-link" v-bind:key="'last-' + item.id"><b>-</b><span>{{item.title}}</span></span>
			  </template>
			</p>
			<el-card class="box-card" shadow="hover">
			  <div class="card-header" ref="headerPane">
				<div class="search-wrap" ref="searchPane">
				  <div class="item-search">
					<el-date-picker
						v-model="searchData.date"
						type="date"
						placeholder="选择日期"
						:picker-options="pickerOptions">
					</el-date-picker>
				  </div>
				  <div class="item-search">
					<el-select v-model="searchData.sort" size="small" clearable placeholder="排序方式" class="select-panel" @change="searchResult">
						<el-option
							v-for="item in sortList"
							:key="item.label"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				  </div>
				  <div class="item-search">
					<el-select v-model="searchData.my_level" size="small" clearable placeholder="关键词等级" class="select-panel" @change="searchResult">
						<el-option
							v-for="item in levelList"
							:key="item.label"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				  </div>
				  <div class="item-search">
					<el-input
						class="input-panel"
						size="small"
						placeholder="请输入关键词"
						v-model="searchData.keyword"
						@keyup.enter.native="searchResult"
						@clear="searchResult"
						clearable>
					</el-input>
				  </div>
				  <div class="item-search">
					<el-input
						class="input-panel"
						size="small"
						placeholder="请输入抖音名称"
						v-model="searchData.nickname"
						@keyup.enter.native="searchResult"
						@clear="searchResult"
						clearable>
					</el-input>
				  </div>
				  <div class="item-search">
					<el-button class="item-input" :class="isSearchResult?'isDisabled':''" :disabled="isSearchResult" type="primary" size="small" icon="el-icon-search" @click="searchResult">查询</el-button>
					<el-button type="info" class="resetBtn" size="small" @click="resetData">重置</el-button>
					<el-button type="success" size="small" icon="el-icon-plus" @click="addTableRow">添加工作汇报</el-button>
					<el-button type="warning" size="small" icon="el-icon-thumb" class="exportBtn derived" @click="addScore">分配积分</el-button>
				  </div>
				</div>
			  </div>
			  <div class="card-content" ref="tableContent">
				<div class="table-wrapper" v-bind:class="scrollPosition.isFixed?'fixed-table':''">
				  <div class="table-mask"></div>
					  <el-table
						ref="simpleTable"
						:data="tableData"
						tooltip-effect="dark"
						class="SiteTable"
						style="width: 100%"
						:style="'min-height:'+tableHeight+'px;'"
						row-key="id"
						@selection-change="handleSelectionChange"
						>
						<el-table-column type="selection" align="center" width="48"></el-table-column>
						<el-table-column align="center" width="80" prop="id" label="ID"></el-table-column>
						<el-table-column
						  prop="name"
						  label="关键词"
						  min-width="120"
						  >
						  <template #default="scope">
							<el-link v-if="scope.row.url" :href="scope.row.url" target="_blank" type="primary">
							  {{scope.row.name}}
							</el-link>
							<span v-else>
							  {{scope.row.name}}
							</span>
						  </template>
						</el-table-column>
						<el-table-column
						  prop="my_level"
						  label="关键词等级"
						  align="center"
						  width="100"
						  >
						</el-table-column>
						<el-table-column
						  prop="rank_number"
						  label="排名"
						  align="center"
						  width="100"
						  >
						  <template #default="scope">
							<div class="item_text item_text_rank">
							  <span class="before">{{scope.row.rank_number}}</span>
							  <template v-if="scope.row.hasOwnProperty('rand_cha')">
								<span v-if="scope.row['rand_cha'] !== 0" class="after" :class="scope.row['rand_cha'] > 0 ? 'red' : scope.row['rand_cha'] < 0 ? 'green' : 'default'">{{ Math.abs(scope.row['rand_cha']) }}</span>
								<span v-else class="zero"></span>
							  </template>
							</div>
						  </template>
						</el-table-column>
						<el-table-column
						  prop="avgnumber"
						  align="center"
						  label="抖音指数"
						  width="90"
						  >
						</el-table-column>
						<el-table-column
						  v-if="searchData.all_name"
						  prop="depart"
						  align="center"
						  label="部门"
						  width="100"
						  >
						</el-table-column>
						<el-table-column
						  v-if="searchData.all_name"
						  prop="uname"
						  align="center"
						  label="负责人"
						  width="90"
						  >
						</el-table-column>
						<el-table-column
						  prop="score"
						  align="center"
						  label="积分"
						  width="140"
						  >
						  <template #default="scope">
							<div class="chart_main">
							  <div class="item_text">
								<span class="before">{{scope.row.score}}</span>
								<template v-if="scope.row.hasOwnProperty('score_cha')">
								  <span v-if="scope.row['score_cha'] !== 0" class="after" :class="scope.row['score_cha'] > 0 ? 'red' : scope.row['score_cha'] < 0 ? 'green' : 'default'">{{ Math.abs(scope.row['score_cha']).toFixed(1) }}</span>
								  <span v-else class="zero"></span>
								</template>
							  </div>
							  <el-tooltip content="点击查看积分趋势" placement="right-start" effect="light">
								<span class="icon_chart" @click="showLineChart(scope.row)"><svg-icon icon-class="line2" alt="" /></span>
							  </el-tooltip>
							</div>
						  </template>
						</el-table-column>
						<el-table-column
						  prop="desc"
						  label="标题"
						  min-width="460"
						  >
						</el-table-column>
						<el-table-column
						  prop="nickname"
						  label="名称"
						  min-width="150"
						  >
						</el-table-column>
					  </el-table>
				  </div>
				  <div class="out_box fixed" v-if="scrollPosition.maxScrollWidth>0&&scrollPosition.isPC" :style="'left:'+scrollPosition.left+'px;width:'+scrollPosition.width+'px;bottom:'+scrollPosition.fixedBottom+'px;'" ref="out_box">
					  <div class="in_box" @mousedown="mouseDownHandler" :style="'left:'+scrollPosition.insetLeft+'px;width:'+scrollPosition.insetWidth+'px;'" ref="in_box" ></div>
				  </div>
			  </div>
			  <div class="pagination-panel" v-if="totalDataNum>50" ref="pagePane">
				<el-pagination
				  @size-change="handleSizeChange"
				  @current-change="handleCurrentChange"
				  :current-page="searchData.page"
				  :page-sizes="pageSizeList"
				  :page-size="searchData.limit"
				  :pager-count="pagerCount"
				  :layout="'total, sizes, prev, pager, next, jumper'"
				  :total="totalDataNum">
				</el-pagination>
			  </div>
			</el-card>
		  </div>
		</div>
	  </div>
	  <el-backtop target=".scroll-panel"></el-backtop>
	  <ExportModal ref="ExportModalRef" @exportSuccess="exportDone"></ExportModal>
	  
	</div>
  </template>
  <script>
  import { mapGetters } from 'vuex'
  import ExportModal from '@/components/Excel/exportModal.vue'
  import { jsonToSheetXlsx } from '@/components/Excel/Export2Excel'
  import {sortByDesc, sortByAsc} from "@/utils/index"
  import * as echarts from 'echarts';
  export default {
	name: 'Douyin_index',
	components: {
	  ExportModal
	},
	data() {
	  return {
		breadcrumbList:[],
		menuButtonPermit:[],
		pagerCount:5,
		pageSizeList:[20, 50, 100, 150, 200],
		totalDataNum: 0,
		tableData:[],
		tableHeight:200,
		searchData:{
		  keyword: "",
		  nickname: "",
		  all_name: false,
		  page: 1,
		  limit: 20,
		  num: "",
		  my_level: "",
		  sort: "",
		  id: ""
		},
		scrollPosition:{
		  width:0,
		  left:0,
		  fixedBottom: 20,
		  insetWidth:0,
		  oldInsetLeft:0,
		  insetLeft:0,
		  ratio:0,
		  startPageX:0,
		  maxScrollWidth:0,
		  isMouseDown:false,
		  isPC:true,
		  isFixed:false,
		},
		scrollTable:{
		  scrollDom:null,
		  tableHeaderFixedDom:null,
		  tableFixedRightDom:null,
		  tableFixedLeftDom:null,
		  fixedTopHeight:0,
		  tableheaderHeight:0,
		  fixedRightWidth:0,
		  fixedLeftWidth:0,
		  tableBottom:0,
		  clientHeight:0,
		},
		isSearchResult:false,
		selectedData: [],
		pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
	  }
	},
	computed: {
	  ...mapGetters([
		'sidebar',
		'menuData'
	  ]),
	  isOpen() {
		return this.sidebar.opened;
	  },
	},
	mounted(){
	  const $this = this;
	  if(!$this.sidebar.opened){
		$this.$store.dispatch('app/toggleSideBar');
	  }
	  // 监听竖向滚动条滚动事件
	  window.addEventListener('scroll',$this.handleScroll,true);
	  $this.$nextTick(function () {
		$this.setTableHeight();
	  });
	  window.onresize = () => {
		return (() => {
		  $this.setTableHeight();
		})()
	  }
	},
	watch: {
	  tableHeight(val) {
		if (!this.timer) {
		  this.tableHeight = val
		  this.timer = true
		  const $this = this
		  setTimeout(function() {
			$this.timer = false
		  }, 400)
		}
	  },
	},
	created(){
	  var $this = this;
	  $this.getBreadcrumbList();
	  $this.initData();
	},
	updated(){
	  var $this = this;
	  $this.$nextTick(() => {
		$this.$refs.simpleTable.doLayout();
	  });
	},
	destroyed(){
	  window.removeEventListener('scroll', this.handleScroll,true);//监听页面滚动事件
	},
	methods:{
	  // 获取面包屑路径
	  getBreadcrumbList(){
		var $this = this;
		var breadcrumbList = [];
		var currentID = ""+$this.$router.currentRoute.meta.id;
		var pageID = 0;
		if(currentID.indexOf('-')!=-1){
		  pageID = parseInt(currentID.split("-")[1]);
		}else{
		  pageID = parseInt(currentID);
		}
		$this.menuData.forEach(function(item,index){
		  if(item.meta.id == pageID){
			var itemData = {};
			itemData.id = item.meta.id;
			itemData.router = item.path;
			itemData.title = item.meta.title;
			breadcrumbList.push(itemData);
		  }else{
			if(item.children.length>0){
			  item.children.forEach(function(item1,index1){
				if(item1.meta.id == pageID){
				  var itemData = {};
				  itemData.id = item.meta.id;
				  itemData.router = item.path;
				  itemData.title = item.meta.title;
				  breadcrumbList.push(itemData);
				  var itemData2 = {};
				  itemData2.id = item1.meta.id;
				  itemData2.router = item1.path;
				  itemData2.title = item1.meta.title;
				  breadcrumbList.push(itemData2);
				}else{
				  if(item1.children.length>0){
					item1.children.forEach(function(item2,index2){
					  if(item2.meta.id == pageID){
						var itemData = {};
						itemData.id = item.meta.id;
						itemData.router = item.path;
						itemData.title = item.meta.title;
						breadcrumbList.push(itemData);
						var itemData2 = {};
						itemData2.id = item1.meta.id;
						itemData2.router = item1.path;
						itemData2.title = item1.meta.title;
						breadcrumbList.push(itemData2);
						var itemData3 = {};
						itemData3.id = item2.meta.id;
						itemData3.router = item2.path;
						itemData3.title = item2.meta.title;
						breadcrumbList.push(itemData3);
					  }
					});
				  }
				}
			  });
			}
		  }
		});
		$this.breadcrumbList = breadcrumbList;
	  },
	  // 判断浏览器类型
	  getBrowserType(){
		var ua =  navigator.userAgent;
		if(ua){
		  if(ua.indexOf('Mobile')!=-1){
			this.scrollPosition.isPC = false;
		  }else{
			this.scrollPosition.isPC = true;
		  }
		}else{
		  this.scrollPosition.isPC = true;
		}
	  },
	  // 设置高度
	  setTableHeight(){
		var $this = this;
		$this.tableHeight = 0;      
		var headerHeight = $this.$refs.headerPane.offsetHeight;
		var breadcrumbHeight = $this.$refs.breadcrumbPane.offsetHeight;
		var screenHeight = $this.$refs.boxPane.offsetHeight;
		var countHeight = $this.$refs.countPane.offsetHeight;
		$this.tableHeight = screenHeight-headerHeight-countHeight-breadcrumbHeight-40-45-31;
		$this.getBrowserType();
		  setTimeout(function() {
			$this.setScrollDom();
		}, 400);
	  },
	  // 表格多选改变事件
	  handleSelectionChange(val) {
		var $this = this;
		$this.selectedData = val;
	  },
	  // 搜索点击事件
	  searchResult(){
		var $this = this;
		if(!$this.isSearchResult){
		  $this.isSearchResult=true;
		  $this.searchData.page = 1;
		  $this.initPage();
		}
	  },
	  // 重置表单
	  resetData(){
		  var $this = this;
		  $this.searchData.page=1;
		  $this.searchData.limit=20;
		  $this.searchData.keyword = "";
		  $this.searchData.nickname = "";
		  $this.searchData.all_name = false;
		  $this.searchData.num = "";
		  $this.searchData.my_level = "";
		  $this.searchData.sort = "";
		  $this.searchData.id = "";
		  $this.searchResult();
	  },
	  // 初始化数据
	  initData(){
		var $this = this;
		$this.getUserMenuButtonPermit();
	  },
	  // 获取当前登陆用户在该页面的操作权限
	  getUserMenuButtonPermit(){
		var $this = this;
		$this.$store.dispatch('api/getMenuButtonPermitAction',{id:$this.$router.currentRoute.meta.id}).then(res=>{
		  if(res.status){
			// if(res.data.length>0){
			//   res.data.forEach(function(item,index){
			// 	$this.menuButtonPermit.push(item.action_route);
			//   });
			//   if($this.menuButtonPermit.includes('Douyin_index')){
			// 	$this.getDouyinTime();
			//   }else{
			// 	$this.$message({
			// 	  showClose: true,
			// 	  message: "未被分配该页面的访问权限",
			// 	  type: 'error',
			// 		duration:6000
			// 	});
			// 	$this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
			//   }
			// }else{
			//   $this.$message({
			// 	showClose: true,
			// 	message: "未被分配该页面的访问权限",
			// 	type: 'error',
			// 	  duration:6000
			//   });
			//   $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
			// }
		  }else{
			$this.$message({
			  showClose: true,
			  message: response.info,
			  type: 'error'
			});
		  }
		});
	  },
	  // 获取日期
	  getDouyinTime(){
		var $this = this;
		$this.$store.dispatch('douyin/douyinCountTime',null).then(res=>{
		  if(res.status){
			$this.timeList = res.data;
			var numArr = [];
			res.data.forEach(item => {
			  numArr.push(item.num)
			})
			$this.searchData.num = Math.max(...numArr);
			$this.timeArr = numArr;
			$this.initPage();
			$this.getDouyinCount();
		  }else{
			$this.$message({
			  showClose: true,
			  message: response.info,
			  type: 'error'
			});
		  }
		});
	  },
	  selectedTimeChange(){
		var $this = this;
		if(!$this.isSearchResult){
		  $this.isSearchResult=true;
		  $this.initPage();
		  $this.getDouyinCount();
		}
	  },
	  // 初始化页面信息
	  initPage(){
		var $this = this;
		$this.nick_res = [];
		var formData = {}
		formData.page = $this.searchData.page;
		formData.limit = $this.searchData.limit;
		formData.keyword = $this.searchData.keyword;
		formData.nickname = $this.searchData.nickname;
		formData.all_name = $this.searchData.all_name ? 1 : "";
		formData.num = $this.searchData.num;
		formData.my_level = $this.searchData.my_level;
		formData.sort = $this.searchData.sort;
		document.getElementsByClassName("scroll-panel")[0].scrollTop = 0;
		$this.$store.dispatch('douyin/getDouyinResData', formData).then(response=>{
			if(response){
			  if(response.status){
				if(response.data){
				  $this.tableData = response.data;
				  $this.totalDataNum = response.allcount;
				  setTimeout(()=>{
					$this.isSearchResult=false;
				  },1000);
				  $this.$nextTick(function () {
					$this.setTableHeight();
				  })
				}
				if(response.nick_res){
				  var keys = Object.keys(response.nick_res);
				  var resList = [];
				  keys.forEach(item => {
					var obj = {};
					obj.name = item;
					obj.value = response.nick_res[item];
					resList.push(obj);
				  })
				  $this.nick_res = resList;
				}else{
				  $this.nick_res = [];
				}
				if(response.add_word){
				  var keys = Object.keys(response.add_word);
				  var resList = [];
				  keys.forEach(item => {
					var obj = {};
					obj.name = item;
					obj.value = response.add_word[item];
					resList.push(obj);
				  })
				  $this.add_word = resList;
				}else{
				  $this.add_word = [];
				}
				if(response.desc_word){
				  var keys = Object.keys(response.desc_word);
				  var resList = [];
				  keys.forEach(item => {
					var obj = {};
					obj.name = item;
					obj.value = response.desc_word[item];
					resList.push(obj);
				  })
				  $this.desc_word = resList;
				}else{
				  $this.desc_word = [];
				}
  
				if( $this.searchData.nickname == "" || $this.searchData.nickname && $this.CheckNameIn()){
				  $this.checkBtnShow = true;
				}else{
				  $this.checkBtnShow = false;
				}
			  }else{
				if(response.permitstatus&&response.permitstatus==2){
				  $this.$message({
					showClose: true,
					message: "未被分配该页面访问权限",
					type: 'error',
					duration:6000
				  });
				  $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
				}else{
				  $this.$message({
					showClose: true,
					message: response.info,
					type: 'error'
				  });
				  setTimeout(()=>{
					$this.isSearchResult=false;
				  },1000);
				}
			  }
			}
		});
	  },
	  // 每页显示条数改变事件
	  handleSizeChange(val) {
		this.searchData.limit = val;
		this.searchData.page = 1;
		this.initPage();
	  },
	  // 当前页改变事件
	  handleCurrentChange(val) {
		this.searchData.page = val;
		this.initPage();
	  },
	  // 设置横向滚动条相关DOM数据
	  setScrollDom(){
		var $this = this;
		$this.scrollPosition.insetLeft = 0;
		$this.scrollPosition.oldInsetLeft = 0;
		// 表格真实宽度（可能超出屏幕）
		var scrollWidth = $this.$refs.simpleTable.bodyWrapper.scrollWidth;
		// 表格可见宽度（屏幕内宽度）
		var maxWidth = $this.$refs.simpleTable.bodyWrapper.clientWidth;
		// 获取表格的位置信息（距离视窗左边的位置信息）
		var rectOBJ = $this.$refs.simpleTable.$el.getBoundingClientRect();
		// 获取距离视窗左边的宽度
		var leftWidth = rectOBJ.left;
		// 根据百分比算出滚动条滑块的宽度
		var insetWidth = parseInt(maxWidth/scrollWidth*maxWidth);
		// 算出滚动条与视口比例（滚动条滚动1像素视口需要滚动多少像素）
		var ratio = (scrollWidth - maxWidth) / (maxWidth - insetWidth);
		var scrollDom = document.querySelector(".SiteTable .el-table__body-wrapper");
		var tableHeaderFixedDom = document.querySelector(".SiteTable .el-table__header-wrapper");
		var tableFixedRightDom = document.querySelector(".SiteTable .el-table__fixed-right");
		var tableFixedLeftDom = document.querySelector(".el-table__fixed");
		$this.scrollPosition.width = maxWidth;
		$this.scrollPosition.left = leftWidth;
		$this.scrollPosition.insetWidth = insetWidth;
		$this.scrollPosition.ratio = parseFloat(ratio);
		$this.scrollPosition.maxScrollWidth = maxWidth - insetWidth;
		$this.scrollTable.scrollDom = scrollDom;
		// 视窗改变时，让自定义滚动条的位置与真实滚动条滚动的位置相吻合
		$this.scrollPosition.insetLeft = $this.scrollTable.scrollDom.scrollLeft/$this.scrollPosition.ratio;
		// 获取表格头吸顶需滚动的高度
		if($this.$refs.headerPane){
		   $this.scrollTable.fixedTopHeight = $this.$refs.headerPane.offsetHeight+$this.$refs.countPane.offsetHeight+$this.$refs.breadcrumbPane.offsetHeight+15+20;
		}else{
		   $this.scrollTable.fixedTopHeight=$this.$refs.breadcrumbPane.offsetHeight+15+20;
		}
		$this.scrollTable.tableHeaderFixedDom = tableHeaderFixedDom;
		if(tableFixedRightDom&&tableFixedRightDom!=null&&tableFixedRightDom!=undefined){
		   $this.scrollTable.tableFixedRightDom = tableFixedRightDom;
		}
		if(tableFixedLeftDom&&tableFixedLeftDom!=null&&tableFixedLeftDom!=undefined){
		   $this.scrollTable.tableFixedLeftDom = tableFixedLeftDom;
		}
		var fixedHeaderObj = $this.scrollTable.tableHeaderFixedDom.getBoundingClientRect();
		// 获取表格头的高度
		$this.scrollTable.tableheaderHeight = fixedHeaderObj.height;
		if(tableFixedRightDom&&tableFixedRightDom!=null&&tableFixedRightDom!=undefined){
		   var fixedRightObj = $this.scrollTable.tableFixedRightDom.getBoundingClientRect();
		   // 获取右侧固定列的总宽度
		   $this.scrollTable.fixedRightWidth = fixedRightObj.width;
		}
		if(tableFixedLeftDom&&tableFixedLeftDom!=null&&tableFixedLeftDom!=undefined){
		   var fixedLeftObj = $this.scrollTable.tableFixedLeftDom.getBoundingClientRect();
		   // 获取左侧侧固定列的总宽度
		   $this.scrollTable.fixedLeftWidth = fixedLeftObj.width;
		}
		var tableObj = $this.scrollTable.scrollDom.getBoundingClientRect();
		$this.scrollTable.tableBottom = tableObj.height+$this.scrollTable.fixedTopHeight+$this.scrollTable.tableheaderHeight+54+20;
		$this.scrollTable.clientHeight = document.documentElement.clientHeight;
		// 头部固定情况下视窗宽高改变，需要重新设置的一些宽高
		if($this.scrollPosition.isFixed){
		  var tableHeaderStyle = "width:"+$this.scrollPosition.width+"px;";
		  $this.scrollTable.tableHeaderFixedDom.style = tableHeaderStyle;
		  document.querySelector(".table-mask").style = tableHeaderStyle;
		  var tableStyle3 = "width:"+$this.scrollTable.fixedRightWidth+"px;";
		  var tableStyle4 = "width:"+$this.scrollTable.fixedLeftWidth+"px;";
		  if(tableFixedRightDom&&tableFixedRightDom!=null&&tableFixedRightDom!=undefined){
			document.querySelector(".SiteTable .el-table__fixed-right .el-table__fixed-header-wrapper").style=tableStyle3;
		  }
		  if(tableFixedLeftDom&&tableFixedLeftDom!=null&&tableFixedLeftDom!=undefined){
			document.querySelector(".SiteTable .el-table__fixed .el-table__fixed-header-wrapper").style=tableStyle4;
		  }
		  $this.scrollTable.tableBottom = tableObj.height+$this.scrollTable.fixedTopHeight+54+20;
		}
	  },
	  // 竖向滚动条滚动事件
	  handleScroll(event){
		var $this = this;
		if(!$this.scrollPosition.isMouseDown&&event.target.className=="scroll-panel"){// 非鼠标按下状态，为竖向滚动条触发的滚动事件
		  var scrTop = event.target.scrollTop;
		  var tableFixedRightDom = document.querySelector(".SiteTable .el-table__fixed-right");
		  var tableFixedLeftDom = document.querySelector(".SiteTable .el-table__fixed");
		  if(scrTop>=$this.scrollTable.fixedTopHeight){// 头部需要固定
			$this.scrollPosition.isFixed = true;
			var tableHeaderStyle = "width:"+$this.scrollPosition.width+"px;"
			$this.scrollTable.tableHeaderFixedDom.style = tableHeaderStyle;
			document.querySelector(".table-mask").style = tableHeaderStyle;
			var tableStyle1 = "padding-top:"+$this.scrollTable.tableheaderHeight+"px;";
			var tableStyle2 = "top:"+$this.scrollTable.tableheaderHeight+"px;";
			var tableStyle3 = "width:"+$this.scrollTable.fixedRightWidth+"px;";
			var tableStyle4 = "width:"+$this.scrollTable.fixedLeftWidth+"px;";
			document.querySelector(".SiteTable .el-table__body-wrapper").style=tableStyle1;
			if(tableFixedRightDom&&tableFixedRightDom!=null&&tableFixedRightDom!=undefined){
			  document.querySelector(".SiteTable .el-table__fixed-right .el-table__fixed-body-wrapper").style=tableStyle2;
			  document.querySelector(".SiteTable .el-table__fixed-right .el-table__fixed-header-wrapper").style=tableStyle3;
			}
			if(tableFixedLeftDom&&tableFixedLeftDom!=null&&tableFixedLeftDom!=undefined){
			  document.querySelector(".SiteTable .el-table__fixed .el-table__fixed-body-wrapper").style=tableStyle2;
			  document.querySelector(".SiteTable .el-table__fixed .el-table__fixed-header-wrapper").style=tableStyle4;
			}
		  }else{// 头部需要变为正常
			$this.scrollPosition.isFixed = false;
			var tableHeaderStyle = "width:100%";
			$this.scrollTable.tableHeaderFixedDom.style = tableHeaderStyle;
			var tableStyle1 = "padding-top:0";
			document.querySelector(".SiteTable .el-table__body-wrapper").style=tableStyle1;
			var tableStyle3 = "width:auto";
			var tableStyle4 = "width:auto";
			if(tableFixedRightDom&&tableFixedRightDom!=null&&tableFixedRightDom!=undefined){
			  document.querySelector(".SiteTable .el-table__fixed-right .el-table__fixed-header-wrapper").style=tableStyle3;
			}
			if(tableFixedLeftDom&&tableFixedLeftDom!=null&&tableFixedLeftDom!=undefined){
			  document.querySelector(".SiteTable .el-table__fixed .el-table__fixed-header-wrapper").style=tableStyle4;
			}
		  }
		}
	  },
	  // 监听横向滚动条鼠标按下事件
	  mouseDownHandler(e){
		this.crossMoveStartHandler(e);
		window.addEventListener('mousemove',this.crossMoveingHandler);
		window.addEventListener('mouseup',this.crossMoveEndHandler);
	  },
	  // 横向滚动条移动开始事件
	  crossMoveStartHandler(e){
		var $this = this;
		$this.scrollPosition.isMouseDown = true;
		$this.scrollPosition.startPageX = e.pageX;
	  },
	  // 横向滚动条鼠标移动事件
	  crossMoveingHandler(e){
		var $this = this;
		if($this.scrollPosition.isMouseDown){// 只在鼠标按下时监听鼠标移动事件
		  var moveLeft = e.pageX - $this.scrollPosition.startPageX;
		  var scrollWidth = 0;
		  // 判断本次鼠标按下后鼠标移动的距离 大于0为向右移动
		  if(moveLeft>0){
			// 本次移动距离+历史已移动距离如果大于最大能移动距离，说明向右已经滚动到头
			if(moveLeft+$this.scrollPosition.oldInsetLeft>=$this.scrollPosition.maxScrollWidth){
			  scrollWidth = $this.scrollPosition.maxScrollWidth;
			}else{
			  scrollWidth = moveLeft+$this.scrollPosition.oldInsetLeft;
			}
		  }else if(moveLeft<0){
			// 小于0为向左移动
			// 本次移动距离+历史已移动距离，如果小于0，说明向左移动已经到头
			if(moveLeft+$this.scrollPosition.oldInsetLeft<0){
			  scrollWidth = 0;
			}else{
			  scrollWidth = moveLeft+$this.scrollPosition.oldInsetLeft;
			}
		  }else{// 鼠标按下后，未移动
			scrollWidth = $this.scrollPosition.insetLeft;
		  }
		  // 计算得出本次移动+历史移动总距离
		  // 自定义滚动条位置改变
		  $this.scrollPosition.insetLeft = scrollWidth;
		  // 真实滚动条滚动距离 = 自定义滚动条滚动距离*自定义滚动条与真实滚动条的滚动比
		  $this.scrollTable.scrollDom.scrollLeft = scrollWidth*$this.scrollPosition.ratio;
		  e.preventDefault();
		}
	  },
	  // 横向滚动条移动结束事件
	  crossMoveEndHandler(e){
		var $this = this;
		$this.scrollPosition.isMouseDown = false;
		$this.scrollPosition.startPageX = 0;
		$this.scrollPosition.oldInsetLeft = $this.scrollPosition.insetLeft;
	  },
	  addTableRow() {
		this.$refs.ExportModalRef.showDialog({ fieldList: this.fieldList2, hasSelected: this.selectedData.length > 0, hasData: this.tableData.length > 0 })
	  },
	  addScore(){
		this.$refs.ExportModalRef.showDialog({ fieldList: this.fieldList2, hasSelected: this.selectedData.length > 0, hasData: this.tableData.length > 0 })
	  }
	}
  }
  </script>
  <style lang="scss" scoped>
  .el-table.SiteTable .table-button .el-button{
	margin: 0;
  }
  .search-wrap{
	background-color: #fff;
	padding: 15px;
	margin-bottom: 15px;
	.item-search{
	  float:left;
	  padding: 10px 10px 10px 0;
	  span{
		font-size: 14px;
		line-height: 28px;
	  }
	  .el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner {
		width: 100% !important
	  }
	  .el-checkbox__label{
		padding-left: 6px;
	  }
	  .el-checkbox.is-bordered.el-checkbox--medium{
		height: 32px;
		padding-top: 6px;
	  }
	  .item-label{
		line-height: 32px;
		font-size: 14px;
		color: #606266;
	  }
	}
	.input-panel{
	  width: 210px;
	}
	.select-panel{
	  width: 140px;
	}
  }
  .el-table.SiteTable svg{
	font-size: 20px;
  }
  .item-text{
	color: #606266;
	display: flex;
	align-items: center;
	line-height: 0;
	&.regular{
	  color: #999;
	}
	&.keyword{
	  justify-content: center;
	  span{
		justify-content: center;
	  }
	}
	&.center{
	  justify-content: center;
	  span{
		flex: none;
		display: inline-flex;
		justify-content: center;
		line-height: 24px;
	  }
	}
	span{
	  flex: 1;
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  line-height: 24px;
	  .svg-i{
		display: inline-flex;
		align-items: center;
		justify-content: center;
	  }
	  &.before{
		justify-content: flex-end;
		color: #111;
	  }
	  &.after{
		justify-content: flex-start;
		margin-left: 4px;
	  }
	  &.zero{
		padding-left: 6px;
		position: relative;
		&:before{
		  content: '';
		  height: 2px;
		  width: 6px;
		  background-color: #999;
		  position: absolute;
		  left: 6px;
		  top: 0;
		}
	  }
	  &.default{
		padding-left: 10px;
		color: #999;
	  }
	  &.red{
		padding-left: 10px;
		color: #f97979;
		background: url(../../../assets/up.png) left center no-repeat;
		background-size: auto 10px;
	  }
	  &.green{
		padding-left: 10px;
		color: #6dd29a;
		background: url(../../../assets/down.png) left center no-repeat;
		background-size: auto 10px;
	  }
	}
	.icon-other{
	  font-size: 16px;
	  color: #f97979;
	  margin-right: 6px;
	  cursor: pointer;
	}
  }
  .box-card .el-card__header{
	padding: 0;
	background-color: transparent;
  }
  .link{
	color:#0970ff;
	font-size: 13px;
	.item-text span.before{
	  color:#0970ff;
	}
	.item-text span.zero:before{
	  background-color:#0970ff;
	}
  }
  </style>
  <style lang="scss" > 
  .el-table__cell.stripe{
	background: #fafafa;
  }
  
  .el-table__cell.stripe-all{
	background: #f2f6f9;
  }
  
  .el-table--border th.el-table__cell{
	border-bottom: 1px solid #ebeff1;
  }
  .el-table--border .el-table__cell {
	  border-right: 1px solid #ebeff1;
  }
  .el-table th.el-table__cell{
	font-weight: normal;
	color: #111;
  }
  .el-tooltip__popper.is-light{
	color: #606266!important;
  }
  .el-message{
	max-width: 380px;
	min-width: 380px!important;
  }
  
  .el-table.dyTable{
	border-radius:8px;
	border-left:1px solid #ebeff1;
	border-right:1px solid #ebeff1;
	display:flex;
	flex-direction:column;
	.el-table__body-wrapper{
	  flex:1;
	  display:flex;
	  flex-direction:column;
	  .el-table__empty-block{
		flex:1;
	  }
	}
	&:before{display:none;}
	th.is-leaf{
	  background:#e2e9ed;
	  font-size: 14px;
	  color:#555;
	  font-weight:normal;
	  border-bottom:1px solid #ebeff1;
	  border-right:1px solid #ebeff1;
	  line-height:20px;
	}
	th.gutter{
	  background:#e2e9ed;
	}
	td{
	  border-bottom:1px solid #ebeff1 !important;
	  border-right:1px solid #ebeff1 !important;
	  font-size:13px !important;
	  color:#1a1a1a;
	}
	svg,i[class~="el-cion"]{
	  font-size:21px;
	}
	.el-table__placeholder{
	  display:none!important;
	}
  }
  
  </style>