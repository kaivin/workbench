<template>
  <div class="page-root" ref="boxPane">
    <el-card class="box-card" shadow="hover">
      <div slot="header">
        <div class="card-header" ref="headerPane">
          <el-button type="primary" size="small" icon="el-icon-refresh" v-on:click="refreshData()">刷新</el-button>
          <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click="addTableRow()" v-if="(menuButtonPermit.includes('Permit_add'))&&device==='desktop'">添加权限</el-button>
        </div>
      </div>
      <div class="card-content" ref="tableContent">
        <el-table
          border
          ref="simpleTable"
          :data="tableData"
          tooltip-effect="dark"
          stripe
          style="width: 100%"
          :height="tableHeight"
          row-key="id"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          >
          <el-table-column
            prop="name"
            label="名称"
            min-width="180"
            fixed="left"
            >
          </el-table-column>
          <el-table-column
            prop="route"
            label="唯一标识名"
            min-width="160"
            >
          </el-table-column>
          <el-table-column
            width="80"
            prop="type"
            label="类型"
            >
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.type === '菜单层' ? 'info' : 'primary'"
                disable-transitions>{{scope.row.type}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            v-if="(menuButtonPermit.includes('Permit_add')||menuButtonPermit.includes('Permit_edit')||menuButtonPermit.includes('Permit_delete'))&&device==='desktop'"
            :width="operationsWidth"
            align="center"
            fixed="right"
            prop="operations"
            label="操作">
            <template #default="scope">
              <div class="table-button">
                <el-button size="mini" @click="addTableRow(scope.row,scope.$index)" v-if="!scope.row.isPermit&&menuButtonPermit.includes('Permit_add')">添加权限</el-button>
                <el-button size="mini" @click="editTableRow(scope.row,scope.$index)" v-if="scope.row.isPermit&&menuButtonPermit.includes('Permit_edit')">编辑</el-button>
                <el-button size="mini" @click="deleteTableRow(scope.row,scope.$index)" v-if="scope.row.isPermit&&menuButtonPermit.includes('Permit_delete')" type="info" plain>删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-dialog :title="dialogText" v-if="(menuButtonPermit.includes('Permit_add')||menuButtonPermit.includes('Permit_edit'))&&device==='desktop'" custom-class="add-edit-dialog" :visible.sync="dialogFormVisible" width="480px">
      <el-form :model="dialogForm">
        <div class="item-form">
          <el-form-item label="权限所属菜单：" :label-width="formLabelWidth" v-if="permitLevelData.length>0">
            <el-cascader v-model="dialogForm.mid" :options="permitLevelData" ref="menuLevel" filterable placeholder="请选择权限所属菜单" :props="{ checkStrictly: true,expandTrigger: 'hover' }" clearable></el-cascader>
          </el-form-item>
          <el-popover
            placement="left"
            width="200"
            trigger="hover"
            content="不可为空，所添加权限必须有一个指定的菜单">
            <i slot="reference" class="el-icon-s-opportunity"></i>
          </el-popover>
        </div>
        <div class="item-form">
          <el-form-item label="权限名称：" :label-width="formLabelWidth">
            <el-input v-model="dialogForm.name" ref="name"></el-input>
          </el-form-item>
          <el-popover
            placement="left"
            width="200"
            trigger="hover"
            content="权限显示名称，不可为空">
            <i slot="reference" class="el-icon-s-opportunity"></i>
          </el-popover>
        </div>
        <div class="item-form">
            <el-form-item label="唯一标识名：" :label-width="formLabelWidth">
              <el-input v-model="dialogForm.route" ref="route"></el-input>
            </el-form-item>
            <el-popover
              placement="left"
              width="200"
              trigger="hover"
              content="后端程序控制器，此处不可为空">
              <i slot="reference" class="el-icon-s-opportunity"></i>
            </el-popover>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveData">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>


<script>
import { mapGetters } from 'vuex'
export default {
  name: 'permitIndex',
  data() {
    return {
      menuButtonPermit:[],
      operationsWidth:"",
      tableData:[],
      tableHeight:200,
      dialogFormVisible:false,
      dialogText:"",
      formLabelWidth:"110px",
      permitLevelData:[],
      dialogForm:{
        mid:0,
        id:0,
        name:"",
        route:"",
      },
    }
  },
  computed: {
    ...mapGetters([
      'device'
    ]),
  },
  mounted(){
      const $this = this;
      this.$nextTick(function () {
        $this.tableHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-30-30-20-3;
        // 49: 分割线高度；30：page-root上下内边距；30：el-card__body上下内边距；20：按钮父级上下内边距；3：上下border
      });
      window.onresize = () => {
          return (() => {
            $this.tableHeight = $this.$refs.boxPane.offsetHeight-$this.$refs.headerPane.offsetHeight-30-30-20-3;
            // 49: 分割线高度；30：page-root上下内边距；30：el-card__body上下内边距；20：按钮父级上下内边距；3：上下border
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
    $this.initData();
  },
  updated(){
    this.$nextTick(() => {
      this.$refs.simpleTable.doLayout()
    })
  },
  methods:{
    // 刷新数据
    refreshData(){
      this.initPage();
    },
    // 初始化数据
    initData(){
      var $this = this;
      $this.getUserMenuButtonPermit();
    },
    // 初始化页面信息
    initPage(){
      var $this = this;
      $this.$store.dispatch('permit/permitListAction', null).then(response=>{
        if(response){
          if(response.status){
            if(response.data.length>0){
              var resData = []
              response.data.forEach(function(item,index){
                var itemData = {}
                itemData.id = item.id;
                itemData.uid = item.uid;
                itemData.name = item.name;
                itemData.route = item.route
                itemData.type = "菜单层";
                itemData.isPermit = false;
                resData.push(itemData);
                if(item.permit&&item.permit.length>0){
                  item.permit.forEach(function(item1,index1){
                    var itemChildren = {}
                    itemChildren.id = "p-"+item1.pid;
                    itemChildren.uid = item.id;
                    itemChildren.name = item1.pname;
                    itemChildren.route = item1.action_route;
                    itemChildren.type = "权限层";
                    itemChildren.isPermit = true;
                    resData.push(itemChildren);
                  });
                }
              });
              $this.tableData = $this.dataToTree(resData,$this);
              var selectData = [];
              $this.tableData.forEach(function(item,index){
                var itemData = {}
                if(!item.isPermit){
                  itemData.value = item.id;
                  itemData.label = item.name;
                  itemData.children = $this.selectData(item.children,$this);
                  selectData.push(itemData);
                }
              });
              $this.permitLevelData = selectData;
            }else{
              $this.tableData = [];
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
            }
          }
        }
      });
    },
    selectData(data,$this){
      var childrenData = [];
      data.forEach(function(item,index){
        var itemData = {};
        if(!item.isPermit){
          itemData.value = item.id;
          itemData.label = item.name;
          itemData.children = $this.selectData(item.children,$this);
          childrenData.push(itemData);
        }
      });
      return childrenData;
    },
    // 树形菜单
    dataToTree(data,$this){
        var parents = data.filter(function (item) {
            return item.uid == 0;
        });
        var children = data.filter(function (item) {
            return item.uid != 0;
        });
        $this.convert(parents, children,$this);
        return parents;
    },
    // 树形菜单转化
    convert(parents,children,$this){
      parents.forEach(function (item) {
        item.children = [];
        children.forEach(function (current, index) {
            if (current.uid === item.id) {
                var temp = JSON.parse(JSON.stringify(children)); // 将获得的子集json格式化
                temp.splice(index, 1); // 删除子集中已匹配项
                item.children.push(current);
                $this.convert([current], temp,$this); // 递归
            }
        });
      });
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
            if($this.menuButtonPermit.includes('Permit_index')){
              var operationsWidth = 22;
              if($this.menuButtonPermit.includes('Permit_edit')&&$this.menuButtonPermit.includes('Permit_delete')){
                operationsWidth+=132;
              }
              if(($this.menuButtonPermit.includes('Permit_delete')&&!$this.menuButtonPermit.includes('Permit_edit')&&$this.menuButtonPermit.includes('Permit_add'))||(!$this.menuButtonPermit.includes('Permit_delete')&&$this.menuButtonPermit.includes('Permit_edit')&&$this.menuButtonPermit.includes('Permit_add'))){
                operationsWidth+=90;
              }
              $this.operationsWidth = "" + operationsWidth;
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
    // 添加表格行数据
    addTableRow(row,index){
      this.dialogFormVisible = true;
      this.dialogText = "添加权限";
      this.resetFormData();
      if(row){
        this.dialogForm.mid = row.id;
      }
    },
    // 编辑表格行数据
    editTableRow(row,index){
      var $this = this;
      $this.dialogFormVisible = true;
      $this.dialogText = "编辑权限";
      console.log(row);
      $this.dialogForm.mid = row.uid;
      $this.dialogForm.id = row.id;
      $this.dialogForm.name = row.name;
      $this.dialogForm.route = row.route;
    },
    // 保存添加/编辑数据
    saveData(){
      var $this = this;
      if(!$this.validationForm()){
        return false;
      }
      var formData = {}
      formData.id = $this.dialogForm.id!=0?parseInt($this.dialogForm.id.split("-")[1]):0;
      formData.mid = Array.isArray($this.dialogForm.mid)?$this.dialogForm.mid.length == 0 ? 0 :$this.dialogForm.mid[$this.dialogForm.mid.length-1]:$this.dialogForm.mid;
      formData.name = $this.dialogForm.name;
      formData.action = $this.dialogForm.route;
      var pathUrl = "";
      if($this.dialogText=="编辑权限"){
        pathUrl = "permit/permitEditAction";
      }else{
        pathUrl = "permit/permitAddAction";
      }
      $this.$store.dispatch(pathUrl, formData).then(response=>{
          if(response.status){
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'success'
            });
            $this.dialogFormVisible = false;
            $this.initData();
          }else{
            $this.$message({
              showClose: true,
              message: response.info,
              type: 'error'
            });
          }
      });
    },
    // 重置添加数据表单
    resetFormData(){
      var $this = this;
      $this.dialogForm.mid = 0;
      $this.dialogForm.id = 0;
      $this.dialogForm.name = "";
      $this.dialogForm.route = "";
    },
    // 验证是否为空
    validationForm(){
      var $this = this;
      if($this.dialogForm.mid == ""){
        $this.$message({
            showClose: true,
            message: '错误：权限所属菜单不能为空！',
            type: 'error'
        });
        return false;
      }
      if($this.dialogForm.name == ""){
        $this.$message({
            showClose: true,
            message: '错误：权限名称不能为空！',
            type: 'error'
        });
        $this.$refs['name'].focus();
        return false;
      }
      if($this.dialogForm.route == ""){
        $this.$message({
            showClose: true,
            message: '错误：唯一标识名不能为空！',
            type: 'error'
        });
        $this.$refs['route'].focus();
        return false;
      }
      return true;
    },
    // 删除表格行
    deleteTableRow(row,index){
      var $this = this;
      $this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          $this.$store.dispatch('permit/permitDeleteAction', {id:parseInt(row.id.split("-")[1])}).then(response=>{
            if(response.status){
              $this.$message({
                showClose: true,
                message: response.info,
                type: 'success'
              });
              $this.initData();
            }else{
              $this.$message({
                showClose: true,
                message: response.info,
                type: 'error'
              });
            }
          });
      }).catch(() => {
          $this.$message({
            type: 'info',
            message: '已取消删除'
          });          
      });
    },
  }
}
</script>
<style lang="scss" scoped>
  .el-tabs{
    display: flex;
    height: 480px;
    overflow: hidden;
    flex-direction: column;
    .grid {
      position: relative;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    }

    .icon-item {
      margin: 10px;
      padding: 10px;
      border-radius: 4px;
      height: 105px;
      text-align: center;
      width: 100px;
      float: left;
      font-size: 30px;
      color: #24292e;
      cursor: pointer;
      &.is-active{
        background: #f2f2f2;
      }
    }

    span {
      display: block;
      font-size: 16px;
      margin-top: 10px;
    }

    .disabled {
      pointer-events: none;
    }
  }
  .el-cascader{
      width:100%;
  }
  .form-title{
    width: 110px;
    display: inline-block;
    text-align: right;
    vertical-align: middle;
    font-size: 14px;
    color: #606266;
    line-height: 36px;
    padding: 0 12px 0 0;
    box-sizing: border-box;
  }
  .item-form.icon{
    padding-right: 76px;
  }
  .item-form{
      padding-right: 30px;
      position: relative;
      .icon-button{
        width: 36px;
        height: 36px;
        position: absolute;
        top:0;
        right: 30px;
        border: 1px solid #C0C4CC;
        border-radius: 4px;
        text-align: center;
        line-height: 34px;
        font-size: 18px;
        color: #999;
        cursor: pointer;
      }
      >span{
        display: block;
        width: 30px;
        height: 36px;
        position: absolute;
        right:0;
        top:0;
        text-align: center;
        line-height: 36px;
        font-size: 14px;
        cursor: pointer;
        color: #bbb;
      }
      &:before,
      &:after {
        content: "";
        display: table;
      }
      &:after {
        clear: both;
      }
    }
  .item-form-group{
    width: 100%;
    &:before,
    &:after {
      content: "";
      display: table;
    }
    &:after {
      clear: both;
    }
    .item-form-3{
      width: 180px;
      float:left;
      padding-right: 30px;
      position: relative;
      &:before,
      &:after {
        content: "";
        display: table;
      }
      &:after {
        clear: both;
      }
      >span{
        display: block;
        width: 30px;
        height: 36px;
        position: absolute;
        right:0;
        top:0;
        text-align: center;
        line-height: 36px;
        font-size: 14px;
        cursor: pointer;
        color: #bbb;
      }
    }
    .item-form{
      width: 50%;
      float:left;
      }
  }
  .el-table{
    svg,i[class~="el-cion"]{
      font-size: 20px;
    }
  }
</style>
