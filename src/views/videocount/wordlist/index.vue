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
							<div class="item-search item-search-date">
								<el-date-picker
									v-model="searchData.time"
									@change="searchResult"
									type="daterange"
									format="yyyy-MM-dd"
									value-format="yyyy-MM-dd"
									key="b"
									size="small"
									class="date-range"
									range-separator="～"
									start-placeholder="开始日期"
									end-placeholder="结束日期"
									:picker-options="pickerRangeOptions">
								</el-date-picker>
							</div>
							<div class="item-search">
								<el-input
									class="input-panel"
									size="small"
									placeholder="请输入姓名"
									v-model="searchData.name"
									@keyup.enter.native="searchResult"
									@clear="searchResult"
									clearable>
								</el-input>
							</div>
							<div class="item-search">
								<el-button class="item-input" :class="isSearchResult?'isDisabled':''" :disabled="isSearchResult" type="primary" size="small" icon="el-icon-search" @click="searchResult">查询</el-button>
								<el-button type="info" :disabled="isSearchResult" class="resetBtn" size="small" @click="resetData">重置</el-button>
								<el-button type="success" v-if="menuButtonPermit.includes('videocount_saveword')" :disabled="isSearchResult" size="small" icon="el-icon-plus" @click="addTableRow" >添加工作汇报</el-button>
								<el-button type="warning" size="small" :disabled="isSearchResult" class="exportBtn derived" @click="showExportDialog"><i class="svg-i"><svg-icon icon-class="derived" /></i>导出数据</el-button>
								<el-button type="danger" v-if="menuButtonPermit.includes('videocount_distribution')" :disabled="isSearchResult" size="small" icon="el-icon-thumb" class="exportBtn derived"  @click="addScore">分配积分</el-button>
							</div>
						</div>
					</div>
					<div class="clues_info">
						<p><span>当前结果共有<strong class="color3">{{infoData.totalNumber}}</strong>条数据，完成积分<strong class="color2">{{infoData.allScore}}</strong>分，有效积分<strong class="color1">{{infoData.trueScore}}</strong>分。</span></p>
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
									stripe
									:style="'min-height:'+tableHeight+'px;'"
									>
									<el-table-column align="center" width="60" type="expand">
										<template slot-scope="props">
											<div class="table_detail">
												<el-table
													ref="childTable"
													:data="props.row.detail"
													style="width:100%"
													>
													<el-table-column
														prop="post_name"
														label="岗位"
														align="center"
														min-width="100"
														>
														<template slot-scope="scopes">
															{{scopes.row.extend.post_name}}
														</template>
													</el-table-column>
													<el-table-column
														prop="type_name"
														label="类型/单个积分"
														align="center"
														min-width="130"
														>
														<template slot-scope="scopes">
															{{scopes.row.extend.type_name}}（{{scopes.row.extend.score}}）
														</template>
													</el-table-column>
													<el-table-column
														prop="number"
														label="完成数量"
														align="center"
														min-width="100"
														>
														<template slot-scope="scopes">
															{{scopes.row.extend.number}}
														</template>
													</el-table-column>
													<el-table-column
														prop="invalid_number"
														label="未通过审核数量"
														align="center"
														min-width="100"
														>
														<template slot-scope="scopes">
															{{scopes.row.extend.invalid_number}}
														</template>
													</el-table-column>
													<el-table-column
														prop="score"
														label="完成积分"
														min-width="100"
														align="center"
														>
													</el-table-column>
													<el-table-column
														prop="valid_score"
														label="有效积分"
														min-width="100"
														align="center"
														>
													</el-table-column>
													<el-table-column
														prop="remark"
														label="备注"
														align="center"
														min-width="150"
														>
													</el-table-column>
													<el-table-column
														v-if="props.row.detail && props.row.detail.length > 0 && props.row.detail[0].user_id == userInfo.id && (menuButtonPermit.includes('videocount_saveword') || menuButtonPermit.includes('videocount_delword') || menuButtonPermit.includes('videocount_distribution'))"
														:width="operationsWidth"
														align="center"
														prop="operations"
														label="操作" >
														<template slot-scope="scopes">
															<div class="table-button" >
																<el-button v-if="menuButtonPermit.includes('videocount_saveword')&&scopes.row.type_type == 'manual'" size="mini" @click="editTableRow(scopes.row, scopes.$index)" plain type="primary" >编辑</el-button>
																<el-button v-if="menuButtonPermit.includes('videocount_delword')&&scopes.row.type_type == 'manual'" size="mini" @click="deleteTableRow(scopes.row, scopes.$index)" type="info" plain >删除</el-button>
																<el-button v-if="menuButtonPermit.includes('videocount_distribution')&&scopes.row.type_type == 'specify'" size="mini" @click="editScoreRow(scopes.row, scopes.$index)" plain type="primary" >编辑</el-button>
																<el-button v-if="menuButtonPermit.includes('videocount_distribution')&&scopes.row.type_type == 'specify'" size="mini" @click="deleteScoreRow(scopes.row, scopes.$index)" type="info" plain >删除</el-button>
															</div>
														</template>
													</el-table-column>
												</el-table>
											</div>
										</template>
									</el-table-column>
									<el-table-column
										prop="user_name"
										label="姓名"
										align="center"
										min-width="100"
										>
									</el-table-column>
									<el-table-column
										prop="day"
										label="日期"
										align="center"
										min-width="100"
										>
									</el-table-column>
									<el-table-column
										prop="promotional_video"
										label="公司宣传片"
										align="center"
										sortable
										min-width="130"
										>
									</el-table-column>
									<el-table-column
										prop="character_on_camera"
										label="人物上镜短视频"
										align="center"
										sortable
										min-width="150"
										>
									</el-table-column>
									<el-table-column
										prop="wechat_moments"
										label="朋友圈视频"
										align="center"
										sortable
										min-width="130"
										>
									</el-table-column>
									<el-table-column
										prop="pure_shear_video"
										label="纯剪视频"
										align="center"
										sortable
										min-width="120"
										>
									</el-table-column>
									<el-table-column
										prop="other"
										label="其他（素材处理）"
										align="center"
										sortable
										min-width="160"
										>
									</el-table-column>
									<el-table-column
										prop="specify"
										align="center"
										sortable
										label="分配的积分"
										min-width="120"
										>
									</el-table-column>
									<el-table-column
										prop="inquiry"
										align="center"
										sortable
										label="询盘成交"
										min-width="120"
										>
									</el-table-column>
									<el-table-column
										prop="score"
										align="center"
										sortable
										label="完成积分"
										min-width="120"
										>
									</el-table-column>
									<el-table-column
										prop="valid_score"
										align="center"
										sortable
										label="有效积分"
										min-width="120"
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
	  <AddWork ref="AddWorkRef" @saveSuccess="searchResult"></AddWork>
	  <AddScore ref="AddScoreRef" @saveSuccess="searchResult"></AddScore>
	  <ExportModal ref="ExportModalRef" @exportSuccess="exportDone"></ExportModal>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
import AddScore from '../component/addScore.vue';
import AddWork from '../component/addWork.vue';
import {sortByDesc, sortByAsc} from "@/utils/index";
import * as echarts from 'echarts';
import {parseTime}  from "@/utils";
import ExportModal from '@/components/Excel/exportModal.vue'
import { jsonToSheetXlsx } from '@/components/Excel/Export2Excel'
export default {
	name: 'Douyin_index',
	components: {
		AddScore,
		AddWork,
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
				time: [],
				name: "",
				page: 1,
				limit: 20,
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
			operationsWidth: "",
			isSearchResult:false,
			selectedData: [],
			fieldList: [
				{ key: 'user_name', value: '姓名' },
				{ key: 'day', value: '日期' },
				{ key: 'promotional_video', value: '公司宣传片' },
				{ key: 'character_on_camera', value: '人物上镜短视频' },
				{ key: 'wechat_moments', value: '朋友圈视频' },
				{ key: 'pure_shear_video', value: '纯剪视频' },
				{ key: 'other', value: '其他（素材处理）' },
				{ key: 'specify', value: '分配的积分' },
				{ key: 'inquiry', value: '询盘成交' },
				{ key: 'score', value: '完成积分' },
				{ key: 'valid_score', value: '有效积分'}
			],
			infoData:{
				totalNumber: 0,
				allScore: 0,
				trueScore: 0
			},
			pickerRangeOptions: this.$pickerRangeOptions,
		}
	},
	computed: {
		...mapGetters([
			'sidebar',
			'menuData',
			'userInfo'
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
			$this.tableHeight = screenHeight-headerHeight-breadcrumbHeight-40-35;
			$this.getBrowserType();
				setTimeout(function() {
				$this.setScrollDom();
			}, 400);
		},
		// 搜索点击事件
		searchResult(){
			var $this = this;
			if(!$this.isSearchResult){
				$this.isSearchResult=true;
				$this.searchData.page = 1;
				$this.getWorkList();
			}
		},
		// 重置表单
		resetData(){
			var $this = this;
			const end = parseTime(new Date(), '{y}-{m}-{d}');
			const start = $this.getEndDay();
			$this.searchData.time = [start, end];
			$this.searchData.name = "";
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
				if(res.data.length>0){
					res.data.forEach(function(item,index){
					$this.menuButtonPermit.push(item.action_route);
					});
					if($this.menuButtonPermit.includes('videocount_wordlist')){
					$this.initPage();
					var operationsWidth = 154;
					$this.operationsWidth = "" + operationsWidth;
					}else{
					$this.$message({
						showClose: true,
						message: "未被分配该页面的访问权限",
						type: 'error',
						duration:6000
					});
					$this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
					}
				}else{
					$this.$message({
					showClose: true,
					message: "未被分配该页面的访问权限",
					type: 'error',
						duration:6000
					});
					$this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
				}
				}else{
				$this.$message({
					showClose: true,
					message: response.info,
					type: 'error'
				});
				}
			});
		},
		initPage(){
			var $this = this;
			const end = parseTime(new Date(), '{y}-{m}-{d}');
			const start = $this.getEndDay();
			$this.searchData.time = [start, end];
			$this.getWorkList();
		},
		// 获取工作列表
		getWorkList(){
			var $this = this;
			var formData = {}
			formData.page = $this.searchData.page;
			formData.limit = $this.searchData.limit;
			formData.time = $this.searchData.time.join(" - ");
			formData.name = $this.searchData.name;
			document.getElementsByClassName("scroll-panel")[0].scrollTop = 0;
			$this.$store.dispatch('videocount/getRecordData', formData).then(response=>{
				if(response){
					if(response.code == 200){
						if(response.data){
							if(response.data.length > 0){
								$this.tableData = response.data;
								$this.infoData.totalNumber = response.extend.count;
								$this.infoData.allScore = response.extend.all_score;
								$this.infoData.trueScore = response.extend.all_valid_score;
							}
							
							setTimeout(()=>{
								$this.isSearchResult=false;
							},1000);
							$this.$nextTick(function () {
								$this.setTableHeight();
							})
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
								message: response.msg,
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
		addTableRow() {
			var $this = this;
			$this.$refs.AddWorkRef.showDialog({type: "add"})
		},
		editTableRow(data) {
			var $this = this;
			var dataObj = {};
			var resData = [];
			var obj = {};
			obj.type_id = data.type_id;
			obj.number = data.extend.number;
			obj.remark = data.remark;
			obj.invalid_number = data.extend.invalid_number;
			resData.push(obj);
			dataObj.uid = data.user_id;
			dataObj.id = data.id;
			dataObj.record_time = data.record_time;
			dataObj.data = obj;
			dataObj.post_id = data.post_id;
			$this.$refs.AddWorkRef.showDialog({type: "edit", data: dataObj})
		},
		// 删除表格行
		deleteTableRow(row, index) {
			var $this = this;
			$this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var formData = {};
					formData.uid = row.user_id;
					formData.record_time = row.record_time;
					formData.post_id = row.post_id;
					formData.type_id = row.type_id;
					$this.$store.dispatch('videocount/delRecordData',formData).then(response=>{
						if (response.code == 200) {
							$this.$message({
								showClose: true,
								message: response.msg,
								type: "success",
							});
							$this.initPage();
						} else {
							$this.$message({
								showClose: true,
								message: response.msg,
								type: "error",
							});
						}
					});
			});
		},
		addScore(){
			var $this = this;
			$this.$refs.AddScoreRef.showDialog({type: "add"})
		},
		editScoreRow(data) {
			var $this = this;
			var dataObj = {};
			dataObj.type_id = data.type_id;
			dataObj.uid = [data.user_id];
			dataObj.remark = data.remark;
			dataObj.score = data.score;
			$this.$refs.AddScoreRef.showDialog({type: "edit", data: dataObj})
		},
		// 删除表格行
		deleteScoreRow(row, index) {
			var $this = this;
			$this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var formData = {};
					formData.uid = row.user_id;
					formData.record_time = row.record_time;
					formData.post_id = 0;
					formData.type_id = row.type_id;
					$this.$store.dispatch('videocount/delRecordData',formData).then(response=>{
						if (response.code == 200) {
							$this.$message({
								showClose: true,
								message: response.msg,
								type: "success",
							});
							$this.initPage();
						} else {
							$this.$message({
								showClose: true,
								message: response.msg,
								type: "error",
							});
						}
					});
			});
		},
		// 每页显示条数改变事件
		handleSizeChange(val) {
			this.searchData.limit = val;
			this.searchData.page = 1;
			this.getWorkList();
		},
		// 当前页改变事件
		handleCurrentChange(val) {
			this.searchData.page = val;
			this.getWorkList();
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
				$this.scrollTable.fixedTopHeight = $this.$refs.headerPane.offsetHeight+$this.$refs.breadcrumbPane.offsetHeight+15+20;
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
		showExportDialog() {
			var $this = this;
			$this.$refs.ExportModalRef.showDialog({ fieldList: $this.fieldList, hasSelected: false, hasData: false })
		},
		exportDone(obj) {
			var $this = this;
			const filename = obj.filename
			const customData = []
			let header = null
			const bookType = obj.fileType
			const headerSort = obj.sort
			if (obj.headerType === 'custom') {
				header = obj.header
			}
			var resData = $this.tableData;
			resData.forEach((item) => {
				const itemObj = {}
				headerSort.forEach((current) => {
					itemObj[current] = item[current]
				})
				customData.push(itemObj)
			})
			jsonToSheetXlsx({
				data: customData,
				header: header,
				filename: filename,
				json2sheetOpts: {
				// 指定顺序
				header: headerSort
				},
				write2excelOpts: {
				bookType
				}
			})
		},
		getEndDay(){
			var date = new Date();
            var year = date.getFullYear().toString();
            //获取月份，由于月份从0开始，此处要加1，判断是否小于10，如果是在字符串前面拼接'0'
            var month = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1).toString():(date.getMonth()+1).toString();
            var end = '';
            var endmonth = date.getMonth() + 1 == 12 ? 1 : date.getMonth()+2;
            endmonth = parseInt(endmonth) > 9 ? endmonth : '0' + endmonth;
            var endday = new Date(year + '-' + endmonth + '-01').getTime() - 1000*60*60*24;
            endday = new Date(endday).getDate();
            var start = year + '-' + month + '-01';
            end = parseInt(endday) < 10 ? year + '-' + month  + '-0' + endday : year + '-' + month  + '-' + endday;
			return start;
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
padding: 8px 20px;
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
.item-search-select{
	.select-panel{
		width: 200px;
	}
}
.item-search-date{
	width: 300px;
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
.table_detail{
	padding: 20px 30px 20px;
	.table_detail_title{
		font-size: 15px;
		color: #333;
		margin-bottom: 15px;
	}
}
.table-button{
	.el-button+.el-button{
		margin-left: 10px!important;
	}
}
.clues_info{
	margin-bottom: 15px;
	padding-left: 20px;
    border-radius:4px;
	font-size: 14px;
    line-height:20px;
    color:#333;
    em{
      font-style:normal;
      margin:0 10px;
    }
    span{
      color:#888;
      padding:0px 5px;
    }
    strong,b{
      margin:0 2px;
    }
    .color1{
      color:#d02c34;
    }
    .color2{
      color:#f8a53a;
    }
    .color3{
      color:#333;
    }
    .color4{
      color:#f5522a;
    }
    .color5{
      color:#fb7d23;
    }
    .item-span-1{
      strong{
        color:#d02c34;
      }
    }
    .item-span-2{
      strong{
        color:#f8a53a;
      }
    }
    .item-span-3{
      strong{
        color:#333;        
      }
    }
    .item-span-5{
      strong{
        color: #f5522a;
      }
      b{
        color: #fb7d23;
      }
    }
    .item-span-4{
      color:#2e88ff;
      font-weight:bold;
      &:hover{
        opacity: 0.6;
      }
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
.fixed-table .table_detail .el-table__header-wrapper{
	position: relative;
	z-index: 1;
	top: 0;
}
.el-table.SiteTable .table_detail .el-table{
	border-radius: 0;
}
.el-table.SiteTable .table_detail th.is-leaf{
	background: rgba(226, 233, 237, 0.4);
}
.el-table.SiteTable .table_detail td{
}
</style>