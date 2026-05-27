import { client } from "./redis-client";

/**
 * Validates a rate limit using a sliding window algorithm with Redis Sorted Sets.
 * 
 * @param key Unique identifier for the limit (e.g. `rate_limit:login:${fingerprint}`)
 * @param limit Maximum number of requests allowed in the window
 * @param windowSecs Window duration in seconds
 * @returns {Promise<{success: boolean}>} Object containing success boolean
 */
export async function checkRateLimit(key: string, limit: number, windowSecs: number): Promise<{ success: boolean }> {
  try {
    const now = Date.now();
    const windowStart = now - (windowSecs * 1000);

    // Use a transaction pipeline for atomicity
    const multi = client.multi();

    // 1. Remove timestamps older than the sliding window
    multi.zRemRangeByScore(key, 0, windowStart);
    
    // 2. Count requests remaining in the current window
    multi.zCard(key);
    
    // 3. Add current request timestamp
    multi.zAdd(key, [{ score: now, value: `${now}-${Math.random()}` }]);
    
    // 4. Set TTL on the key to automatically clean it up if inactive
    multi.expire(key, windowSecs);

    const results = await multi.exec();
    
    if (results && results.length >= 2) {
      // The second command's result is zCard (number of elements *before* we added the current one)
      const requestCount = results[1] as number;
      
      // If the number of requests before this one is greater than or equal to limit, we're over the limit
      if (requestCount >= limit) {
        return { success: false };
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error("Rate limit error:", error);
    // Fail open in case of Redis errors to not block legitimate users
    return { success: true };
  }
}
