export interface User {
  id: number;
  uid: string;
  name: string;
  email: string;
  role: string;
  partner?: User;
  partner_email?: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  hide_from_hr: string;
  alert_message_for_u: string;
  alert_message_for_p: string;
}


// _components/ModalPartner.tsx
export interface ModalPartnerProps {
  isOpen: boolean;
  onClose: () => void;
  event: any;
}
