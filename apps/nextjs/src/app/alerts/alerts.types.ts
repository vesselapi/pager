import type { RouterInputs, RouterOutputs } from '@vessel/api';

/**
 * Base Types
 */
export type Alert = NonNullable<RouterOutputs['alert']['all']['0']>;
export type User = RouterOutputs['user']['me']['user'];

/**
 * Used for the Config bar options
 */
export interface ConfigOption<T = string> {
  label: string;
  value: T;
  Icon: React.ReactElement; // Use react-icons library
}

/**
 * Config Bar Settings
 */
export interface DisplaySettings {
  // How the alerts should be styled
  cardType: 'condensed' | 'expanded';
}

type SortApiInput = NonNullable<RouterInputs['alert']['all']['sorts']>['0'];
export interface SortSetting {
  property: SortApiInput['property'];
  label: string;
  order?: SortApiInput['order'];
  Icon: React.ReactElement;
}

export type FilterApiInput = NonNullable<
  RouterInputs['alert']['all']['filters']
>['0'];
export interface FilterSetting {
  property: Omit<FilterApiInput['property'], 'title'>; // Title is handled by search.
  label: string;
  Icon: React.ReactElement;
  value: ConfigOption[]; // selected value
  condition: ConfigOption; // selected condition
  valueOptions: ConfigOption[];
  conditionOptions: ConfigOption[];
}
