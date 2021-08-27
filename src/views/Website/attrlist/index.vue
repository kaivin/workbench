<template>
  <div class="page-root" ref="boxPane">
    <el-card class="box-card" shadow="hover">
      <div class="card-content" ref="tableContent">
        <el-table
          ref="simpleTable"
          :data="tableData"
          tooltip-effect="dark"
          stripe
          class="SiteTable"
          style="width: 100%"
          :height="tableHeight"
          row-key="id"
          >
          <el-table-column
            prop="name"
            label="标签名称"
            min-width="200"
            >
            <template slot-scope="scope">
              <el-tag
                class="tag-font"
                :style="{background:scope.row.namecolor,borderColor:scope.row.namecolor,color:'#ffffff'}"
                v-if="scope.row.namecolor"
                disable-transitions>{{scope.row.name}}</el-tag>
                <span v-else>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="namecolor"
            align="center"
            label="背景色"
            width="80"
            >
            <template slot-scope="scope">
              <el-tag
                class="tag-color"
                :style="{background:scope.row.namecolor,borderColor:scope.row.namecolor}"
                v-if="scope.row.namecolor"
                disable-transitions></el-tag>
            </template>
          </el-table-column>
          <el-table-column
            v-if="(menuButtonPermit.includes('Website_attredit')||menuButtonPermit.includes('Website_attrdelete'))&&device==='desktop'"
            :width="operationsWidth"
            align="center"
            fixed="right"
            prop="operations"
            label="操作">
            <template #default="scope">
              <div class="table-button">
                <el-button size="mini" @click="editTableRow(scope.row,scope.$index)" v-if="menuButtonPermit.includes('Website_attredit')">编辑</el-button>
                <el-button size="mini" @click="deleteTableRow(scope.row,scope.$index)" v-if="menuButtonPermit.includes('Website_attrdelete')" type="info" plain>删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-dialog :title="dialogText" v-if="(menuButtonPermit.includes('Website_attradd')||menuButtonPermit.includes('Website_attredit'))&&device==='desktop'" custom-class="add-edit-dialog" :visible.sync="dialogFormVisible" :before-close="handleClose" width="480px">
      <el-form :model="dialogForm">
        <div class="item-form">
          <el-form-item label="标签名称：" :label-width="formLabelWidth">
            <el-input v-model="dialogForm.name" ref="name"></el-input>
          </el-form-item>
        </div>
        <div class="item-form" style="width:180px;">
            <el-form-item label="背景色：" :label-width="formLabelWidth">
              <el-color-picker
                v-model="dialogForm.namecolor"
                :predefine="predefineColors">
              </el-color-picker>
            </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="saveData">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>


<script>
import { mapGetters } from 'vuex'
export default {
  name: 'websiteArrtList',
  data() {
    return {
      menuButtonPermit:[],
      tableData:[],
      tableHeight:200,
      operationsWidth:"160",
      dialogFormVisible:false,
      dialogText:"",
      formLabelWidth:"110px",
      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
      ],
      dialogForm:{
        id:0,
        name:"",
        namecolor:'#17997f',
      },
    }
  },
  computed: {
    ...mapGetters([
      'device',
      'addWebsiteAttr'
    ]),
    isAdd() {
      return this.addWebsiteAttr
    }
  },
  mounted(){
      const $this = this;
      this.$nextTick(function () {
        $this.tableHeight = $this.$refs.boxPane.offsetHeight-30;
      });
      window.onresize = () => {
          return (() => {
            $this.tableHeight = $this.$refs.boxPane.offsetHeight-30;
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
      isAdd(e){
        if(e){
          this.addTableRow();
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
    // 初始化数据
    initData(){
      var $this = this;
      $this.getUserMenuButtonPermit();
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
            if(!$this.menuButtonPermit.includes('Website_attrlist')){
              $this.$message({
                showClose: true,
                message: "未被分配该页面的访问权限",
                type: 'error',
                duration:6000
              });
              $this.$router.push({path:`/401?redirect=${$this.$router.currentRoute.fullPath}`});
            }else{
              var operationsWidth = 22;
              if($this.menuButtonPermit.includes('Website_attredit')){
                operationsWidth+=66;
              }
              if($this.menuButtonPermit.includes('Website_attrdelete')){
                operationsWidth+=66;
              }
              $this.operationsWidth = "" + operationsWidth;
              $this.initPage();
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
    // 页面初始化
    initPage(){
      var $this = this;
      $this.$store.dispatch('website/websiteAttrListAction', null).then(response=>{
        if(response){
          if(response.status){
            console.log(response.data)
            if(response.data.length>0){
              $this.tableData = response.data;
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
    // 关闭添加电话弹窗
    handleClose(){
      var $this = this;
      $this.dialogFormVisible = false;
      $this.$store.dispatch('app/closeWebsiteAttr');
    },
    // 添加表格行数据
    addTableRow(row,index){
      this.dialogFormVisible = true;
      this.dialogText = "添加标签";
      this.resetFormData();
    },
    // 编辑表格行数据
    editTableRow(row,index){
      var $this = this;
      $this.dialogFormVisible = true;
      $this.dialogText = "编辑标签";
      $this.dialogForm.id = row.id;
      $this.dialogForm.name = row.name;
      $this.dialogForm.namecolor = row.namecolor;
    },
    // 保存添加/编辑数据
    saveData(){
      var $this = this;
      if(!$this.validationForm()){
        return false;
      }
      var formData = {}
      formData.id = $this.dialogForm.id;
      formData.name = $this.dialogForm.name;
      formData.namecolor = $this.dialogForm.namecolor;
      var pathUrl = "";
      if($this.dialogText=="编辑标签"){
        pathUrl = "website/websiteAttrEditAction";
      }else{
        pathUrl = "website/websiteAttrAddAction";
      }
      $this.$store.dispatch(pathUrl, formData).then(response=>{
          if(response.status){
              $this.$message({
                  showClose: true,
                  message: response.info,
                  type: 'success'
              });
              $this.handleClose();
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
      $this.dialogForm.id = 0;
      $this.dialogForm.name = "";
      $this.dialogForm.namecolor = "#17997f";
    },
    // 验证是否为空
    validationForm(){
      var $this = this;
      if($this.dialogForm.name == ""){
        $this.$message({
            showClose: true,
            message: '错误：标签名称不能为空！',
            type: 'error'
        });
        $this.$refs['name'].focus();
        return false;
      }
      if($this.dialogForm.namecolor == ""){
        $this.$message({
            showClose: true,
            message: '错误：背景色不能为空！',
            type: 'error'
        });
        $this.$refs['namecolor'].focus();
        return false;
      }
      return true;
    },
    // 删除表格行
    deleteTableRow(row,index){
      var $this = this;
      $this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          $this.$store.dispatch('website/websiteAttrDeleteAction', {id:row.id}).then(response=>{
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
</style>
