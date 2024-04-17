<template>
	<el-dialog title="导入数据" :visible.sync="isDialogShow" :before-close="handleClose" width="500px">
        <div class="form_box">
            <el-form label-width="50px">
                <el-form-item label="类型">
                    <el-select v-model="importData.type" placeholder="请选择日期" clearable>
                        <el-option v-for="item in importList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="文件">
                    <div class="upload_file">
                        <i v-if="importData.file" class="el-icon-folder-checked avatar-uploader-icon"></i>
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        <input class="file_input" ref="fileinput" type="file" accept=".xlsx, .xls" @change="domainFileUp"/>
                    </div>
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
            <span class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" :class="isSaveData?'isDisabled':''" :disabled="isSaveData" @click="submitForm">保 存</el-button>
            </span>
        </template>
	</el-dialog>
</template>

<script>
    import { mapGetters } from 'vuex';
	export default {
		name: 'ImportData',
		data(){
			return {
                isDialogShow: false,
                isSaveData: false,
                importData: {
                    type: "",
                    file: ""
                },
                importList: [
                    {label: "搜索词", value: "1"},
                    {label: "广告", value: "3"},
                    {label: "网址", value: "4"},
                ],
			}
		},
        computed: {
            ...mapGetters([
                'sidebar',
                'menuData',
                'userInfo',
            ]),
        },
		methods: {
            showDialog(v) {
                var $this = this;
                $this.isDialogShow = true;
            },
            //数据导入
            domainFileUp(e){
                var $this = this;
                let filedata = e.target.files[0];
                $this.importData.file = filedata;
            },
			submitForm(){
				var $this = this;
                if(!$this.checkForm()){
                    return false;
                }
                var formData = new FormData();
                formData.append('filename',$this.importData.file);
                formData.append("type", $this.importData.type);
                $this.$store.dispatch('depfive/depfiveExportAction', formData).then(res=>{
                    $this.$message({
                        showClose: true,
                        message: res.info,
                        type: res.status?'success':'error',
                    });
                    if(res.status){
                        $this.handleClose();
                        $this.$emit("saveSuccess");
                    }
                })
			},
            checkForm(){
                var $this = this;
                if($this.importData.type == ""){
                    $this.$message({
                        showClose: true,
                        message: '请选择文件的类型！',
                        type: 'error'
                    });
                    return false;
                }
                if($this.importData.file == ""){
                    $this.$message({
                        showClose: true,
                        message: '请选择要上传的文件！',
                        type: 'error'
                    });
                    return false;
                }
                return true;
            },
			resetForm(){
				var $this = this;
                $this.importData.type = "";
                $this.importData.file = "";
                $this.$refs.fileinput.value = "";
			},
            handleClose(){
                var $this = this;
                $this.resetForm();
                $this.isDialogShow = false;
            },
		}
	}
</script>
<style lang="scss" scoped>
    .form_box{
        padding-right: 10px;
    }
    .el-select{
        width: 100%;
    }
    .upload_file{
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        display: inline-block;
        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 128px;
            height: 128px;
            line-height: 128px;
            text-align: center;
        }
        .el-icon-folder-checked{
            color:#0970ff;
        }
        .file_input{
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            z-index:3;
            opacity: 0;
            cursor: pointer;
        }
        }
</style>