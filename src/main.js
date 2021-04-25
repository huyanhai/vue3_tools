import { createApp } from 'vue';

import App from './App.vue';
import router from './router';
import store from './store';
import 'tailwindcss/tailwind.css';

const app = createApp(App);

// app.config.isCustomElement = tag => tag.startsWith('apps-');
app.use(store);
app.use(router);

// app.mixin()
// app.directive()
// app.component()

app.mount('#app');
