/* Small structured logger. Swap for pino/winston in production if desired. */
export const logger = {
  info: (msg: string, meta?: unknown) =>
    console.log(JSON.stringify({ level: "info", msg, ...toMeta(meta), time: new Date().toISOString() })),
  warn: (msg: string, meta?: unknown) =>
    console.warn(JSON.stringify({ level: "warn", msg, ...toMeta(meta), time: new Date().toISOString() })),
  error: (msg: string, meta?: unknown) =>
    console.error(JSON.stringify({ level: "error", msg, ...toMeta(meta), time: new Date().toISOString() })),
};

function toMeta(meta: unknown) {
  if (!meta) return {};
  if (meta instanceof Error) return { error: meta.message, stack: meta.stack };
  if (typeof meta === "object") return { meta };
  return { meta };
}
