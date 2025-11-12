/**
 * Time Estimation Utilities
 * 
 * Functions for calculating and formatting time estimates for job processing
 */

/**
 * Calculate elapsed time since a given timestamp
 */
export function getElapsedTime(startTime: number | string): {
  minutes: number;
  seconds: number;
  formatted: string;
} {
  const start = typeof startTime === 'string' ? parseInt(startTime, 10) : startTime;
  const now = Date.now();
  const elapsedMs = now - start;
  const elapsedSeconds = Math.floor(elapsedMs / 1000);
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;

  let formatted: string;
  if (minutes === 0) {
    formatted = `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
  } else if (minutes === 1) {
    formatted = seconds > 0 
      ? `1 minute ${seconds} second${seconds !== 1 ? 's' : ''} ago`
      : '1 minute ago';
  } else {
    formatted = `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  }

  return { minutes, seconds, formatted };
}

/**
 * Estimate remaining time based on progress and elapsed time
 */
export function estimateRemainingTime(
  progress: number,
  elapsedSeconds: number
): {
  estimatedSeconds: number;
  formatted: string;
} {
  if (progress <= 0) {
    // Can't estimate if no progress
    return {
      estimatedSeconds: 60, // Default 1 minute
      formatted: '~1 minute',
    };
  }

  if (progress >= 100) {
    return {
      estimatedSeconds: 0,
      formatted: 'Almost done',
    };
  }

  // Calculate estimated total time based on current progress
  const estimatedTotalSeconds = (elapsedSeconds / progress) * 100;
  const estimatedRemainingSeconds = Math.max(0, estimatedTotalSeconds - elapsedSeconds);

  // Format the estimate
  const remainingMinutes = Math.ceil(estimatedRemainingSeconds / 60);
  
  let formatted: string;
  if (remainingMinutes === 0) {
    formatted = 'Less than a minute';
  } else if (remainingMinutes === 1) {
    formatted = '~1 minute';
  } else if (remainingMinutes < 60) {
    formatted = `~${remainingMinutes} minutes`;
  } else {
    const hours = Math.floor(remainingMinutes / 60);
    const mins = remainingMinutes % 60;
    formatted = mins > 0 ? `~${hours}h ${mins}m` : `~${hours} hour${hours !== 1 ? 's' : ''}`;
  }

  return {
    estimatedSeconds: estimatedRemainingSeconds,
    formatted,
  };
}

/**
 * Get stage message based on progress
 */
export function getStageMessage(progress: number): string {
  if (progress < 10) {
    return 'Starting...';
  } else if (progress < 40) {
    return 'Scraping Reddit...';
  } else if (progress < 70) {
    return 'Analyzing posts...';
  } else if (progress < 100) {
    return 'Finalizing...';
  } else {
    return 'Complete!';
  }
}

/**
 * Get full time information for a job
 */
export function getJobTimeInfo(
  startTime: number | string,
  progress: number
): {
  elapsed: ReturnType<typeof getElapsedTime>;
  remaining: ReturnType<typeof estimateRemainingTime>;
  stage: string;
} {
  const start = typeof startTime === 'string' ? parseInt(startTime, 10) : startTime;
  const elapsed = getElapsedTime(start);
  const elapsedSeconds = elapsed.minutes * 60 + elapsed.seconds;
  const remaining = estimateRemainingTime(progress, elapsedSeconds);
  const stage = getStageMessage(progress);

  return {
    elapsed,
    remaining,
    stage,
  };
}

