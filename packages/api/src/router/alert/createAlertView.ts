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
      // TODO: Figure out what summary to generate for sentry alerts.
      summary: `Alert '${rest.title}' triggered by ${rest.source}`,
    };
  }

  const summary =
    typeof metadata === 'object' &&
    metadata !== null &&
    !Array.isArray(metadata)
      ? metadata.summary
      : undefined;
  return {
    ...rest,
    summary:
      (summary as string) ??
      `Alert '${rest.title}' triggered by ${rest.source}`,
  };
};
