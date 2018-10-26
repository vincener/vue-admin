<template>
  <div class="app-container">
    <el-table
    :data="tableData"
    stripe
    style="width: 100%">
    <el-table-column
      prop="email"
      label="email"
      width="180">
    </el-table-column>
    <el-table-column
      prop="loginName"
      label="姓名"
      width="180">
    </el-table-column>
    <el-table-column
      prop="organization.name"
      label="机构">
    </el-table-column>
  </el-table>
  </div>
</template>

<script>

import { getAll } from '@/api/user.js'
export default {
  data() {
      return {
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }]
      }
    },
    mounted(){
getAll().then(res => {
  this.tableData=res.content
})
    }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

