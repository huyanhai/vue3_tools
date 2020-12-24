<template>
  <div ref="el">{{ name }}</div>
  <div>{{ newObj }}</div>
  <HelloWorld />
</template>
<script>
import { ref, toRef, onMounted, provide } from 'vue';
import { createDialog } from './views/show';
import HelloWorld from './components/HelloWorld';

export default {
  setup() {
    const name = ref('name');
    const obj = {
      name: 'name',
      age: 12,
    };
    const el = ref(null);
    const newObj = toRef(obj, 'age');
    // const instance = getCurrentInstance();

    onMounted(() => {
      el.value.innerHTML = '文案被修改';
    });

    provide('dialog', createDialog);
    return {
      name,
      newObj,
      obj,
      el,
    };
  },
  components: {
    HelloWorld,
  },
};
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.mode-fade-enter-active,
.mode-fade-leave-active {
  transition: opacity 0.5s ease;
}

.mode-fade-enter-from,
.mode-fade-leave-to {
  opacity: 0;
}
</style>
