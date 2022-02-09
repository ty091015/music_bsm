<template>
  <div class="song">
    <!--  输入框  -->
    <div class="search">
      <span>歌曲名称</span>&nbsp;
      <el-input
          v-model="search"
          style="width: 200px"
          placeholder="请输入歌曲名"
      />
      <el-button @click="handleSearch" style="margin-left: 10px"
      >搜索
      </el-button
      >
      <el-button @click="addSinger" type="primary">新增歌曲</el-button>
      <el-button @click="deleteSong" type="danger">批量删除</el-button>
    </div>
    <!--  表格数据  -->
    <div class="table">
      <el-table
          class="el_table"
          :cell-style="{ textAlign: 'center' }"
          :header-cell-style="{ textAlign: 'center' }"
          border
          size="small"
          stripe
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
        <el-table-column fixed prop="songId" label="songId" width="60"/>
        <el-table-column label="歌曲名称" width="100" show-overflow-tooltip>
          <template #default="scope">
            <p class="showOverTooltip">{{ scope.row.name }}</p>
          </template>
        </el-table-column>
        <el-table-column label="歌曲简介" width="150" show-overflow-tooltip>
          <template #default="scope">
            <p class="showOverTooltip">{{ scope.row.introduce }}</p>
          </template>
        </el-table-column>
        <el-table-column label="图片" width="100">
          <template #default="scope">
            <el-icon
                class="el-icon--center"
                @click="uploadClick(scope.row)"
            >
              <el-upload
                  class="avatar-uploader"
                  action="/api/uploadFile"
                  :show-file-list="false"
                  :limit="1"
                  ref="uploadPhoto"
                  :http-request="uploadPhoto"
              >
                <img style="height: 30px;" :src="uploadImg" alt="找不到">
                <img style="height: 40px" :src="scope.row.photo" class="avatar"/>
              </el-upload>
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column align="left" label="歌词" show-overflow-tooltip width="180">
          <template #default="scope">
            <el-icon class="el-icon--center">
              <el-upload
                  class="avatar-uploader"
                  action="/api/uploadFile"
                  :show-file-list="false"
                  :limit="1"
                  ref="uploadLrc"
                  :http-request="uploadLrc"
              >
                <img style="height: 30px;" :src="uploadImg" alt="找不到">
                <span style="display: inline-block" class="showOverTooltip">{{ scope.row.lyric }}</span>
              </el-upload>
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="url" label="音乐地址" show-overflow-tooltip width="180">
          <template #default="scope">
            <el-icon class="el-icon--center">
              <el-upload
                  class="avatar-uploader"
                  action="/api/uploadFile"
                  :show-file-list="false"
                  :limit="1"
                  ref="uploadMusic"
                  :http-request="uploadMusic"
              >
                <img style="height: 30px;" :src="uploadImg" alt="找不到">
                <span style="display: inline-block" class="showOverTooltip">{{ scope.row.url }}</span>
              </el-upload>
            </el-icon>
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
        <el-table-column label="歌手" width="80">
          <template #default="scope">
            {{ scope.row.singer.name }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button type="text" size="small" @click="editSong(scope.row)"
            >编辑
            </el-button
            >
            <el-button type="danger" size="small" @click="deleteSong(scope.row)"
            >删除
            </el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--  模态框  -->
    <div class="modal">
      <el-dialog v-model="showDialog" :title="title" width="40%" center>
        <div class="content">
          <el-form
              :model="form"
              label-width="120px"
              ref="form"
              :rules="rules"
          >
            <el-form-item label="歌手" prop="singerId">
              <el-select v-model="form.singerId" class="m-2" placeholder="选择歌手">
                <el-option
                    v-for="singer in singerData"
                    :key="singer.singerId"
                    :label="singer.name"
                    :value="singer.singerId"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="歌曲名" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="介绍" prop="introduce">
              <el-input v-model="form.introduce"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit('form')">确认</el-button>
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
import {ElMessage, ElMessageBox} from "element-plus";

export default {
  name: "Song",
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
      singerData: [],
      formDate: "",
      fileType: '歌词',
      form: {
        name: '',
        photo: '',
        lyric: "",
        url: '',
        introduce: '',
        type: '',
        singerId: ''
      },
      rules: {
        singerId: [
          {required: true, message: '请选择歌手', trigger: 'blur'},
        ],
        name: [
          {required: true, message: '请输入歌曲名', trigger: 'blur'},
        ],
        introduce: [
          {required: true, message: '请输入内容', trigger: 'blur'},
        ]
      },
      uploadImg: require('../../../assets/upload.png')
    };
  },
  methods: {
    getSingerName(singerId) {
      request
          .request({
            method: "get",
            url: "/api/singer/getSinger",
            params: {
              singerId
            }
          }).then(res => {
        if (res.data.code == 200) {
          console.log(res.data.data)
        }
      })
    },
    //歌手信息
    getDataSource_Singer() {
      request
          .request({
            method: "get",
            url: "/api/singer/getSinger",
          })
          .then((res) => {
            if (res.data.code == 200) {
              this.singerData = res.data.data
            }
          });
    },
    //数据
    getDataSource() {
      request
          .request({
            method: "get",
            url: "/api/song/getSong",
          })
          .then((res) => {
            if (res.data.code == 200) {
              this.tableData = res.data.data;
              this.filTableData = res.data.data;
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
      this.title = "新增歌曲";
    },
    //编辑
    editSong(row) {
      this.showDialog = true;
      this.title = "修改歌曲";
      this.form = row;
    },
    //点击上传获取row
    uploadClick(row) {
      this.form = row
    },
    //上传歌词
    uploadLrc(param) {
      this.$refs.uploadLrc.clearFiles(); //上传成功之后清除历史记录
      if (param.file.name.split('.')[1] !== 'lrc') {
        ElMessage({
          message: '上传格式错误，不是lrc文件',
          type: "error",
        });
        return
      }
      const p = new Promise((resolve) => {
        let formData = new FormData()
        formData.append('file', param.file)
        request.request({
          method: 'post',
          url: '/api/uploadFile',
          data: formData,
          params: {
            fileType: this.fileType
          }
        }).then(res => {
          if (res.data.code == 200) {
            this.form.lyric = res.data.data.lyric
            resolve(this.form)
          }
        })
      })
      p.then(form => {
        request
            .request({
              method: "post",
              url: "/api/song/add_edit",
              data: form,
              params: {
                songId: this.form.songId,
                singerId: this.form.singerId
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
      })
    },
    //上传图片
    uploadPhoto(param) {
      this.$refs.uploadPhoto.clearFiles(); //上传成功之后清除历史记录
      if (param.file.name.split('.')[1] !== 'png' && param.file.name.split('.')[1] !== 'jpg') {
        ElMessage({
          message: '上传格式错误，不是.jpg格式或.png格式',
          type: "error",
        });
        return
      }
      const p = new Promise((resolve, reject) => {
        let formData = new FormData()
        formData.append('file', param.file)
        request.request({
          method: 'post',
          url: '/api/uploadFile',
          data: formData,
        }).then(res => {
          if (res.data.code == 200) {
            this.form.photo = res.data.data.url
            resolve(this.form)
          }
        })
      })
      p.then(form => {
        request
            .request({
              method: "post",
              url: "/api/song/add_edit",
              data: form,
              params: {
                songId: this.form.songId,
                singerId: this.form.singerId
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
      })
    },
    //MP3
    uploadMusic(param) {
      this.$refs.uploadMusic.clearFiles(); //上传成功之后清除历史记录
      if (param.file.name.split('.')[1] !== 'mp3') {
        ElMessage({
          message: '上传格式错误，不是.mp3文件',
          type: "error",
        });
        return
      }
      const p = new Promise((resolve) => {
        let formData = new FormData()
        formData.append('file', param.file)
        request.request({
          method: 'post',
          url: '/api/uploadFile',
          data: formData,
        }).then(res => {
          if (res.data.code == 200) {
            this.form.url = res.data.data.url
            resolve(this.form)
          }
        })
      })
      p.then(form => {
        request
            .request({
              method: "post",
              url: "/api/song/add_edit",
              data: form,
              params: {
                songId: this.form.songId,
                singerId: this.form.singerId
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
      })
    },
    //确认
    onSubmit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          request
              .request({
                method: "post",
                url: "/api/song/add_edit",
                data: this.form,
                params: {
                  songId: this.form.songId,
                  singerId: this.form.singerId
                },
              })
              .then((res) => {
                if (res.data.code == 200) {
                  this.showDialog = false;
                  this.getDataSource();
                  this.form = {}
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
          return false
        }
      })
    },
    //取消
    onCancel(form) {
      this.showDialog = false;
      this.getDataSource();
      this.$refs[form].resetFields()
    },
    //选择框改变
    SelectionChange(value) {
      this.Selection = value.map((item) => {
        return item.songId;
      });
    },
    //删除
    deleteSong(row) {
      ElMessageBox.confirm(
          '确认删除',
          'Warning',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          }
      )
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
                      url: "/api/song/deleteSong",
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
              type: 'info',
              message: '取消删除',
            })
          })
    },
    //  val表示当前页大小
    handleSizeChange(val) {
      // console.log(`${val} items per page`);
      this.pageSize = val;
    },
    //控制跳转到第几页，val表示当前页数
    handleCurrentChange(val) {
      // console.log(`current page: ${val}`);
      this.currentPage = val;
      // console.log(this.currentPage);
    },
  },
  mounted() {
    this.getDataSource();
    this.getDataSource_Singer();
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

<style scoped lang="less">
.song {
  width: 99%;
  overflow: hidden;
}

.search {
  margin-top: 15px;
  margin-bottom: 10px;
  margin-left: 2%;
  margin-top: 1%;
}

.table {
  width: 96%;
  height: 490px;
  margin-left: 2%;
  overflow: auto;
}

.demo-pagination-block {
  margin-left: 2%;
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
.el_table th{
  height: 20px !important;
}

</style>