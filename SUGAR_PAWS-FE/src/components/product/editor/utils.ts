import { DescBlock } from "./BlockEditor";

export const parseHtmlBlocks = (html: string): DescBlock[] => {
  const blocks: DescBlock[] = [];
  if (!html) return blocks;
  const div = document.createElement("div");
  div.innerHTML = html;
  div.childNodes.forEach((node) => {
    if (node.nodeType === 1) {
      const el = node as HTMLElement;
      if (el.tagName === "P") {
        // Extract only plain text for editing
        blocks.push({ type: "paragraph", value: el.innerText });
      } else if (el.tagName === "H2") {
        blocks.push({ type: "heading", value: el.innerText });
      } else if (el.tagName === "BLOCKQUOTE") {
        // For blockquote, get text content (strip inner tags)
        blocks.push({ type: "quote", value: el.innerText });
      } else if (el.tagName === "TABLE") {
        blocks.push({ type: "table", value: el.outerHTML });
      }
    }
  });
  return blocks;
};

export function parseTable(html: string): string[][] {
  if (!html) return [[""]];
  const div = document.createElement("div");
  div.innerHTML = html;
  const table = div.querySelector("table");
  if (!table) return [[""]];
  return Array.from(table.rows).map((row) =>
    Array.from(row.cells).map((cell) => cell.innerText),
  );
}

export function tableToHtml(data: string[][]): string {
  return (
    '<table style="width: 100%;">' +
    data
      .map(
        (row) =>
          "<tr>" +
          row.map((cell) => `<td>${cell || "&nbsp;"}</td>`).join("") +
          "</tr>",
      )
      .join("") +
    "</table>"
  );
}

export const blocksToHtml = (
  blocks: DescBlock[],
  tableStates: Record<number, string[][]>,
): string => {
  return blocks
    .map((block, idx) => {
      if (block.type === "paragraph") return `<p>${block.value}</p>`;
      if (block.type === "heading") return `<h2>${block.value}</h2>`;
      if (block.type === "quote")
        return `<blockquote><p>${block.value}</p></blockquote>`;
      if (block.type === "table")
        return tableToHtml(tableStates[idx] || [[""]]);
      return "";
    })
    .join("");
};
