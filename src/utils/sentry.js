import Vue from 'vue';
import * as Sentry from '@sentry/vue';
import { Integrations } from '@sentry/tracing';
export default Sentry.init({
  Vue,
  dsn: process.env.VUE_APP_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [
    new Integrations.BrowserTracing({
      Vue,
      attachProps: true,
      logErrors: true,
    }),
  ],
  tracesSampleRate: 1.0,
  beforeSend: event => {
    return event;
  },
});
