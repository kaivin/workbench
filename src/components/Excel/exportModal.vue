<template>
  <el-dialog :visible.sync="visible" custom-class="export-excel-dialog" width="720px" title="导出数据" append-to-body destroy-on-close :before-close="handleCloseDialog">
    <div class="export-modal__body">
      <el-form>
        <div class="el-form-group">
          <el-form-item label="文件名称" prop="filename">
            <el-input v-model="exportInfo.filename" clearable placeholder="默认文件名：excel-list.xlsx" />
          </el-form-item>
          <el-form-item label="文件类型">
            <el-select v-model="exportInfo.fileType" placeholder="">
              <el-option label="xlsx(*.xlsx)" value="xlsx" />
              <el-option label="csv(*.csv)" value="csv" />
              <el-option label="网页(*.html)" value="html" />
              <el-option label="xml数据(*.xml)" value="xml" />
              <el-option label="文本文件(*.txt)" value="txt" />
            </el-select>
          </el-form-item>
        </div>
        <div class="el-form-group">
          <el-form-item label="选择数据">
            <el-select v-model="exportInfo.dataScope" placeholder="">
              <el-option label="当前页数据" :value="1" :disabled="!hasData" />
              <el-option label="选中的数据" :value="2" :disabled="!hasSelected" />
              <el-option label="全量后台数据" :value="3" />
            </el-select>
          </el-form-item>
          <el-form-item label="表头选择">
            <el-radio-group class="radio-button" v-model="exportInfo.headerType">
              <el-radio-button label="default">默认</el-radio-button>
              <el-radio-button label="custom">自定义</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="el-form-group">
          <el-form-item label="字段选择">
            <div class="field-list flex-1 m-6px">
              <div class="all-field">
                <el-checkbox v-model="checkAllField" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全部字段</el-checkbox>
              </div>
              <el-checkbox-group v-model="checkedFields" @change="handleCheckedFieldsChange">
                <el-scrollbar>
                  <draggable v-model="fieldList" animation="300" handle=".move">
                      <div v-for="(item, index) in fieldList" :key="index" class="item-field">
                        <span class="move"><i class="el-icon-rank"></i></span>
                        <el-checkbox :label="item.key">{{item.value}}</el-checkbox>
                      </div>
                  </draggable>
                </el-scrollbar>
              </el-checkbox-group>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <template #footer>
      <span class="modal-footer" ref="modalFooter">
        <el-button @click="handleCloseDialog">取消</el-button>
        <el-button type="primary" @click="handleOk">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
import draggable from 'vuedraggable'
import { DEF_FILE_NAME } from './Export2Excel'
export default {
  name: 'ExportModal',
  components: {
    draggable
  },
  data() {
    return {
      visible: false,
      checkAllField: false,
      isIndeterminate: false,
      checkedFields: [],
      fieldList: [],
      hasData: false,
      hasSelected: false,
      exportInfo: {
        filename: '',
        fileType: 'xlsx',
        dataScope: 3,
        headerType: 'custom'
      }
    }
  },
  methods: {
    showDialog(v) {
      this.visible = true
      this.fieldList = v.fieldList
      this.hasData = v.hasData
      this.hasSelected = v.hasSelected
    },
    handleCloseDialog() {
      this.visible = false
    },
    handleOk() {
      if(this.checkedFields.length == 0) {
        this.$message({
          showClose: true,
          message: "请选择要导出的字段",
          type: 'error'
        });
        return false
      }
      const sortArr = []
      const headerObj = {}
      this.fieldList.forEach((item) => {
        if (this.checkedFields.includes(item.key)) {
          sortArr.push(item.key)
          headerObj[item.key] = item.value
        }
      })
      this.$emit('exportSuccess', {
              filename: `${this.exportInfo.filename === '' ? DEF_FILE_NAME.split('.')[0] : this.exportInfo.filename}.${this.exportInfo.fileType}`,
              fileType: this.exportInfo.fileType,
              dataScope: this.exportInfo.dataScope,
              header: headerObj,
              sort: sortArr,
              headerType: this.exportInfo.headerType
            })
      this.handleCloseDialog()
    },
    handleCheckAllChange(val) {
      this.checkedFields = []
      this.fieldList.forEach((item) => {
        if (val) {
          this.checkedFields.push(item.key)
        }
      })
      this.isIndeterminate = false
      console.log(this.checkedFields)
    },
    handleCheckedFieldsChange(value) {
      const checkedCount = value.length
      this.checkAllField = checkedCount === this.fieldList.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.fieldList.length
      console.log(this.checkedFields)
    }
  }
}
</script>

<style scoped lang="scss">
.modal-header{
  display: flex;
  margin: -15px -20px;
  padding: 15px 20px;

  .header-title{
    flex: 1;
    height: 24px;
    line-height: 24px;
  }

  .el-button{
    margin-left: 0;
    background: none!important;
    border: none!important;

    &:hover,&:focus{
      background: none;
    }
  }
}

.modal-footer{
  display: inline-flex;
  overflow: hidden;
}

.el-form-group{
  display: flex;
  flex: 1;

  .el-form-item{
    flex: 1;
    margin: 0;
    display: flex;

    ::v-deep(.el-form-item__label) {
      float: none;
      margin: 6px;
      padding-right: 0;
    }

    ::v-deep(.el-form-item__content) {
      flex: 1;
      margin: 6px;
    }
  }

  .el-form-item+.el-form-item{
    margin: 0;
  }
}

.el-select{
  display: flex;
}

.field-list{
  flex: 1;
  border: 1px solid #ebeef5;

  .all-field{
    padding-left: 36px;
    background: #f5f7fa;
    border-bottom: 1px solid #ebeef5;
  }

  .el-checkbox-group{
    padding: 0;
  }

  .item-field{
    display: flex;
    align-items: center;

    .move{
      padding: 0 10px;
      font-size: 14px;
      cursor: move;

      .el-icon{
        color: #909399;
      }
    }
  }
}

.el-scrollbar{
  height: 320px;
}
</style>
<style lang="scss">
.export-excel-dialog{
  .el-dialog__header{
    padding: 15px 20px;
  }
  .el-dialog__body {
    padding: 0;
    border-top: 1px solid #ebeef5;
    border-bottom: 1px solid #ebeef5;
  }
  .el-dialog__footer{
    padding: 15px 20px;
  }

.export-modal__body{
  overflow: hidden;
  padding: 14px;

  .el-scrollbar__view {
    padding: 0 2px;
  }
}
}
</style>
