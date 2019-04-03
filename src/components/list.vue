<template>
  <div class="app-container calendar-list-container">
    <el-table :data="list" style="width: 100%">
      <el-table-column
        prop="id"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间">
      </el-table-column>
      
      <el-table-column align="center" width="280" label="操作">
        <template scope="scope">
          <el-button  size="small" type="success" @click="showQRCode(scope.row)">查看
          </el-button>
          <el-button  size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
    <el-dialog title="扫描二维码"
      :visible.sync="isQRCodeShow">
        <div class="qrcode" id="qrcode"></div>
    </el-dialog>
  </div>
</template>
<script>
import {page, delObj} from '../fetch'
import QRCode from 'qrcodejs2'
export default {
  data() {
    return {
      list: [],
      listLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20
      },
      isQRCodeShow: false,
      QRCode: null
    }
  },
  created() {
    this.getList()
  },
  methods: {
    showQRCode(row) {
      this.isQRCodeShow = true
      this.$nextTick(() => {
        // TODO: 修改对外域名或ip
        let txt = 'https://www.zgqsgw.com/h5/?id=' + row.id
        this.QRCode ? this.QRCode.makeCode(txt) : this.makeQRCode(txt)
      })
    },
    makeQRCode(txt) {
      this.QRCode = new QRCode('qrcode', {
        text: txt
      })
    },
    getList() {
      this.listLoading = true;
      page(this.listQuery)
        .then(response => {
          this.list = response.data.rows;
          this.total = response.data.total;
          this.listLoading = false;
        })
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delObj(row.id)
            .then(() => {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              });
              const index = this.list.indexOf(row);
              this.list.splice(index, 1);
            });
        });
    },
    handleUpdate(row) {
      this.$router.push({
        path: '/main',
        query: {id: row.id}
      })
    }
  }
}
</script>
<style>
.qrcode img{
  margin: 0 auto;
}
</style>
