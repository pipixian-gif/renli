<template>
  <div class="container">
    <div class="app-container">
      <div class="left">
        <el-input 
        @input="changeValue"
        v-model="queryParams.keyword" 
        style="margin-bottom:10px" 
        type="text" 
        prefix-icon="el-icon-search" 
        size="small" 
        placeholder="输入员工姓名全员搜索"  />
        <!-- 树形组件 -->
        <el-tree 
         ref="deptTree" 
         node-key="id" 
         :expand-on-click-node="false"
         default-expand-all 
         highlight-current 
         :data="depts" 
         :props="defaultProps"
         @current-change ="selectNode"
         >
          
        </el-tree>
      </div>
      <div class="right">
        <el-row class="opeate-tools" type="flex" justify="end">
          <el-button size="mini" type="primary" @click="$router.push('/employee/detail')">添加员工</el-button>
          <el-button size="mini">excel导入</el-button>
          <el-button size="mini">excel导出</el-button>
        </el-row>
        <!-- 表格组件 -->
        <el-table :data ="list">
          <el-table-column align="center" label="头像" prop="staffPhoto">
            <template v-slot="{ row }">
              <el-avatar v-if="row.staffPhoto" :src="row.staffPhoto" :size="30"></el-avatar>
              <span v-else class="username">{{ row.username.charAt(0) }}</span>
            </template>
          </el-table-column>
          <el-table-column  label="姓名" prop="username"></el-table-column>
          <el-table-column  label="手机号" sortable prop="mobile"></el-table-column>
          <el-table-column  label="工号" sortable prop="workNumber"></el-table-column>
          <el-table-column  label="聘用形式" prop="formOfEmployment">
            <template v-slot="{ row }">
              <span>{{row.formOfEmployment ===1 ?'正式' : row.formOfEmployment ===2 ?'非正式' :'无'}} </span>
            </template>
          </el-table-column>
          <el-table-column  label="部门" prop="departmentName"></el-table-column>
          <el-table-column  label="入职时间" sortable prop="timeOfEntry"></el-table-column>
          <el-table-column  label="操作" width="280px">
            <template v-slot="{ row }">
              <el-button size="mini" type="text" @click="$router.push(`/employee/detail/${row.id}`)">查看</el-button>
              <el-button size="mini" type="text">角色</el-button>
              <el-popconfirm title="确认删除该行数据吗？"
              @onConfirm ="confirmDel(row.id)">
              <el-button size="mini" type="text" slot="reference" style="margin-left: 10px;">删除</el-button>
            </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-row style="height: 60px;" align="middle" type="flex" justify="end">
          <el-pagination
             layout="total,prev, pager, next"
             :total="total"
             :current-page="queryParams.page"
             :page-size="queryParams.pagesize"
             @current-change="changePage"
             >
           </el-pagination>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { getDepartment } from '@/api/department'
import { transListToTreeData } from '@/utils'
import { getEmployeeList,delEmployee } from '@/api/employee'
export default {
  name: 'Employee',
  data(){
    return {
      depts: [],
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      queryParams: {
        departmentId: null,
        page: 1,
        pagesize: 10,
        keyword: ''
      },
      total: 0,
      list: []
    }
  },
  created(){
    this.getDepartment()
  },
  methods: {
    async getDepartment(){
      this.depts = transListToTreeData(await getDepartment(), 0)
      this.queryParams.departmentId = this.depts[0].id
      this.$nextTick(() => {this.$refs.deptTree.setCurrentKey(this.queryParams.departmentId)})
      this.getEmployeeList()
      
    },
    selectNode(node){
      this.queryParams.departmentId = node.id
      this.queryParams.page =1
      this.getEmployeeList()
    },
    async getEmployeeList(){
      const {rows,total} =await getEmployeeList(this.queryParams)
      this.list =rows,
      this.total =total
    },
    changePage(newPage){
      this.queryParams.page=newPage
      this.getEmployeeList()
    },
    changeValue(){
      clearTimeout(this.timer)
      this.timer =setTimeout(() => {
        this.queryParams.page = 1
        this.getEmployeeList() 
      },300)
    },
    async confirmDel(id){
      await delEmployee(id)
      if(this.list.length === 1 && this.queryParams.page > 1){
        this.queryParams.page--
      }
      this.getEmployeeList()
      this.$message.success('删除员工成功')
}
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  background: #fff;
  display: flex;
  .left {
    width: 280px;
    padding: 20px;
    border-right: 1px solid #eaeef4;
  }
  .right {
    flex: 1;
    padding: 20px;
    .opeate-tools {
      margin:10px ;
    }
    .username {
      height: 30px;
      width: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 50%;
      color: #fff;
      background: #04C9BE;
      font-size: 12px;
      display:inline-block;
    }
  }
}

</style>