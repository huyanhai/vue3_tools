<template>
  <div class="dialog" ref="el">
    <div class="hd">{{ title }}</div>
    <div class="bd">{{ content }}</div>
    <div class="ft">
      <button @click="cancel">取消</button>
      <button @click="confirm">确定</button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
export default {
  props: {
    title: {
      type: String,
      default: '提示',
    },
    content: {
      type: String,
      default: '确认关闭？',
    },
  },
  setup() {
    const status = ref(null);
    const el = ref(null);

    function removeNode() {
      el.value.parentNode.removeChild(el.value);
    }

    function cancel() {
      status.value = 0;
      removeNode();
    }

    function confirm() {
      status.value = 1;
      removeNode();
    }

    return {
      el,
      removeNode,
      cancel,
      confirm,
      status,
    };
  },
};
</script>

<style lang="scss">
.dialog {
  position: fixed;
  width: 300px;
  height: 200px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba($color: #000000, $alpha: 0.2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  .ft {
    display: flex;
    justify-content: center;
    margin-top: 10px;
    button {
      margin: 0 20px;
    }
  }
}
</style>
