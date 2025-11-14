/**
 * Page Visit Tracking
 * 
 * Tracks page visits to our backend API for analytics.
 * This provides server-side analytics that doesn't rely on Google Analytics.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7300';

/**
 * Generate or retrieve a session ID
 */
function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  let sessionId = sessionStorage.getItem('page_tracking_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('page_tracking_session_id', sessionId);
  }
  return sessionId;
}

/**
 * Extract UTM parameters from URL
 */
function getUtmParams(): { source?: string; medium?: string; campaign?: string } {
  if (typeof window === 'undefined') return {};
  
  const params = new URLSearchParams(window.location.search);
  return {
    source: params.get('utm_source') || undefined,
    medium: params.get('utm_medium') || undefined,
    campaign: params.get('utm_campaign') || undefined,
  };
}

/**
 * Get referrer (where the user came from)
 */
function getReferrer(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  
  // Don't track internal referrers (same domain)
  const referrer = document.referrer;
  if (!referrer) return undefined;
  
  try {
    const referrerUrl = new URL(referrer);
    const currentUrl = new URL(window.location.href);
    
    // If same domain, don't track as referrer
    if (referrerUrl.hostname === currentUrl.hostname) {
      return undefined;
    }
    
    return referrer;
  } catch {
    return referrer;
  }
}

/**
 * Track a page visit
 */
export async function trackPageVisit(pagePath: string): Promise<void> {
  try {
    // Note: This tracking does NOT require cookie consent because:
    // 1. It's server-side analytics (not cookies)
    // 2. It only tracks anonymous data (IP, referrer, page path)
    // 3. No personal information is collected
    // This is similar to server logs which are typically exempt from consent requirements
    
    const utmParams = getUtmParams();
    const referrer = getReferrer();
    const sessionId = getSessionId();
    
    const response = await fetch(`${API_URL}/api/v1/analytics/track-visit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page_path: pagePath,
        referrer: referrer,
        utm_source: utmParams.source,
        utm_medium: utmParams.medium,
        utm_campaign: utmParams.campaign,
        session_id: sessionId,
      }),
      // Don't send credentials for analytics tracking
      credentials: 'omit',
    });
    
    if (!response.ok) {
      // Log errors in development for debugging
      if (process.env.NODE_ENV === 'development') {
        const errorText = await response.text().catch(() => 'Unknown error');
        console.warn('Failed to track page visit:', response.status, errorText);
      }
    } else {
      // Log success in development for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Page visit tracked:', pagePath);
      }
    }
  } catch (error) {
    // Log errors in development for debugging
    if (process.env.NODE_ENV === 'development') {
      console.warn('Error tracking page visit:', error);
    }
    // Silently fail in production - don't break the user experience
  }
}

