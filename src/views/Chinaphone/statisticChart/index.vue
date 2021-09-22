<template>
  <div class="page-root cn-phone-stat" ref="boxPane">
    <div class="abs-panel" ref="mainPane">
      <div class="scroll-panel" ref="scrollPane">
        <p class="breadcrumb" ref="breadcrumbPane">
            <router-link class="breadcrumb-link" to="/">首页</router-link>
            <template v-for="item in breadcrumbList">
              <router-link class="breadcrumb-link" :to="item.router" v-bind:key="item.id"><b>-</b><span>{{item.title}}</span></router-link>
            </template>
        </p>
        <el-card class="box-card scroll-card" shadow="hover">
            <div class="card-content ChinaphoneTwoBox" ref="tableContent">
                <div class="ChinaphoneTwo buttonTwo">
                  <div class="group-header">
                      <el-checkbox class="all-select" :indeterminate="isAllPhone" border size="mini" v-model="checkAllPhone" @change="handleCheckAllPhoneChange">电话全选<span class="require tips">(* 至少选择一个电话)</span></el-checkbox>
                  </div>
                  <div class="group-body">
                    <div class="team-panel" v-for="item in phoneList" v-bind:key="item.id">
                      <div class="team-header" v-if="item.icon=='sem'">
                        <span class="require" v-if="device=='desktop'">{{item.name}}：</span>
                        <el-checkbox class="all-select" v-if="device=='desktop'" :indeterminate="isAllSemPhone" border size="mini" v-model="checkAllSemPhone" @change="handleCheckAllSemPhoneChange">全选</el-checkbox>
                        <el-checkbox class="all-select" v-if="device=='mobile'" :indeterminate="isAllSemPhone" border size="mini" v-model="checkAllSemPhone" @change="handleCheckAllSemPhoneChange">{{item.name}}全选</el-checkbox>
                        <el-checkbox-group class="team-list" v-model="checkedSem" @change="handleCheckedSemChange" size="mini">
                          <el-checkbox class="item-checkbox" v-for="phone in item.children" :label="phone.value" :key="phone.value" border>{{phone.label}}</el-checkbox>
                        </el-checkbox-group>
                      </div>
                      <div class="team-header" v-else-if="item.icon=='seo'">
                        <span class="require" v-if="device=='desktop'">{{item.name}}：</span>
                        <el-checkbox class="all-select" v-if="device=='desktop'" :indeterminate="isAllSeoPhone" border size="mini" v-model="checkAllSeoPhone" @change="handleCheckAllSeoPhoneChange">全选</el-checkbox>
                        <el-checkbox class="all-select" v-if="device=='mobile'" :indeterminate="isAllSeoPhone" border size="mini" v-model="checkAllSeoPhone" @change="handleCheckAllSeoPhoneChange">{{item.name}}全选</el-checkbox>
                        <el-checkbox-group class="team-list" v-model="checkedSeo" @change="handleCheckedSeoChange" size="mini">
                          <el-checkbox class="item-checkbox" v-for="phone in item.children" :label="phone.value" :key="phone.value" border>{{phone.label}}</el-checkbox>
                        </el-checkbox-group>
                      </div>
                      <div class="team-header" v-else-if="item.icon=='we-media'">
                        <span class="require" v-if="device=='desktop'">{{item.name}}：</span>
                        <el-checkbox class="all-select" v-if="device=='desktop'" :indeterminate="isAllMediaPhone" border size="mini" v-model="checkAllMediaPhone" @change="handleCheckAllMediaPhoneChange">全选</el-checkbox>
                        <el-checkbox class="all-select" v-if="device=='mobile'" :indeterminate="isAllMediaPhone" border size="mini" v-model="checkAllMediaPhone" @change="handleCheckAllMediaPhoneChange">{{item.name}}全选</el-checkbox>
                        <el-checkbox-group class="team-list" v-model="checkedMedia" @change="handleCheckedMediaChange" size="mini">
                          <el-checkbox class="item-checkbox" v-for="phone in item.children" :label="phone.value" :key="phone.value" border>{{phone.label}}</el-checkbox>
                        </el-checkbox-group>
                      </div>
                      <div class="team-header" v-else-if="item.icon=='sns'">
                        <span class="require" v-if="device=='desktop'">{{item.name}}：</span>
                        <el-checkbox class="all-select" v-if="device=='desktop'" :indeterminate="isAllSnsPhone" border size="mini" v-model="checkAllSnsPhone" @change="handleCheckAllSnsPhoneChange">全选</el-checkbox>
                        <el-checkbox class="all-select" v-if="device=='mobile'" :indeterminate="isAllSnsPhone" border size="mini" v-model="checkAllSnsPhone" @change="handleCheckAllSnsPhoneChange">{{item.name}}全选</el-checkbox>
                        <el-checkbox-group class="team-list" v-model="checkedSns" @change="handleCheckedSnsChange" size="mini">
                          <el-checkbox class="item-checkbox" v-for="phone in item.children" :label="phone.value" :key="phone.value" border>{{phone.label}}</el-checkbox>
                        </el-checkbox-group>
                      </div>
                      <div class="team-header" v-else>
                        <span class="require" v-if="device=='desktop'">{{item.name}}：</span>
                        <el-checkbox class="all-select" v-if="device=='desktop'" :indeterminate="isAllOtherPhone" border size="mini" v-model="checkAllOtherPhone" @change="handleCheckAllOtherPhoneChange">全选</el-checkbox>
                        <el-checkbox class="all-select" v-if="device=='mobile'" :indeterminate="isAllOtherPhone" border size="mini" v-model="checkAllOtherPhone" @change="handleCheckAllOtherPhoneChange">{{item.name}}全选</el-checkbox>
                        <el-checkbox-group class="team-list" v-model="checkedOther" @change="handleCheckedOtherChange" size="mini">
                          <el-checkbox class="item-checkbox" v-for="phone in item.children" :label="phone.value" :key="phone.value" border>{{phone.label}}</el-checkbox>
                        </el-checkbox-group>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="ChinaphoneTwo buttonTwo">
                  <div class="group-body">
                    <div class="team-panel">
                      <div class="team-header">
                          <div class="team-headerItem">
                                <span class="require tips">* 时间：</span>
                                <el-date-picker
                                    v-model="searchData.date"
                                    size="mini"
                                    type="daterange"
                                    align="right"
                                    value-format = "yyyy-MM-dd"
                                    unlink-panels
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    v-if="device=='desktop'"
                                    :picker-options="pickerRangeOptions">
                                </el-date-picker> 
                                <div class="mobileTime flex-box" v-if="device=='mobile'">          
                                    <el-date-picker
                                      v-model="searchData.startDate"
                                      size="mini"
                                      type="date"       
                                      class="flex-content"   
                                      value-format="yyyy-MM-dd"                            
                                      placeholder="开始日期">
                                    </el-date-picker> 
                                    <i>至</i>
                                    <el-date-picker
                                      v-model="searchData.endDate"
                                      size="mini"
                                      type="date"
                                      class="flex-content"
                                      value-format="yyyy-MM-dd" 
                                      placeholder="结束日期">
                                    </el-date-picker>
                                </div>                 
                          </div>
                          <div class="team-headerItem">
                                <span class="require">域名：</span>
                                <el-input
                                    size="mini"
                                    v-model="searchData.domain"
                                    clearable>
                                </el-input>
                          </div>
                          <div class="team-headerItem">
                                <span class="require">地区：</span>
                                <el-input
                                    size="mini"
                                    v-model="searchData.province"
                                    clearable>
                                </el-input>
                          </div>
                          <div class="team-headerItem">
                                <span class="require">备注：</span>
                                <el-input
                                    size="mini"
                                    v-model="searchData.name"
                                    placeholder="域名备注等"
                                    clearable>
                                </el-input>
                          </div>
                      </div>
                    </div>
                    <div class="team-panel">
                      <div class="team-header">
                        <span class="require" v-if="device=='desktop'">渠道：</span>
                        <el-checkbox class="all-select" v-if="device=='desktop'" :indeterminate="isAllSource" border size="mini" v-model="checkAllSource" @change="handleCheckAllSourceChange">全选</el-checkbox>
                        <el-checkbox class="all-select" v-if="device=='mobile'" :indeterminate="isAllSource" border size="mini" v-model="checkAllSource" @change="handleCheckAllSourceChange">渠道全选</el-checkbox>
                        <el-checkbox-group class="team-list" v-model="checkedSource" @change="handleCheckedSourceChange" size="mini">
                          <el-checkbox class="item-checkbox" v-for="item in sourceList" :label="item.value" :key="item.value" border>{{item.label}}</el-checkbox>
                        </el-checkbox-group>
                      </div>
                    </div>
                    <div class="team-panel">
                      <div class="team-header">
                        <span class="require" v-if="device=='desktop'">级别：</span>
                        <el-checkbox class="all-select" v-if="device=='desktop'" :indeterminate="isAllLevel" border size="mini" v-model="checkAllLevel" @change="handleCheckAllLevelChange">全选</el-checkbox>
                        <el-checkbox class="all-select" v-if="device=='mobile'" :indeterminate="isAllLevel" border size="mini" v-model="checkAllLevel" @change="handleCheckAllLevelChange">级别全选</el-checkbox>
                        <el-checkbox-group class="team-list" v-model="checkedLevel" @change="handleCheckedLevelChange" size="mini">
                          <el-checkbox class="item-checkbox" v-for="item in levelList" :label="item.value" :key="item.value" border>{{item.label}}</el-checkbox>
                        </el-checkbox-group>
                      </div>
                    </div>
                    <div class="team-panel">
                      <div class="team-header">
                        <span class="require" v-if="device=='desktop'">类别：</span>
                        <el-checkbox class="all-select" v-if="device=='desktop'" :indeterminate="isAllCategory" border size="mini" v-model="checkAllCategory" @change="handleCheckAllCategoryChange">全选</el-checkbox>
                        <el-checkbox class="all-select" v-if="device=='mobile'" :indeterminate="isAllCategory" border size="mini" v-model="checkAllCategory" @change="handleCheckAllCategoryChange">类别全选</el-checkbox>
                        <el-checkbox-group class="team-list" v-model="checkedCategory" @change="handleCheckedCategoryChange" size="mini">
                          <el-checkbox class="item-checkbox" v-for="item in categoryList" :label="item.value" :key="item.value" border>{{item.label}}</el-checkbox>
                        </el-checkbox-group>
                      </div>
                    </div>
                    <div class="team-panel">
                      <div class="team-header">
                        <span class="require" v-if="device=='desktop'">设备：</span>
                        <el-checkbox class="all-select" v-if="device=='desktop'" :indeterminate="isAllDevice" border size="mini" v-model="checkAllDevice" @change="handleCheckAllDeviceChange">全选</el-checkbox>
                        <el-checkbox class="all-select" v-if="device=='mobile'" :indeterminate="isAllDevice" border size="mini" v-model="checkAllDevice" @change="handleCheckAllDeviceChange">全选</el-checkbox>
                        <el-checkbox-group class="team-list" v-model="checkedDevice" @change="handleCheckedDeviceChange" size="mini">
                          <el-checkbox class="item-checkbox" v-for="item in deviceList" :label="item.value" :key="item.value" border>{{item.label}}</el-checkbox>
                        </el-checkbox-group>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="ChinaphoneTwo buttonTwo">
                  <div class="group-header"><el-checkbox class="all-select" :indeterminate="isAllProduct" border size="mini" v-model="checkAllProduct" @change="handleCheckAllProductChange">产品全选</el-checkbox>
                  </div>
                  <div class="group-body">
                    <div class="team-panel" v-for="item in productList" v-bind:key="item.id">
                      <div class="team-header" v-if="item.icon=='a1'">
                        <span class="require" v-if="device=='desktop'">{{item.name}}：</span>
                        <el-checkbox class="all-select" v-if="device=='desktop'" :indeterminate="isAllA1Product" border size="mini" v-model="checkAllA1Product" @change="handleCheckAllA1ProductChange">全选</el-checkbox>
                        <el-checkbox class="all-select" v-if="device=='mobile'" :indeterminate="isAllA1Product" border size="mini" v-model="checkAllA1Product" @change="handleCheckAllA1ProductChange">{{item.name}}全选</el-checkbox>
                        <el-checkbox-group class="team-list" v-model="checkedA1Product" @change="handleCheckedA1ProductChange" size="mini">
                          <el-checkbox class="item-checkbox" v-for="product in item.children" :label="product.value" :key="product.value" border>{{product.label}}</el-checkbox>
                        </el-checkbox-group>
                      </div>
                      <div class="team-header" v-else-if="item.icon=='a2'">
                        <span class="require" v-if="device=='desktop'">{{item.name}}：</span>
                        <el-checkbox class="all-select" v-if="device=='desktop'" :indeterminate="isAllA2Product" border size="mini" v-model="checkAllA2Product" @change="handleCheckAllA2ProductChange">全选</el-checkbox>
                        <el-checkbox class="all-select" v-if="device=='mobile'" :indeterminate="isAllA2Product" border size="mini" v-model="checkAllA2Product" @change="handleCheckAllA2ProductChange">{{item.name}}全选</el-checkbox>
                        <el-checkbox-group class="team-list" v-model="checkedA2Product" @change="handleCheckedA2ProductChange" size="mini">
                          <el-checkbox class="item-checkbox" v-for="product in item.children" :label="product.value" :key="product.value" border>{{product.label}}</el-checkbox>
                        </el-checkbox-group>
                      </div>
                      <div class="team-header" v-else-if="item.icon=='a3'">
                        <span class="require" v-if="device=='desktop'">{{item.name}}：</span>
                        <el-checkbox class="all-select" v-if="device=='desktop'" :indeterminate="isAllA3Product" border size="mini" v-model="checkAllA3Product" @change="handleCheckAllA3ProductChange">全选</el-checkbox>
                        <el-checkbox class="all-select" v-if="device=='mobile'" :indeterminate="isAllA3Product" border size="mini" v-model="checkAllA3Product" @change="handleCheckAllA3ProductChange">{{item.name}}全选</el-checkbox>
                        <el-checkbox-group class="team-list" v-model="checkedA3Product" @change="handleCheckedA3ProductChange" size="mini">
                          <el-checkbox class="item-checkbox" v-for="product in item.children" :label="product.value" :key="product.value" border>{{product.label}}</el-checkbox>
                        </el-checkbox-group>
                      </div>
                      <div class="team-header" v-else-if="item.icon=='a4'">
                        <span class="require" v-if="device=='desktop'">{{item.name}}：</span>
                        <el-checkbox class="all-select" v-if="device=='desktop'" :indeterminate="isAllA4Product" border size="mini" v-model="checkAllA4Product" @change="handleCheckAllA4ProductChange">全选</el-checkbox>
                        <el-checkbox class="all-select" v-if="device=='mobile'" :indeterminate="isAllA4Product" border size="mini" v-model="checkAllA4Product" @change="handleCheckAllA4ProductChange">{{item.name}}全选</el-checkbox>
                        <el-checkbox-group class="team-list" v-model="checkedA4Product" @change="handleCheckedA4ProductChange" size="mini">
                          <el-checkbox class="item-checkbox" v-for="product in item.children" :label="product.value" :key="product.value" border>{{product.label}}</el-checkbox>
                        </el-checkbox-group>
                      </div>
                      <div class="team-header" v-else-if="item.icon=='a5'">
                        <span class="require" v-if="device=='desktop'">{{item.name}}：</span>
                        <el-checkbox class="all-select" v-if="device=='desktop'" :indeterminate="isAllA5Product" border size="mini" v-model="checkAllA5Product" @change="handleCheckAllA5ProductChange">全选</el-checkbox>
                        <el-checkbox class="all-select" v-if="device=='mobile'" :indeterminate="isAllA5Product" border size="mini" v-model="checkAllA5Product" @change="handleCheckAllA5ProductChange">{{item.name}}全选</el-checkbox>
                        <el-checkbox-group class="team-list" v-model="checkedA5Product" @change="handleCheckedA5ProductChange" size="mini">
                          <el-checkbox class="item-checkbox" v-for="product in item.children" :label="product.value" :key="product.value" border>{{product.label}}</el-checkbox>
                        </el-checkbox-group>
                      </div>
                      <div class="team-header" v-else-if="item.icon=='a6'">
                        <span class="require" v-if="device=='desktop'">{{item.name}}：</span>
                        <el-checkbox class="all-select" v-if="device=='desktop'" :indeterminate="isAllA6Product" border size="mini" v-model="checkAllA6Product" @change="handleCheckAllA6ProductChange">全选</el-checkbox>
                        <el-checkbox class="all-select" v-if="device=='mobile'" :indeterminate="isAllA6Product" border size="mini" v-model="checkAllA6Product" @change="handleCheckAllA6ProductChange">{{item.name}}全选</el-checkbox>
                        <el-checkbox-group class="team-list" v-model="checkedA6Product" @change="handleCheckedA6ProductChange" size="mini">
                          <el-checkbox class="item-checkbox" v-for="product in item.children" :label="product.value" :key="product.value" border>{{product.label}}</el-checkbox>
                        </el-checkbox-group>
                      </div>
                      <div class="team-header" v-else>
                        <span class="require" v-if="device=='desktop'">{{item.name}}：</span>
                        <el-checkbox class="all-select" v-if="device=='desktop'" :indeterminate="isAllA7Product" border size="mini" v-model="checkAllA7Product" @change="handleCheckAllA7ProductChange">全选</el-checkbox>
                        <el-checkbox class="all-select" v-if="device=='mobile'" :indeterminate="isAllA7Product" border size="mini" v-model="checkAllA7Product" @change="handleCheckAllA7ProductChange">{{item.name}}全选</el-checkbox>
                        <el-checkbox-group class="team-list" v-model="checkedA7Product" @change="handleCheckedA7ProductChange" size="mini">
                          <el-checkbox class="item-checkbox" v-for="product in item.children" :label="product.value" :key="product.value" border>{{product.label}}</el-checkbox>
                        </el-checkbox-group>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="card-header WebServerAddEditBtn ChinaphoneTwoBtn">
                    <el-button type="primary" class="updateBtn" size="small" v-if="menuButtonPermit.includes('Chinaphone_countlist')" v-on:click="getCluesAnalysisData"><i class="svg-i planeWhite" ><svg-icon icon-class="planeWhite" /></i>生成数据</el-button>
                    <el-button type="primary" class="resetBtn" size="small" v-on:click="resetData()">重置</el-button>
                </div>
            </div>
        </el-card>
        <el-card class="box-card scroll-card cn-phone-result" shadow="hover" v-if="isSearch">
            <div class="card-content ChinaphoneTwoBox" ref="tableContent">
              <div class="cavans-wrapper" id="canvasPane" ref="canvasPane">
                <el-row :gutter="15">
                  <el-col :xs="24" :sm="24" :md="12">
                    <div class="chart-wrapper">
                      <div class="chart-header"><span>电话总数（{{searchResult.phoneTotalNum}}）</span></div>
                      <div class="chart-body" style="height:640px;">                        
                          <div class="abs-canvas" v-if="device==='desktop'">
                            <div id="cluesChart1" class="chart-canvas"></div>
                          </div>
                          <div class="abs-canvas" v-else>
                            <canvas id="cluesChart1" class="chart-canvas"></canvas>
                          </div>                        
                      </div>
                    </div>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12">
                    <div class="chart-wrapper">
                      <div class="chart-header"><span>有效电话（{{searchResult.phoneEffectiveNum}}）</span></div>
                      <div class="chart-body" style="height:640px;">                              
                          <div class="abs-canvas" v-if="device==='desktop'">
                            <div id="cluesChart2" class="chart-canvas"></div>
                          </div>
                          <div class="abs-canvas" v-else>
                            <canvas id="cluesChart2" class="chart-canvas"></canvas>
                          </div>
                      </div>
                    </div>
                  </el-col>
                </el-row>
                <el-row :gutter="15">
                  <el-col :xs="24" :sm="24" :md="12">
                    <div class="chart-wrapper">
                      <div class="chart-header"><span>使用设备</span></div>
                      <div class="chart-body" style="height:400px;">                                              
                          <div class="abs-canvas" v-if="device==='desktop'">
                            <div id="cluesChart3" class="chart-canvas"></div>
                          </div>
                          <div class="abs-canvas" v-else>
                            <canvas id="cluesChart3" class="chart-canvas"></canvas>
                          </div>
                      </div>
                    </div>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12">
                    <div class="chart-wrapper">
                      <div class="chart-header"><span>产品分类</span></div>
                      <div class="chart-body" style="height:400px;">
                        <div class="abs-canvas"><div id="cluesChart4" class="chart-canvas"></div></div>
                      </div>
                    </div>
                  </el-col>
                </el-row>
                <el-row :gutter="15">
                  <el-col :xs="24" :sm="24" :md="12">
                    <div class="chart-wrapper">
                      <div class="chart-header"><span>平均星期电话量</span></div>
                      <div class="chart-body" style="height:400px;">
                          <div class="abs-canvas" v-if="device==='desktop'">
                            <div id="cluesChart5" class="chart-canvas"></div>
                          </div>
                          <div class="abs-canvas" v-else>
                            <canvas id="cluesChart5" class="chart-canvas"></canvas>
                          </div>
                      </div>
                    </div>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12">
                    <div class="chart-wrapper">
                      <div class="chart-header"><span>来源渠道</span></div>
                      <div class="chart-body" style="height:400px;">
                        <div class="abs-canvas"><div id="cluesChart6" class="chart-canvas"></div></div>
                      </div>
                    </div>
                  </el-col>
                </el-row>
                <el-row :gutter="15">
                  <el-col :xs="24">
                    <div class="chart-wrapper">
                      <div class="chart-header"><span>每天电话量</span></div>
                      <div class="chart-body" style="height:400px;">
                        <div class="abs-canvas"><div id="cluesChart7" class="chart-canvas"></div></div>
                      </div>
                    </div>
                  </el-col>
                </el-row>
                <el-row :gutter="15">
                  <el-col :xs="24">
                    <div class="chart-wrapper">
                      <div class="chart-header"><span>平均小时电话量</span></div>
                      <div class="chart-body" style="height:400px;">
                          <div class="abs-canvas" v-if="device==='desktop'">
                            <div id="cluesChart8" class="chart-canvas"></div>
                          </div>
                          <div class="abs-canvas" v-else>
                            <canvas id="cluesChart8" class="chart-canvas"></canvas>
                          </div>
                      </div>
                    </div>
                  </el-col>
                </el-row>
                <el-row :gutter="15">
                  <el-col :xs="24">
                    <div class="chart-wrapper">
                      <div class="chart-header"><span>热门产品</span></div>
                      <div class="chart-body" style="height:400px;">
                          <div class="abs-canvas" v-if="device==='desktop'">
                            <div id="cluesChart9" class="chart-canvas"></div>
                          </div>
                          <div class="abs-canvas" v-else>
                            <canvas id="cluesChart9" class="chart-canvas"></canvas>
                          </div>
                      </div>
                    </div>
                  </el-col>
                </el-row>
                <el-row :gutter="15">
                  <el-col :xs="24">
                    <div class="chart-wrapper">
                      <div class="chart-header"><span>热门地区</span></div>
                      <div class="chart-body" style="height:540px;text-align:center;">
                        <div class="map-panel flex-box">
                          <div class="map-chart">
                            <div id="cluesChart10" class="chart-canvas"></div>
                          </div>
                          <div class="flex-content table-panel">
                            <div class="table-chart">
                              <el-table
                                border
                                ref="simpleTable"
                                :data="searchResult.regionCount"
                                tooltip-effect="dark"
                                stripe
                                height="480"
                                style="width: 100%;"
                                row-key="id"
                                show-summary
                                :summary-method="getSummaries"
                                :default-sort = "{prop: 'number', order: 'descending'}"
                                >
                                <el-table-column
                                  prop="province"
                                  label="地区"
                                  >
                                </el-table-column>
                                <el-table-column
                                  prop="number"
                                  label="数量"
                                  sortable
                                  >
                                </el-table-column>
                              </el-table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </el-col>
                </el-row>
                <el-row :gutter="15">
                  <el-col :sm="24" :md="12">
                    <div class="chart-wrapper">
                      <div class="chart-header"><span>关键词</span></div>
                      <div class="chart-body">
                        <div class="table-chart">
                          <el-table
                            border
                            ref="simpleKeywordTable"
                            :data="searchResult.searchWordCount"
                            tooltip-effect="dark"
                            stripe
                            style="width: 100%"
                            height="540"
                            row-key="id"
                            show-summary
                            :summary-method="getSummaries"
                            :default-sort = "{prop: 'number', order: 'descending'}"
                            >
                            <el-table-column
                              prop="searchword"
                              label="关键词"
                              >
                            </el-table-column>
                            <el-table-column
                              prop="number"
                              label="数量"
                              sortable
                              >
                            </el-table-column>
                          </el-table>
                        </div>
                      </div>
                    </div>
                  </el-col>
                  <el-col :sm="24" :md="12">
                    <div class="chart-wrapper">
                      <div class="chart-header"><span>产品</span></div>
                      <div class="chart-body">
                        <div class="table-chart">
                          <el-table
                            border
                            ref="simpleProductTable"
                            :data="searchResult.productCount"
                            tooltip-effect="dark"
                            stripe
                            style="width: 100%"
                            height="540"
                            row-key="id"
                            show-summary
                            :summary-method="getSummaries"
                            :default-sort = "{prop: 'number', order: 'descending'}"
                            >
                            <el-table-column
                              prop="name"
                              label="产品"
                              >
                            </el-table-column>
                            <el-table-column
                              prop="number"
                              label="数量"
                              sortable
                              >
                            </el-table-column>
                          </el-table>
                        </div>
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
        </el-card>
      </div>
    </div>
    <el-backtop target=".scroll-panel"></el-backtop>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import DataSet from '@antv/data-set';
import { Chart } from '@antv/g2';
import { Column,Bar,Pie, measureTextWidth,Line } from '@antv/g2plot';
export default {
  name: 'statisticChart',
  data() {
    return {
      isSearch:false,
      breadcrumbList:[],
      menuButtonPermit:[],
      isAllPhone:false,
      checkAllPhone:false,
      isAllSemPhone:false,
      checkAllSemPhone:false,
      isAllSeoPhone:false,
      checkAllSeoPhone:false,
      isAllMediaPhone:false,
      checkAllMediaPhone:false,
      isAllSnsPhone:false,
      checkAllSnsPhone:false,
      isAllOtherPhone:false,
      checkAllOtherPhone:false,
      checkedSem:[],
      checkedSeo:[],
      checkedMedia:[],
      checkedSns:[],
      checkedOther:[],
      searchData:{
        date:[],
        startDate:'',
        endDate:'',
        province:"",
        domain:'',
        name:'',
      },
      pickerRangeOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
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
      deviceList:[],
      productList:[],
      sourceList:[],
      levelList:[],
      categoryList:[],
      phoneList:[],
      phoneCount:0,
      productCount:0,
      isAllProduct:false,
      checkAllProduct:false,
      isAllA1Product:false,
      checkAllA1Product:false,
      isAllA2Product:false,
      checkAllA2Product:false,
      isAllA3Product:false,
      checkAllA3Product:false,
      isAllA4Product:false,
      checkAllA4Product:false,
      isAllA5Product:false,
      checkAllA5Product:false,
      isAllA6Product:false,
      checkAllA6Product:false,
      isAllA7Product:false,
      checkAllA7Product:false,
      checkedA1Product:[],
      checkedA2Product:[],
      checkedA3Product:[],
      checkedA4Product:[],
      checkedA5Product:[],
      checkedA6Product:[],
      checkedA7Product:[],
      isAllSource:false,
      checkAllSource:false,
      checkedSource:[],
      isAllLevel:false,
      checkAllLevel:false,
      checkedLevel:[],
      isAllCategory:false,
      checkAllCategory:false,
      checkedCategory:[],
      isAllDevice:false,
      checkAllDevice:false,
      checkedDevice:[],
      searchResult:{
        hoursCount:[],
        deviceCount:[],
        dayCount:[],
        productCount:[],
        sourceCount:[],
        phoneCount:[],
        phoneEffectiveCount:[],
        phoneTotalNum:0,
        phoneEffectiveNum:0,
        productTypeCount:[],
        regionCount:[],
        regionMap:[],
        searchWordCount:[],
        weekCount:[],
      },
      maxWeek:[],
      minWeek:[],
      maxWeekNum:0,
      minWeekNum:0,
      maxHours:[],
      minHours:[],
      maxHoursNum:0,
      minHoursNum:0,
      maxProduct:[],
      minProduct:[],
      maxProductNum:0,
      minProductNum:0,
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'device',
      'menuData'
    ]),
  },
  created(){
    var $this = this;
    $this.getBreadcrumbList();
    $this.initData();
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
      console.log($this.breadcrumbList,"面包屑数据");
    },
    // 重置选择项
    resetData(){
      var $this = this;
      $this.isSearch = false;
      $this.isAllPhone=false;
      $this.checkAllPhone=false;
      $this.isAllSemPhone=false;
      $this.checkAllSemPhone=false;
      $this.isAllSeoPhone=false;
      $this.checkAllSeoPhone=false;
      $this.isAllMediaPhone=false;
      $this.checkAllMediaPhone=false;
      $this.isAllSnsPhone=false;
      $this.checkAllSnsPhone=false;
      $this.isAllOtherPhone=false;
      $this.checkAllOtherPhone=false;
      $this.checkedSem=[];
      $this.checkedSeo=[];
      $this.checkedMedia=[];
      $this.checkedSns=[];
      $this.checkedOther=[];
      $this.phoneCount=0;
      $this.productCount=0;
      $this.isAllProduct=false;
      $this.checkAllProduct=false;
      $this.isAllA1Product=false;
      $this.checkAllA1Product=false;
      $this.isAllA2Product=false;
      $this.checkAllA2Product=false;
      $this.isAllA3Product=false;
      $this.checkAllA3Product=false;
      $this.isAllA4Product=false;
      $this.checkAllA4Product=false;
      $this.isAllA5Product=false;
      $this.checkAllA5Product=false;
      $this.isAllA6Product=false;
      $this.checkAllA6Product=false;
      $this.isAllA7Product=false;
      $this.checkAllA7Product=false;
      $this.checkedA1Product=[];
      $this.checkedA2Product=[];
      $this.checkedA3Product=[];
      $this.checkedA4Product=[];
      $this.checkedA5Product=[];
      $this.checkedA6Product=[];
      $this.checkedA7Product=[];
      $this.isAllSource=false;
      $this.checkAllSource=false;
      $this.checkedSource=[];
      $this.isAllLevel=false;
      $this.checkAllLevel=false;
      $this.checkedLevel=[];
      $this.isAllCategory=false;
      $this.checkAllCategory=false;
      $this.checkedCategory=[];
      $this.isAllDevice=false;
      $this.checkAllDevice=false;
      $this.checkedDevice=[];
      $this.maxWeek=[];
      $this.minWeek=[];
      $this.maxWeekNum=0;
      $this.minWeekNum=0;
      $this.maxHours=[];
      $this.minHours=[];
      $this.maxHoursNum=0;
      $this.minHoursNum=0;
      $this.maxProduct=[];
      $this.minProduct=[];
      $this.maxProductNum=0;
      $this.minProductNum=0;
      $this.searchData.startDate='';
      $this.searchData.endDate='';
      $this.searchData.province="";
      $this.searchData.domain='';
      $this.searchData.name='';
      $this.searchResult.hoursCount=[];
      $this.searchResult.deviceCount=[];
      $this.searchResult.dayCount=[];
      $this.searchResult.productCount=[];
      $this.searchResult.sourceCount=[];
      $this.searchResult.phoneCount=[];
      $this.searchResult.phoneEffectiveCount=[];
      $this.searchResult.phoneTotalNum=0;
      $this.searchResult.phoneEffectiveNum=0;
      $this.searchResult.productTypeCount=[];
      $this.searchResult.regionCount=[];
      $this.searchResult.regionMap=[];
      $this.searchResult.searchWordCount=[];
      $this.searchResult.weekCount=[];
      if($this.chart&&!$this.chart.destroyed){
        $this.chart.destroy();
      }
    },
    // 初始化数据
    initData(){
      var $this = this;
      $this.getUserMenuButtonPermit();
    },
    // 初始化页面信息
    initPage(){
      var $this = this;
      $this.getSearchSystemData();
    },
    // 组装搜索接口所需数据
    initSearchData(){
      var $this = this;
      var searchData = {};
      searchData.province = $this.searchData.province;
      searchData.domain = $this.searchData.domain;
      searchData.name = $this.searchData.name;
      if($this.device=='desktop'){
        if($this.searchData.date&&$this.searchData.date.length>0){
          searchData.starttime = $this.searchData.date[0];
          searchData.endtime = $this.searchData.date[1];
        }else{
          searchData.starttime = "";
          searchData.endtime = "";
        }
      }else{
          searchData.starttime = $this.searchData.startDate;
          searchData.endtime = $this.searchData.endDate;
      }
      var checkedSem = $this.checkedSem;
      var checkedSeo = $this.checkedSeo;
      var checkedMedia = $this.checkedMedia;
      var checkedSns = $this.checkedSns;
      var checkedOther = $this.checkedOther;
      searchData.phoneid = checkedSem.concat(checkedSeo).concat(checkedMedia).concat(checkedSns).concat(checkedOther);
      searchData.mode = $this.checkedSource;
      searchData.level_id = $this.checkedLevel;
      searchData.device = $this.checkedDevice;
      searchData.productlevel = $this.checkedCategory;
      var checkedA1Product = $this.checkedA1Product;
      var checkedA2Product = $this.checkedA2Product;
      var checkedA3Product = $this.checkedA3Product;
      var checkedA4Product = $this.checkedA4Product;
      var checkedA5Product = $this.checkedA5Product;
      var checkedA6Product = $this.checkedA6Product;
      var checkedA7Product = $this.checkedA7Product;
      searchData.productid=checkedA1Product.concat(checkedA2Product).concat(checkedA3Product).concat(checkedA4Product).concat(checkedA5Product).concat(checkedA6Product).concat(checkedA7Product)
      console.log(searchData);
      return searchData;
    },
    // 获取当前登陆用户在该页面的操作权限
    getUserMenuButtonPermit(){
      var $this = this;
      $this.$store.dispatch('api/getMenuButtonPermitAction',{id:$this.$router.currentRoute.meta.id}).then(res=>{
        console.log(res);
        if(res.status){
          if(res.data.length>0){
            res.data.forEach(function(item,index){
              $this.menuButtonPermit.push(item.action_route);
            });
            if($this.menuButtonPermit.includes('Chinaphone_countlist')){
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
    // 获取询盘统计的搜索条件数据
    getSearchSystemData(){
      var $this = this;
      $this.$store.dispatch('chinaphone/cluesAnalysisSystemDataAction', null).then(response=>{
        if(response){
          if(response.status){
            console.log(response,"搜索条件信息");
            var deviceList = [];
            response.device.forEach(function(item,index){
              var itemData = {};
              if(item.name){
                itemData.label = item.name;
                itemData.value = item.name;
              }else{
                itemData.label = "未标记";
                itemData.value = "";
              }
              deviceList.push(itemData);
            });
            $this.deviceList = deviceList;
            var productList = [];
            var productCount = 0;
            response.producttype.forEach(function(item,index){
              var itemData = {};
              itemData.name = item.name;
              itemData.id = item.id;
              itemData.icon = "a"+item.id;
              itemData.children = [];
              productCount += item.product.length;
              item.product.forEach(function(item1,index1){
                var itemChildren = {};
                itemChildren.label = item1.name;
                itemChildren.value = item1.id;
                itemData.children.push(itemChildren);
              });
              productList.push(itemData);
            });
            $this.productList = productList;
            $this.productCount = productCount;
            var phoneList = [];
            var phoneCount = 0;
            response.phone.forEach(function(item,index){
              var itemData = {};
              if(item.name!="其他"){
                itemData.name = item.name+"组";
              }else{
                itemData.name = item.name;
              }
              itemData.id = item.id;
              itemData.icon = item.icon;
              itemData.children = [];
              phoneCount+=item.phone.length;
              item.phone.forEach(function(item1,index1){
                var itemChildren = {};
                if(item1.phonenumber.indexOf("-")!=-1){
                  itemChildren.label = item1.phonenumber.split("-")[1];
                }else{
                  itemChildren.label = item1.phonenumber;
                }
                itemChildren.value = item1.id;
                itemData.children.push(itemChildren);
              });
              phoneList.push(itemData);
            });
            $this.phoneList = phoneList;
            $this.phoneCount = phoneCount;
            var sourceList = [];
            response.sourcetype.forEach(function(item,index){
              var itemData = {};
              itemData.label = item.name;
              itemData.value = item.id;
              sourceList.push(itemData);
            });
            $this.sourceList = sourceList;
            var levelList = [];
            response.xunlevel.forEach(function(item,index){
              var itemData = {};
              itemData.label = item.levelname;
              itemData.value = item.id;
              levelList.push(itemData);
            });
            $this.levelList = levelList;
            console.log($this.levelList);
            var categoryList = [];
            response.xuntype.forEach(function(item,index){
              var itemData = {};
              itemData.label = item.name;
              itemData.value = item.id;
              categoryList.push(itemData);
            });
            $this.categoryList = categoryList;
            console.log($this.categoryList);
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
    // 比较两个时间的先后
    compareDate(date1,date2){
      var oDate1 = new Date(date1);
      var oDate2 = new Date(date2);
      if(oDate1.getTime() > oDate2.getTime()){
          return false;
      }else{
          return true;
      }
    },
    // 获取统计数据
    getCluesAnalysisData(){
      var $this = this;
      var searchData = $this.initSearchData();
      if(searchData.phoneid.length == 0){
        $this.$message({
            showClose: true,
            message: '错误：请至少选择一个电话！',
            type: 'error'
        });
        return false;
      }
      var isSearch = true;
      if($this.device==="mobile"){
        if(($this.searchData.startDate==""&&$this.searchData.endDate!="")||($this.searchData.startDate!=""&&$this.searchData.endDate=="")){
          isSearch = false;
        }else{
          if($this.searchData.startDate!=""&&$this.searchData.endDate!=""){
            if(!$this.compareDate($this.searchData.startDate,$this.searchData.endDate)){
              isSearch = false;
            }
          }
        }
      }
      if(!isSearch){
        if($this.searchData.startDate==""&&$this.searchData.endDate!=""){
          $this.$alert('结束时间不为空时开始时间不能为空', '警告', {
            confirmButtonText: '确定',
          });
        }
        if($this.searchData.startDate!=""&&$this.searchData.endDate==""){
          $this.$alert('开始时间不为空时结束时间不能为空', '警告', {
            confirmButtonText: '确定',
          });
        }
        if($this.searchData.startDate!=""&&$this.searchData.endDate!=""){
          $this.$alert('开始时间不能大于结束时间', '警告', {
            confirmButtonText: '确定',
          });
        }
        return false;
      }
      if($this.searchData.date.length == 0&&$this.device==="desktop"){
        $this.$message({
            showClose: true,
            message: '错误：请选择查询时间范围！',
            type: 'error'
        });
        return false;
      }
      if($this.chart&&!$this.chart.destroyed){
        $this.chart.destroy();
      }
      $this.$store.dispatch('chinaphone/cluesAnalysisResultDataAction', searchData).then(response=>{
        if(response){
          if(response.status){
            $this.isSearch=true;
            $this.searchResult.hoursCount = response.avghourscount;
            var deviceCount=[];
            if(response.devicecount.length>0){
              response.devicecount.forEach(function(item){
                   item.count="count";
                   deviceCount.push(item);
              });
            }
            $this.searchResult.deviceCount = deviceCount;
            console.log($this.searchResult.deviceCount,'$this.searchResult.deviceCount');
            $this.searchResult.dayCount = response.everydaycount;
            $this.searchResult.productCount = response.hotproductcount;
            $this.searchResult.sourceCount = response.modecount;
            $this.searchResult.phoneCount = response.phonecount;
            $this.searchResult.phoneEffectiveCount = response.phonecounteffective;
            $this.searchResult.phoneTotalNum = response.phonenumber;
            $this.searchResult.phoneEffectiveNum = response.phonenumbereffective;
            $this.searchResult.productTypeCount = response.producttypecount;
            $this.searchResult.regionCount = response.provincecoun;
            $this.searchResult.regionMap = response.provincecountmap;
            $this.searchResult.searchWordCount = response.searchwordcount;
            var numArr = [];
            response.weekdaycount.forEach(function(item,index){
              numArr.push(item.number);
            });
            var maxWeekNum = Math.max(...numArr);
            var minWeekNum = Math.min(...numArr);
            var maxWeek = [];
            var minWeek = [];
            response.weekdaycount.forEach(function(item,index){
              if(item.number === maxWeekNum){
                maxWeek.push(item.weekday)
              }else if(item.number === minWeekNum){
                minWeek.push(item.weekday);
              }
            });
            $this.maxWeekNum = maxWeekNum;
            $this.minWeekNum = minWeekNum;
            $this.maxWeek = maxWeek;
            $this.minWeek = minWeek;
            $this.searchResult.weekCount = response.weekdaycount;
            var numHoursArr = [];
            response.avghourscount.forEach(function(item,index){
              numHoursArr.push(item.number);
            });
            var maxHoursNum = Math.max(...numHoursArr);
            var minHoursNum = Math.min(...numHoursArr);
            var maxHours = [];
            var minHours = [];
            response.avghourscount.forEach(function(item,index){
              if(item.number === maxHoursNum){
                maxHours.push(item.hours)
              }else if(item.number === minHoursNum){
                minHours.push(item.hours);
              }
            });
            $this.maxHoursNum = maxHoursNum;
            $this.minHoursNum = minHoursNum;
            $this.maxHours = maxHours;
            $this.minHours = minHours;
            var numProductArr = [];
            response.hotproductcount.forEach(function(item,index){
              numProductArr.push(item.number);
            });
            var maxProductNum = Math.max(...numProductArr);
            var minProductNum = Math.min(...numProductArr);
            var maxProduct = [];
            var minProduct = [];
            response.hotproductcount.forEach(function(item,index){
              if(item.number === maxProductNum){
                maxProduct.push(item.name)
              }else if(item.number === minProductNum){
                minProduct.push(item.name);
              }
            });
            $this.maxProductNum = maxProductNum;
            $this.minProductNum = minProductNum;
            $this.maxProduct = maxProduct;
            $this.minProduct = minProduct;
            $this.$nextTick(()=>{
              document.getElementById("canvasPane").scrollIntoView({behavior: "smooth"});
              if($this.barPhoneTotalPlot){
                $this.barPhoneTotalPlot.changeData($this.searchResult.phoneCount);
              }else{
                $this.drawChart1();
              }
              if($this.barPhoneEffectivePlot){
                $this.barPhoneEffectivePlot.changeData($this.searchResult.phoneEffectiveCount);
              }else{
                $this.drawChart2();
              }
              if($this.pieDevicePlot){
                $this.pieDevicePlot.changeData($this.searchResult.deviceCount);
              }else{
                $this.drawChart3();
              }
              if($this.pieProductTypePlot){
                $this.pieProductTypePlot.changeData($this.searchResult.productTypeCount);
              }else{
                $this.drawChart4();
              }
              if($this.columnWeekPlot){
                $this.columnWeekPlot.changeData($this.searchResult.weekCount);
              }else{
                $this.drawChart5();
              }
              if($this.pieSourcePlot){
                $this.pieSourcePlot.changeData($this.searchResult.sourceCount);
              }else{
                $this.drawChart6();
              }
              if($this.lineDayPlot){
                $this.lineDayPlot.changeData($this.searchResult.dayCount);
              }else{
                $this.drawChart7();
              }
              if($this.columnHoursPlot){
                $this.columnHoursPlot.changeData($this.searchResult.hoursCount);
              }else{
                $this.drawChart8();
              }
              if($this.columnProductPlot){
                $this.columnProductPlot.changeData($this.searchResult.productCount);
              }else{
                $this.drawChart9();
              }
              $this.drawChart10();
            });
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
    // 选中所有电话事件
    handleCheckAllPhoneChange(e){
      var $this = this;
      if(e){
        $this.phoneList.forEach(function(item,index){
          var checkedList = [];
          if(item.icon=="sem"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
            $this.checkedSem = checkedList;
            $this.checkAllSemPhone = true;
          }else if(item.icon=="seo"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
            $this.checkedSeo = checkedList;
            $this.checkAllSeoPhone = true;
          }else if(item.icon=="we-media"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
            $this.checkedMedia = checkedList;
            $this.checkAllMediaPhone = true;
          }else if(item.icon=="sns"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
            $this.checkedSns = checkedList;
            $this.checkAllSnsPhone = true;
          }else{
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
            $this.checkedOther = checkedList;
            $this.checkAllOtherPhone = true;
          }
        });
      }else{
        $this.checkedSem = [];
        $this.checkedSeo = [];
        $this.checkedMedia = [];
        $this.checkedSns = [];
        $this.checkedOther = [];
        $this.checkAllSemPhone = false;
        $this.checkAllSeoPhone = false;
        $this.checkAllMediaPhone = false;
        $this.checkAllSnsPhone = false;
        $this.checkAllOtherPhone = false;
      }
      $this.isAllPhone = false;
      $this.isAllSemPhone = false;
      $this.isAllSeoPhone = false;
      $this.isAllMediaPhone = false;
      $this.isAllSnsPhone = false;
      $this.isAllOtherPhone = false;
    },
    handleCheckAllSemPhoneChange(e){
      var $this = this;
      if(e){
        var checkedList = [];
        $this.phoneList.forEach(function(item,index){
          if(item.icon=="sem"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
          }
        });
        $this.checkedSem = checkedList;
      }else{
        $this.checkedSem = [];
      }
      $this.isAllSemPhone = false;
      $this.allPhoneSelectedStatus();
    },
    handleCheckAllSeoPhoneChange(e){
      var $this = this;
      if(e){
        var checkedList = [];
        $this.phoneList.forEach(function(item,index){
          if(item.icon=="seo"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
          }
        });
        $this.checkedSeo = checkedList;
      }else{
        $this.checkedSeo = [];
      }
      $this.isAllSeoPhone = false;
      $this.allPhoneSelectedStatus();
    },
    handleCheckAllMediaPhoneChange(e){
      var $this = this;
      if(e){
        var checkedList = [];
        $this.phoneList.forEach(function(item,index){
          if(item.icon=="we-media"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
          }
        });
        $this.checkedMedia = checkedList;
      }else{
        $this.checkedMedia = [];
      }
      $this.isAllMediaPhone = false;
      $this.allPhoneSelectedStatus();
    },
    handleCheckAllSnsPhoneChange(e){
      var $this = this;
      if(e){
        var checkedList = [];
        $this.phoneList.forEach(function(item,index){
          if(item.icon=="sns"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
          }
        });
        $this.checkedSns = checkedList;
      }else{
        $this.checkedSns = [];
      }
      $this.isAllSnsPhone = false;
      $this.allPhoneSelectedStatus();
    },
    handleCheckAllOtherPhoneChange(e){
      var $this = this;
      if(e){
        var checkedList = [];
        $this.phoneList.forEach(function(item,index){
          if(item.icon=="other"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
          }
        });
        $this.checkedOther = checkedList;
      }else{
        $this.checkedOther = [];
      }
      $this.isAllOtherPhone = false;
      $this.allPhoneSelectedStatus();
    },
    handleCheckedSemChange(e){
      var $this = this;
      var checkedCount = e.length;
      $this.phoneList.forEach(function(item,index){
        if(item.icon=="sem"){
          if(checkedCount === item.children.length){
            $this.checkAllSemPhone = true;
          }else{
            $this.checkAllSemPhone = false;
          }
          if(checkedCount>0&&checkedCount<item.children.length){
            $this.isAllSemPhone = true;
          }else{
            $this.isAllSemPhone = false;
          }
        }
      });
      $this.allPhoneSelectedStatus();
    },
    handleCheckedSeoChange(e){
      var $this = this;
      var checkedCount = e.length;
      $this.phoneList.forEach(function(item,index){
        if(item.icon=="seo"){
          if(checkedCount === item.children.length){
            $this.checkAllSeoPhone = true;
          }else{
            $this.checkAllSeoPhone = false;
          }
          if(checkedCount>0&&checkedCount<item.children.length){
            $this.isAllSeoPhone = true;
          }else{
            $this.isAllSeoPhone = false;
          }
        }
      });
      $this.allPhoneSelectedStatus();
    },
    handleCheckedMediaChange(e){
      var $this = this;
      var checkedCount = e.length;
      $this.phoneList.forEach(function(item,index){
        if(item.icon=="we-media"){
          if(checkedCount === item.children.length){
            $this.checkAllMediaPhone = true;
          }else{
            $this.checkAllMediaPhone = false;
          }
          if(checkedCount>0&&checkedCount<item.children.length){
            $this.isAllMediaPhone = true;
          }else{
            $this.isAllMediaPhone = false;
          }
        }
      });
      $this.allPhoneSelectedStatus();
    },
    handleCheckedSnsChange(e){
      var $this = this;
      var checkedCount = e.length;
      $this.phoneList.forEach(function(item,index){
        if(item.icon=="sns"){
          if(checkedCount === item.children.length){
            $this.checkAllSnsPhone = true;
          }else{
            $this.checkAllSnsPhone = false;
          }
          if(checkedCount>0&&checkedCount<item.children.length){
            $this.isAllSnsPhone = true;
          }else{
            $this.isAllSnsPhone = false;
          }
        }
      });
      $this.allPhoneSelectedStatus();
    },
    handleCheckedOtherChange(e){
      var $this = this;
      var checkedCount = e.length;
      $this.phoneList.forEach(function(item,index){
        if(item.icon=="other"){
          if(checkedCount === item.children.length){
            $this.checkAllOtherPhone = true;
          }else{
            $this.checkAllOtherPhone = false;
          }
          if(checkedCount>0&&checkedCount<item.children.length){
            $this.isAllOtherPhone = true;
          }else{
            $this.isAllOtherPhone = false;
          }
        }
      });
      $this.allPhoneSelectedStatus();
    },
    // 全选按钮状态事件
    allPhoneSelectedStatus(){
      var $this = this;
      var totalCheckedCount = $this.checkedSem.length+$this.checkedSeo.length+$this.checkedMedia.length+$this.checkedSns.length+$this.checkedOther.length;
      if(totalCheckedCount>0&&totalCheckedCount<$this.phoneCount){
        $this.isAllPhone = true;
      }else{
        $this.isAllPhone = false;
      }
      if(totalCheckedCount == $this.phoneCount){
        $this.checkAllPhone = true;
      }else{
        $this.checkAllPhone = false;
      }
    },
    // 选中所有产品事件
    handleCheckAllProductChange(e){
      var $this = this;
      if(e){
        $this.productList.forEach(function(item,index){
          var checkedList = [];
          if(item.icon=="a1"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
            $this.checkedA1Product = checkedList;
            $this.checkAllA1Product= true;
          }else if(item.icon=="a2"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
            $this.checkedA2Product = checkedList;
            $this.checkAllA2Product = true;
          }else if(item.icon=="a3"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
            $this.checkedA3Product = checkedList;
            $this.checkAllA3Product = true;
          }else if(item.icon=="a4"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
            $this.checkedA4Product = checkedList;
            $this.checkAllA4Product = true;
          }else if(item.icon=="a5"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
            $this.checkedA5Product = checkedList;
            $this.checkAllA5Product = true;
          }else if(item.icon=="a6"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
            $this.checkedA6Product = checkedList;
            $this.checkAllA6Product = true;
          }else{
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
            $this.checkedA7Product = checkedList;
            $this.checkAllA7Product = true;
          }
        });
      }else{
        $this.checkedA1Product = [];
        $this.checkedA2Product = [];
        $this.checkedA3Product = [];
        $this.checkedA4Product = [];
        $this.checkedA5Product = [];
        $this.checkedA6Product = [];
        $this.checkedA7Product = [];
        $this.checkAllA1Product = false;
        $this.checkAllA2Product = false;
        $this.checkAllA3Product = false;
        $this.checkAllA4Product = false;
        $this.checkAllA5Product = false;
        $this.checkAllA6Product = false;
        $this.checkAllA7Product = false;
      }
      $this.isAllProduct = false;
      $this.isAllA1Product = false;
      $this.isAllA2Product = false;
      $this.isAllA3Product = false;
      $this.isAllA4Product = false;
      $this.isAllA5Product = false;
      $this.isAllA6Product = false;
      $this.isAllA7Product = false;
    },
    handleCheckAllA1ProductChange(e){
      var $this = this;
      if(e){
        var checkedList = [];
        $this.productList.forEach(function(item,index){
          if(item.icon=="a1"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
          }
        });
        $this.checkedA1Product = checkedList;
      }else{
        $this.checkedA1Product = [];
      }
      $this.isAllA1Product = false;
      $this.allProductSelectedStatus();
    },
    handleCheckAllA2ProductChange(e){
      var $this = this;
      if(e){
        var checkedList = [];
        $this.productList.forEach(function(item,index){
          if(item.icon=="a2"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
          }
        });
        $this.checkedA2Product = checkedList;
      }else{
        $this.checkedA2Product = [];
      }
      $this.isAllA2Product = false;
      $this.allProductSelectedStatus();
    },
    handleCheckAllA3ProductChange(e){
      var $this = this;
      if(e){
        var checkedList = [];
        $this.productList.forEach(function(item,index){
          if(item.icon=="a3"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
          }
        });
        $this.checkedA3Product = checkedList;
      }else{
        $this.checkedA3Product = [];
      }
      $this.isAllA3Product = false;
      $this.allProductSelectedStatus();
    },
    handleCheckAllA4ProductChange(e){
      var $this = this;
      if(e){
        var checkedList = [];
        $this.productList.forEach(function(item,index){
          if(item.icon=="a4"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
          }
        });
        $this.checkedA4Product = checkedList;
      }else{
        $this.checkedA4Product = [];
      }
      $this.isAllA4Product = false;
      $this.allProductSelectedStatus();
    },
    handleCheckAllA5ProductChange(e){
      var $this = this;
      if(e){
        var checkedList = [];
        $this.productList.forEach(function(item,index){
          if(item.icon=="a5"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
          }
        });
        $this.checkedA5Product = checkedList;
      }else{
        $this.checkedA5Product = [];
      }
      $this.isAllA5Product = false;
      $this.allProductSelectedStatus();
    },
    handleCheckAllA6ProductChange(e){
      var $this = this;
      if(e){
        var checkedList = [];
        $this.productList.forEach(function(item,index){
          if(item.icon=="a6"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
          }
        });
        $this.checkedA6Product = checkedList;
      }else{
        $this.checkedA6Product = [];
      }
      $this.isAllA6Product = false;
      $this.allProductSelectedStatus();
    },
    handleCheckAllA7ProductChange(e){
      var $this = this;
      if(e){
        var checkedList = [];
        $this.productList.forEach(function(item,index){
          if(item.icon=="a7"){
            item.children.forEach(function(item1,index1){
              checkedList.push(item1.value);
            });
          }
        });
        $this.checkedA7Product = checkedList;
      }else{
        $this.checkedA7Product = [];
      }
      $this.isAllA7Product = false;
      $this.allProductSelectedStatus();
    },
    handleCheckedA1ProductChange(e){
      var $this = this;
      var checkedCount = e.length;
      $this.productList.forEach(function(item,index){
        if(item.icon=="a1"){
          if(checkedCount === item.children.length){
            $this.checkAllA1Product = true;
          }else{
            $this.checkAllA1Product = false;
          }
          if(checkedCount>0&&checkedCount<item.children.length){
            $this.isAllA1Product = true;
          }else{
            $this.isAllA1Product = false;
          }
        }
      });
      $this.allProductSelectedStatus();
    },
    handleCheckedA2ProductChange(e){
      var $this = this;
      var checkedCount = e.length;
       $this.productList.forEach(function(item,index){
        if(item.icon=="a2"){
          if(checkedCount === item.children.length){
            $this.checkAllA2Product = true;
          }else{
            $this.checkAllA2Product = false;
          }
          if(checkedCount>0&&checkedCount<item.children.length){
            $this.isAllA2Product = true;
          }else{
            $this.isAllA2Product = false;
          }
        }
      });
      $this.allProductSelectedStatus();
    },
    handleCheckedA3ProductChange(e){
      var $this = this;
      var checkedCount = e.length;
       $this.productList.forEach(function(item,index){
        if(item.icon=="a3"){
          if(checkedCount === item.children.length){
            $this.checkAllA3Product = true;
          }else{
            $this.checkAllA3Product = false;
          }
          if(checkedCount>0&&checkedCount<item.children.length){
            $this.isAllA3Product = true;
          }else{
            $this.isAllA3Product = false;
          }
        }
      });
      $this.allProductSelectedStatus();
    },
    handleCheckedA4ProductChange(e){
      var $this = this;
      var checkedCount = e.length;
       $this.productList.forEach(function(item,index){
        if(item.icon=="a4"){
          if(checkedCount === item.children.length){
            $this.checkAllA4Product = true;
          }else{
            $this.checkAllA4Product = false;
          }
          if(checkedCount>0&&checkedCount<item.children.length){
            $this.isAllA4Product = true;
          }else{
            $this.isAllA4Product = false;
          }
        }
      });
      $this.allProductSelectedStatus();
    },
    handleCheckedA5ProductChange(e){
      var $this = this;
      var checkedCount = e.length;
       $this.productList.forEach(function(item,index){
        if(item.icon=="a5"){
          if(checkedCount === item.children.length){
            $this.checkAllA5Product = true;
          }else{
            $this.checkAllA5Product = false;
          }
          if(checkedCount>0&&checkedCount<item.children.length){
            $this.isAllA5Product = true;
          }else{
            $this.isAllA5Product = false;
          }
        }
      });
      $this.allProductSelectedStatus();
    },
    handleCheckedA6ProductChange(e){
      var $this = this;
      var checkedCount = e.length;
       $this.productList.forEach(function(item,index){
        if(item.icon=="a6"){
          if(checkedCount === item.children.length){
            $this.checkAllA6Product = true;
          }else{
            $this.checkAllA6Product = false;
          }
          if(checkedCount>0&&checkedCount<item.children.length){
            $this.isAllA6Product = true;
          }else{
            $this.isAllA6Product = false;
          }
        }
      });
      $this.allProductSelectedStatus();
    },
    handleCheckedA7ProductChange(e){
      var $this = this;
      var checkedCount = e.length;
       $this.productList.forEach(function(item,index){
        if(item.icon=="a7"){
          if(checkedCount === item.children.length){
            $this.checkAllA7Product = true;
          }else{
            $this.checkAllA7Product = false;
          }
          if(checkedCount>0&&checkedCount<item.children.length){
            $this.isAllA7Product = true;
          }else{
            $this.isAllA7Product = false;
          }
        }
      });
      $this.allProductSelectedStatus();
    },
    // 全选按钮状态事件
    allProductSelectedStatus(){
      var $this = this;
      var totalCheckedCount = $this.checkedA1Product.length+$this.checkedA2Product.length+$this.checkedA3Product.length+$this.checkedA4Product.length+$this.checkedA5Product.length+$this.checkedA6Product.length+$this.checkedA7Product.length;
      if(totalCheckedCount>0&&totalCheckedCount<$this.productCount){
        $this.isAllProduct = true;
      }else{
        $this.isAllProduct = false;
      }
      if(totalCheckedCount == $this.productCount){
        $this.checkAllProduct = true;
      }else{
        $this.checkAllProduct = false;
      }
    },
    handleCheckAllSourceChange(e){
      var $this = this;
      if(e){
        var checkedList = [];
        $this.sourceList.forEach(function(item,index){
          checkedList.push(item.value);
        });
        $this.checkedSource = checkedList;
        $this.checkAllSource= true;
      }else{
        $this.checkedSource = [];
        $this.checkAllSource = false;
      }
      $this.isAllSource = false;
    },
    handleCheckedSourceChange(e){
      var $this = this;
      var checkedCount = e.length;
       if(checkedCount === $this.sourceList.length){
          $this.checkAllSource = true;
        }else{
          $this.checkAllSource = false;
        }
        if(checkedCount>0&&checkedCount<$this.sourceList.length){
          $this.isAllSource = true;
        }else{
          $this.isAllSource = false;
        }
    },
    handleCheckAllLevelChange(e){
      var $this = this;
      if(e){
        var checkedList = [];
        $this.levelList.forEach(function(item,index){
          checkedList.push(item.value);
        });
        $this.checkedLevel = checkedList;
        $this.checkAllLevel= true;
      }else{
        $this.checkedLevel = [];
        $this.checkAllLevel = false;
      }
      $this.isAllLevel = false;
    },
    handleCheckedLevelChange(e){
      var $this = this;
      var checkedCount = e.length;
       if(checkedCount === $this.levelList.length){
          $this.checkAllLevel = true;
        }else{
          $this.checkAllLevel = false;
        }
        if(checkedCount>0&&checkedCount<$this.levelList.length){
          $this.isAllLevel = true;
        }else{
          $this.isAllLevel = false;
        }
    },
    handleCheckAllCategoryChange(e){
      var $this = this;
      if(e){
        var checkedList = [];
        $this.categoryList.forEach(function(item,index){
          checkedList.push(item.value);
        });
        $this.checkedCategory = checkedList;
        $this.checkAllCategory= true;
      }else{
        $this.checkedCategory = [];
        $this.checkAllCategory = false;
      }
      $this.isAllCategory = false;
    },
    handleCheckedCategoryChange(e){
      var $this = this;
      var checkedCount = e.length;
       if(checkedCount === $this.categoryList.length){
          $this.checkAllCategory = true;
        }else{
          $this.checkAllCategory = false;
        }
        if(checkedCount>0&&checkedCount<$this.categoryList.length){
          $this.isAllCategory = true;
        }else{
          $this.isAllCategory = false;
        }
    },
    handleCheckAllDeviceChange(e){
      var $this = this;
      if(e){
        var checkedList = [];
        $this.deviceList.forEach(function(item,index){
          checkedList.push(item.value);
        });
        $this.checkedDevice = checkedList;
        $this.checkAllDevice= true;
      }else{
        $this.checkedDevice = [];
        $this.checkAllDevice = false;
      }
      $this.isAllDevice = false;
    },
    handleCheckedDeviceChange(e){
      var $this = this;
      var checkedCount = e.length;
       if(checkedCount === $this.deviceList.length){
          $this.checkAllDevice = true;
        }else{
          $this.checkAllDevice = false;
        }
        if(checkedCount>0&&checkedCount<$this.deviceList.length){
          $this.isAllDevice = true;
        }else{
          $this.isAllDevice = false;
        }
    },
    // 图表功能
    drawChart1(){
      var $this = this;
      if($this.searchResult.phoneCount.length>0){        
        if($this.device == "desktop"){
          const barPhoneTotalPlot = new Bar('cluesChart1', {
            data:$this.searchResult.phoneCount,
            xField: 'number',
            yField: 'phonenumber',
            appendPadding:[15,15,15,15],
            seriesField: 'phonenumber',
            label: {
              // 可手动配置 label 数据标签位置
              position: 'middle', // 'top', 'bottom', 'middle',
              // 配置样式
              style: {
                fill: '#FFFFFF',
                opacity:1,
              },
            },
            tooltip: {
              formatter: (datum) => {
                return { name: "询盘个数", value: datum.number };
              }
            },
            meta: {
              number: {
                alias: '询盘个数',
              },
              phonenumber: {
                alias: '电话',
              },
            },
          });
          $this.barPhoneTotalPlot = barPhoneTotalPlot;
          barPhoneTotalPlot.render();
        }else{
          // Step 1: 创建 Chart 对象
          const chart = new $this.$F2.Chart({
            id: 'cluesChart1',
            pixelRatio: window.devicePixelRatio // 指定分辨率
          });
          // Step 2: 载入数据源
          chart.source($this.searchResult.phoneCount, {
            number: {
              tickCount:5
            }
          });
          chart.coord({
            transposed: true
          });
          // Step 3：创建图形语法，绘制柱状图，由 genre 和 sold 两个属性决定图形位置，genre 映射至 x 轴，sold 映射至 y 轴
          chart.interval()
            .position('phonenumber*number')
            .color('phonenumber');

          // Step 4: 渲染图表
          chart.render();
        }
      }
    },
    // 图表功能
    drawChart2(){
      var $this = this;
      if($this.searchResult.phoneEffectiveCount.length>0){               
        if($this.device == "desktop"){
          const barPhoneEffectivePlot = new Bar('cluesChart2', {
            data:$this.searchResult.phoneEffectiveCount,
            xField: 'number',
            yField: 'phonenumber',
            appendPadding:[15,15,15,15],
            seriesField: 'phonenumber',
            label: {
              // 可手动配置 label 数据标签位置
              position: 'middle', // 'top', 'bottom', 'middle',
              // 配置样式
              style: {
                fill: '#FFFFFF',
                opacity:1,
              },
            },
            tooltip: {
              formatter: (datum) => {
                return { name: "询盘个数", value: datum.number };
              }
            },
            meta: {
              number: {
                alias: '询盘个数',
              },
              phonenumber: {
                alias: '电话',
              },
            },
          });
          $this.barPhoneEffectivePlot = barPhoneEffectivePlot;
          barPhoneEffectivePlot.render();
        }else{
          // Step 1: 创建 Chart 对象
          const chart = new $this.$F2.Chart({
            id: 'cluesChart2',
            pixelRatio: window.devicePixelRatio // 指定分辨率
          });
          // Step 2: 载入数据源
          chart.source($this.searchResult.phoneEffectiveCount, {
            number: {
              tickCount:5
            }
          });
          chart.coord({
            transposed: true
          });
          // Step 3：创建图形语法，绘制柱状图，由 genre 和 sold 两个属性决定图形位置，genre 映射至 x 轴，sold 映射至 y 轴
          chart.interval()
            .position('phonenumber*number')
            .color('phonenumber');

          // Step 4: 渲染图表
          chart.render();
        }
      }
    },
    // 图表功能
    drawChart3(){
      var $this = this;
      if($this.searchResult.deviceCount.length>0){            
        if($this.device == "desktop"){
            const pieDevicePlot = new Pie('cluesChart3', {
              data:$this.searchResult.deviceCount,
              angleField: 'number',
              colorField: 'devicename',
              appendPadding:[15,15,15,15],
              radius: 0.8,
              label: {
                type: 'outer',
                content: '{name} {percentage}',
              },
              tooltip: {
                formatter: (datum) => {
                  return { name: "询盘个数", value: datum.number };
                }
              },
              interactions: [{ type: 'pie-legend-active' }, { type: 'element-active' }],
            });
            $this.pieDevicePlot = pieDevicePlot;
            pieDevicePlot.render();
        }else{
            const chart = new $this.$F2.Chart({
              id: 'cluesChart3',
              pixelRatio: window.devicePixelRatio
            });

            chart.source($this.searchResult.deviceCount);
            chart.coord('polar', {
              transposed: true,
              radius: 0.75
            });
            chart.legend(false);
            chart.axis(false);
            chart.tooltip(false);
            // 添加饼图文本
            //chart.pieLabel({
            //  sidePadding: 40,
            //  label1: function label1(data, color) {
            //    return {
            //      text: data.devicename,
            //      fill: color
            //    };
            //  },
            //  label2: function label2(data) {
            //    return {
            //      text: '￥' + String(Math.floor(data.percenter * 100) / 100).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            //      fill: '#808080',
            //      fontWeight: 'bold'
            //    };
            //  }
            //});
            chart.interval()
              .position('const*devicename')
              .color('devicename', [ '#1890FF', '#13C2C2', '#2FC25B', '#FACC14', '#F04864' ])
              .adjust('stack');
            chart.render();
        }
      }
    },
    // 图表功能
    drawChart4(){
      var $this = this;
      if($this.searchResult.productTypeCount.length>0){
        const pieProductTypePlot = new Pie('cluesChart4', {
          data:$this.searchResult.productTypeCount,
          angleField: 'number',
          colorField: 'name',
          appendPadding:[15,15,15,15],
          radius: 0.8,
          label: {
            type: 'outer',
            content: '{name} {percentage}',
          },
          tooltip: {
            formatter: (datum) => {
              return { name: "询盘个数", value: datum.number };
            }
          },
          interactions: [{ type: 'pie-legend-active' }, { type: 'element-active' }],
        });
        $this.pieProductTypePlot = pieProductTypePlot;
        pieProductTypePlot.render();
      }
    },
    // 图表功能
    drawChart5(){
      var $this = this;
      if($this.searchResult.weekCount.length>0){
        if($this.device == "desktop"){
            const maxColor = '#FF4500';
            const minColor = '#1CC25E';
            const defaultColor = '#5B8FF9';
            const columnWeekPlot = new Column('cluesChart5', {
              data:$this.searchResult.weekCount,
              xField: 'weekday',
              yField: 'number',
              appendPadding:[15,15,15,15],
              seriesField: '',
              color: ({ weekday }) => {
                var currentColor = defaultColor;
                $this.maxWeek.forEach(function(item,index){
                  if(weekday == item){
                    currentColor = maxColor;
                  }
                });
                $this.minWeek.forEach(function(item,index){
                  if(weekday == item){
                    currentColor = minColor;
                  }
                });
                return currentColor;
              },
              xAxis:{
                label:{
                  autoHide:true
                },
              },
              label:{
                position:'top',
                offsetY:8,
                style: {
                  fill: '#000',
                  opacity:1
                },
              },
              tooltip: {
                formatter: (datum) => {
                  return { name: "询盘个数", value: datum.number };
                },
                title:(e)=>{
                  return e.replace(/\n/g," ")
                }
              },
              meta: {
                weekday: {
                  alias: '星期',
                },
                number: {
                  alias: '询盘个数',
                  max: $this.maxWeekNum,
                  min: 0,
                },
              },
            });
            $this.columnWeekPlot = columnWeekPlot;
            columnWeekPlot.render();
        }else{
          // Step 1: 创建 Chart 对象
          const chart = new $this.$F2.Chart({
            id: 'cluesChart5',
            pixelRatio: window.devicePixelRatio // 指定分辨率
          });
          // Step 2: 载入数据源
          chart.source($this.searchResult.weekCount, {
            number: {
              tickCount:4
            }
          });
          // Step 3：创建图形语法，绘制柱状图，由 genre 和 sold 两个属性决定图形位置，genre 映射至 x 轴，sold 映射至 y 轴
          chart.interval()
            .position('weekday*number')
            .color('weekday');

          // Step 4: 渲染图表
          chart.render();
        }
      }
    },
    // 图表功能
    drawChart6(){
      var $this = this;
      if($this.searchResult.sourceCount.length>0){
        const pieSourcePlot = new Pie('cluesChart6', {
          data:$this.searchResult.sourceCount,
          angleField: 'number',
          colorField: 'name',
          appendPadding:[15,15,15,15],
          radius: 1,
          innerRadius: 0.64,
          label: {
            type: 'inner',
            offset: '-50%',
            style: {
              textAlign: 'center',
            },
            autoRotate: false,
            // content: '{value}',
            formatter: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
          },
          statistic: {
            title: {
              offsetY: -4,
              customHtml: (cluesChart6, view, datum) => {
                const { width, height } = cluesChart6.getBoundingClientRect();
                const d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
                const text = datum ? datum.name : '总计';
                return $this.renderStatistic(d, text, { fontSize: 28 });
              },
            },
            content: {
              offsetY: 4,
              style: {
                fontSize: '32px',
              },
              customHtml: (cluesChart6, view, datum, data) => {
                const { width } = cluesChart6.getBoundingClientRect();

                const text = datum ? `${datum.number}` : `${data.reduce((r, d) => r + d.number, 0)}`;
                return $this.renderStatistic(width, text, { fontSize: 32 });
              },
            },
          },
          // 添加 中心统计文本 交互
          interactions: [{ type: 'element-selected' }, { type: 'element-active' }, { type: 'pie-statistic-active' }],
        });
        $this.pieSourcePlot = pieSourcePlot;
        pieSourcePlot.render();
      }
    },
    renderStatistic(containerWidth, text, style) {
      const { width: textWidth, height: textHeight } = measureTextWidth(text, style);
      const R = containerWidth / 2;
      // r^2 = (w / 2)^2 + (h - offsetY)^2
      var scale = 1;
      if (containerWidth < textWidth) {
        scale = Math.min(Math.sqrt(Math.abs(Math.pow(R, 2) / (Math.pow(textWidth / 2, 2) + Math.pow(textHeight, 2)))), 1);
      }
      const textStyleStr = `width:${containerWidth}px;`;
      return `<div style="${textStyleStr};font-size:${scale}em;line-height:${scale < 1 ? 1 : 'inherit'};">${text}</div>`;
    },
    // 图表功能
    drawChart7(){
      var $this = this;
      if($this.searchResult.dayCount.length>0){
        const lineDayPlot = new Line('cluesChart7', {
          data:$this.searchResult.dayCount,
          xField: 'day',
          yField: 'number',
          appendPadding:[15,15,15,15],
          smooth:true,
          tooltip: {
            formatter: (datum) => {
              return { name: "询盘个数", value: datum.number };
            },
            title:(e)=>{
              return e.replace(/\n/g," ")
            }
          },
        });
        $this.lineDayPlot = lineDayPlot;
        lineDayPlot.render();
      }
    },
    // 图表功能
    drawChart8(){
      var $this = this;
      if($this.searchResult.hoursCount.length>0){        
        if($this.device == "desktop"){
            const maxColor = '#FF4500';
            const minColor = '#1CC25E';
            const defaultColor = '#5B8FF9';
            const columnHoursPlot = new Column('cluesChart8', {
              data:$this.searchResult.hoursCount,
              xField: 'hours',
              yField: 'number',
              appendPadding:[15,15,15,15],
              seriesField: '',
              color: ({ hours }) => {
                var currentColor = defaultColor;
                $this.maxHours.forEach(function(item,index){
                  if(hours == item){
                    currentColor = maxColor;
                  }
                });
                $this.minHours.forEach(function(item,index){
                  if(hours == item){
                    currentColor = minColor;
                  }
                });
                return currentColor;
              },
              xAxis:{
                label:{
                  autoHide:true
                },
              },
              label:{
                position:'top',
                offsetY:8,
                style: {
                  fill: '#000',
                  opacity:1
                },
              },
              tooltip: {
                formatter: (datum) => {
                  return { name: "询盘个数", value: datum.number };
                },
                title:(e)=>{
                  return e.replace(/\n/g," ")
                }
              },
              meta: {
                weekday: {
                  alias: '时段',
                },
                number: {
                  alias: '询盘个数',
                  max: $this.maxHoursNum,
                  min: 0,
                },
              },
            });
            $this.columnHoursPlot = columnHoursPlot;
            columnHoursPlot.render();
        }else{
          // Step 1: 创建 Chart 对象
          const chart = new $this.$F2.Chart({
            id: 'cluesChart8',
            pixelRatio: window.devicePixelRatio // 指定分辨率
          });
          // Step 2: 载入数据源
          chart.source($this.searchResult.hoursCount, {
            number: {
              tickCount:12
            }
          });
          // Step 3：创建图形语法，绘制柱状图，由 genre 和 sold 两个属性决定图形位置，genre 映射至 x 轴，sold 映射至 y 轴
          chart.interval()
            .position('hours*number')
            .color('hours');

          // Step 4: 渲染图表
          chart.render();
        }
      }
    },
    // 图表功能
    drawChart9(){
      var $this = this;
      if($this.searchResult.productCount.length>0){       
        if($this.device == "desktop"){
            const maxColor = '#FF4500';
            const minColor = '#1CC25E';
            const defaultColor = '#5B8FF9';
            const columnProductPlot = new Column('cluesChart9', {
              data:$this.searchResult.productCount,
              xField: 'name',
              yField: 'number',
              appendPadding:[15,15,15,15],
              seriesField: '',
              color: ({ name }) => {
                var currentColor = defaultColor;
                $this.maxProduct.forEach(function(item,index){
                  if(name == item){
                    currentColor = maxColor;
                  }
                });
                $this.minProduct.forEach(function(item,index){
                  if(name == item){
                    currentColor = minColor;
                  }
                });
                return currentColor;
              },
              xAxis:{
                label:{
                  autoHide:true
                },
              },
              label:{
                position:'top',
                offsetY:8,
                style: {
                  fill: '#000',
                  opacity:1
                },
              },
              tooltip: {
                formatter: (datum) => {
                  return { name: "询盘个数", value: datum.number };
                },
                title:(e)=>{
                  return e.replace(/\n/g," ")
                }
              },
              meta: {
                name: {
                  alias: '产品',
                },
                number: {
                  alias: '询盘个数',
                  max: $this.maxProductNum,
                  min: 0,
                },
              },
            });
            $this.columnProductPlot = columnProductPlot;
            columnProductPlot.render();
        }else{
          // Step 1: 创建 Chart 对象
          const chart = new $this.$F2.Chart({
            id: 'cluesChart9',
            pixelRatio: window.devicePixelRatio // 指定分辨率
          });
          // Step 2: 载入数据源
          chart.source($this.searchResult.productCount, {
            number: {
              tickCount:10
            }
          });
          // Step 3：创建图形语法，绘制柱状图，由 genre 和 sold 两个属性决定图形位置，genre 映射至 x 轴，sold 映射至 y 轴
          chart.interval()
            .position('name*number')
            .color('name');

          // Step 4: 渲染图表
          chart.render();
        }
      }
    },
    // 图表功能
    drawChart10(){
      var $this = this;
      if($this.searchResult.regionMap.length>0){     
        if($this.device == "desktop"){
            fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/china-provinces.geo.json')
            .then(res => res.json())
            .then(GeoJSON => {
              const chart = new Chart({
                container: 'cluesChart10',
                width: 760,
                height: 480,
              });
              chart.scale({
                latitude: { sync: true },
                longitude: { sync: true }
              });
              chart.tooltip({
                showTitle: false,
                showMarkers: false,
                shared: true,
              });
              // 同步度量
              chart.scale({
                longitude: {
                  sync: true
                },
                latitude: {
                  sync: true
                }
              });
              chart.axis(false);
              chart.legend('trend', {
                position: 'right'
              });
              
              var ds = new DataSet();
              const geoDv = ds.createView('back').source(GeoJSON, {type: 'GeoJSON'});
              const geoView = chart.createView();
              geoView.data(geoDv.rows);
              geoView.tooltip(false);
              geoView.polygon()
                .position('longitude*latitude')
                .color('grey')
                .style({
                  fill: '#fff',
                  stroke: '#ccc',
                  lineWidth: 1,
                });

              const userData = [];
              $this.searchResult.regionMap.forEach(function(item,index){
                var itemData = {};
                itemData.name = item.name;
                itemData.value = item.number;
                userData.push(itemData);
              });
              const userDv = ds.createView().source(userData).transform({
                // sizeByCount: true,
                geoDataView: geoDv,
                field: 'name',
                type: 'geo.region',
                as: ['longitude', 'latitude']
              }).transform({
                type: 'map',
                callback: obj => {
                  if(obj.value <10){
                      obj.trend="0-10";
                  }else if(obj.value <20 && obj.value>=10){
                      obj.trend="10-20";
                  }else if(obj.value <30 && obj.value>=20){
                      obj.trend="20-30";
                  }else if(obj.value <40 && obj.value>=30){
                      obj.trend="30-40";
                  }else if(obj.value <50 && obj.value>=40){
                      obj.trend="40-50";
                  }else if(obj.value <60 && obj.value>=50){
                      obj.trend="50-60";
                  }else if(obj.value <100 && obj.value>=60){
                      obj.trend="60-100";
                  }else if(obj.value <300 && obj.value>=100){
                      obj.trend="100-300";
                  }else if(obj.value <500 && obj.value>=300){
                      obj.trend="300-500";
                  }else if(obj.value <800 && obj.value>=500){
                      obj.trend="500-800";
                  }else{
                      obj.trend="大于800";
                  }
                  return obj;
                }
              });
              console.log(userDv,"用户数据");
              const userView = chart.createView();
              userView.data(userDv.rows);
              userView.scale({
                value: {
                  alias: '数量'
                },
                name:{
                  alias:"地区"
                }
              });
              userView.polygon()
                .position('longitude*latitude')
                .color('trend', '#BAE7FF-#1890FF-#0050B3')
                .tooltip('name*value')
                .style({
                  fillOpacity: 0.85
                }).animate({
                  leave: {
                    animation: 'fade-out'
                  }
                });
              userView.interaction('element-active');
              $this.chart = chart;
              chart.render();
            });
        }else{                  
          //const DataSet = window.DataSet;
          //fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/china-provinces.geo.json')
          //  .then(res => res.json())
          //  .then(GeoJSON => {
          //    const geoDv = new DataSet.View().source(GeoJSON, {
          //      type: 'GeoJSON'
          //    });
          //    const chart = new $this.$F2.Chart({
          //      id: 'cluesChart10',
          //      padding: 0,
          //      pixelRatio: window.devicePixelRatio
          //    });
          //    chart.legend(false);
          //    chart.axis(false);
          //    chart.tooltip(false);
          //    chart.source(geoDv.rows);
          //    chart.polygon()
          //      .position('longitude*latitude')
          //      .color('grey')
          //      .style({
          //        fill: '#fff',
          //        stroke: '#ccc',
          //        lineWidth: 1,
          //      });

          //    chart.render();
          //  });
          }
      }
    },
    getSummaries(param){
      var $this = this;
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
        } else {
          sums[index] = '-';
        }
      });
      return sums;
    }
  }
}
</script>
<style lang="scss" scoped>
</style>