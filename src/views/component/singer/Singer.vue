<template>
  <div class="singer">
    <!--  输入框  -->
    <div class="search">
      <span>歌手名称</span>&nbsp;
      <el-input
          v-model="search"
          style="width: 200px"
          placeholder="请输入歌手名"
      />
      <el-button @click="handleSearch" style="margin-left: 10px"
      >搜索
      </el-button>
      <el-button @click="addSinger" type="primary">新增歌手</el-button>
      <el-button @click="deleteSinger" type="danger">批量删除</el-button>
    </div>
    <!--  表格数据  -->
    <div class="table">
      <el-table
          v-loading="loading"
          :cell-style="{ textAlign: 'center' }"
          :header-cell-style="{ textAlign: 'center' }"
          border
          size="small"
          :data="
          this.filTableData.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
          )
        "
          style="width: 100%"
          @selection-change="SelectionChange"
      >
        <el-table-column type="selection" width="40"/>
        <el-table-column label="歌手头像" width="100">
          <template #default="scope">
            <el-icon class="el-icon--center" @click="uploadClick(scope.row)">
              <el-upload
                  class="avatar-uploader"
                  action="/api/uploadFile"
                  :show-file-list="false"
                  :limit="1"
                  ref="uploadPhoto"
                  :http-request="uploadPhoto"
              >
                <img style="height: 14px" :src="uploadImg" alt="找不到"/>
                <img
                    style="width: 40px;margin-top: 30px"
                    :src="scope.row.photo"
                    class="avatar"
                />
              </el-upload>
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column fixed prop="singerId" label="singerId" width="70"/>
        <el-table-column
            prop="name"
            label="歌手姓名"
            width="100"
            show-overflow-tooltip
        >
          <template #default="scope">
            <span class="showOverTooltip">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sex" label="性别" width="63"/>
        <el-table-column label="歌手简介" width="500" show-overflow-tooltip>
          <template #default="scope">
            <span class="showOverTooltip">{{ scope.row.introduce }}</span>
          </template>
        </el-table-column>
        <el-table-column
            prop="type"
            label="歌手风格"
            width="300"
            show-overflow-tooltip
        >
          <template #default="scope">
            <span class="showOverTooltip">{{ scope.row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column
            prop="birth"
            label="出生日期"
            width="85"
            show-overflow-tooltip
        >
          <template #default="scope">
            <span class="showOverTooltip">{{ scope.row.birth }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="85" show-overflow-tooltip>
          <template #default="scope">
            <span class="showOverTooltip">{{ scope.row.createdAt }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最新更新" width="85" show-overflow-tooltip>
          <template #default="scope">
            <span class="showOverTooltip">{{ scope.row.updatedAt }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button type="text" size="small" @click="editSinger(scope.row)"
            >编辑
            </el-button>
            <el-button
                type="danger"
                size="small"
                @click="deleteSinger(scope.row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--  模态框  -->
    <div class="modal">
      <el-dialog v-model="showDialog" :title="title" width="40%" center>
        <div class="content">
          <el-form :model="form" label-width="120px" :rules="rules" ref="form">
            <el-form-item label="歌手名" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <el-radio v-model="form.sex" label="男" size="large">男</el-radio>
              <el-radio v-model="form.sex" label="女" size="large">女</el-radio>
            </el-form-item>
            <el-form-item label="歌手简介" prop="introduce">
              <el-input v-model="form.introduce"></el-input>
            </el-form-item>
            <el-form-item label="歌手风格" prop="type">
              <el-checkbox-group v-model="form.type">
                <el-checkbox label="中国风" name="type"></el-checkbox>
                <el-checkbox label="流行音乐" name="type"></el-checkbox>
                <el-checkbox label="抖音神曲" name="type"></el-checkbox>
                <el-checkbox label="经典老歌" name="type"></el-checkbox>
                <el-checkbox label="伤感" name="type"></el-checkbox>
                <el-checkbox label="快乐" name="type"></el-checkbox>
                <el-checkbox label="安静" name="type"></el-checkbox>
                <el-checkbox label="励志" name="type"></el-checkbox>
                <el-checkbox label="治愈" name="type"></el-checkbox>
                <el-checkbox label="怀恋" name="type"></el-checkbox>
                <el-checkbox label="2000年后" name="type"></el-checkbox>
                <el-checkbox label="2000年前" name="type"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="出生日期" prop="birth">
              <el-date-picker
                  v-model="form.birth"
                  type="date"
                  placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit('form')"
              >确认
              </el-button
              >
              <el-button @click="onCancel('form')">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
    </div>
    <!-- 分页 -->
    <div class="demo-pagination-block">
      <el-pagination
          :v-model:currentPage="currentPage"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="this.filTableData.length"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import request from "../../../utils/request";
import {dateFormat} from "../../../utils/dateFormat";
import {ElMessage, ElMessageBox} from "element-plus";

export default {
  name: "Singer",
  data() {
    return {
      currentPage: 1, //当前页码
      pageSizes: [8, 16, 24, 32], //页码格式
      pageSize: 8, //页码大小
      search: "",
      tableData: [],
      filTableData: [],
      showDialog: false,
      title: "新增歌手",
      Selection: [],
      formDate: "",
      form: {
        birth: "",
        type: ["中国风", "流行音乐"],
        introduce: "",
        name: "",
        photo: "",
        sex: "女",
      },
      rules: {
        name: [{required: true, message: "请输入歌手名", trigger: "blur"},
          {validator: this.checkSingerName, trigger: ['change', 'blur']}],
        sex: [{required: true, message: "请选择性别", trigger: "blur"}],
        introduce: [{required: true, message: "请输入内容", trigger: "blur"}],
        type: [{required: true, message: "请选择爱好", trigger: "blur"}],
        birth: [{required: true, message: "选择日期", trigger: "blur"}],
      },
      uploadImg: require("../../../assets/upload.png"),
      loading: true,
      editSingerName: ''
    };
  },
  methods: {
    //数据
    getDataSource() {
      request
          .request({
            method: "get",
            url: "/api/singer/getSinger",
          })
          .then((res) => {
            if (res.data.code == 200) {
              res.data.data.map((item) => {
                var newType = JSON.parse(item.type);
                item.type = newType;
              });
              this.tableData = res.data.data;
              this.filTableData = res.data.data;
              this.loading = false;
              console.log("singer表数据", this.filTableData);
            }
          });
    },
    //查询
    handleSearch() {
      this.filTableData = this.tableData.filter((item) => {
        return item.name.indexOf(this.search) !== -1;
      });
    },
    //新增
    addSinger() {
      this.showDialog = true;
      this.title = "新增歌手";
      this.form = {
        birth: "",
        type: ["中国风", "流行音乐"],
        introduce: "",
        name: "",
        photo: "",
        sex: "女",
      };
    },
    //编辑
    editSinger(row) {
      this.showDialog = true;
      this.title = "修改歌手";
      this.form = row;
      this.editSingerName = row.name
    },
    //上传获取row
    uploadClick(row) {
      this.form = row;
    },
    //上传
    //上传图片
    uploadPhoto(param) {
      this.$refs.uploadPhoto.clearFiles(); //上传成功之后清除历史记录
      if (
          param.file.name.split(".")[1] !== "png" &&
          param.file.name.split(".")[1] !== "jpg"
      ) {
        ElMessage({
          message: "上传格式错误，不是.jpg格式或.png格式",
          type: "error",
        });
        return;
      }
      const p = new Promise((resolve) => {
        let formData = new FormData();
        formData.append("file", param.file);
        request
            .request({
              method: "post",
              url: "/api/uploadFile",
              data: formData,
            })
            .then((res) => {
              if (res.data.code == 200) {
                this.form.photo = res.data.data.url;
                this.form.type = JSON.stringify(this.form.type);
                resolve(this.form);
              }
            });
      });
      p.then((form) => {
        request
            .request({
              method: "post",
              url: "/api/singer/add_edit",
              data: form,
              params: {
                singerId: this.form.singerId,
              },
            })
            .then((res) => {
              if (res.data.code == 200) {
                this.showDialog = false;
                this.getDataSource();
                this.form = {};
                ElMessage({
                  message: res.data.msg,
                  type: "success",
                });
              } else {
                ElMessage({
                  message: res.data.msg,
                  type: "error",
                });
              }
            });
      });
    },
    //确认
    onSubmit(form) {
      this.form.type = JSON.stringify(this.form.type);
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.form.birth = dateFormat("YYYY-mm-dd", this.form.birth);
          if (this.form.singerId) {
            request
                .request({
                  method: "post",
                  url: "/api/singer/add_edit",
                  data: this.form,
                  params: {
                    singerId: this.form.singerId,
                  },
                })
                .then((res) => {
                  if (res.data.code == 200) {
                    this.showDialog = false;
                    this.getDataSource();
                    ElMessage({
                      message: res.data.msg,
                      type: "success",
                    });
                  } else {
                    ElMessage({
                      message: res.data.msg,
                      type: "error",
                    });
                  }
                });
          } else {
            request
                .request({
                  method: "post",
                  url: "/api/singer/add_edit",
                  data: this.form,
                })
                .then((res) => {
                  if (res.data.code == 200) {
                    this.getDataSource();
                    this.showDialog = false;
                    ElMessage({
                      message: res.data.msg,
                      type: "success",
                    });
                  } else {
                    ElMessage({
                      message: res.data.msg,
                      type: "error",
                    });
                  }
                });
          }
        } else {
          return 0;
        }
      });
    },
    //取消
    onCancel(form) {
      this.showDialog = false;
      this.getDataSource();
      this.$refs[form].resetFields();
    },
    //选择框改变
    SelectionChange(value) {
      this.Selection = value.map((item) => {
        return item.singerId;
      });
    },
    //删除
    deleteSinger(row) {
      ElMessageBox.confirm("确认删除", "Warning", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
          .then(() => {
            console.log(row)
            const {singerId} = row;
            if (singerId) {
              this.Selection = [singerId];
            }
            const p = new Promise((resolve, reject) => {
              this.Selection.map((singerId) => {
                request
                    .request({
                      method: "get",
                      url: "/api/singer/deleteSinger",
                      params: {
                        singerId,
                      },
                    })
                    .then((res) => {
                      if (res.data.code == 200) {
                        this.getDataSource();
                        resolve(true);
                      } else {
                        reject(false);
                      }
                    });
              });
            });
            p.then((value) => {
              if (value) {
                ElMessage({
                  message: "删除成功",
                  type: "success",
                });
              }
            });
          })
          .catch(() => {
            ElMessage({
              type: "info",
              message: "取消删除",
            });
          });
    },
    //  val表示当前页大小
    handleSizeChange(val) {
      this.pageSize = val;
    },
    //控制跳转到第几页，val表示当前页数
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    //校验新建歌手名
    checkSingerName(rule, value, callback) {
      new Promise(resolve => {
        request
            .request({
              method: "get",
              url: "/api/singer/getSinger",
            })
            .then((res) => {
              if (res.data.code == 200) {
                resolve(res.data.data)
              }
            });
      }).then(res => {
        var result = res
        if (this.title == '修改歌手') {
          result = res.filter((item) => {
            return item.name != this.editSingerName
          })
        }
        var hasAccount = result.some(item => {
          return item.name == value
        })
        if (hasAccount) {
          callback(new Error('该歌手已经存在'))
        } else {
          callback()
        }
      })
    }
  },
  mounted() {
    this.getDataSource();
    console.log("singer表数据", this.filTableData);
  },
  watch: {
    //输入框为空
    search(value) {
      if (value == "") {
        this.handleSearch();
      }
    },
  },
};
</script>

<style scoped>
.singer {
  width: 100%;
  overflow: hidden;
}

.search {
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 2%;
}

.table {
  width: 100%;
  min-height: 500px;
  margin-left: 2%;
  overflow: auto;
}

.demo-pagination-block {
  margin-left: 2%;
  margin-top: 10px;
}

.showOverTooltip {
  display: -webkit-box;
  text-overflow: ellipsis;
  overflow: hidden;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.showOverTooltip:hover {
  cursor: pointer;
}
</style>