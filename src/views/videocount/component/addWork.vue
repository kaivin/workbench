<template>
	<el-dialog :title="dialogTitle" :visible.sync="isDialogShow" :before-close="handleClose" width="1200px">
        <div class="form_box">
            <el-form ref="ruleForm" :model="form" label-width="50px">
                <el-form-item label="日期" prop="date">
                    <el-date-picker
                        v-model="form.record_time"
                        type="date"
                        placeholder="选择日期"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerOptions">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="岗位" prop="post_id" v-if="postList.length > 0">
                    <el-radio-group v-model="form.post_id">
                        <el-radio v-for="item in postList" :key="item.value" :label="item.value">{{item.label}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="内容" prop="data">
                    <sc-form-table ref="table" v-model="form.data" :addTemplate="addTemplate" :hideAdd="addDisabled" :hideDelete="addDisabled" @updateValue="updateDataValue" placeholder="暂无数据">
                        <el-table-column prop="type_id" label="类型" align="center"  width="200">
                            <template #default="scope">
                                <el-select v-model="scope.row.type_id" placeholder="请选择">
                                    <el-option v-for="item in typeList" :disabled="item.disabled" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column prop="number" align="center" label="个数" width="180">
                            <template #default="scope">
                                <el-input-number v-model="scope.row.number" :min="0" ></el-input-number>
                            </template>
                        </el-table-column>
                        <el-table-column prop="invalid_number" align="center" label="未通过审核个数" width="180">
                            <template #default="scope">
                                <el-input-number v-model="scope.row.invalid_number" :min="0" :max="Number(scope.row.number)"></el-input-number>
                            </template>
                        </el-table-column>
                        <el-table-column prop="remark" label="备注" align="center" >
                            <template #default="scope">
                                <el-input v-model="scope.row.remark" placeholder="请输入内容"></el-input>
                            </template>
                        </el-table-column>
                    </sc-form-table>
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
import scFormTable from './scTable';
import {parseTime}  from "@/utils";
export default {
    name: 'addWork',
    components: {
        scFormTable
    },
    data(){
        return {
            isDialogShow: false,
            isSaveData: false,
            addTemplate: {
                type_id: '',
                number: 1,
                remark: '',
                invalid_number: 0
            },
            form: {
                uid: "",
                id: "",
                record_time: "",
                data: [],
                post_id: '',
            },
            editType: "",
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                },
                shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                    picker.$emit('pick', new Date());
                    }
                }, {
                    text: '昨天',
                    onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() - 3600 * 1000 * 24);
                    picker.$emit('pick', date);
                    }
                }, {
                    text: '一周前',
                    onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', date);
                    }
                }]
            },
            typeList: [],
            postList: [],
            isGetPost: false,
            isGetType: false,
            addDisabled: false,
            dialogTitle: "",
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
            $this.editType = v.type;
            // 设置标题
            if(v.type == "add"){
                $this.dialogTitle = "添加工作汇报";
            }else if(v.type == "edit"){
                $this.dialogTitle = "编辑工作汇报";
            }
            // 请求数据
            if(!$this.isGetType){
                if(v.type == "edit"){
                    $this.getTypeList(v.data.data);
                }else{
                    $this.getTypeList();
                }
            }else{
                if(v.type == "edit"){
                    $this.form.data.push(v.data.data);
                }else{
                    $this.form.data.push({
                        type_id: '',
                        number: 1,
                        remark: '',
                        invalid_number: 0
                    })
                }
            }
            if(!$this.isGetPost){
                $this.getPostList();
            }else{
                if(v.type == 'add'){
                    if($this.postList.length > 0){
                        $this.form.post_id = $this.postList[0].value;
                    }
                }
            }
            // 绑定数据
            if(v.type == 'edit'){
                $this.form.uid = v.data.uid;
                $this.form.id = v.data.id;
                $this.form.record_time = v.data.record_time;
                $this.form.post_id = v.data.post_id;
                $this.addDisabled = true;
            }else{
                var nowDay = parseTime(new Date(),'{y}-{m}-{d}');
                $this.form.record_time = nowDay;
                $this.form.uid = $this.userInfo.id;
                $this.addDisabled = false;
            }
            $this.isDialogShow = true;
        },
        submitForm(){
            var $this = this;
            if(!$this.checkForm()){
                return false;
            }
            const loading = this.$loading({
                lock: true,
                text: '保存中',
                spinner: 'el-icon-loading',
                background: 'rgba(255, 255, 255, 0.7)'
            });
            $this.isSaveData = true;
            var formData = {};
            formData.uid = $this.form.uid;
            formData.record_time = $this.form.record_time;
            formData.data = $this.form.data;
            formData.post_id = $this.form.post_id;
            if($this.editType == 'edit'){
                formData.data[0].id = $this.form.id;
            }
            $this.$store.dispatch('videocount/saveRecordData',formData).then(res=>{
                if(res.code == 200){
                    $this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'success'
                    });
                    $this.$emit("saveSuccess");
                    loading.close();
                    $this.resetForm();
                    $this.isDialogShow = false;
                    $this.isSaveData = false;
                }else{
                    $this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'error'
                    });
                }
            });
        },
        resetForm(){
            var $this = this;
            $this.form.uid = "";
            $this.form.id = "";
            $this.form.record_time = "";
            $this.form.data.splice(0, $this.form.data.length);
            $this.form.post_id = "";
            $this.typeList.forEach(item => {
                item.disabled = false;
            })
        },
        checkForm(){
            var $this = this;
            if(!$this.form.record_time){
                $this.$message({
                    showClose: true,
                    message: "请选择日期",
                    type: 'error'
                });
                return false
            }
            if($this.form.data.length == 0){
                $this.$message({
                    showClose: true,
                    message: "请填写工作内容",
                    type: 'error'
                });
                return false
            }else{
                var isTypeEmpty = false;
                var isNumberEmpty =  false;
                var isWrongData = false;
                $this.form.data.forEach(item => {
                    if(item.type_id == '' ){
                        isTypeEmpty = true;
                    }
                    if(!item.number){
                        isNumberEmpty = true;
                    }
                    if(item.number && item.invalid_number && item.invalid_number > item.number){
                        isWrongData = true;
                    }
                })
                if(isTypeEmpty){
                    $this.$message({
                        showClose: true,
                        message: "请将工作类型补充完整",
                        type: 'error'
                    });
                    return false
                }
                if(isNumberEmpty){
                    $this.$message({
                        showClose: true,
                        message: "请将工作数量补充完整",
                        type: 'error'
                    });
                    return false
                }
                if(isWrongData){
                    $this.$message({
                        showClose: true,
                        message: "请核对工作数量与未通过审核数量",
                        type: 'error'
                    });
                    return false
                }
            }
            return true;
        },
        handleClose(){
            var $this = this;
            $this.resetForm();
            $this.isDialogShow = false;
        },
        updateDataValue(value){
            var $this = this;
            $this.form.data = value;
            var ids = [];
            if(value && value.length > 0){
                value.forEach(item => {
                    if(item.type_id){
                        ids.push(item.type_id);
                    }
                })
            }
            if(ids.length > 0){
                $this.typeList.forEach(item => {
                    if(ids.includes(item.value)){
                        item.disabled = true;
                    }else{
                            item.disabled = false;
                    }
                })
            }
        },
		// 获取工作类型
		getTypeList(data){
			var $this = this;
			var formData = {};
			formData.type = "manual";
			$this.$store.dispatch('videocount/getVideoTypeData',formData).then(res=>{
				if(res.code == 200){
					var resData = [];
					if(res.data && res.data.length > 0){
						res.data.forEach(item => {
							var obj = {};
							obj.label = item.name;
							obj.value = item.id;
							obj.disabled = false;
							resData.push(obj);
						})
					}
					$this.typeList = resData;
                    $this.isGetType = true;
                    if(data){
                        $this.form.data.push(data);
                    }else{
                        $this.form.data.push({
                            type_id: '',
                            number: 1,
                            remark: '',
                            invalid_number: 0
                        })
                    }
				}else{
					$this.$message({
						showClose: true,
						message: res.msg,
						type: 'error'
					});
				}
			});
		},
        // 获取岗位
		getPostList(){
			var $this = this;
			$this.$store.dispatch('videocount/getVideoPostData',null).then(res=>{
				if(res.code == 200){
                    var resData = [];
                    if(res.data && res.data.length > 0){
                        res.data.forEach(item => {
                            var obj = {};
                            obj.label = item.name;
                            obj.value = item.id;
                            obj.disabled = false;
                            resData.push(obj);
                        })
                    }
                    $this.postList = resData;
                    $this.form.post_id = resData.length > 0 ? resData[0].value : "";
                    $this.isGetPost = true;
				}else{
                    // $this.$message({
                    //     showClose: true,
                    //     message: res.msg,
                    //     type: 'error'
                    // });
                    $this.isSaveData = true;
                }
			});
		},
    }
}
</script>
<style lang="scss" scoped>
	.el-input-number{
		width: 158px;
	}
    .form_box{
        padding-right: 10px;
    }
</style>
<style lang="scss">
  .el-table{
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
  }
  .el-table--border::after{
    width: 0;
  }
</style>