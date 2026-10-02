import type { SVGProps } from "react";
import type { IconKey } from "@/lib/types";

type P = SVGProps<SVGSVGElement>;

const base = (props: P) => ({
  viewBox: "0 0 24 24",
  width: 24,
  height: 24,
  fill: "none",
  ...props,
});

export const PizzaIcon = (p: P) => (
  <svg {...base(p)}>
    <path
      d="M12 3 21 19a1 1 0 0 1-1 1.3L4 21 12 3Z"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinejoin="round"
    />
    <circle cx="11" cy="11" r="1.3" fill="currentColor" />
    <circle cx="14" cy="15" r="1.3" fill="currentColor" />
    <circle cx="9.5" cy="16" r="1.1" fill="currentColor" />
  </svg>
);

export const SandwichIcon = (p: P) => (
  <svg {...base(p)}>
    <path
      d="M4 8c0-2 4-3 8-3s8 1 8 3M3 8h18M5 11h14M4.5 14c.7 3 3.5 5 7.5 5s6.8-2 7.5-5"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const TacoIcon = (p: P) => (
  <svg {...base(p)}>
    <path
      d="M3 16a9 9 0 0 1 18 0H3Z"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinejoin="round"
    />
    <path d="M3 16h18" stroke="currentColor" strokeWidth={1.7} />
    <circle cx="9" cy="13" r="1" fill="currentColor" />
    <circle cx="14" cy="12.5" r="1" fill="currentColor" />
  </svg>
);

export const BowlIcon = (p: P) => (
  <svg {...base(p)}>
    <path
      d="M3 11h18a9 9 0 0 1-18 0Z"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinejoin="round"
    />
    <path d="M7 11a5 5 0 0 1 10 0" stroke="currentColor" strokeWidth={1.7} />
  </svg>
);

export const DrinkIcon = (p: P) => (
  <svg {...base(p)}>
    <path
      d="M6 4h12l-1.5 16h-9L6 4Z"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinejoin="round"
    />
    <path d="M6.6 9h10.8" stroke="currentColor" strokeWidth={1.7} />
  </svg>
);

export const ExtraIcon = (p: P) => (
  <svg {...base(p)}>
    <path
      d="M5 9 12 4l7 5v8l-7 4-7-4V9Z"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinejoin="round"
    />
  </svg>
);

export const ClockIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth={1.7} />
    <path
      d="M12 7.5V12l3 2"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
    />
  </svg>
);

export const ScooterIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="6" cy="18" r="2.4" stroke="currentColor" strokeWidth={1.7} />
    <circle cx="18" cy="18" r="2.4" stroke="currentColor" strokeWidth={1.7} />
    <path
      d="M8.4 18h7.2M3 6h3l3 9M14 9h3l2.5 6M14 9V6h4"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const PinIcon = (p: P) => (
  <svg {...base(p)}>
    <path
      d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11Z"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinejoin="round"
    />
    <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth={1.7} />
  </svg>
);

export const PhoneIcon = (p: P) => (
  <svg {...base(p)}>
    <path
      d="M6 3h3l1.5 5L8 9.5a12 12 0 0 0 6.5 6.5L16 14l5 1.5V19a2 2 0 0 1-2.2 2A16 16 0 0 1 3 5.2 2 2 0 0 1 5 3Z"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinejoin="round"
    />
  </svg>
);

export const WhatsAppIcon = (p: P) => (
  <svg {...base({ ...p, fill: "currentColor" })}>
    <path d="M12 2a10 10 0 0 0-8.6 15l-1.2 4.4 4.5-1.2A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2s-1.1.3-3.6-.8-3.9-3.6-4-3.8-1-1.3-1-2.5.6-1.8.8-2 .4-.3.6-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .6l-.4.5c-.2.2-.3.4-.1.7s.7 1.2 1.6 1.9c1.1.9 1.9 1.2 2.2 1.3s.4.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l1.9.9c.2.1.4.2.4.3s0 .8-.2 1.2Z" />
  </svg>
);

export const FacebookIcon = (p: P) => (
  <svg {...base({ ...p, fill: "currentColor" })}>
    <path d="M14 9h2.5V6H14c-2.2 0-3.5 1.4-3.5 3.6V11H8.5v3h2v6h3v-6H16l.5-3h-3V9.7C13.5 9.2 13.6 9 14 9Z" />
  </svg>
);

export const InstagramIcon = (p: P) => (
  <svg {...base(p)}>
    <rect x="4" y="4" width="16" height="16" rx="5" stroke="currentColor" strokeWidth={1.9} />
    <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth={1.9} />
    <circle cx="16.4" cy="7.6" r="1.1" fill="currentColor" />
  </svg>
);

const FOOD: Record<IconKey, (p: P) => JSX.Element> = {
  pizza: PizzaIcon,
  sandwich: SandwichIcon,
  taco: TacoIcon,
  bowl: BowlIcon,
  drink: DrinkIcon,
  extra: ExtraIcon,
};

export function FoodIcon({ name, ...p }: { name: IconKey } & P) {
  const C = FOOD[name];
  return <C {...p} />;
}
