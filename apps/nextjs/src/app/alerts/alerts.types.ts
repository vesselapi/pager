import type { RouterOutputs } from '@vessel/api';

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
export interface SortSetting {
  property: string;
  label: string;
  order?: 'asc' | 'desc';
  Icon: React.ReactElement;
}
export interface FilterSetting {
  property: string;
  label: string;
  Icon: React.ReactElement;
  value: ConfigOption[]; // selected value
  condition: ConfigOption; // selected condition
  valueOptions: ConfigOption[];
  conditionOptions: ConfigOption[];
}
