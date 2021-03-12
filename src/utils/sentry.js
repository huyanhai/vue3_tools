import * as Sentry from '@sentry/vue';
import { Integrations } from '@sentry/tracing';
export default Sentry.init({
  dsn: process.env.VUE_APP_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
  debug: true,
});
