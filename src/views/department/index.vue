<template>
  <div class="container">
    <div class="app-container">
      <!-- 展示树形结构 -->
      <el-tree :expand-on-click-node="false" default-expand-all :data="depts" :props="defaultProps">
        <template v-slot="{ data }">
          <el-row
          style="width: 100%; height: 40px"
          type="flex"
          justify="space-between"
          align="middle">
          <el-col>{{ data.name }}</el-col>
          <el-col :span="4">
            <span class="tree-manager">{{ data.managerName }}</span>
            <el-dropdown @command="operateDpet($event,data.id)">
              <span class="el-dropdown-link">
                操作<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="add">添加子部门</el-dropdown-item>
                <el-dropdown-item command="edit">编辑子部门</el-dropdown-item>
                <el-dropdown-item command="del">删除子部门</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
        </template>
      </el-tree>
    </div>
    <!-- 放置弹窗组件 .sync会监听update:showDialog -->
    <add-dept ref="addDept" :updateDepartment="getDepartment" :currentNodeId="currentNodeId" :showDialog.sync ="showDialog" />
  </div>
</template>
<script>
import {delDepartment , getDepartment } from '@/api/department'
import { transListToTreeData } from '@/utils'
import AddDept from './components/add-dept.vue'
export default {
  name: "Department",
  components: { AddDept },
  data() {
    return {
      currentNodeId: null,
      showDialog: false,
      depts: [],
      defaultProps: {
        label: "name",
        children: "children",
      },
    };
  },
  created(){
    this.getDepartment()
  },
  methods: {
    async getDepartment(){
      const result= await getDepartment()
      this.depts= transListToTreeData(result,0)
    },
    operateDpet(type, id){
      if(type === 'add'){
        this.showDialog = true
        this.currentNodeId = id
      }else if(type === 'edit'){
        this.showDialog = true
        this.currentNodeId = id
        // 下者this.$refs.addDept相当于子组件addDept中的this,$nextTick表明上述完成后再调用，解决异步问题
        this.$nextTick(() => {this.$refs.addDept.getDepartmentDetail()})
        
      }
      else{
        this.$confirm('你确定要删除该部门吗','提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await delDepartment(id)
          this.$message.success('删除部门成功')
          this.getDepartment()
        })
      }
    }
  }

};
</script>
<style scoped>
.app-container {
  padding: 30px, 140px;
  font-size: 14px;
}
.tree-manager{
  width: 50px;
  display: inline-block;
  margin: 10px;
}
</style>
