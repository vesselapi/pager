import type { Alert } from '@vessel/db/schema/alert';

export const createAlertView = (dbAlert: Alert) => {
  return {
    ...dbAlert,
    summary: `Alert '${dbAlert.title}' triggered by ${dbAlert.source}`,
  };
};
