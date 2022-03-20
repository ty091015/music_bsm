<template>
  <div class="user">
    <!--  输入框  -->
    <div class="search">
      <span>用户名称</span>&nbsp;
      <el-input
          v-model="search"
          style="width: 200px"
          placeholder="请输入用户名"
      />
      <el-button @click="handleSearch" style="margin-left: 10px"
      >搜索
      </el-button>
      <el-button @click="addUser" type="primary">新增用户</el-button>
      <el-button @click="deleteUser" type="danger">批量删除</el-button>
    </div>
    <!--  表格数据  -->
    <div class="table">
      <el-table
          v-loading="loading"
          class="elTable"
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
        <el-table-column type="selection" width="35"/>
        <el-table-column fixed prop="userId" label="userId" width="70"/>
        <el-table-column label="头像" width="80" style="height: 40px">
          <template #default="scope">
            <el-icon
                class="el-icon--center"
                @click="uploadClick(scope.row)"
                style="width: 40px !important"
            >
              <el-upload
                  class="avatar-uploader"
                  action="/api/uploadFile"
                  :show-file-list="false"
                  :limit="1"
                  ref="uploadPhoto"
                  :http-request="uploadPhoto"
              >
                <img style="width: 14px" :src="uploadImg" alt="找不到"/>
                <img style="width: 40px" :src="scope.row.photo"/>
              </el-upload>
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column
            prop="account"
            label="账号"
            width="100"
            show-overflow-tooltip
        >
          <template #default="scope">
            <span class="showOverTooltip">{{ scope.row.account }}</span>
          </template>
        </el-table-column>
        <el-table-column
            prop="name"
            label="密码"
            width="50"
            show-overflow-tooltip
        >
          <template #default="scope">
            <span class="showOverTooltip">{{ scope.row.password }}</span>
          </template>
        </el-table-column>

        <el-table-column
            prop="name"
            label="别名"
            width="115"
            show-overflow-tooltip
        >
          <template #default="scope">
            <span class="showOverTooltip">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sex" label="性别" width="50"/>
        <el-table-column label="收藏歌手" width="100" show-overflow-tooltip>
          <template #default="scope">
            <span class="showOverTooltip">{{
                scope.row.collectSingerIds
              }}</span>
          </template>
        </el-table-column>
        <el-table-column label="收藏歌曲" width="100" show-overflow-tooltip>
          <template #default="scope">
            <span class="showOverTooltip">{{ scope.row.collectSongIds }}</span>
          </template>
        </el-table-column>
        <el-table-column label="介绍" width="100" show-overflow-tooltip>
          <template #default="scope">
            <span class="showOverTooltip">{{ scope.row.introduce }}</span>
          </template>
        </el-table-column>
        <el-table-column
            prop="hobby"
            label="爱好"
            width="103"
            show-overflow-tooltip
        >
          <template #default="scope">
            <span class="showOverTooltip">{{ scope.row.hobby }}</span>
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
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button type="text" size="small" @click="editUser(scope.row)"
            >编辑
            </el-button>
            <el-button type="danger" size="small" @click="deleteUser(scope.row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--  模态框  -->
    <div class="modal">
      <el-dialog v-model="showDialog" :title="title" width="40%" center @close='closeDialog'>
        <div class="content">
          <el-form ref="form" :model="form" label-width="120px" :rules="rules">
            <el-form-item label="账号" prop="account">
              <el-input v-model="form.account"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="form.password"></el-input>
            </el-form-item>
            <el-form-item label="用户名" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <el-radio v-model="form.sex" label="男" size="large">男</el-radio>
              <el-radio v-model="form.sex" label="女" size="large">女</el-radio>
            </el-form-item>
            <el-form-item label="介绍" prop="introduce">
              <el-input v-model="form.introduce"></el-input>
            </el-form-item>
            <el-form-item label="收藏歌手" v-show="title == '修改用户'">
              <el-input v-model="form.collectSingerIds"></el-input>
            </el-form-item>
            <el-form-item label="收藏歌曲" v-show="title == '修改用户'">
              <el-input v-model="form.collectSongIds"></el-input>
            </el-form-item>
            <el-form-item label="爱好风格" prop="hobby">
              <el-checkbox-group v-model="form.hobby">
                <el-checkbox label="中国风" name="hobby"></el-checkbox>
                <el-checkbox label="流行音乐" name="hobby"></el-checkbox>
                <el-checkbox label="抖音神曲" name="hobby"></el-checkbox>
                <el-checkbox label="经典老歌" name="hobby"></el-checkbox>
                <el-checkbox label="伤感" name="hobby"></el-checkbox>
                <el-checkbox label="快乐" name="hobby"></el-checkbox>
                <el-checkbox label="安静" name="hobby"></el-checkbox>
                <el-checkbox label="励志" name="hobby"></el-checkbox>
                <el-checkbox label="治愈" name="hobby"></el-checkbox>
                <el-checkbox label="怀恋" name="hobby"></el-checkbox>
                <el-checkbox label="2000年后" name="hobby"></el-checkbox>
                <el-checkbox label="2000年前" name="hobby"></el-checkbox>
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
  name: "User",
  data() {
    return {
      currentPage: 1, //当前页码
      pageSizes: [10, 20, 30, 40], //页码格式
      pageSize: 10, //页码大小
      search: "",
      tableData: [],
      filTableData: [],
      showDialog: false,
      title: "新增用户",
      Selection: [],
      formDate: "",
      form: {
        account: "",
        birth: "",
        hobby: ["中国风", "流行音乐"],
        introduce: "",
        name: "",
        password: "123",
        sex: "女",
        photo: "",
        collectSingerIds: "",
        collectSongIds: "",
      },
      rules: {
        account: [{required: true, message: "请输入账号", trigger: "blur"},
          {validator: this.checkAccount, trigger: ['change', 'blur']}],
        password: [{required: true, message: "请输入密码", trigger: "blur"}],
        name: [{required: true, message: "请输入名称", trigger: "blur"}],
        sex: [{required: true, message: "请选择性别", trigger: "blur"}],
        introduce: [{required: true, message: "请输入内容", trigger: "blur"}],
        hobby: [{required: true, message: "请选择爱好", trigger: "blur"}],
        birth: [{required: true, message: "选择日期", trigger: "blur"}],
      },
      uploadImg: require("../../../assets/upload.png"),
      loading: true,
      editAccount: ''
    };
  },
  methods: {
    //数据
    getDataSource() {
      request
          .request({
            method: "get",
            url: "/api/user/getUser",
          })
          .then((res) => {
            if (res.data.code == 200) {
              res.data.data.map((item) => {
                var newHobby = JSON.parse(item.hobby);
                item.hobby = newHobby;
              });
              this.tableData = res.data.data;
              this.filTableData = res.data.data;
              this.loading = false;
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
    addUser() {
      this.showDialog = true;
      this.title = "新增用户";
      this.form = {
        account: "",
        birth: "",
        hobby: ["中国风", "流行音乐"],
        introduce: "",
        name: "",
        password: "123",
        sex: "女",
        photo: "",
        collectSingerIds: "",
        collectSongIds: "",
      };
    },
    //编辑
    editUser(row) {
      this.showDialog = true;
      this.title = "修改用户";
      this.form = row;
      this.editAccount = row.account
    },
    //上传获取row
    uploadClick(row) {
      this.form = row;
    },
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
                this.form.hobby = JSON.stringify(this.form.hobby);
                resolve(this.form);
              }
            });
      });
      p.then((form) => {
        request
            .request({
              method: "post",
              url: "/api/user/register_edit",
              data: form,
              params: {
                userId: this.form.userId,
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
      this.form.hobby = JSON.stringify(this.form.hobby);
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.form.birth = dateFormat("YYYY-mm-dd", this.form.birth);
          if (this.form.userId) {
            request
                .request({
                  method: "post",
                  url: "/api/user/register_edit",
                  data: this.form,
                  params: {
                    userId: this.form.userId,
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
                  url: "/api/user/register_edit",
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
          return false;
        }
      });
    },
    //取消
    onCancel(form) {
      this.showDialog = false;
      this.getDataSource();
      this.$refs[form].resetFields();
    },
    //关闭弹框
    closeDialog() {
      this.showDialog = false;
      this.getDataSource();
      this.$refs.form.resetFields();
    },
    //选择框改变
    SelectionChange(value) {
      this.Selection = value.map((item) => {
        return item.userId;
      });
    },
    //删除
    deleteUser(row) {
      ElMessageBox.confirm("确认删除", "Warning", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
          .then(() => {
            const {userId} = row;
            if (userId) {
              this.Selection = [userId];
            }
            const p = new Promise((resolve, reject) => {
              this.Selection.map((userId) => {
                request
                    .request({
                      method: "get",
                      url: "/api/user/deleteUser",
                      params: {
                        userId,
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
    //校验账号
    checkAccount(rule, value, callback) {
      new Promise(resolve => {
        request
            .request({
              method: "get",
              url: "/api/user/getUser",
            })
            .then((res) => {
              if (res.data.code == 200) {
                resolve(res.data.data)
              }
            });
      }).then(res => {
        var result = res
        if (this.title == '修改用户') {
          result = res.filter((item) => {
            return item.account != this.editAccount
          })
        }
        var hasAccount = result.some(item => {
          return item.account == value
        })
        if (hasAccount) {
          callback(new Error('该账号已经被注册，请重新更换账号'))
        } else {
          callback()
        }
      })
    },
  },
  mounted() {
    this.getDataSource();
    console.log("user表数据", this.filTableData);
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
.user {
  width: 100%;
  overflow: hidden;
}

.search {
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 2%;
}

.table {
  width: 96%;
  height: 530px;
  margin-left: 2%;
  overflow: auto;
}

.demo-pagination-block {
  margin-left: 30px;
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

.elTable th {
  padding: 0 !important;
  height: 20px !important;
  line-height: 20px;
}

.elTable td {
  padding: 0 !important;
  height: 20px;
  line-height: 20px;
}
</style>