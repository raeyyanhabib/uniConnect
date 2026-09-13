const cacheStore = new Map();

export const cacheMiddleware = (durationSeconds = 60) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = req.originalUrl || req.url;
    const cachedResponse = cacheStore.get(key);

    if (cachedResponse && Date.now() < cachedResponse.expiresAt) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(cachedResponse.data);
    }

    // Intercept res.json to store result in cache
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cacheStore.set(key, {
          data: body,
          expiresAt: Date.now() + durationSeconds * 1000
        });
      }
      res.setHeader('X-Cache', 'MISS');
      return originalJson(body);
    };

    next();
  };
};

export const clearCache = () => {
  cacheStore.clear();
};
