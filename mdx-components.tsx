import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import * as TabsComponents from "fumadocs-ui/components/tabs";
import { Callout } from "fumadocs-ui/components/callout";

import { ExcalidrawDiagram } from "@/components/mdx/excalidraw-diagram";
import { Objection } from "@/components/mdx/objection";
import { Principle } from "@/components/mdx/principle";
import { RoughAnnotation } from "@/components/mdx/rough-annotation";
import { RoughSketch } from "@/components/mdx/rough-sketch";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Callout,
    ExcalidrawDiagram,
    Objection,
    Principle,
    RoughAnnotation,
    RoughSketch,
    ...TabsComponents,
    ...components,
  };
}
