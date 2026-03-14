import type { ReactNode } from "react";

export function Objection({ children }: { children: ReactNode }) {
  return (
    <div className="not-prose my-6 rounded-lg border border-amber-500/20 bg-amber-500/5 px-5 py-4">
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400 opacity-80">
        You&apos;re thinking
      </p>
      <p className="text-base italic text-fd-foreground/80">&ldquo;{children}&rdquo;</p>
    </div>
  );
}
