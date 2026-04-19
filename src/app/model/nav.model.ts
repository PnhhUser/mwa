export interface NavModel {
  title: string;
  icon?: string;
  route?: string;
  selected?: boolean;
  disabled?: boolean;
  tooltip?: string;
  children?: NavModel[];
}
