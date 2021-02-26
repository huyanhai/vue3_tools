<template>
  <img src="./assets/test.jpg" />
  <div class="p-test">
    <ul class="ui-repeart">
      <li class="repeart-item text-gray-600" v-for="(item, index) in lists" :key="index">
        {{ item.name }}
      </li>
    </ul>
    <img :src="img" class="rounded-b-lg rounded-t-md" />
  </div>
  <p class="bg-gray-100 border-green-500 p-test m-test text-test-reds">123</p>
  <div class="test">
    <p>test</p>
  </div>
</template>
<script>
import { ref } from '@vue/reactivity';
import { onBeforeMount } from 'vue';
import { getMock, postMock } from './api';
export default {
  setup() {
    let img = ref(null);
    let lists = ref([]);
    onBeforeMount(() => {
      getMock({
        params: {
          name: 'name',
        },
      }).then(res => {
        if (res.code === 200) {
          const { data } = res;
          lists.value = data;
        }
      });
      postMock({
        name: 'name',
      }).then(res => {
        if (res.code === 200) {
          const { image } = res.data;
          img.value = image;
        }
      });
    });
    return { img, lists };
  },
};
</script>
<style lang="scss" scoped>
.test {
  p {
    color: red;
  }
}
</style>
