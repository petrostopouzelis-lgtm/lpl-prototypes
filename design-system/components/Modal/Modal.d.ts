import { ReactNode } from 'react';

export interface ModalProps {
  open?: boolean;
  /** 20px bold Manrope in text-blue, with the close button opposite. */
  title?: string;
  onClose?: () => void;
  /** Right-aligned footer buttons. */
  actions?: ReactNode;
  /** 520 for standard dialogs, 780 for the group wizard, 860 for the assignment wizard. */
  width?: number;
  children?: ReactNode;
}

export function Modal(props: ModalProps): JSX.Element | null;
