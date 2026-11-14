export interface ToggleSwitchProps {
  on?: boolean;
  onChange?: (on: boolean) => void;
  label?: string;
}

export function ToggleSwitch(props: ToggleSwitchProps): JSX.Element;
