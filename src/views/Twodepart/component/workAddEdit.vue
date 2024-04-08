<template>
	<el-dialog :visible.sync="isDialogShow">
        <el-form ref="ruleForm" :model="form" :rules="rules" label-width="100px">
            <el-form-item label="标题" prop="title">
                <el-input v-model="form.title"></el-input>
            </el-form-item>
            <el-form-item label="表格" prop="list">
                <sc-form-table ref="table" v-model="form.list" :addTemplate="addTemplate" placeholder="暂无数据">
                    <el-table-column prop="type" label="类型" align="center"  width="180">
                        <template #default="scope">
                            <el-select v-model="scope.row.type" placeholder="请选择">
                                <el-option v-for="item in typeDic" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="number" align="center" label="个数" width="220">
                        <template #default="scope">
                            <el-input-number v-model="scope.row.number" :min="0"></el-input-number>
                        </template>
                    </el-table-column>
                    <el-table-column prop="open" label="备注" align="center" >
                        <template #default="scope">
                            <el-input v-model="scope.row.content" placeholder="请输入内容"></el-input>
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
    import scFormTable from './scTable'
	export default {
		name: 'formtable',
        components: {
          scFormTable
        },
		data(){
			return {
                isDialogShow: false,
				addTemplate: {
					time: '',
					type: '',
					val: '',
					open: true,
					checked: false
				},
				form: {
					title: "标题",
					list: [
						{
							time: '09:00',
							type: '1',
							val: '100',
							open: true,
							checked: true
						},
						{
							time: '10:00',
							type: '0',
							val: '50',
							open: false,
							checked: true
						}
					]
				},
				typeDic: [
					{
						label: "全局",
						value: "0"
					},
					{
						label: "局部",
						value: "1"
					}
				],
				rules: {
					title: [
						{required: true, message: '请上传', trigger: 'blur'}
					]
				}
			}
		},
        mounted(){
            
        },
		methods: {
			submitForm(){
				this.$refs.ruleForm.validate((valid) => {
					if (valid) {
						alert('请看控制台输出');
						console.log(this.form);
					}else{
						return false;
					}
				})
			},
			resetForm(){
				this.$refs.ruleForm.resetFields();
			},
            
		}
	}
</script>
<style lang="scss" scoped>
	.el-input-number{
		width: 140px;
	}
</style>