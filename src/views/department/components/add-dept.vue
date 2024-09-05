<template>
    <el-dialog :title="showTitle" @close="close" :visible="showDialog">
        <el-form ref="addDept" :model="formData" :rules="rules" label-width="120px">
            <el-form-item prop="name" label="部门名称">
                <el-input v-model="formData.name" placeholder="2-10个字符" style="width:80%" size="mini"></el-input>
            </el-form-item>
            <el-form-item prop="code" label="部门编码">
                <el-input v-model="formData.code" placeholder="2-10个字符" style="width:80%" size="mini"></el-input>
            </el-form-item>
            <el-form-item prop="mangerId" label="部门负责人">
                <el-select v-model="formData.managerId" placeholder="请选择负责人" style="width:80%" size="mini">
                    <el-option v-for="item in managerList" :key="item.id" :label="item.username" value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="introduce" label="部门介绍">
                <el-input v-model="formData.introduce" placeholder="1-100个字符" type="textarea" :rows="4" style="width:80%" size="mini"></el-input>
            </el-form-item>
            <el-form-item>
                <el-row type="flex" justify="center">
                    <el-col :span="12">
                        <el-button @click="btnOk" size="mini" type="primary">确定</el-button>
                        <el-button @click="close" size="mini">取消</el-button>
                    </el-col>
                </el-row>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import {updateDepartmentDetail,getDepartmentDetail,getDepartment, getManagerList,addDepartment} from '@/api/department'
export default{
    props: {
        showDialog: {
            type: Boolean,
            default: false
        },
        currentNodeId: {
            type: Number,
            default: null
        }
    },
    data(){
        return{
            managerList: [],
            formData: {
                code: '',
                introduce: "",
                managerId: '',
                name: '',
                pid: ''
            },

            rules: {
                code: [{required: true, message: '部门编码不能为空', trigger: 'blur'},
                    {
                        min: 2, max:10,message:'部门编码的长度为2-10个字符'
                    },
                    {
                        trigger: 'blur',
                        validator: async(rule,value,callback) => {
                            let result =await getDepartment()
                            if(this.formData.id){
                                // 过滤成后者
                                result = result.filter(item => item.id !== this.formData.id)
                            }
                            if(result.some(item =>item.code ===value)){
                                callback(new Error("部门中已经有该编码了"))
                            }else{
                                callback()
                            }
                        }
                        
                    }
                ],
                introduce: [{required: true, message: '部门介绍不能为空', trigger: 'blur'},
                {min: 1, max:100,message:'部门介绍的长度为2-10个字符'}
                ],
                managerId: [{required: true, message: '部门负责人不能为空', trigger: 'blur'}],
                name: [{required: true, message: '部门名称不能为空', trigger: 'blur'},
                {min: 2, max:10,message:'部门名称的长度为2-10个字符'},
                {
                        trigger: 'blur',
                        validator: async(rule,value,callback) => {
                            let result =await getDepartment()
                            if(this.formData.id){
                                // 过滤成后者
                                result = result.filter(item => item.id !== this.formData.id)
                            }
                            if(result.some(item =>item.name ===value)){
                                callback(new Error("部门中已经有该名称了"))
                            }else{
                                callback()
                            }
                        }
                        
                    }
                ],
               
            }
        }
    },
    computed:{
        showTitle(){
            return this.formData.id ? '编辑部门' : '新增部门'
        }
    },
    created(){
        this.getManagerList()
    },
    methods: {
        close(){
            this.formData = {
                code: '',
                introduce: "",
                managerId: '',
                name: '',
                pid: ''
            },
            this.$refs.addDept.resetFields()
            this.$emit('update:showDialog', false)
        },
        async getManagerList(){
       this.managerList = await getManagerList()
        },
        btnOk(){
            this.$refs.addDept.validate(async isOK => {
                if(isOK){
                    let msg ='新增'
                    if(this.formData.id){
                        msg ='更新'
                        await updateDepartmentDetail(this.formData)
                    }else{
                        await addDepartment({...this.formData,pid: this.currentNodeId})
                    }
                    
                    this.$emit('updateDepartment')
                    this.$message.success(`${msg}部门成功`)
                    this.close()
                }
            })
        },
        async getDepartmentDetail(){
            this.formData = await getDepartmentDetail(this.currentNodeId)
        }
    }
}
</script>