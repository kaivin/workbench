<template>
	<el-dialog :visible.sync="isDialogShow" :before-close="handleClose" width="1000px">
        <el-form ref="ruleForm" :model="form" label-width="60px">
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
            <el-form-item label="岗位" prop="post_id">
                <el-radio-group v-model="form.post_id">
                    <el-radio v-for="item in postList" :key="item.value" :label="item.value">{{item.label}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="内容" prop="data">
                <sc-form-table ref="table" v-model="form.data" :addTemplate="addTemplate" @updateValue="updateDataValue" placeholder="暂无数据">
                    <el-table-column prop="type_id" label="类型" align="center"  width="200">
                        <template #default="scope">
                            <el-select v-model="scope.row.type_id" placeholder="请选择">
                                <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="number" align="center" label="个数" width="180">
                        <template #default="scope">
                            <el-input-number v-model="scope.row.number" :min="0"></el-input-number>
                        </template>
                    </el-table-column>
                    <el-table-column prop="remark" label="备注" align="center" >
                        <template #default="scope">
                            <el-input v-model="scope.row.remark" placeholder="请输入内容"></el-input>
                        </template>
                    </el-table-column>
                </sc-form-table>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm">保存</el-button>
                <el-button @click="resetForm">重置</el-button>
            </el-form-item>
        </el-form>
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
            addTemplate: {
                type_id: '',
                number: '',
                remark: ''
            },
            form: {
                uid: "",
                id: "",
                record_time: "",
                data: [{
                    type_id: '',
                    number: '',
                    remark: '' 
                }],
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
            $this.typeList = v.typeList;
            $this.postList = v.postList;
            $this.editType = v.type;
            $this.form.uid = $this.userInfo.id;
            var nowDay = parseTime(new Date(),'{y}-{m}-{d}');
            $this.form.record_time = nowDay;
            if(v.type == 'edit'){
                $this.form.uid = v.data.uid;
                $this.form.id = v.data.id;
                $this.form.record_time = v.data.record_time;
                $this.form.data = v.data.data;
                $this.form.post_id = v.data.post_id;
            }
        },
        submitForm(){
            var $this = this;
            $this.checkForm();
            var formData = {};
            formData.uid = $this.form.uid;
            formData.record_time = $this.form.record_time;
            formData.data = $this.form.data;
            formData.post_id = $this.form.post_id;
            if($this.editType == 'edit'){
                formData.id = $this.form.id;
            }
            console.log(formData)
            // $this.$store.dispatch('videocount/saveRecordData',formData).then(res=>{
            //     if(res.code == 200){
            //         $this.$message({
            //             showClose: true,
            //             message: res.msg,
            //             type: 'success'
            //         });
            //         $this.$emit("saveSuccess");
            //         $this.isDialogShow = false;
            //     }else{
            //         $this.$message({
            //             showClose: true,
            //             message: res.msg,
            //             type: 'error'
            //         });
            //     }
            // });
        },
        resetForm(){
            var $this = this;
            $this.form.uid = "";
            $this.form.id = "";
            $this.form.record_time = "";
            $this.form.data = [];
            $this.form.post_id = "";
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
                $this.form.data.forEach(item => {
                    if(item.type_id == '' ){
                        isTypeEmpty = true;
                    }
                    if(!item.number){
                        isNumberEmpty = true;
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
            }
        },
        handleClose(){
            var $this = this;
            $this.resetForm();
            $this.isDialogShow = false;
        },
        updateDataValue(value){
            var $this = this;
            $this.form.data = value;
        }
    }
}
</script>
<style lang="scss" scoped>
	.el-input-number{
		width: 158px;
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