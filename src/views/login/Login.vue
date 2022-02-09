<template>
  <div class="login">
    <img class="bg" ref="img" :src="bg" alt/>
    <div id="form">
      <form>
        <tr>
          <td> 账号：</td>
          <td><input type="text" v-model.trim="user.account"></td>
        </tr>
        <tr>
          <td>密码：</td>
          <td><input type="password" v-model="user.password"> <br/><br/></td>
        </tr>
        <tr>
          <td colspan="2">
            <button @click="toLogin" style="width: 150px;border-radius: 20%">登录</button>
          </td>
        </tr>
      </form>
    </div>
  </div>
</template>

<script>
import request from "../../utils/request";
import {ElMessage} from "element-plus";

export default {
  name: "Login",
  data() {
    return {
      bg: require("../../assets/static/bg.jpg"),
      user: {
        account: '',
        password: ''
      }
    }
  },
  methods: {
    toLogin() {
      request.request({
        method: 'post',
        url: '/api/user/login',
        data: this.user
      }).then(res => {
        // console.log(res)
        if (res.data.code == 200) {
          if (this.user.account == 'admin' && this.user.password == '123') {
            const token = res.data.data.token;
            localStorage.setItem("token", token);
            localStorage.setItem("admin", JSON.stringify(res.data.data.user));
            this.$router.push('/user')
            ElMessage({
              message: "登陆成功",
              type: "success",
            });
          } else {
            ElMessage({
              message: "账户错误",
              type: "fail",
            });
          }
        } else {
          ElMessage({
            message: "登陆失败",
            type: "fail",
          });
        }
      })
    },
  }
}
</script>

<style scoped>
.login {
  width: 100%;
  height: 710px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg {
  width: 100%;
  height: 711px;
  position: absolute;
  z-index: -999;
}

form {
  width: 400px;
  height: 300px;
  margin: auto;
  text-align: center;
  box-shadow: 0px 0px 5px gray;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

button {
  margin-left: 25px;
}
</style>