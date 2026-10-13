import type { SVGProps } from 'react';

// Small hand-drawn stroke icons (24px grid). Decorative by default: label the control, not the icon.
type P = SVGProps<SVGSVGElement>;
const Icon = ({ children, ...p }: P) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...p}>
    {children}
  </svg>
);

export const BagIcon = (p: P) => <Icon {...p}><path d="M5 8h14l-1.2 12H6.2z" /><path d="M9 10V7a3 3 0 0 1 6 0v3" /></Icon>;
export const PlusIcon = (p: P) => <Icon {...p}><path d="M12 5v14M5 12h14" /></Icon>;
export const MinusIcon = (p: P) => <Icon {...p}><path d="M5 12h14" /></Icon>;
export const CheckIcon = (p: P) => <Icon {...p}><path d="M5 12.5l4.5 4.5L19 7.5" /></Icon>;
export const CloseIcon = (p: P) => <Icon {...p}><path d="M6 6l12 12M18 6L6 18" /></Icon>;
export const ChevronIcon = (p: P) => <Icon {...p}><path d="M6 9l6 6 6-6" /></Icon>;
// Points "forward": mirrors in RTL.
export const ArrowIcon = ({ className = '', ...p }: P) => (
  <Icon className={`rtl:-scale-x-100 ${className}`} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Icon>
);
export const PhoneIcon = (p: P) => (
  <Icon {...p}><path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></Icon>
);
export const PinIcon = (p: P) => (
  <Icon {...p}><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></Icon>
);
export const WhatsAppIcon = (p: P) => (
  <Icon {...p}>
    <path d="M4 20l1.2-3.9A8.5 8.5 0 1 1 8.1 19z" />
    <path d="M9.2 8.6c.2 2.8 2.9 5.6 5.9 6.1l1.1-1.4-1.8-.9-.9.8c-1-.5-2.2-1.7-2.7-2.7l.8-.9-.8-1.8z" />
  </Icon>
);
export const InstagramIcon = (p: P) => (
  <Icon {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r=".6" fill="currentColor" /></Icon>
);
export const TikTokIcon = (p: P) => (
  <Icon {...p}><path d="M14 3.5v11a3.5 3.5 0 1 1-3.5-3.5" /><path d="M14 3.5c.4 2.6 2.3 4.4 5 4.6" /></Icon>
);
