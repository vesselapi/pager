/**
 * Used for the Config bar options
 */
export interface ConfigOption<T = string> {
  label: string; // Display Name
  value: T;
  Icon: React.ReactElement; // Use react-icons library
}
