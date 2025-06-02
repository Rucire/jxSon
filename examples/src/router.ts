import { createRouter, createWebHistory } from 'vue-router';
import BasicUsage from './views/BasicUsage.vue';
import NestedStructures from './views/NestedStructures.vue';
import ReadOnlyExample from './views/ReadOnlyExample.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'basic',
      component: BasicUsage
    },
    {
      path: '/nested',
      name: 'nested',
      component: NestedStructures
    },
    {
      path: '/readonly',
      name: 'readonly',
      component: ReadOnlyExample
    },
  ]
});

export default router; 