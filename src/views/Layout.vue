<template>
  <div class="layout">
    <Nav></Nav>
   <Main></Main>
  </div>
</template>

<script>
import Nav from "./nav/Nav";
import Main from "./main/Main";

export default {
  name: "Layout",
  components: {Main,Nav},
  data() {
    return {
      tabPosition: "left",
    };
  },
  methods: {},
};
</script>
<style lang='scss'>
.layout{
  background-color: #f6f6f6;
  display: flex;
}
</style>
