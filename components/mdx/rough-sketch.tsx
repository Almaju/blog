"use client";

import { useEffect, useRef } from "react";

type RoughOptions = {
  roughness?: number;
  bowing?: number;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  fillStyle?:
    | "solid"
    | "hachure"
    | "zigzag"
    | "cross-hatch"
    | "dots"
    | "dashed"
    | "zigzag-line";
  fillWeight?: number;
  hachureAngle?: number;
  hachureGap?: number;
  seed?: number;
};

type Shape =
  | { type: "rectangle"; x: number; y: number; width: number; height: number; options?: RoughOptions }
  | { type: "ellipse"; x: number; y: number; width: number; height: number; options?: RoughOptions }
  | { type: "circle"; x: number; y: number; diameter: number; options?: RoughOptions }
  | { type: "line"; x1: number; y1: number; x2: number; y2: number; options?: RoughOptions }
  | { type: "polygon"; points: [number, number][]; options?: RoughOptions }
  | { type: "arc"; x: number; y: number; width: number; height: number; start: number; stop: number; closed?: boolean; options?: RoughOptions }
  | { type: "path"; d: string; options?: RoughOptions }
  | { type: "text"; x: number; y: number; text: string; fontSize?: number; fontFamily?: string };

interface RoughSketchProps {
  shapes: Shape[] | string;
  width?: number;
  height?: number;
  roughness?: number;
  stroke?: string;
  className?: string;
}

export function RoughSketch({
  shapes,
  width = 400,
  height = 300,
  roughness = 1.5,
  stroke = "currentColor",
  className,
}: RoughSketchProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const parsedShapes: Shape[] =
    typeof shapes === "string" ? JSON.parse(shapes) : shapes;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    import("roughjs").then(({ default: rough }) => {
      // Clear previous drawings (keep any non-rough children)
      while (svg.firstChild) svg.removeChild(svg.firstChild);

      const rc = rough.svg(svg);
      const defaultOptions: RoughOptions = { roughness, stroke };

      for (const shape of parsedShapes) {
        if (shape.type === "text") {
          const text = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text",
          );
          text.setAttribute("x", String(shape.x));
          text.setAttribute("y", String(shape.y));
          text.setAttribute(
            "font-size",
            String(shape.fontSize ?? 14),
          );
          text.setAttribute(
            "font-family",
            shape.fontFamily ?? "inherit",
          );
          text.setAttribute("fill", "currentColor");
          text.textContent = shape.text;
          svg.appendChild(text);
          continue;
        }

        const opts = { ...defaultOptions, ...shape.options };
        let node: SVGGElement | null = null;

        switch (shape.type) {
          case "rectangle":
            node = rc.rectangle(shape.x, shape.y, shape.width, shape.height, opts);
            break;
          case "ellipse":
            node = rc.ellipse(
              shape.x + shape.width / 2,
              shape.y + shape.height / 2,
              shape.width,
              shape.height,
              opts,
            );
            break;
          case "circle":
            node = rc.circle(shape.x, shape.y, shape.diameter, opts);
            break;
          case "line":
            node = rc.line(shape.x1, shape.y1, shape.x2, shape.y2, opts);
            break;
          case "polygon":
            node = rc.polygon(shape.points, opts);
            break;
          case "arc":
            node = rc.arc(
              shape.x,
              shape.y,
              shape.width,
              shape.height,
              shape.start,
              shape.stop,
              shape.closed ?? false,
              opts,
            );
            break;
          case "path":
            node = rc.path(shape.d, opts);
            break;
        }

        if (node) svg.appendChild(node);
      }
    });
  }, [parsedShapes, roughness, stroke]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={{ maxWidth: "100%", height: "auto" }}
    />
  );
}
