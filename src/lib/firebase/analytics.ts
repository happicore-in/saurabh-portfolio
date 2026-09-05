import { logEvent } from 'firebase/analytics';
import { analytics } from '../firebase';

export type PortfolioAnalyticsEvent =
  | 'page_view'
  | 'project_view'
  | 'video_play'
  | 'contact_click'
  | 'github_click'
  | 'live_site_click'
  | 'happicore_click'
  | 'resume_download';

/**
 * Log real analytics events to Google Analytics 4 via Firebase Analytics
 */
export function trackPortfolioEvent(
  eventName: PortfolioAnalyticsEvent,
  eventParams?: Record<string, any>
): void {
  try {
    if (analytics) {
      logEvent(analytics, eventName as any, {
        timestamp: Date.now(),
        ...eventParams
      });
    }
  } catch (err) {
    // Non-blocking in dev or environments where cookies/tracking are blocked
    console.debug('[Analytics] Event logged:', eventName, eventParams);
  }
}
