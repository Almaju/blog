import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export function baseOptions(): BaseLayoutProps {
  return {
    links: [],
    nav: {
      title: (
        <span className="inline-flex items-center gap-[0.3em] align-middle font-semibold tracking-tight [font-family:var(--font-serif),Georgia,serif]">
          <span className="text-[1.5em] leading-none flex items-center -mt-1">
            ∴
          </span>
          <span>The Unwrap</span>
        </span>
      ),
    },
  };
}
