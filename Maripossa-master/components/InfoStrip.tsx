"use client";

import { useStore } from "./StoreProvider";
import { ClockIcon, ScooterIcon, PinIcon } from "./Icons";
import { CITY, HOURS } from "@/lib/constants";
import { useEffect, useState } from "react";

function useIsOpen() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const checkOpen = () => {
      const now = new Date();
      // Get current hour in Tunisia (UTC+1)
      const tunisiaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Africa/Tunis' }));
      const hours = tunisiaTime.getHours();
      
      // Open from 10:00 to 05:00 next day
      if (hours >= 10 || hours < 5) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };
    checkOpen();
    const interval = setInterval(checkOpen, 60000);
    return () => clearInterval(interval);
  }, []);

  return { isOpen, isClient };
}

export function InfoStrip() {
  const { t, state } = useStore();
  const { isOpen, isClient } = useIsOpen();

  const openStatus = isClient ? (
    <>
      <span className="font-extrabold uppercase tracking-widest leading-tight">
        {state.lang === 'ar' ? (isOpen ? 'مفتوح' : 'مغلق') : (isOpen ? 'OUVERT' : 'FERMÉ')}
      </span>
      <br className="md:hidden" />
      <span className="hidden md:inline"> </span>
      <span className="text-[9px] md:text-[11px] font-extrabold uppercase tracking-widest leading-tight">
        {state.lang === 'ar' ? 'الآن' : 'MAINTENANT'}
      </span>
    </>
  ) : null;

  const statusColor = isClient 
    ? (isOpen ? 'text-basil' : 'text-ember-d')
    : 'text-muted';

  const cells = [
    { 
      Icon: ClockIcon, 
      label: t.openLabel, 
      value: HOURS, 
      sub: openStatus,
      subColor: statusColor
    },
    { 
      Icon: ScooterIcon, 
      label: t.deliveryLabel, 
      value: t.deliveryPickup, 
      sub: t.deliveryPartner,
      subColor: "text-ink/70"
    },
    { 
      Icon: PinIcon, 
      label: t.locLabel, 
      value: CITY, 
      sub: (
        <>
          {t.locValLine1}
          <br className="md:hidden" />
          <span className="hidden md:inline"> </span>
          {t.locValLine2}
        </>
      ),
      subColor: "text-ink/70"
    },
  ];

  return (
    <div className="relative z-10 mx-auto -mt-12 w-full max-w-2xl px-[18px]">
      <div className="grid grid-cols-3 overflow-hidden rounded-[20px] border border-line bg-surface shadow-lift">
        {cells.map(({ Icon, label, value, sub, subColor }, i) => (
          <div
            key={i}
            className={`px-2 py-4 text-center md:py-5 ${
              i > 0 ? "border-s border-line" : ""
            }`}
          >
            <div className="flex justify-center text-ember">
              <Icon width={22} height={22} />
            </div>
            <div className="mt-2 text-[9.5px] font-bold uppercase tracking-[1.5px] text-muted">
              {label}
            </div>
            <div className="mt-0.5 text-[12.5px] font-bold text-ink">{value}</div>
            {sub && (
              <div className={`mt-0.5 text-[10px] font-bold tracking-wide ${subColor}`}>
                {sub}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
