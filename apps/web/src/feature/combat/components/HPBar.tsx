import React from "react";

type HPBarProps = {
  hp: number;
  maxHp: number;
  tempHp: number;
};

export function HPBar({ hp, maxHp, tempHp }: HPBarProps) {
  const pct = maxHp <= 0 ? 0 : Math.max(0, Math.min(100, (hp / maxHp) * 100));
  const tempPct =
    maxHp <= 0 ? 0 : Math.max(0, Math.min(100 - pct, (tempHp / maxHp) * 100));

  const hpColor =
    pct > 60 ? "bg-success" : pct > 30 ? "bg-warning" : "bg-danger";

  return (
    <div className="w-full h-2 rounded-full border border-white/10 bg-gray-800 overflow-hidden">
      <div
        className={`h-full ${hpColor} transition-all duration-300`}
        style={{ width: `${pct}%` }}
      />
      {tempHp > 0 && (
        <div
          className="h-full bg-primary/40 transition-all duration-300"
          style={{ width: `${tempPct}%` }}
        />
      )}
    </div>
  );
}
