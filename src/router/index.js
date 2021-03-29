import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/a', component: import('@/views/A.vue') },
  { path: '/b', component: import('@/views/B.vue') },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
