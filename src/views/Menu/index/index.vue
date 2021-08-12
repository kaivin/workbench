<template>
  <div ref="boxPane" class="page-root">
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
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" >
          <el-table-column
            prop="name"
            label="菜单名称"
            min-width="160"
            fixed="left" >
          </el-table-column>
          <el-table-column prop="route" label="唯一标识名" width="150">
          </el-table-column>
          <el-table-column prop="url" label="链接" min-width="160">
          </el-table-column>
          <el-table-column
            prop="redirecturl"
            label="重定向链接"
            min-width="160" >
          </el-table-column>
          <el-table-column prop="sort" label="排序" width="80">
          </el-table-column>
          <el-table-column align="center" prop="icon" label="图标" width="80">
            <template slot-scope="scope" v-if="scope.row.iconType != ''">
              <svg-icon v-if="scope.row.iconType == 'svg'" :icon-class="scope.row.icon" />
              <i v-else :class="scope.row.icon"></i>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="hide"
            label="是否隐藏"
            width="80" >
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.hide" disabled></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column
            v-if="isCaches"
            align="center"
            prop="is_fixed"
            label="是否固定"
            width="80" >
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.fixed" disabled></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column
            v-if="isCaches"
            align="center"
            prop="redis"
            label="是否缓存"
            width="80" >
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.redis" disabled></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column
            v-if="(menuButtonPermit.includes('Menu_add')||menuButtonPermit.includes('Menu_edit')||menuButtonPermit.includes('Menu_delete')) &&device === 'desktop'"
            :width="operationsWidth"
            align="center"
            fixed="right"
            prop="operations"
            label="操作" >
            <template #default="scope">
              <div class="table-button">
                <el-button size="mini" @click="addTableRow(scope.row, scope.$index)" v-if="menuButtonPermit.includes('Menu_add')">添加子菜单</el-button>
                <el-button size="mini" @click="editTableRow(scope.row, scope.$index)" v-if="menuButtonPermit.includes('Menu_edit')" >编辑</el-button>
                <el-button size="mini" @click="deleteTableRow(scope.row, scope.$index)" v-if="menuButtonPermit.includes('Menu_delete')" type="info" plain >删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-dialog :title="dialogText" v-if="(menuButtonPermit.includes('Menu_add')||menuButtonPermit.includes('Menu_edit')) &&device === 'desktop'" custom-class="add-edit-dialog" :visible.sync="dialogFormVisible" :before-close="handleClose" width="680px">
      <el-form :model="dialogForm">
        <div class="item-form-group">
          <div class="item-form">
            <el-form-item label="父级菜单：" :label-width="formLabelWidth" v-if="menuLevelData.length > 0">
              <el-cascader
                v-model="dialogForm.uid"
                :options="menuLevelData"
                ref="menuLevel"
                filterable
                placeholder="请选择父级菜单"
                :props="{ checkStrictly: true, expandTrigger: 'hover' }"
                clearable></el-cascader>
            </el-form-item>
          </div>
          <div class="item-form">
            <el-form-item label="菜单名称：" :label-width="formLabelWidth">
              <el-input v-model="dialogForm.name" ref="name"></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="item-form">
          <el-form-item label="唯一标识名：" :label-width="formLabelWidth">
            <el-input v-model="dialogForm.route" ref="route"></el-input>
          </el-form-item>
        </div>
        <div class="item-form">
          <el-form-item label="链接：" :label-width="formLabelWidth">
            <el-input v-model="dialogForm.url" ref="url"></el-input>
          </el-form-item>
        </div>
        <div class="item-form">
          <el-form-item label="重定向链接：" :label-width="formLabelWidth">
            <el-input v-model="dialogForm.redirecturl" ref="redirecturl"></el-input>
          </el-form-item>
        </div>
        <div class="item-form-group">
          <div class="item-form">
            <el-form-item label="排序：" :label-width="formLabelWidth">
              <el-input v-model="dialogForm.sort" ref="sort"></el-input>
            </el-form-item>
          </div>
          <div class="item-form icon">
            <el-form-item label="图标：" :label-width="formLabelWidth">
              <el-input v-model="dialogForm.icon" :disabled="true" clearable ref="icon"></el-input>
            </el-form-item>
            <div class="icon-button" v-on:click="chooseIcon()">
              <template v-if="dialogText == '编辑菜单'">
                <template v-if="dialogForm.icon && dialogForm.icon != ''">
                  <svg-icon v-if="dialogForm.icon.indexOf('el-icon-') == -1" :icon-class="dialogForm.icon" />
                  <i v-else :class="dialogForm.icon"></i>
                </template>
                <template v-else>
                  <i class="el-icon-plus"></i>
                </template>
              </template>
              <template v-else>
                <template v-if="dialogForm.icon == ''">
                  <i class="el-icon-plus"></i>
                </template>
                <template v-else>
                  <svg-icon v-if="selectedIcon.activeTabName == 'svg'" :icon-class="dialogForm.icon" />
                  <i v-else :class="dialogForm.icon"></i>
                </template>
              </template>
            </div>
          </div>
        </div>
        <div class="item-form-group">
          <div class="item-form-3">
            <el-form-item label="是否隐藏：" :label-width="formLabelWidth">
              <el-switch
                v-model="dialogForm.is_hide"
                active-color="#2e84f6"
                inactive-color="#bbbbbb"
                active-value="1"
                inactive-value="0">
              </el-switch>
            </el-form-item>
          </div>
          <div class="item-form-3" v-if="isCaches">
            <el-form-item label="是否固定：" :label-width="formLabelWidth">
              <el-switch
                v-model="dialogForm.is_fixed"
                active-color="#2e84f6"
                inactive-color="#bbbbbb"
                active-value="1"
                inactive-value="0"
                v-on:change="handleFixedChange">
              </el-switch>
            </el-form-item>
          </div>
          <div class="item-form-3" v-if="isCaches">
            <el-form-item label="是否缓存：" :label-width="formLabelWidth">
              <el-switch
                v-model="dialogForm.is_redis"
                active-color="#2e84f6"
                inactive-color="#bbbbbb"
                active-value="1"
                inactive-value="0"
                :disabled="redisDisabled">
              </el-switch>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="saveData">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog title="选择图标" v-if="(menuButtonPermit.includes('Menu_add')||menuButtonPermit.includes('Menu_edit'))&&device === 'desktop'" custom-class="icon-dialog" :visible.sync="dialogIconVisible" width="960px">
      <el-tabs v-model="activeTabName" type="border-card" @tab-click="handleTabClick">
        <el-tab-pane label="svg图标" name="svg">
          <div class="scroll-panel">
            <div class="grid">
              <div v-for="(item, index) of svgIcons" :key="item" @click="handleIconClick(item, index)">
                <el-tooltip placement="top">
                  <template v-slot:content>
                    <div>{{ generateIconCode(item) }}</div>
                  </template>
                  <div class="icon-item" v-bind:class="activeTabName == 'svg' && currentIndex == index?'is-active':''">
                    <svg-icon :icon-class="item" class-name="disabled" />
                    <span>{{ item }}</span>
                  </div>
                </el-tooltip>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="饿了么图标" name="element">
          <div class="scroll-panel">
            <div class="grid">
              <div v-for="(item, index) of elementIcons" :key="item" @click="handleIconClick(item, index)">
                <el-tooltip placement="top">
                  <template v-slot:content>
                    <div>{{ generateElementIconCode(item) }}</div>
                  </template>
                  <div class="icon-item" v-bind:class="activeTabName == 'element' && currentIndex == index?'is-active':''">
                    <i :class="'el-icon-' + item" />
                    <span>{{ item }}</span>
                  </div>
                </el-tooltip>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogIconVisible = false">取 消</el-button>
          <el-button @click="clearIcon">清空选择</el-button>
          <el-button type="primary" @click="handleSelectedIcon">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import svgIcons from "./svg-icons.js";
import elementIcons from "./element-icons.js";
import { mapGetters } from "vuex";
export default {
  name: "menuIndex",
  data() {
    return {
      menuButtonPermit: [],
      operationsWidth: "",
      tableData: [],
      tableHeight: 200,
      dialogFormVisible: false,
      dialogText: "",
      formLabelWidth: "110px",
      menuLevelData: [],
      redisDisabled: false,
      isCaches:false,
      dialogForm: {
        uid: 0,
        id: 0,
        name: "",
        route: "",
        url: "",
        redirecturl: "",
        sort: 0,
        icon: "",
        is_hide: "0",
        is_fixed: "0",
        is_redis: "0",
      },
      dialogIconVisible: false,
      svgIcons,
      elementIcons,
      activeTabName: "svg",
      currentIndex: "",
      currentItem: "",
      selectedIcon: {
        activeTabName: "",
        currentIndex: "",
        currentItem: "",
      },
    };
  },
  computed: {
    ...mapGetters([
      "device",
      'addMenu'
    ]),
    isAdd() {
      return this.addMenu
    }
  },
  mounted() {
    const $this = this;
    this.$nextTick(function () {
      $this.tableHeight = $this.$refs.boxPane.offsetHeight-40;
    });
    window.onresize = () => {
      return (() => {
        $this.tableHeight = $this.$refs.boxPane.offsetHeight-40;
      })();
    };
  },
  watch: {
    tableHeight(val) {
      if (!this.timer) {
        this.tableHeight = val;
        this.timer = true;
        const $this = this;
        setTimeout(function () {
          $this.timer = false;
        }, 400);
      }
    },
    isAdd(e){
      if(e){
        this.addTableRow();
      }
    },
  },
  created() {
    var $this = this;
    $this.initData();
  },
  updated() {
    this.$nextTick(() => {
      this.$refs.simpleTable.doLayout();
    });
  },
  methods: {
    generateIconCode(symbol) {
      return `<svg-icon icon-class="${symbol}" />`;
    },
    generateElementIconCode(symbol) {
      return `<i class="el-icon-${symbol}" />`;
    },
    // 初始化数据
    initData() {
      var $this = this;
      $this.getUserMenuButtonPermit();
    },
    // 初始化页面信息
    initPage(){
      var $this = this;
      $this.$store.dispatch("menu/menuListAction", null).then((response) => {
        if (response) {
          if (response.status) {
            if (response.data.length > 0) {
              $this.tableData = $this.dataToTree(response.data, $this);
              var selectData = [];
              $this.tableData.forEach(function (item, index) {
                var itemData = {};
                itemData.value = item.id;
                itemData.label = item.name;
                itemData.disabled = false;
                itemData.children = $this.selectData(item.children, $this);
                selectData.push(itemData);
              });
              $this.menuLevelData = selectData;
            } else {
              $this.tableData = [];
            }
          } else {
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
    selectData(data, $this) {
      var childrenData = [];
      data.forEach(function (item, index) {
        var itemData = {};
        itemData.value = item.id;
        itemData.label = item.name;
        itemData.children = $this.selectData(item.children, $this);
        childrenData.push(itemData);
      });
      return childrenData;
    },
    // 树形菜单
    dataToTree(data, $this) {
      var parents = data.filter(function (item) {
        return item.uid == 0;
      });
      var children = data.filter(function (item) {
        return item.uid != 0;
      });
      $this.convert(parents, children, $this);
      return parents;
    },
    // 树形菜单转化
    convert(parents, children, $this) {
      parents.forEach(function (item) {
        item.fixed = item.is_fixed == "1" ? true : false;
        item.hide = item.is_hide == "1" ? true : false;
        item.redis = item.is_redis == "1" ? true : false;
        if (item.icon) {
          item.iconType =
            item.icon.indexOf("el-icon-") == -1 ? "svg" : "element";
        } else {
          item.iconType = "";
        }
        item.children = [];
        children.forEach(function (current, index) {
          if (current.uid === item.id) {
            var temp = JSON.parse(JSON.stringify(children)); // 将获得的子集json格式化
            temp.splice(index, 1); // 删除子集中已匹配项
            item.children.push(current);
            $this.convert([current], temp, $this); // 递归
          }
        });
      });
    },
    // 获取当前登陆用户在该页面的操作权限
    getUserMenuButtonPermit() {
      var $this = this;
      $this.$store
        .dispatch("api/getMenuButtonPermitAction", {
          id: $this.$router.currentRoute.meta.id,
        })
        .then((res) => {
          console.log(res);
          if (res.status) {
            if (res.data.length > 0) {
              res.data.forEach(function (item, index) {
                $this.menuButtonPermit.push(item.action_route);
              });
              if($this.menuButtonPermit.includes('Menu_index')){
                var operationsWidth = 22;
                if($this.menuButtonPermit.includes('Menu_add')){
                  operationsWidth+=102;
                }
                if($this.menuButtonPermit.includes('Menu_edit')){
                  operationsWidth+=66;
                }
                if($this.menuButtonPermit.includes('Menu_delete')){
                  operationsWidth+=66;
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
          } else {
            $this.$message({
              showClose: true,
              message: response.info,
              type: "error",
            });
          }
        });
    },
    // 关闭添加菜单弹窗
    handleClose(){
      var $this = this;
      $this.dialogFormVisible = false;
      $this.$store.dispatch('app/closeMenu');
    },
    // 添加表格行数据
    addTableRow(row, index) {
      this.dialogFormVisible = true;
      this.dialogText = "添加菜单";
      this.resetFormData();
      if (row) {
        this.dialogForm.uid = row.id;
      }
    },
    // 编辑表格行数据
    editTableRow(row, index) {
      var $this = this;
      $this.dialogFormVisible = true;
      $this.dialogText = "编辑菜单";
      var menuLevelData = $this.menuLevelData;
      menuLevelData.forEach(function (item, index) {
        item.disabled = false;
        if (item.children.length > 0) {
          $this.resetDisabledMenu(item.children, $this);
        }
      });
      menuLevelData.forEach(function (item, index) {
        if (row.uid == 0) {
          if (item.value == row.id) {
            item.disabled = true;
            if (item.children.length > 0) {
              $this.disabledMenu(item.children, $this);
            }
          }
        } else {
          if (item.children.length > 0) {
            $this.disabledSonMenu(item.children, row.id, row.uid, $this);
          }
        }
      });
      $this.menuLevelData = menuLevelData;
      $this.dialogForm.uid = row.uid;
      $this.dialogForm.id = row.id;
      $this.dialogForm.name = row.name;
      $this.dialogForm.route = row.route;
      $this.dialogForm.url = row.url;
      $this.dialogForm.redirecturl = row.redirecturl;
      $this.dialogForm.sort = row.sort;
      $this.dialogForm.icon = row.icon;
      $this.dialogForm.is_hide = "" + row.is_hide;
      $this.dialogForm.is_fixed = "" + row.is_fixed;
      $this.dialogForm.is_redis = "" + row.is_redis;
    },
    // 初始化部门下拉框的禁用状态
    resetDisabledMenu(data, $this) {
      data.forEach(function (item, index) {
        item.disabled = false;
        if (item.children.length > 0) {
          $this.resetDisabledMenu(item.children, $this);
        }
      });
    },
    // 部门编辑禁用设置
    disabledMenu(data, $this) {
      data.forEach(function (item, index) {
        item.disabled = true;
        if (item.children.length > 0) {
          $this.disabledMenu(item.children, $this);
        }
      });
    },
    // 部门编辑禁用设置
    disabledSonMenu(data, id, uid, $this) {
      data.forEach(function (item, index) {
        if (item.value == uid) {
          item.disabled = true;
          if (item.children.length > 0) {
            $this.disabledSonMenu(item.children, id, uid, $this);
          }
        }
        if (item.value == id) {
          item.disabled = true;
          if (item.children.length > 0) {
            $this.disabledMenu(item.children, $this);
          }
        }
      });
    },
    // 保存添加/编辑数据
    saveData() {
      var $this = this;
      if (!$this.validationForm()) {
        return false;
      }
      var formData = $this.dialogForm;
      if (formData.uid) {
        formData.uid = Array.isArray(formData.uid)
          ? formData.uid.length == 0 ? 0 :formData.uid[formData.uid.length - 1]
          : formData.uid;
      } else {
        formData.uid = 0;
      }
      var pathUrl = "";
      if ($this.dialogText == "编辑菜单") {
        pathUrl = "menu/menuEditAction";
      } else {
        pathUrl = "menu/menuAddAction";
      }
      $this.$store.dispatch(pathUrl, formData).then((response) => {
        if (response.status) {
          $this.$message({
            showClose: true,
            message: response.info,
            type: "success",
          });
          $this.handleClose();
          $this.initPage();
        } else {
          $this.$message({
            showClose: true,
            message: response.info,
            type: "error",
          });
        }
      });
    },
    // 重置添加数据表单
    resetFormData() {
      var $this = this;
      $this.dialogForm.uid = 0;
      $this.dialogForm.id = 0;
      $this.dialogForm.name = "";
      $this.dialogForm.route = "";
      $this.dialogForm.url = "";
      $this.dialogForm.redirecturl = "";
      $this.dialogForm.sort = "";
      $this.dialogForm.icon = "";
      $this.dialogForm.is_hide = "0";
      $this.dialogForm.is_fixed = "0";
      $this.dialogForm.is_redis = "0";
      $this.selectedIcon.activeTabName = "";
      $this.selectedIcon.currentIndex = "";
      $this.selectedIcon.currentItem = "";
      $this.activeTabName = "svg";
      $this.currentIndex = "";
      $this.currentItem = "";
    },
    // 验证是否为空
    validationForm() {
      var $this = this;
      if ($this.dialogForm.name == "") {
        $this.$message({
          showClose: true,
          message: "错误：菜单名称不能为空！",
          type: "error",
        });
        $this.$refs["name"].focus();
        return false;
      }
      if ($this.dialogForm.uid == 0 && $this.dialogForm.icon == "") {
        $this.$message({
          showClose: true,
          message: "错误：根节点菜单必须设置图标！",
          type: "error",
        });
        return false;
      }
      return true;
    },
    // 删除表格行
    deleteTableRow(row, index) {
      var $this = this;
      $this.$store
        .dispatch("menu/menuDeleteAction", { id: row.id })
        .then((response) => {
          if (response.status) {
            $this.$message({
              showClose: true,
              message: response.info,
              type: "success",
            });
            $this.initData();
          } else {
            $this.$message({
              showClose: true,
              message: response.info,
              type: "error",
            });
          }
        });
    },
    // 清空图标选择
    clearIcon() {
      var $this = this;
      $this.currentIndex = "";
      $this.currentItem = "";
      $this.dialogForm.icon = "";
      this.dialogIconVisible = false;
    },
    // 选择图标打开弹窗
    chooseIcon() {
      this.dialogIconVisible = true;
      if (this.selectedIcon.activeTabName != "") {
        $this.activeTabName = $this.selectedIcon.activeTabName;
        $this.currentIndex = $this.selectedIcon.currentIndex;
        $this.currentItem = $this.selectedIcon.currentItem;
      }
    },
    // 确认选择图标事件
    handleSelectedIcon() {
      var $this = this;
      $this.selectedIcon.activeTabName = $this.activeTabName;
      $this.selectedIcon.currentIndex = $this.currentIndex;
      $this.selectedIcon.currentItem = $this.currentItem;
      $this.activeTabName = "svg";
      $this.currentIndex = "";
      $this.currentItem = "";
      if ($this.selectedIcon.activeTabName == "svg") {
        $this.dialogForm.icon = $this.selectedIcon.currentItem;
      } else {
        $this.dialogForm.icon = "el-icon-" + $this.selectedIcon.currentItem;
      }
      this.dialogIconVisible = false;
    },
    // 图标选项卡点击事件
    handleTabClick(tab, event) {
      var $this = this;
      $this.currentIndex = "";
      $this.currentItem = "";
    },
    // 选中图标点击事件
    handleIconClick(item, index) {
      var $this = this;
      $this.currentIndex = index;
      $this.currentItem = item;
    },
    // 是否固定开关点击事件
    handleFixedChange(e) {
      var $this = this;
      if (e == "1") {
        $this.dialogForm.is_redis = "1";
        $this.redisDisabled = true;
      } else {
        $this.redisDisabled = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
