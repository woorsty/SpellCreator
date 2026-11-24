import React, { PropsWithChildren, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

type DialogProps = PropsWithChildren & {
  open: boolean;
  onClose: () => void;
  title?: string;
};

export function Dialog({ open, onClose, title, children }: DialogProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl p-4">
        <div
          className="dnd-panel p-6 rounded-2xl shadow-dnd relative max-h-[85vh] overflow-y-auto"
        >
          {title && (
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-serif font-bold text-text dnd-gradient-text">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="rounded p-1.5 text-text-muted hover:text-text hover:bg-surface-2 transition-colors"
                aria-label="Schließen"
              >
                ✕
              </button>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
