export const logger = {
  info: (message: string, ...meta: unknown[]) => {
    console.log(`[INFO] [${new Date().toISOString()}] ${message}`, ...meta);
  },
  warn: (message: string, ...meta: unknown[]) => {
    console.warn(`[WARN] [${new Date().toISOString()}] ${message}`, ...meta);
  },
  error: (message: string, ...meta: unknown[]) => {
    console.error(`[ERROR] [${new Date().toISOString()}] ${message}`, ...meta);
  },
  telemetry: (metric: string, value: unknown) => {
    console.log(`[TELEMETRY] [${new Date().toISOString()}] ${metric}:`, value);
  },
};
