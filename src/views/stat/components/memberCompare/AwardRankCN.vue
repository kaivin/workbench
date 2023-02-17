<template> 
    <div class="dealRankMainItem">  
        <div class="dealRankMainBox">      
            <el-table
                ref="SimpleTable"
                :data="RankData"
                tooltip-effect="dark"
                class="SiteTable EntableColor"
                style="width: 100%"
                row-key="id"
                key="a"
                @sort-change="sortAllChange"
                >
                <el-table-column
                  label="序号" 
                  type="index"
                  width='50'
                  >
                </el-table-column>
                <el-table-column
                  prop="departname"
                  label="所属部门"
                  >
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="姓名"
                  >
                    <template slot-scope="scope">
                      <router-link :to="{path: lang == 'ch'?'/stat/cn/memberAnalysis/singlePerson':'/stat/en/memberAnalysis/singlePerson',query:{deptId:scope.row.dept_id,itemId:scope.row.id}}" tag="a" target="_blank">
                        <span class="uname" :style="scope.row.postionname=='组长'||scope.row.postionname=='主管'?'color:red;font-weight:bold':''">{{scope.row.name}}</span></router-link>
                    </template>
                </el-table-column>
                <el-table-column
                  prop="postionname"
                  label="职位"
                  >
                    <template slot-scope="scope">
                        <span class="uname" :style="scope.row.postionname=='组长'||scope.row.postionname=='主管'?'color:red;font-weight:bold':''">{{scope.row.postionname}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                  prop="comtime"
                  label="入职时间"
                  sortable              
                  >
                    <template slot-scope="scope">
                        <span :class="scope.row.comtimeShow?'':'inTime'">{{scope.row.comtime}}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="defaultTagData" v-if="isMonth == 3">
                    <el-table-column
                      label="总询盘"
                      sortable="custom"
                      class-name="dayStyle"
                      >
                      <template slot-scope="scope">
                        {{scope.row.datehasquality+scope.row.datenohasquality}}
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="datehasquality"
                      label="已判定"
                      sortable
                      class-name="dayStyle"
                      >
                    </el-table-column>
                    <el-table-column
                      prop="datenohasquality"
                      label="未判定"
                      sortable
                      class-name="dayStyle"
                      >
                    </el-table-column>
                    <el-table-column
                      prop="zero"
                      label="无效率"
                      sortable
                      class-name="dayStyle"
                      >
                      <template slot-scope="scope">
                        {{scope.row.zero}}%
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="datehasqualityscore"
                      label="质量分"
                      sortable
                      class-name="dayStyle"
                      >
                    </el-table-column>
                    <el-table-column
                      prop="avghasqualityscore"
                      label="平均质量分"
                      sortable
                      class-name="dayStyle"
                      >
                    </el-table-column>
                </el-table-column>
                <el-table-column :label="defaultTagData" v-if="isMonth == 1">
                    <el-table-column
                      label="总询盘"
                      sortable="custom"
                      class-name="dayStyle"
                      >
                      <template slot-scope="scope">
                        {{scope.row.monthhasquality+scope.row.monthnohasquality}}
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="monthhasquality"
                      label="已判定"
                      sortable
                      class-name="monthStyle"
                      >
                    </el-table-column>
                    <el-table-column
                      prop="monthnohasquality"
                      label="未判定"
                      sortable
                      class-name="monthStyle"
                      >
                    </el-table-column>
                    <el-table-column
                      prop="zero"
                      label="无效率"
                      sortable
                      class-name="dayStyle"
                      >
                      <template slot-scope="scope">
                        {{scope.row.zero}}%
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="monthhasqualityscore"
                      label="质量分"
                      sortable
                      class-name="monthStyle"
                      >
                    </el-table-column>
                    <el-table-column
                      prop="avghasqualityscore"
                      label="平均质量分"
                      sortable
                      class-name="monthStyle"
                      >
                    </el-table-column>
                    <el-table-column
                      prop="score"
                      label="成交积分"
                      sortable
                      class-name="monthStyle"
                      >
                    </el-table-column>
                    <el-table-column
                      prop="Anumber"
                      label="100万个数"
                      sortable
                      class-name="monthStyle"
                      >
                    </el-table-column>
                </el-table-column>
                <el-table-column :label="defaultTagData" v-if="isMonth ==2">
                    <el-table-column
                      label="总询盘"
                      sortable="custom"
                      class-name="dayStyle"
                      >
                      <template slot-scope="scope">
                        {{scope.row.hasqualitynumber+scope.row.nohasqualitynumber}}
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="hasqualitynumber"
                      label="已判定数量"
                      sortable
                      class-name="yearStyle"
                      >
                    </el-table-column>
                    <el-table-column
                      prop="nohasqualitynumber"
                      label="未判定数量"
                      sortable
                      class-name="yearStyle"
                      >
                    </el-table-column>
                    <el-table-column
                      prop="zero"
                      label="无效率"
                      sortable
                      class-name="dayStyle"
                      >
                      <template slot-scope="scope">
                        {{scope.row.zero}}%
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="hasqualityscore"
                      label="质量分"
                      width='140'
                      sortable
                      class-name="yearStyle"
                      >
                    </el-table-column>
                    <el-table-column
                      prop="avghasqualityscore"
                      label="平均质量分"
                      sortable
                      class-name="yearStyle"
                      >
                    </el-table-column>
                    <el-table-column
                      prop="score"
                      label="成交积分"
                      sortable
                      class-name="yearStyle"
                      >
                    </el-table-column>
                    <el-table-column
                      prop="Anumber"
                      label="100万个数"
                      sortable
                      class-name="yearStyle"
                      >
                    </el-table-column>
                </el-table-column>
            </el-table>
        </div> 
    </div>
    </template>
    
    <script>
    export default {
      name: "AwardRank",
      data() {
        return {
            isMonth: 3,
        };
      },
      created(){
      },
      props: {
        RankData: {
          type: Array,
          default: function () {
            return [];
          },
        },
        lang:{
          type: String,
          default: function () {
            return "";
          },
        },
        defaultTagData:{
          type: String,
          default: function () {
            return "";
          },
        },
        month: {
          type: Number,
          default: 1,
        },
      },
      computed:{
        yearTime(){
            return new Date().getFullYear();
        },
        monthTime(){
            return new Date().getMonth() + 1;
        }
      },
      watch: {
        month:{
            handler(newValue, oldValue) {
                this.isMonth = newValue;
            },
        },
      },
      methods:{
        sortAllChange(res){
          let $this = this;
          $this.$emit('rankChange', res.order);
        }
      }
    }
    </script>
    
    <style></style>