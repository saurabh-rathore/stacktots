import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import * as Sentry from "@sentry/angular";
import { BrowserTracing } from "@sentry/tracing";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  integrations: [
    new BrowserTracing({
      tracingOrigins: ["localhost", "https://your-domain.com/api"],
      routingInstrumentation: Sentry.routingInstrumentation,
    }),
  ],
  tracesSampleRate: 1.0,
});

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
