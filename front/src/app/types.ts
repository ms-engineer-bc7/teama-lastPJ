// calendar/page.tsx
export interface EventInfo {
  id: number;
  title: string;
  start: string;
  end: string;
}

// _components/ModalPartner.tsx
export interface ModalPartnerProps {
  isOpen: boolean;
  onClose: () => void;
  event: any;
}
