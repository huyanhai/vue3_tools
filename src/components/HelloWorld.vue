<template>
  <button @click="show">show</button>
</template>

<script>
import { inject } from 'vue';
export default {
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  setup() {
    let $confirm = inject('dialog');
    function show() {
      $confirm({
        title: 'createDialogTitle',
        content: 'createDialog',
        foot: 'foot',
      })
        .then(() => {
          console.log('点击了确定按钮');
        })
        .catch(() => {
          console.log('点击了取消按钮');
        });
    }
    return {
      show,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
