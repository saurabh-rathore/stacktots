import { Injectable } from '@angular/core';

declare let gtag: Function;

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor() { }

  trackEvent(eventName: string, eventCategory: string, eventAction: string, eventLabel: string | null = null, eventValue: number | null = null) {
    gtag('event', eventName, {
      event_category: eventCategory,
      event_label: eventLabel,
      event_action: eventAction,
      value: eventValue
    });
  }
}
