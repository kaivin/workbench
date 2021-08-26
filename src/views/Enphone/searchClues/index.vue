<template>
    <div class="page-root scroll-panel en-phone-search" ref="boxPane">
        <el-card class="box-card scroll-card" shadow="hover">
            <div slot="header">
                <div class="card-header EnphoneCardHeader" ref="headerPane">
                    <div class="search-wrap">
                        <div class="item-search EnphoneSearchOne flex-wrap">
                             <el-checkbox class="all-select" :indeterminate="isAllTeam" border size="mini" v-model="checkAllTeam" @change="handleCheckAllTeamChange">组别全选</el-checkbox>
                             <el-checkbox-group class="team-list flex-content" v-model="searchData.phoneid" @change="handleCheckedTeamChange" size="mini">
                                <el-checkbox class="item-checkbox" v-for="item in phoneList" :label="item.value" :key="item.value" border>{{item.label}}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <div class="item-search  EnphoneSearchTwo flex-wrap">
                            <el-checkbox class="item-checkbox" v-model="searchData.is_group" size="mini" border>分组</el-checkbox>
                            <div class="team-list flex-content">
                                <span class="item-clues" v-for="item in groupurlproductList" v-bind:class="item.isOn?'active':''" v-bind:key="item.value" v-on:click="groupurlproductClick(item.value)"><i></i>{{item.label}}</span>
                            </div>
                        </div>
                        <div class="item-search EnphoneSearchThree">
                            <el-input
                                size="mini"
                                placeholder="ID"
                                style="width:80px;margin-right:10px;margin-bottom:10px;"
                                v-model="searchData.messageid"
                                clearable>
                            </el-input>
                            <el-input
                                size="mini"
                                placeholder="客户姓名/称呼"
                                style="width:100px;margin-right:10px;margin-bottom:10px;"
                                v-model="searchData.custormname"
                                clearable>
                            </el-input>
                            <el-input
                                size="mini"
                                placeholder="Email"
                                style="width:100px;margin-right:10px;margin-bottom:10px;"
                                v-model="searchData.custormemail"
                                clearable>
                            </el-input>
                            <el-input
                                size="mini"
                                placeholder="电话"
                                style="width:110px;margin-right:10px;margin-bottom:10px;"
                                v-model="searchData.custormphone"
                                clearable>
                            </el-input>
                            <el-input
                                size="mini"
                                placeholder="来自IP"
                                style="width:150px;margin-right:10px;margin-bottom:10px;"
                                v-model="searchData.ip"
                                clearable>
                            </el-input>
                            <el-date-picker
                                v-model="searchData.date"
                                size="mini"
                                type="daterange"
                                align="right"
                                style="width:250px;margin-right:10px;margin-bottom:10px;vertical-align: top;"
                                value-format = "yyyy-MM-dd"
                                unlink-panels
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :picker-options="pickerRangeOptions">
                            </el-date-picker>
                            <el-select v-model="searchData.timeing" clearable placeholder="时段" style="width:70px;margin-right:10px;margin-bottom:10px;" size="mini">
                                <el-option
                                    v-for="item in timeList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <el-select v-model="searchData.mode" clearable placeholder="渠道" style="width:110px;margin-right:10px;margin-bottom:10px;" size="mini">
                                <el-option
                                    v-for="item in sourceList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <el-select v-model="searchData.device" clearable placeholder="设备" style="width:100px;margin-right:10px;margin-bottom:10px;" size="mini">
                                <el-option
                                    v-for="item in deviceList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <el-select v-model="searchData.producttype_id" clearable placeholder="产品分类" style="width:100px;margin-right:10px;margin-bottom:10px;" @change="currentCateChange" size="mini">
                                <el-option
                                    v-for="item in cateList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <el-select v-model="searchData.productid" clearable placeholder="产品" style="width:100px;margin-right:10px;margin-bottom:10px;" size="mini">
                                <el-option
                                    v-for="item in productList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <el-select v-model="searchData.feedback" clearable placeholder="反馈" style="width:120px;margin-right:10px;margin-bottom:10px;" size="mini">
                                <el-option
                                    v-for="item in feedbackList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <el-select v-model="searchData.level_id" clearable placeholder="首次级别" style="width:80px;margin-right:10px;margin-bottom:10px;" size="mini">
                                <el-option
                                    v-for="item in levelList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <el-select v-model="searchData.erroring" clearable placeholder="异常" style="width:170px;margin-right:10px;margin-bottom:10px;" size="mini">
                                <el-option
                                    v-for="item in errorList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <el-input
                                size="mini"
                                placeholder="国家"
                                style="width:100px;margin-right:10px;margin-bottom:10px;"
                                v-model="searchData.country"
                                clearable>
                            </el-input>
                            <el-input
                                size="mini"
                                placeholder="备注"
                                style="width:150px;margin-right:10px;margin-bottom:10px;"
                                v-model="searchData.anymessage"
                                clearable>
                            </el-input>
                            <el-input
                                size="mini"
                                placeholder="域名"
                                style="width:150px;margin-right:10px;margin-bottom:10px;"
                                v-model="searchData.domain"
                                clearable>
                            </el-input>
                            <el-input
                                size="mini"
                                placeholder="URL"
                                style="width:200px;margin-right:10px;margin-bottom:10px;"
                                v-model="searchData.url"
                                clearable>
                            </el-input>
                            <el-checkbox class="item-checkbox" :label="searchData.is_url" size="mini" border>精确</el-checkbox>
                            <el-checkbox class="item-checkbox" :label="searchData.effective" size="mini" border>只显示有效</el-checkbox>
                            <el-checkbox class="item-checkbox" :label="searchData.is_adduser" size="mini" border>只显示我添加的（客服）</el-checkbox>
                            <div class="search-panelThree">
                                <span style="float:left;line-height:28px;font-size:12px;">显示条数：</span>
                                <el-input
                                    size="mini"
                                    style="width:40px;"
                                    v-model="searchData.limit"
                                    clearable>
                                </el-input>
                            </div>
                            <div class="search-panelThree">
                                <span style="float:left;line-height:28px;font-size:12px;">排序：</span>
                                <el-radio-group class="team-list" v-model="searchData.sort" size="mini">
                                    <el-radio class="item-radio" label="asc" border>升序</el-radio>
                                    <el-radio class="item-radio" label="desc" border>降序</el-radio>
                                </el-radio-group>
                            </div>
                        </div>   
                    </div>
                    <div class="clues-info flex-wrap">
                        <div class="clues-infoFl flex-content">
                            <p v-if="isClues"><span class="item-span-1">根据查询条件共找到：<strong>{{infoData.totalCount}}</strong>条，</span><span class="item-span-2">其中有效<strong>{{infoData.effectiveCount}}</strong>条，无效：<strong>{{infoData.invalidCount}}</strong>条！</span></p>
                            <p v-if="isUrl"><span class="item-span-1">共计：<strong>{{infoData.groupCount}}</strong>条URL，数量：<strong>{{infoData.totalCount}}</strong>个询盘。</span></p>
                            <p v-if="isProduct"><span class="item-span-1">共计：<strong>{{infoData.groupCount}}</strong>种产品，数量：<strong>{{infoData.totalCount}}</strong>个询盘。</span></p>
                            <p v-if="isCountry"><span class="item-span-1">共计：<strong>{{infoData.groupCount}}</strong>个国家，数量：<strong>{{infoData.totalCount}}</strong>个询盘。</span></p>
                            <p v-if="isContinent"><span class="item-span-1">共计：<strong>{{infoData.groupCount}}</strong>个州，数量：<strong>{{infoData.totalCount}}</strong>个询盘。</span></p>
                            <p v-if="isGroup"><span class="item-span-1">共计：<strong>{{infoData.groupCount}}</strong>个小组，数量：<strong>{{infoData.totalCount}}</strong>个询盘。</span></p>
                            <p v-if="isProducttype"><span class="item-span-1">共计：<strong>{{infoData.groupCount}}</strong>种产品分类，数量：<strong>{{infoData.totalCount}}</strong>个询盘。</span></p>
                        </div>
                        <div class="clues-title-btn">
                            <el-button type="primary" class="updateBtn" size="small" v-if="menuButtonPermit.includes('Enphone_search')" v-on:click="enCluesSearchData"><i class="svg-i" ><svg-icon icon-class="planeWhite" /></i>生成数据</el-button>
                            <el-button type="info" class="resetBtn" size="small" v-on:click="resetData()">重置</el-button>
                            <el-button type="primary" size="small" class="derived" :disabled="isExportDisabled"  @click="dialogExportVisible = true"><i class="svg-i" ><svg-icon icon-class="derived" /></i>导出数据</el-button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-content" ref="tableContent">
                <div class="result-wrap">
                    <el-table
                        v-if="isClues"
                        key="a"
                        border
                        ref="simpleTable"
                        :data="tableData"
                        tooltip-effect="dark"
                        stripe
                        class="SiteTable"
                        style="width: 100%"
                        @selection-change="handleSelectionChange"
                        >
                        <el-table-column
                            type="selection"
                            align="center"
                            width="48">
                        </el-table-column>
                        <el-table-column
                            prop="id"
                            label="ID"
                            width="80"
                            >
                        </el-table-column>
                        <el-table-column
                            prop="phonenumber"
                            label="电话"
                            width="80"
                            >
                        </el-table-column>
                        <el-table-column
                            prop="xuntime"
                            label="时间"
                            width="150"
                            >
                            <template slot-scope="scope">
                                <div class="table-text">
                                <p>{{scope.row.xuntime}}</p>
                                <p>{{scope.row.weekday}}</p>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="sourcename"
                            label="域名/渠道"
                            width="100"
                            >
                            <template slot-scope="scope">
                                <div class="table-text">
                                <p><a :href="scope.row.url" target="_blank">{{scope.row.domain}}</a></p>
                                <p>{{scope.row.sourcename}}</p>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="sourcename"
                            label="地区/归属地"
                            width="100"
                            >
                            <template slot-scope="scope">
                                <div class="table-text">
                                <p>{{scope.row.province}}/{{scope.row.city}}</p>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="keyproduct"
                            label="意向设备"
                            width="100"
                            >
                            <template slot-scope="scope">
                                <span class="product-span" v-bind:class="'level_'+scope.row.productlevel"><i>[{{scope.row.productlevel}}]</i>{{scope.row.keyproduct}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="effective"
                            label="有效"
                            width="60"
                            >
                            <template slot-scope="scope">
                                <div class="table-tag"><el-checkbox v-model="scope.row.isEffective" disabled></el-checkbox></div>
                                <div class="table-text"><p>{{scope.row.invalidcause}}</p></div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="addusername"
                            label="添加人"
                            width="80"
                            >
                        </el-table-column>
                        <el-table-column
                            prop="addtime"
                            label="添加时间"
                            width="150"
                            >
                        </el-table-column>
                        <el-table-column
                            prop="levelname"
                            label="等级"
                            min-width="60"
                            >
                            <template slot-scope="scope">
                                <div class="table-tag"><span class="level"  @click="handleCustormeditlogClick(scope.row.id)" :class="'level-'+scope.row.level_id">{{scope.row.levelname}}</span></div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="levelname"
                            label="备注/原因"
                            min-width="120"
                            >
                            <template slot-scope="scope">
                                <div class="table-text">
                                    <p>{{scope.row.custormcause}}</p>
                                    <p>{{scope.row.custormremark}}</p>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="url"
                            label="域名/链接"
                            min-width="150"
                            >
                            <template slot-scope="scope">
                                <div class="table-text">
                                    <p>{{scope.row.domain}}</p>
                                    <p>{{scope.row.url}}</p>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="searchword"
                            label="平台/关键词"
                            min-width="110"
                            >
                            <template slot-scope="scope">
                                <div class="table-text">
                                    <p>{{scope.row.search}}</p>
                                    <p>{{scope.row.searchword}}</p>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="remark"
                            label="备注"
                            min-width="140"
                            >
                            <template slot-scope="scope">
                                <div class="table-text">
                                    <p>{{scope.row.remark}}</p>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="searchword"
                            label="提供者/设备"
                            min-width="100"
                            >
                            <template slot-scope="scope">
                                <div class="table-text">
                                    <p>{{scope.row.useridname}}</p>
                                    <p>{{scope.row.device}}</p>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-table
                        v-if="isUrl"
                        key="b"
                        border
                        :data="tableData"
                        class="SiteTable"
                        tooltip-effect="dark"
                        stripe
                        style="width: 100%"
                        >
                        <el-table-column
                            prop="url"
                            label="按URL"
                            min-width="200"
                            >
                        </el-table-column>
                        <el-table-column
                            prop="number"
                            label="数量"
                            min-width="120"
                            >
                        </el-table-column>
                    </el-table>
                    <el-table
                        v-if="isProduct"
                        key="c"
                        border
                        :data="tableData"
                        class="SiteTable"
                        tooltip-effect="dark"
                        stripe
                        style="width: 100%"
                        >
                        <el-table-column
                            prop="keyproduct"
                            label="按产品"
                            min-width="200"
                            >
                        </el-table-column>
                        <el-table-column
                            prop="number"
                            label="数量"
                            min-width="120"
                            >
                        </el-table-column>
                    </el-table>
                    <el-table
                        v-if="isCountry"
                        key="d"
                        border
                        :data="tableData"
                        class="SiteTable"
                        tooltip-effect="dark"
                        stripe
                        style="width: 100%"
                        >
                        <el-table-column
                            prop="country"
                            label="按国家"
                            min-width="200"
                            >
                        </el-table-column>
                        <el-table-column
                            prop="number"
                            label="数量"
                            min-width="120"
                            >
                        </el-table-column>
                    </el-table>
                    <el-table
                        v-if="isContinent"
                        key="e"
                        border
                        :data="tableData"
                        class="SiteTable"
                        tooltip-effect="dark"
                        stripe
                        style="width: 100%"
                        >
                        <el-table-column
                            prop="continent"
                            label="按大洲"
                            min-width="200"
                            >
                        </el-table-column>
                        <el-table-column
                            prop="number"
                            label="数量"
                            min-width="120"
                            >
                        </el-table-column>
                    </el-table>
                    <el-table
                        v-if="isGroup"
                        key="f"
                        border
                        :data="tableData"
                        class="SiteTable"
                        tooltip-effect="dark"
                        stripe
                        style="width: 100%"
                        >
                        <el-table-column
                            prop="phoneid"
                            label="按组别"
                            min-width="200"
                            >
                        </el-table-column>
                        <el-table-column
                            prop="number"
                            label="数量"
                            min-width="120"
                            >
                        </el-table-column>
                    </el-table>
                    <el-table
                        v-if="isProducttype"
                        key="g"
                        border
                        :data="tableData"
                        class="SiteTable"
                        tooltip-effect="dark"
                        stripe
                        style="width: 100%"
                        >
                        <el-table-column
                            prop="producttypename"
                            label="按产品分类"
                            min-width="200"
                            >
                        </el-table-column>
                        <el-table-column
                            prop="number"
                            label="数量"
                            min-width="120"
                            >
                        </el-table-column>
                    </el-table>
                </div>
                <div class="pagination-panel" ref="pagePane">
                    <el-pagination
                        @size-change="handleSizeChange"
                        :page-sizes="pageSizeList"
                        @current-change="handleCurrentChange"
                        :current-page="searchData.page"
                        :layout="device==='mobile'?'jumper':'total, sizes, prev, pager, next, jumper'"
                        :total="totalDataNum">
                    </el-pagination>
                </div>
            </div>
        </el-card>        
        <el-dialog title="导出" custom-class="export-dialog" :visible.sync="dialogExportVisible" width="400px">
            <el-form :inline="true" :model="exportForm">
                <el-form-item label="文件名称：" :label-width="formLabelWidth">
                <el-input v-model="exportForm.fileName" placeholder="文件名 (默认：excel-list)" prefix-icon="el-icon-document"></el-input>
                </el-form-item>
                <el-form-item label="文件类型：" :label-width="formLabelWidth">
                <el-select v-model="exportForm.bookType" placeholder="请选择导出文件类型">
                    <el-option label="xlsx" value="xlsx"></el-option>
                    <el-option label="csv" value="csv"></el-option>
                    <el-option label="txt" value="txt"></el-option>
                </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                <el-button @click="dialogExportVisible = false">取 消</el-button>
                <el-button :loading="downloadLoading" type="primary" icon="el-icon-document" @click="handleDownload">导 出</el-button>
                </span>
            </template>
        </el-dialog>
        <el-dialog title="级别修改记录" custom-class="export-dialog popover" :visible.sync="levelPopBool">
            <ul>
                <li v-for="item in levelPop" :key="item.id">            
                <span>{{item.addtime}}</span>
                <span v-if="item.bname&&item.bname!=''">[{{item.bname}}]修改</span>
                <span>是否有效<em>[{{item.neweffective}}]</em></span>
                <span>原始级别<em>[{{item.oldlevel}}]</em>,</span>
                <span>修改后级别<em>[{{item.newlevel}}]</em>,</span>
                <span>原因：<em>[{{item.remark}}]</em></span>            
                </li>
            </ul>
            <template #footer>
            <span class="dialog-footer">
                <el-button :loading="downloadLoading" type="primary" icon="el-icon-document" @click="handleLockClick">确定</el-button>
            </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'searchEnClues',
  data() {
    return {
        menuButtonPermit:[],
        tableData:[],
        searchData:{
            date:[],
            page:1,
            limit:20,
            messageid:"",
            custormname:"",
            custormemail:"",
            custormphone:"",
            ip:"",
            phoneid:[],
            timeing:"",
            device:"",
            mode:"",
            producttype_id:"",
            productid:"",
            feedback:"",
            level_id:"",
            erroring:"",
            country:"",
            anymessage:"",
            domain:"",
            url:"",
            is_url:false,
            effective:false,
            is_adduser:false,
            is_group:false,
            groupurlproduct:"1",
            sort:"asc",
        },
        pageSizeList:[20],
        totalDataNum:0,
        pickerRangeOptions: {
            shortcuts: [{
            text: '最近一旬',
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 9);
                picker.$emit('pick', [start, end]);
            }
            }, {
            text: '最近一个月',
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
            }
            }, {
            text: '最近三个月',
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
            }
            }]
        },
        phoneList:[],
        cateList:[],
        levelList:[],
        sourceList:[],
        productList:[],
        isAllTeam:false,
        checkAllTeam:false,
        deviceList:[
            {label:"PC设备",value:"PC设备"},
            {label:"移动设备",value:"移动设备"},
            {label:"未知设备",value:"未知设备"},
        ],
        groupurlproductList:[
            {label:"按URL",value:1,isOn:false},
            {label:"按产品",value:2,isOn:false},
            {label:"按国家",value:3,isOn:false},
            {label:"按大洲",value:4,isOn:false},
            {label:"按组别",value:5,isOn:false},
            {label:"按产品分类",value:6,isOn:false},
        ],
        timeList:[
            {label:"0-3",value:"0-3"},
            {label:"3-6",value:"3-6"},
            {label:"6-9",value:"6-9"},
            {label:"9-12",value:"9-12"},
            {label:"12-15",value:"12-15"},
            {label:"15-18",value:"15-18"},
            {label:"18-21",value:"18-21"},
            {label:"21-24",value:"21-24"},
        ],
        effectiveList:[
            {label:"只显示有效",value:1},
            {label:"只显示无效",value:2},
        ],
        feedbackList:[
            {label:"已反馈",value:1},
            {label:"未反馈",value:2},
            {label:"意向客户",value:3},
            {label:"非意向客户",value:4},
        ],
        errorList:[
            {label:"1.信息全但联系不上",value:"1.信息全但联系不上"},
            {label:"2.信息全但客户不需要",value:"2.信息全但客户不需要"},
            {label:"3.找工作",value:"3.找工作"},
            {label:"4.找投资",value:"4.找投资"},
            {label:"5.产量过小",value:"5.产量过小"},
            {label:"6.联系方式错误",value:"6.联系方式错误"},
        ],
        infoData:{
            totalCount:0,
            effectiveCount:0,
            invalidCount:0,
            levelOneCount:0,
            levelTwoCount:0,
            totalCountMonth:0,
            effectiveCountMonth:0,
            invalidCountMonth:0,
            levelOneCountMonth:0,
            levelTwoCountMonth:0,
        },
        formLabelWidth:"110px",
        exportForm:{
            fileName:"",
            bookType:"xlsx"
        },
        dialogExportVisible:false,
        downloadLoading: false,
        permitField:[],
        isExportDisabled:true,
        isDisabled:true,
        pageSizeList:[20],

        isUrl:false,
        isProduct:false,
        isCountry:false,
        isContinent:false,
        isGroup:false,
        isProducttype:false,
        isClues:true,
        levelPop:[],  
        levelPopBool:false,
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'device'
    ]),
  },
  mounted(){
    const $this = this;
  },
  created(){
    var $this = this;
    $this.initData();
  },
  methods:{
    // 初始化数据
    initData(){
      var $this = this;
      $this.getUserMenuButtonPermit();
    },
    // 初始化页面信息
    initPage(){
      var $this = this;
      $this.$store.dispatch('enphone/cluesSearchSelectDataAction', null).then(response=>{
        if(response){
          if(response.status){
              console.log(response,"搜索数据02")
              var phoneList = [];
              response.phone.forEach(function(item,index){
                  var itemData = {};
                  itemData.label = item.phonenumber;
                  itemData.value = item.id;
                  phoneList.push(itemData);
              });
              $this.phoneList = phoneList;
              var levelList = [];
              response.xunlevel.forEach(function(item,index){
                  var itemData = {};
                  itemData.label = item.levelname;
                  itemData.value = item.id;
                  levelList.push(itemData);
              });
              $this.levelList = levelList;
              var sourceList = [];
              response.sourcetype.forEach(function(item,index){
                  var itemData = {};
                  itemData.label = item.name;
                  itemData.value = item.id;
                  sourceList.push(itemData);
              });
              $this.sourceList = sourceList;
              var cateList = [];
              response.producttype.forEach(function(item,index){
                  var itemData = {};
                  itemData.label = item.name;
                  itemData.value = item.id;
                  cateList.push(itemData);
              });
              $this.cateList = cateList;
          }else{
            $this.$message({
                showClose: true,
                message: response.info,
                type: 'error'
            });
          }
        }
      });
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
            if($this.menuButtonPermit.includes('Enphone_phoneindex')&&$this.menuButtonPermit.includes('Enphone_search')){
                $this.initPage();
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
    // 小组全选
    handleCheckAllTeamChange(e){
      var $this = this;
      if(e){
        var checkedList = [];
        $this.phoneList.forEach(function(item,index){
          checkedList.push(item.value);
        });
        $this.searchData.phoneid = checkedList;
        $this.checkAllTeam= true;
      }else{
        $this.searchData.phoneid = [];
        $this.checkAllTeam = false;
      }
      $this.isAllTeam = false;
    },
    // 小组选择改变事件
    handleCheckedTeamChange(e){
      var $this = this;
      var checkedCount = e.length;
       if(checkedCount === $this.phoneList.length){
          $this.checkAllTeam = true;
        }else{
          $this.checkAllTeam = false;
        }
        if(checkedCount>0&&checkedCount<$this.phoneList.length){
          $this.isAllTeam = true;
        }else{
          $this.isAllTeam = false;
        }
    },
    // 组装搜索需要的条件数据
    getSearchResultData(){
        var $this = this;
        var resultData = {};
        resultData.page = $this.searchData.page;
        resultData.limit = $this.searchData.limit;
        resultData.messageid = $this.searchData.messageid;
        resultData.custormname = $this.searchData.custormname;
        resultData.custormemail = $this.searchData.custormemail;
        resultData.custormphone = $this.searchData.custormphone;
        resultData.ip = $this.searchData.ip;
        resultData.phoneid = $this.searchData.phoneid;
        resultData.country = $this.searchData.country;
        resultData.mode = $this.searchData.mode;
        resultData.producttype_id = $this.searchData.producttype_id;
        resultData.timeing = $this.searchData.timeing;
        resultData.erroring = $this.searchData.erroring;
        resultData.productid = $this.searchData.productid;
        resultData.level_id = $this.searchData.level_id;
        resultData.anymessage = $this.searchData.anymessage;
        resultData.domain = $this.searchData.domain;
        resultData.is_adduser = $this.searchData.is_adduser?1:0;
        resultData.url = $this.searchData.url;
        resultData.is_url = $this.searchData.is_url?1:0;
        resultData.effective = $this.searchData.effective?1:0;
        resultData.is_group = $this.searchData.is_group?1:0;
        resultData.groupurlproduct = $this.searchData.groupurlproduct;
        resultData.device = $this.searchData.device;
        resultData.sort = $this.searchData.sort;
        resultData.feedback = $this.searchData.feedback;
        if($this.searchData.date&&$this.searchData.date.length>0){
            resultData.starttime = $this.searchData.date[0];
            resultData.endtime = $this.searchData.date[1];
        }else{
            resultData.starttime = "";
            resultData.endtime = "";
        }
        return resultData;
    },
    // 搜索确认
    enCluesSearchData(){
        var $this = this;
        var resultData = $this.getSearchResultData();
        console.log(resultData,"搜索条件");
        $this.$store.dispatch('enphone/getCurrentCluesSearchListAction', resultData).then(response=>{
        if(response){
          if(response.status){
            console.log(response,"搜索条件数据01");
            var infoData = {};
            infoData.totalCount = response.allcount;
            if($this.searchData.is_group){
                $this.isClues=false;
                infoData.groupCount = response.countgroup;
                if($this.searchData.groupurlproduct == 1){
                    $this.isUrl=true;
                    $this.isProduct=false;
                    $this.isCountry=false;
                    $this.isContinent=false;
                    $this.isGroup=false;
                    $this.isProducttype=false;
                }
                if($this.searchData.groupurlproduct == 2){
                    $this.isUrl=false;
                    $this.isProduct=true;
                    $this.isCountry=false;
                    $this.isContinent=false;
                    $this.isGroup=false;
                    $this.isProducttype=false;
                }
                if($this.searchData.groupurlproduct == 3){
                    $this.isUrl=false;
                    $this.isProduct=false;
                    $this.isCountry=true;
                    $this.isContinent=false;
                    $this.isGroup=false;
                    $this.isProducttype=false;
                }
                if($this.searchData.groupurlproduct == 4){
                    $this.isUrl=false;
                    $this.isProduct=false;
                    $this.isCountry=false;
                    $this.isContinent=true;
                    $this.isGroup=false;
                    $this.isProducttype=false;
                }
                if($this.searchData.groupurlproduct == 5){
                    $this.isUrl=false;
                    $this.isProduct=false;
                    $this.isCountry=false;
                    $this.isContinent=false;
                    $this.isGroup=true;
                    $this.isProducttype=false;
                }
                if($this.searchData.groupurlproduct == 6){
                    $this.isUrl=false;
                    $this.isProduct=false;
                    $this.isCountry=false;
                    $this.isContinent=false;
                    $this.isGroup=false;
                    $this.isProducttype=true;
                }                
            }else{
                infoData.effectiveCount = response.effectivecount;
                infoData.invalidCount = response.noeffectivecount;
                $this.isUrl=false;
                $this.isProduct=false;
                $this.isCountry=false;
                $this.isContinent=false;
                $this.isGroup=false;
                $this.isProducttype=false;
                $this.isClues=true;
            }
            if(response.data.length>0){
              $this.isExportDisabled = false;
            }else{
              $this.isExportDisabled = true;
            }
            $this.tableData = response.data;
            $this.infoData = infoData;
            $this.totalDataNum = response.allcount;
            $this.pageSizeList;            
            var pageSizeListArr = [$this.pageSizeList];
            if (pageSizeListArr.length > 1) {
              pageSizeListArr.shift();
            }
            pageSizeListArr = [$this.searchData.limit];
            $this.pageSizeList = pageSizeListArr;
          }else{
            $this.$message({
                showClose: true,
                message: response.info,
                type: 'error'
            });
          }
        }
      });
    },
    // 重置表单
    resetData(){
        var $this = this;
        $this.searchData.date=[];
        $this.searchData.page=1;
        $this.searchData.limit=20;
        $this.searchData.messageid="";
        $this.searchData.custormname="";
        $this.searchData.custormemail="";
        $this.searchData.custormphone="";
        $this.searchData.ip="";
        $this.searchData.phoneid=[];
        $this.searchData.timeing="";
        $this.searchData.device="";
        $this.searchData.mode="";
        $this.searchData.producttype_id="";
        $this.searchData.productid="";
        $this.searchData.feedback="";
        $this.searchData.level_id="";
        $this.searchData.erroring="";
        $this.searchData.country="";
        $this.searchData.anymessage="";
        $this.searchData.domain="";
        $this.searchData.url="";
        $this.searchData.is_url=false;
        $this.searchData.effective=false;
        $this.searchData.is_adduser=false;
        $this.searchData.is_group=false;
        $this.searchData.groupurlproduct="1";
        $this.searchData.sort="asc";
        $this.isAllTeam=false;
        $this.checkAllTeam=false;
        $this.pageSizeList=[20];
    },
    // 表格多选改变事件
    handleSelectionChange(val) {
        var $this = this;
        $this.selectedData = val;
        if($this.selectedData.length>0){
          $this.isDisabled = false;
        }else{
          $this.isDisabled = true;
        }
    },
    // 当前产品分类改变触发事件
    currentCateChange(e){
        var $this = this;
        if(e){
          $this.searchData.productid = "";
          $this.$store.dispatch('enphone/getCurrentCateProductListAction', {typeid:e}).then(response=>{
              if(response){
                  if(response.status){
                      console.log(response,"搜索条件信息phoneindex");
                      var productList = [];
                      response.data.forEach(function(item,index){
                          var itemData = {};
                          itemData.label = item.name;
                          itemData.value = item.id;
                          productList.push(itemData);
                      });
                      $this.productList = productList;
                  }else{
                      $this.$message({
                      showClose: true,
                      message: response.info,
                      type: 'error'
                      });
                  }
              }
          });
        }else{
          $this.searchData.productid = "";
          $this.productList = [];
        }
    },
    //分组选择点击事件
    groupurlproductClick(id){
      var $this = this;
      var groupurlproductList = $this.groupurlproductList;
      groupurlproductList.forEach(function(item,index){
        if(item.value == id){
          if(item.isOn){
            item.isOn = false;
          }else{
            item.isOn = true;
            $this.searchData.groupurlproduct = id;
          }
        }else{
          item.isOn = false;
        }
      });
      $this.groupurlproductList = groupurlproductList;
    },
    // 导出当前页数据
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID','电话','询盘时间','星期','域名','渠道','地区','城市','意向设备','有效','添加人','添加时间','等级','备注','原因','域名','链接','平台','关键词','备注','提供者','设备']
        const list = this.tableData
        const data = [];
        list.forEach(function(item,index){
          var itemData = [];
          itemData.push(item.id);
          itemData.push(item.phonenumber);
          itemData.push(item.xuntime);
          itemData.push(item.weekday);
          itemData.push(item.domain);
          itemData.push(item.sourcename);
          itemData.push(item.province);
          itemData.push(item.city);
          itemData.push(item.keyproduct);
          itemData.push(item.invalidcause);
          itemData.push(item.addusername);
          itemData.push(item.addtime);
          itemData.push(item.levelname);
          itemData.push(item.custormcause);
          itemData.push(item.custormremark);
          itemData.push(item.domain);
          itemData.push(item.url);
          itemData.push(item.search);
          itemData.push(item.searchword);
          itemData.push(item.remark);
          itemData.push(item.useridname);
          itemData.push(item.device);
          data.push(itemData);
        });
        // const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.exportForm.fileName,
          autoWidth: true,
          bookType: this.exportForm.bookType
        })
        this.downloadLoading = false;
        this.dialogExportVisible = false;
        this.exportForm.fileName = "";
      })
    },
    // 每页显示条数改变事件
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.searchData.limit = val;
      this.initCluesList();
    },
    // 当前页改变事件
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.searchData.page = val;
      this.initCluesList();
    },
    // 询盘级别修改记录
    handleCustormeditlogClick(Rid){
      var $this = this;
      var FormID={};
      FormID.id = Rid;
      $this.$store.dispatch('chinaphone/CustormeditlogAction', FormID).then(response=>{
        if(response){
          if(response.status){  
            console.log(response,'级别修改记录-response');  
            if(response.data.length>0){
              $this.levelPopBool=true;
              $this.levelPop=response.data;
            }
          }else{
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'error'
            });
          }
        }
      });
    },
    handleLockClick(){
        var $this=this;
        $this.levelPopBool=!$this.levelPopBool;
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
