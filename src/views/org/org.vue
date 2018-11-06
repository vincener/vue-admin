<template>
  <div class="app-container">
    <div class="filter-container">
      <span class="demonstration">消防栓名称：</span> <el-input v-model="searchConfig.conditions.name" placeholder="火灾名称" style="width: 200px;" class="filter-item" @keyup.enter.native="search"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="search">查询</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">新增</el-button>
      <BookTypeOption v-model="bookType" />
      <el-button :loading="downloadLoading" style="margin:0 0 20px 20px;" type="primary" icon="document" @click="handleDownload">导出Excel</el-button>

    </div>
    <!-- <el-table
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
        label="消防栓"
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
    </el-table> -->
    <tree-table :data="tableData.data" :expand-all="expandAll" border>
      <el-table-column label="机构">
        <template slot-scope="scope">
          <span style="color:#42b983">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="编码">
        <template slot-scope="scope">
          <span style="color:sandybrown">{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="linkMan"
        label="联系人"
        width="180"/>
      <el-table-column
        prop="phone"
        label="电话"
        width="180"/>
      <el-table-column
        prop="state"
        label="状态"
        width="180"/>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="text" @click="message(scope.row.name)">点击</el-button>
        </template>
      </el-table-column>
    </tree-table>
  </div>

</template>

<script>
import { getPage, save, deleteById, update, getById } from '@/api/org.js'
import Pagination from '@/components/Pagination'
import FilenameOption from '@/views/excel/components/FilenameOption'
import AutoWidthOption from '@/views/excel/components/AutoWidthOption'
import BookTypeOption from '@/views/excel/components/BookTypeOption'
import treeTable from '@/components/TreeTable'
import treeToArray from './customEval'
const stateOptions = ['正常使用', '被占用', '已损坏']

export default {
  components: { Pagination, FilenameOption, AutoWidthOption, BookTypeOption, treeTable, treeToArray },
  data() {
    return {
      args: [null, null, 'timeLine'],
      func: treeToArray,
      expandAll: false,
      uploadConfig: {
        files: []
      },
      downloadLoading: false,
      filename: '',
      autoWidth: true,
      bookType: 'xlsx',
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
          var data = res.content.rows
          // this.tableData.data = data
          this.tableData.data = this.covertToTree(data, [])
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
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['Id', '状态', '名称', '地址', '状态']
        const filterVal = ['id', 'state', 'name', 'address', 'state']
        const list = this.tableData.data
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'export_excel',
          autoWidth: true,
          bookType: this.bookType
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    },
    covertToTree(datas, fields) {
      debugger
      var nodeTree = {}
      var nodeMap = {}
      fields = ['operationField', 'code', 'linkMan', 'phone', 'email', 'issuer', 'createDate']
      for (var idx in datas) {
        var data = datas[idx]
        // 数据的合法性校验，id和parentId不允许相同
        if (data.id == data.parentId) {
          throw {
            message: '结点ID[id: ' + data.id + ', parentId: ' + data.parentId + ', name: ' + data.name + ']与父结点ID相同导致循环依赖，不合法的数据！',
            data: data
          }
        }
        var currentNode = nodeTree[data.id]
        var parentNode = nodeTree[data.parentId]
        var currentNodePointer = nodeMap[data.id]

        if (typeof currentNode === 'undefined') {
          currentNode = {
            id: data.id,
            parentId: data.parentId,
            name: data.name,
            children: []
          }
        } else {
          currentNode.name = data.name
          delete nodeTree[data.id]
        }

        if (fields && fields != null &&
            fields.length && fields.length > 0) {
          for (var idx in fields) {
            var field = fields[idx]
            currentNode[field] = data[field] ? data[field] : ''
          }
        }

        // 当前结点已初始化过并在nodeMap中有记录，说明结点的ID重复了
        if (typeof currentNodePointer !== 'undefined') {
          throw {
            message: '存在id[id: ' + data.id + ', name: ' + data.name + '][id: ' + currentNodePointer.id + ', name: ' + currentNodePointer.name + ']相同的数据，数据不合法！',
            data: data
          }
        } else {
          nodeMap[data.id] = currentNode
        }

        if (typeof parentNode === 'undefined') {
          parentNode = nodeMap[data.parentId]

          if (typeof parentNode === 'undefined') {
            parentNode = {
              id: data.parentId,
              name: null,
              parentId: null,
              children: []
            }

            nodeTree[parentNode.id] = parentNode
          } else {
            // 校验是否存在循环依赖的问题
            if (!this.recursionCheckNode(currentNode, parentNode.id)) {
              parentNode.children.push(currentNode)

              throw {
                message: '各节点之间存在循环依赖（例如：节点A的父结点指向节点B,节点B的父结点指向节点C,节点C的父结点又指向了节点A而形成了循环依赖），数据不合法！',
                data: parentNode
              }
            }
          }
        }

        parentNode.children.push(currentNode)
      }

      var count = 0
      var tree

      for (var node in nodeTree) {
        count++
        tree = nodeTree[node]
      }

      if (count > 1) {
        throw {
          message: '存在节点所依赖的父结点不存在的数据，数据不合法！具体请查看date中的记录',
          data: nodeTree
        }
      }

      var tree = tree.children[0]
      return tree
    },
    recursionCheckNode(node, id) {
      if (node.children && node.children.length > 0) {
        for (var i in node.children) {
          var child = node.children[i]

          if (child.id === id) {
            return false
          }

          if (!this.recursionCheckNode(child, id)) {
            return false
          }
        }
      }

      // 没有循环依赖的问题，返回true
      return true
    }
  }
}
</script>

<style scoped>
.line {
  text-align: center;
}
</style>

