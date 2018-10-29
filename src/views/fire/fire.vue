<template>
  <div class="app-container">
    <div class="filter-container">
      <span class="demonstration">火灾名称：</span> <el-input v-model="searchConfig.conditions.name" placeholder="火灾名称" style="width: 200px;" class="filter-item" @keyup.enter.native="search"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="search">查询</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">新增</el-button>
    </div>
    <el-table
      :data="tableData.data"
      :key="tableKey"
      stripe
      border
      fit
      highlight-current-row
      style="width: 100%">
      <el-table-column label="序号" align="center" width="65" type="index"/>
      <el-table-column
        prop="state"
        label="状态"
        width="180"/>
      <el-table-column
        prop="name"
        label="火灾"
        width="180"/>
      <el-table-column
        prop="address"
        label="地址"/>
      <el-table-column
        prop="pipeDiameter"
        label="网管直径"/>
      <el-table-column
        prop="state"
        label="使用情况"/>
      <el-table-column
        prop="pipePressure"
        label="网管压力"/>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="tableData.total>0" :page.sync="searchConfig.pageNumber" :limit.sync="searchConfig.pageSize" :total="tableData.total" @pagination="search" />
    <el-dialog :title="dialogConfig.textMap[dialogConfig.dialogStatus]" :visible.sync="dialogConfig.dialogFormVisible">
      <el-form ref="dataForm" :rules="formConfig.rules" :model="formConfig.temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="名称" prop="name">
          <el-input v-model="formConfig.temp.name"/>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="formConfig.temp.address"/>
        </el-form-item>
        <el-form-item label="消防栓类型" prop="type">
          <el-input v-model="formConfig.temp.type"/>
        </el-form-item>
        <el-form-item label="管网直径" prop="pipeDiameter">
          <el-input v-model="formConfig.temp.pipeDiameter"/>
        </el-form-item>
        <el-form-item label="管网压力" prop="pipePressure">
          <el-input v-model="formConfig.temp.pipePressure"/>
        </el-form-item>
        <el-form-item label="使用情况" prop="state">
          <el-select v-model="formConfig.temp.state" class="filter-item" placeholder="Please select">
            <el-option v-for="item in stateOptions" :key="item" :label="item" :value="item"/>
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogConfig.dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogConfig.dialogStatus==='create'?createData():updateData()">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPage,
  save,
  deleteById,
  update,
  getById
} from '@/api/fire.js'
import Pagination from '@/components/Pagination'

const stateOptions = ['正常使用', '被占用', '已损坏']

export default {

  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      tableData: {
        data: [],
        total: 0,
        listLoading: true
      },
      searchConfig: {
        pageSize: 10,
        pageNumber: 1,
        conditions: {
          name: ''
        }
      },
      dialogConfig: {
        textMap: {
          update: '编辑',
          create: '新增'
        },
        dialogFormVisible: false,
        dialogStatus: ''
      },
      formConfig: {
        rules: {
          name: [{ required: true, message: '名称必填', trigger: 'change' }],
          address: [{ required: true, message: '地址必填', trigger: 'change' }],
          state: [
            { required: true, message: '使用状况必填', trigger: 'change' }
          ]
        },
        temp: {
          id: '',
          name: '',
          address: '',
          type: '',
          longitude: '119',
          latitude: '1',
          altitude: '1',
          state: '',
          pipePressure: '',
          pipeDiameter: ''
        }
      },
      stateOptions
    }
  },
  mounted() {
    this.resetSearch()
  },
  methods: {
    resetSearch() {
      this.searchConfig.conditions = {
        name: ''
      }
      this.searchConfig.pageNumber = 1
      this.search()
    },
    search(obj) {
      // obj是底层组件传回的值解决切换每页多少个响应不到的bug
      // {
      //   page:1,
      //   limit:10
      // }
      if (obj !== undefined && obj != null && obj.page && obj.limit) {
        this.searchConfig.pageSize = obj.limit
        this.searchConfig.pageNumber = obj.page
      }
      getPage(this.searchConfig)
        .then(res => {
          this.tableData.data = res.content.rows
          this.tableData.total = res.content.total
        })
        .catch(new Function())
    },
    handleUpdate(row) {
      getById(row.id).then(res => {
        this.formConfig.temp = res.content
        this.dialogConfig.dialogStatus = 'update'
        this.dialogConfig.dialogFormVisible = true

        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteById(row.id).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.resetSearch()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    handleCreate() {
      this.resetTemp()
      this.dialogConfig.dialogStatus = 'create'
      this.dialogConfig.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetTemp() {
      this.formConfig.temp = {
        id: '',
        name: '',
        address: '',
        type: '',
        longitude: '119',
        latitude: '32',
        altitude: '1',
        state: '',
        pipePressure: '',
        pipeDiameter: ''
      }
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          save(this.formConfig.temp).then(() => {
            this.dialogConfig.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
          this.resetSearch()
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          update(this.formConfig.temp).then(() => {
            this.dialogConfig.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
          this.resetSearch()
        }
      })
    }
  }
}
</script>

<style scoped>
.line {
  text-align: center;
}
</style>

