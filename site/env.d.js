/** @type {string} */
export const SentryRelease =
  process.env.SENTRY_RELEASE ||
  (() => {
    throw new Error("Missing SENTRY_RELEASE");
  })();

/** @type {string} */
export const SentryEnvironment =
  process.env.SENTRY_ENVIRONMENT ||
  (() => {
    throw new Error("Missing SENTRY_ENVIRONMENT");
  })();

/** @type {string} */
export const SentryPublicKey =
  process.env.SENTRY_PUBLIC_KEY ||
  (() => {
    throw new Error("Missing SENTRY_PUBLIC_KEY");
  })();
