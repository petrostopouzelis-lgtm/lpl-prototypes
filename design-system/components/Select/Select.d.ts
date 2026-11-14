export interface SelectProps {
  label?: string;
  options?: string[];
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
}

export function Select(props: SelectProps): JSX.Element;
