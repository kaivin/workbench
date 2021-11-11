<template>
  <div
    class="rowTwoTwo"
    
  >
    <div class="itemRowTit">
      <h3>组员成绩</h3>
      <div class="customRadio">
        <el-checkbox-group
          class="checkbox-panel"
          v-model="moduleGroupID"
          @change="groupClick"
          size="small"
        >
          <el-checkbox
            :label="item.value"
            :disabled="item.disabled"
            v-for="(item, index) in zusuercount.zusuercountGroupnameArr"
            v-bind:key="index"
            >{{ item.label }}</el-checkbox
          >
        </el-checkbox-group>
      </div>
      <span>注：与上月同期对比</span>
    </div>
    <div class="rowTwoTwoItem">
      <div
        class="rowTwoTwoItemBox"
        :style="'height:' + tableHidden.tableHeight"
      >
        <el-table
          ref="simpleTable"
          :data="zusuercount.zusuercountArr"
          tooltip-effect="dark"
          stripe
          class="rowTwoTwoTable rowTableOne"
          style="width: 100%"
        >
          <el-table-column prop="groupname" label="组别" aglin="center">
            <template slot-scope="scope">
              <span style="color: #aaaaaa">{{ scope.row.groupname }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="username" label="姓名" aglin="center">
          </el-table-column>
          <el-table-column
            prop="todaynumber"
            sortable
            label="今天个数"
            aglin="center"
          >
          </el-table-column>
          <el-table-column
            prop="lastdaynumber"
            sortable
            label="昨天个数"
            aglin="center"
          >
          </el-table-column>
          <el-table-column
            prop="monthnumber"
            sortable
            label="本月个数"
            aglin="center"
          >
            <template slot-scope="scope">
              <div class="rowThreeGrowth">
                <p>
                  <i>{{ scope.row.monthnumber }}</i>
                  <span :class="scope.row.Class">{{ scope.row.Growth }}</span>
                </p>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <p
        class="rowTwoTwoItemBtn"
        v-if="tableHidden.tableBtnVisible"
        v-on:click="tableBtn"
      >
        <span>{{ tableHidden.tableBtnTxt }}</span>
      </p>
    </div>
  </div>
</template>

<script>

export default {
  name: "demo",
  data() {
    return {
      moduleGroupID:[],
    };
  },
  props: {
    zusuercount:{
        type:Object,
        default:function(){
            return {}
        }
    },
    tableHidden:{
        type:Object,
        default:function(){
            return {}
        }
    }
  },
  watch:{
    zusuercount:{
      handler(val, oldVal){
        this.moduleGroupID = val.GroupID
        //this.groupClick()
      },
      deep:true //true 深度监听

    }
  },
  created() {
    
  },
  methods: {
     // 组员成绩部门点击事件
    groupClick(){
      this.$emit('moduleChecked',this.moduleGroupID)
    },
        // 表格点击展开
    tableBtn(){
      let tableHeight='';
      let tableBtnTxt = '';
      let tableBtnBool=!this.tableHidden.tableBtnBool;
      if(this.tableHidden.tableBtnBool){
        tableHeight=357+'px';
        tableBtnTxt='点击展开';
      }else{
        tableHeight='auto';
        tableBtnTxt='点击收起';
      }
      this.$emit('tableBtnChange',tableHeight,tableBtnTxt,tableBtnBool)
    },
  },
};
</script>

<style>
</style>