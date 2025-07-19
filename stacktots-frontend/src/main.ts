import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import * as Sentry from "@sentry/angular";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  integrations: [
    new Sentry.BrowserTracing({
      tracingOrigins: ["localhost", "https://your-domain.com/api"],
    }),
    new Sentry.Replay(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
