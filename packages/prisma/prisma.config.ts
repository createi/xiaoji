import { defineConfig } from 'prisma/config';
import path from 'path';
import fs from 'fs';

// 加载环境变量
function loadEnvFile() {
  const envPath = path.resolve(__dirname, '../../.env.development');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    const lines = content.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const eqIndex = trimmed.indexOf('=');
        if (eqIndex > 0) {
          const key = trimmed.substring(0, eqIndex).trim();
          let value = trimmed.substring(eqIndex + 1).trim();
          // 移除引号
          if ((value.startsWith('"') && value.endsWith('"')) ||
              (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }
          process.env[key] = value;
        }
      }
    }
  }
}

loadEnvFile();

export default defineConfig({
  earlyAccess: true,
  schema: path.join(__dirname, 'schema.prisma'),
  migrate: {
    async url() {
      // 从 .env.development 读取 DATABASE_URL
      return process.env.DATABASE_URL || 'mysql://user:1234567@localhost:3306/xiaoji_dev';
    },
  },
  seed: `ts-node --compiler-options {"module":"CommonJS"} ${path.join(__dirname, 'seed.ts')}`,
});
