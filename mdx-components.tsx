import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import * as TabsComponents from "fumadocs-ui/components/tabs";
import { Callout } from "fumadocs-ui/components/callout";

import { Mermaid } from "@/components/mdx/mermaid";
import { Principle } from "@/components/mdx/principle";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Callout,
    Mermaid,
    Principle,
    ...TabsComponents,
    ...components,
  };
}
