"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

type AnnotationType =
  | "underline"
  | "box"
  | "circle"
  | "highlight"
  | "strike-through"
  | "crossed-off"
  | "bracket";

interface RoughAnnotationProps {
  type?: AnnotationType;
  color?: string;
  animate?: boolean;
  animationDuration?: number;
  multiline?: boolean;
  strokeWidth?: number;
  padding?: number | [number, number] | [number, number, number, number];
  children: React.ReactNode;
  className?: string;
}

// Defaults that are readable in each theme when no color is explicitly provided.
const DEFAULTS = {
  light: { stroke: "#1c1c1c", highlight: "#fef08a" },
  dark:  { stroke: "#e5e5e5", highlight: "#713f12" },
};

export function RoughAnnotation({
  type = "underline",
  color,
  animate = true,
  animationDuration = 800,
  multiline = true,
  strokeWidth,
  padding,
  children,
  className,
}: RoughAnnotationProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const annotationRef = useRef<{ remove(): void } | null>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    if (!ref.current) return;

    const defaults = isDark ? DEFAULTS.dark : DEFAULTS.light;
    const resolvedColor = color ?? (type === "highlight" ? defaults.highlight : defaults.stroke);

    import("rough-notation").then(({ annotate }) => {
      if (!ref.current) return;
      annotationRef.current?.remove();
      const annotation = annotate(ref.current, {
        type,
        color: resolvedColor,
        animate,
        animationDuration,
        multiline,
        strokeWidth,
        padding,
      });
      annotationRef.current = annotation;
      annotation.show();
    });

    return () => {
      annotationRef.current?.remove();
      annotationRef.current = null;
    };
  }, [type, color, animate, animationDuration, multiline, strokeWidth, padding, isDark]);

  return (
    <span ref={ref} className={className}>
      {children}
    </span>
  );
}
