"use client";

import { useState } from "react";

type SlideAcknowledgeProps = {
  onComplete: () => Promise<void>;
  disabled?: boolean;
};

export function SlideAcknowledge({ onComplete, disabled }: SlideAcknowledgeProps) {
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);

  const onChange = async (nextValue: number) => {
    setValue(nextValue);

    if (nextValue >= 100 && !loading && !disabled) {
      setLoading(true);
      try {
        await onComplete();
      } finally {
        setTimeout(() => {
          setValue(0);
          setLoading(false);
        }, 300);
      }
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[#4d392c]">Slide to acknowledge</label>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        disabled={disabled || loading}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-[#8a583a]"
      />
      <p className="text-xs text-[#6d5848]">Slide all the way right to stop ringing alert.</p>
    </div>
  );
}
