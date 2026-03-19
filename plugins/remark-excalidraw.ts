/**
 * Transforms:
 *   <Excalidraw>
 *   ```mermaid
 *   graph TD ...
 *   ```
 *   </Excalidraw>
 *
 * Into:
 *   <ExcalidrawDiagram chart="graph TD ..." />
 *
 * This runs at MDX compile time (pure AST manipulation, no rendering).
 * The actual SVG conversion happens in the ExcalidrawDiagram client component.
 */

import type { Code, Root } from "mdast";
import type { MdxJsxAttribute, MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

export const remarkExcalidraw: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, "mdxJsxFlowElement", (node, index, parent) => {
      const jsxNode = node as unknown as MdxJsxFlowElement;
      if (jsxNode.name !== "Excalidraw") return;
      if (index == null || !parent) return;

      const code = jsxNode.children.find(
        (c): c is Code => c.type === "code" && (c as Code).lang === "mermaid",
      );
      if (!code) return;

      const replacement: MdxJsxFlowElement = {
        type: "mdxJsxFlowElement",
        name: "ExcalidrawDiagram",
        attributes: [
          {
            type: "mdxJsxAttribute",
            name: "chart",
            value: code.value,
          } as MdxJsxAttribute,
        ],
        children: [],
      };

      (parent.children as unknown[])[index] = replacement;
    });
  };
};
