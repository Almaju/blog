import type { ReactNode } from "react";

export function Principle({ children }: { children: ReactNode }) {
  return (
    <div className="not-prose mb-14 rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-600/10 to-purple-600/10 dark:from-blue-400/10 dark:to-purple-400/10 px-8 py-8">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 opacity-70">
        The Principle
      </p>
      <p className="text-2xl font-bold leading-snug text-fd-foreground">
        {children}
      </p>
    </div>
  );
}
