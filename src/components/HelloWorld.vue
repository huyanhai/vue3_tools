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
