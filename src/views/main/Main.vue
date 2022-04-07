<template>
  <div class="main">
    <Header></Header>
    <div class="content">
      <router-view/>
    </div>
  </div>
</template>

<script>
import Header from "./header/Header";

export default {
  name: "Main",
  components: {Header},
  props: {
    msg: String,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.main {
  width: 100%;
}
.content {
  width: 96%;
  min-height: 750px;
  background-color: white;
  margin-left: 2%;
  margin-top: 25px;
  box-shadow: 0px 0px 5px #c5c4c4;
}
</style>
