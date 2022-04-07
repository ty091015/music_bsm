<template>
  <div class="nav" ref="nav">
    <div class="logo">
      <img style="width: 80px;border-radius: 20%;margin-top: 25px" src='../../assets/photo/photo1.jpg'/>
    </div>
    <el-radio-group v-model="isCollapse" class="expand" style="margin-top: 50px">
      <el-radio-button style="width: 100%" v-if="isCollapse" :label="false" @click="expand"><span style="width: 150px;font-size: 18px">展开</span></el-radio-button>
      <el-radio-button style="width: 100%" v-if="!isCollapse" :label="true" @click="hide"><span style="width: 150px;font-size: 18px">收缩</span></el-radio-button>
    </el-radio-group>

    <el-menu
        style="margin-top: 10px"
        default-active="1"
        class="el-menu-vertical-demo"
        :collapse="isCollapse"
        @open="handleOpen"
        @close="handleClose"
    >
      <router-link v-for="(item,index) of nav_list" :key="index" :to="item.route" style="text-decoration: none">
        <el-menu-item class="nav_item" :index="String(index+1)">
          <img :src="item.photo"/>
          <template #title>
            <span>{{ item.title }}</span>
          </template>
        </el-menu-item>
      </router-link>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "Nav",
  props: {
    msg: String,
  },
  data() {
    return {
      isCollapse: false,
      nav_list: [
        {route: "/user", photo: require('../../assets/photo/photo4.jpg'), title: '用户管理'},
        {route: "/singer", photo: require('../../assets/photo/photo3.jpg'), title: '歌手管理'},
        {route: "/song", photo: require('../../assets/photo/photo2.jpg'), title: '歌曲管理'},
        // {route: "/user", photo: require('../../assets/photo/photo1.jpg'), title: '专辑管理'},
      ]
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    },
    hide() {
      this.$refs.nav.style.width = "120px";
    },
    expand() {
      this.$refs.nav.style.width = "250px";
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.nav {
  width: 250px;
  height: 928px;
  box-shadow: 5px 5px 5px rgb(211, 211, 211);
  box-sizing: border-box;
  background-color: white;
}
.nav{
  margin: 0 auto;
  text-align: center;
}
.logo {
  width: 100%;
  height: 100px;
  box-sizing: border-box;
}
.nav_item{
  height: 80px !important;
}
.nav_item img{
  width: 40px;
  border-radius: 40%;
  margin-left: 15px;
}
.nav_item span{
  margin-left: 20px;
  font-size: 18px;
}
.el-menu {
  border-right: 0;
}
</style>
