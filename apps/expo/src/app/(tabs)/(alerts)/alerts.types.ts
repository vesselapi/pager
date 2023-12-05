import type { RouterOutputs } from '@vessel/api';

export type Alert = NonNullable<RouterOutputs['alert']['all']['0']>;
export type User = RouterOutputs['user']['me']['user'];
