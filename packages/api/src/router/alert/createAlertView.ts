import type { Alert } from '@vessel/db/schema/alert';

/**
 * Turns the DB representation of an Alert into a client side alert. This function
 * is mainly responsible for handling source specific product logic.
 */
export const createAlertView = (dbAlert: Alert | null) => {
  if (!dbAlert) return dbAlert;

  const { metadata, ...rest } = dbAlert;

  if (rest.source === 'sentry') {
    return {
      ...rest,
      summary: metadata,
    };
  }
  return {
    ...rest,
    summary: `Alert '${rest.title}' triggered by ${rest.source}`,
  };
};
