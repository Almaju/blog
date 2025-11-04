import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import * as TabsComponents from "fumadocs-ui/components/tabs";

import { Mermaid } from "@/components/mdx/mermaid";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Mermaid,
    ...TabsComponents,
    ...components,
  };
}
