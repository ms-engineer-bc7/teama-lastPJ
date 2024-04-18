// calendar/page.tsx
export interface EventInfo {
  event: {
    id: number;
    title: string;
  };
}

// _components/ModalPartner.tsx
export interface ModalPartnerProps {
  isOpen: boolean;
  onClose: () => void;
  event: any;
}
