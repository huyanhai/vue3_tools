import { createApp } from 'vue';

import * as Sentry from '@sentry/vue'; // Sentry for Vue
import { Integrations } from '@sentry/tracing'; // Sentry Monitor Performance

import App from './App.vue';
import router from './router';
import store from './store';
const app = createApp(App);

// app.config.isCustomElement = tag => tag.startsWith('apps-');

app.use(store);
app.use(router);

// app.mixin()
// app.directive()
// app.component()

// Sentry init
if (process.env.NODE_ENV !== 'development') {
  Sentry.init({
    Vue: app,
    dsn: '',
    integrations: [new Integrations.BrowserTracing()],
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
  });
}

app.mount('#app');
