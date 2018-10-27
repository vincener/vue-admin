<template>
  <div class="app-container">
    <div class="filter-container">
      <span class="demonstration">火灾名称：</span> <el-input placeholder="火灾名称" v-model="searchConfig.conditions.name" style="width: 200px;" class="filter-item" @keyup.enter.native="search"/>
      <el-button  class="filter-item" type="primary" icon="el-icon-search" @click="search">查询</el-button>
    </div>
    <el-table
    :data="tableData.data"
    stripe
    style="width: 100%">
    <el-table-column
      prop="state"
      label="状态"
      width="180">
    </el-table-column>
    <el-table-column
      prop="name"
      label="火灾"
      width="180">
    </el-table-column>
    <el-table-column
      prop="address"
      label="地址">
    </el-table-column>
      <el-table-column
      prop="pipeDiameter"
      label="网管直径">
    </el-table-column>
      <el-table-column
      prop="state"
      label="使用情况">
    </el-table-column>
      <el-table-column
      prop="pipePressure"
      label="网管压力">
    </el-table-column>
  </el-table>
  <pagination v-show="tableData.total>0" :page.sync="searchConfig.pageNumber" :limit.sync="searchConfig.pageSize" :total="tableData.total"  @pagination="search" />
  </div>
</template>

<script>
import { getPage, getAll } from "@/api/fire.js";
import Pagination from "@/components/Pagination";
export default {
  data() {
    return {
      tableData: {
        data: [],
        total: 0,
        listLoading:true,
      },
      searchConfig: {
        pageSize: 10,
        pageNumber: 1,
        conditions: {
          name: ""
        }
      }
    };
  },
  mounted() {
    // getAll().then(res => {
    //   this.tableData = res.content;
    // });
    this.search();
  },
  methods: {
    search() {

      getPage(this.searchConfig).then(res => {
        this.tableData.data = res.content.rows;
        this.tableData.total = res.content.total;

      });
    }
  },
  components: { Pagination }
};
</script>

<style scoped>
.line {
  text-align: center;
}
</style>

