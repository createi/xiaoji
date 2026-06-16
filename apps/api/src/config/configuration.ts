export default () => ({
  port: parseInt(process.env.APP_PORT ?? '7001', 10),
  env: process.env.NODE_ENV || 'development',

  database: {
    url: process.env.DATABASE_URL,
  },
  redis: {
    url: process.env.REDIS_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  storage: {
    driver: process.env.STORAGE_DRIVER || 'local',
    localPath: process.env.STORAGE_LOCAL_PATH || 'uploads',
    oss: {
      bucket: process.env.STORAGE_OSS_BUCKET,
      cdn: process.env.STORAGE_OSS_CDN,
    },
  },
  swagger: {
    enabled: process.env.SWAGGER_ENABLED === 'true',
  },
  rateLimit: {
    enabled: process.env.RATE_LIMIT_ENABLED === 'true',
    ttl: parseInt(process.env.RATE_LIMIT_TTL ?? '60', 10),
    limit: parseInt(process.env.RATE_LIMIT_LIMIT ?? '100', 10),
  },
  cache: {
    enabled: process.env.CACHE_ENABLED === 'true',
  },
  captcha: {
    enabled: process.env.CAPTCHA_ENABLED === 'true',
  },
});
