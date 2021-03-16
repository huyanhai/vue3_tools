import * as Sentry from '@sentry/vue';
import { Integrations } from '@sentry/tracing';
window.$sentry = Sentry;
window.$sentry.init({
  dsn: process.env.VUE_APP_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
});
export default window.$sentry;
