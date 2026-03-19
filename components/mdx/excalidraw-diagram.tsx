"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

// Replaces ❌/✅ emoji in excalidraw SVG text nodes with roughjs hand-drawn icons.
// Runs in the browser where getComputedTextLength() is available.
type RoughGen = ReturnType<typeof import("roughjs").default.generator>;

async function replaceEmojiWithRoughIcons(svgEl: SVGSVGElement, gen: RoughGen) {
  // Temporarily mount into the DOM so getComputedTextLength() works on text nodes
  const host = document.createElement("div");
  host.style.cssText = "position:absolute;visibility:hidden;pointer-events:none;left:-9999px;top:-9999px";
  document.body.appendChild(host);
  host.appendChild(svgEl);
  try {
    _replaceEmojiWithRoughIcons(svgEl, gen);
  } finally {
    host.removeChild(svgEl);
    document.body.removeChild(host);
  }
}

function _replaceEmojiWithRoughIcons(svgEl: SVGSVGElement, gen: RoughGen) {
  const ICONS = {
    "❌": (gen: RoughGen, x: number, y: number, s: number, c: string) => {
      const pad = s * 0.1;
      return [
        gen.line(x + pad, y + pad, x + s - pad, y + s - pad, { stroke: c, strokeWidth: 1.5, roughness: 1.8, seed: 1 }),
        gen.line(x + s - pad, y + pad, x + pad, y + s - pad, { stroke: c, strokeWidth: 1.5, roughness: 1.8, seed: 2 }),
      ];
    },
    "✅": (gen: RoughGen, x: number, y: number, s: number, c: string) => {
      return [
        gen.path(
          `M ${x + 1} ${y + s * 0.5} L ${x + s * 0.38} ${y + s * 0.88} L ${x + s} ${y + s * 0.08}`,
          { stroke: c, strokeWidth: 1.5, roughness: 1.5, seed: 3, fill: "none" },
        ),
      ];
    },
  } as const;

  const COLORS: Record<string, string> = { "❌": "#e03131", "✅": "#2f9e44" };

  for (const textEl of svgEl.querySelectorAll("text")) {
    const text = textEl.textContent ?? "";
    const emoji = (Object.keys(ICONS) as Array<keyof typeof ICONS>).find((e) =>
      text.startsWith(e),
    );
    if (!emoji) continue;

    const color = COLORS[emoji];
    const cx = parseFloat(textEl.getAttribute("x") ?? "0");
    const baseline = parseFloat(textEl.getAttribute("y") ?? "0");
    const fontSize = parseFloat((textEl as SVGTextElement).style.fontSize) || 20;
    const iconSize = fontSize * 0.78;

    // Strip the emoji first, then measure the remaining text.
    // The remaining text is still centered at cx (text-anchor: middle),
    // so its left edge is at cx - restLen/2. Place the icon just left of that.
    textEl.textContent = text.slice(emoji.length);
    const restLen = textEl.getComputedTextLength();
    const iconX = cx - restLen / 2 - iconSize - 2;
    const iconY = baseline - fontSize * 0.82;

    const drawables = ICONS[emoji](gen, iconX, iconY, iconSize, color);
    const parent = textEl.parentElement!;

    for (const drawable of drawables) {
      for (const { d, stroke, strokeWidth, fill } of gen.toPaths(drawable)) {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", d);
        path.setAttribute("stroke", stroke || color);
        path.setAttribute("stroke-width", String(strokeWidth ?? 1.5));
        path.setAttribute("fill", fill || "none");
        path.setAttribute("stroke-linecap", "round");
        path.setAttribute("stroke-linejoin", "round");
        parent.insertBefore(path, textEl);
      }
    }
  }
}

// Excalidraw resolves its font-subsetting worker via import.meta.url, which
// becomes a file:// path in Next.js and is blocked by the browser's same-origin
// policy. We copy the worker to public/ (see postinstall) and redirect here.
function patchWorkerConstructor() {
  if (typeof window === "undefined" || (window as any).__workerPatched) return;
  (window as any).__workerPatched = true;
  const NativeWorker = window.Worker;
  function PatchedWorker(this: Worker, url: string | URL, options?: WorkerOptions) {
    const href = url instanceof URL ? url.href : String(url);
    const resolved =
      href.startsWith("file://") && href.includes("subset-worker")
        ? `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/subset-worker.chunk.js`
        : url;
    return new NativeWorker(resolved, options);
  }
  PatchedWorker.prototype = NativeWorker.prototype;
  window.Worker = PatchedWorker as unknown as typeof Worker;
}

const ExcalidrawInner = dynamic(
  async () => {
    patchWorkerConstructor();
    const [{ convertToExcalidrawElements, exportToSvg }, { parseMermaidToExcalidraw }, rough] =
      await Promise.all([
        import("@excalidraw/excalidraw"),
        import("@excalidraw/mermaid-to-excalidraw"),
        import("roughjs"),
      ]);

    return function ExcalidrawInner({
      chart,
      theme,
    }: {
      chart: string;
      theme: "light" | "dark";
    }) {
      const [svg, setSvg] = useState<string | null>(null);

      const chartWithColors = `${chart}
classDef green fill:transparent,stroke:#2f9e44,color:#2f9e44
classDef red fill:transparent,stroke:#e03131,color:#e03131
classDef yellow fill:transparent,stroke:#f08c00,color:#f08c00`;

      useEffect(() => {
        parseMermaidToExcalidraw(chartWithColors)
          .then(async (result) => {
            const elements = convertToExcalidrawElements(result.elements ?? []);
            const svgEl = await exportToSvg({
              elements: elements as never,
              appState: { exportWithDarkMode: theme === "dark", exportBackground: false },
              files: result.files ?? null,
              exportPadding: 16,
            });
            await replaceEmojiWithRoughIcons(svgEl, rough.default.generator());
            setSvg(svgEl.outerHTML);
          })
          .catch(console.error);
      }, [chart, theme]);

      if (!svg) return null;

      return (
        <div
          className="w-full [&>svg]:w-full [&>svg]:h-auto"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      );
    };
  },
  { ssr: false },
);

export function ExcalidrawDiagram({ chart }: { chart: string }) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const theme = resolvedTheme === "dark" ? "dark" : "light";

  return (
    <div className="my-6 w-full p-4">
      <ExcalidrawInner chart={chart} theme={theme} />
    </div>
  );
}
