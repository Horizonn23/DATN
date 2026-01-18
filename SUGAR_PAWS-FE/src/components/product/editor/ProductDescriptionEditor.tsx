import React from "react";
import { Group, Button } from "@mantine/core";
import BlockEditor, { DescBlock } from "./BlockEditor";
import { BLOCK_TYPES } from "./constants";

interface ProductDescriptionEditorProps {
  descBlocks: DescBlock[];
  setDescBlocks: React.Dispatch<React.SetStateAction<DescBlock[]>>;
  tableStates: Record<number, string[][]>;
  setTableStates: React.Dispatch<
    React.SetStateAction<Record<number, string[][]>>
  >;
}

const ProductDescriptionEditor: React.FC<ProductDescriptionEditorProps> = ({
  descBlocks,
  setDescBlocks,
  tableStates,
  setTableStates,
}) => {
  const addBlock = (type: DescBlock["type"]) => {
    setDescBlocks((prev) => [...prev, { type, value: "" } as DescBlock]);
  };

  const removeBlock = (idx: number) => {
    setDescBlocks((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateBlock = (idx: number, value: string) => {
    setDescBlocks((prev) =>
      prev.map((b, i) => (i === idx ? { ...b, value } : b)),
    );
  };

  const changeBlockType = (idx: number, type: DescBlock["type"]) => {
    setDescBlocks((prev) =>
      prev.map((b, i) => (i === idx ? ({ type, value: "" } as DescBlock) : b)),
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold">Product Description</span>
        <Group gap={4}>
          {BLOCK_TYPES.map((t) => (
            <Button
              key={t.value}
              size="xs"
              variant="light"
              onClick={(e) => {
                e.preventDefault();
                addBlock(t.value as DescBlock["type"]);
              }}
            >
              + {t.label}
            </Button>
          ))}
        </Group>
      </div>
      <div className="text-xs text-gray-500 mb-2">
        <ul className="list-disc ml-4">
          <li>Paragraph: For normal text blocks.</li>
          <li>Heading: For section titles.</li>
          <li>Quote: For highlighted quotes or notes.</li>
          <li>
            Table: Paste HTML table or copy from Excel/Word (use{" "}
            <b>Paste as HTML</b> if possible).
          </li>
        </ul>
      </div>
      <div className="flex flex-col gap-2">
        {descBlocks.map((block, idx) => (
          <BlockEditor
            key={idx}
            block={block}
            index={idx}
            changeBlockType={changeBlockType}
            removeBlock={removeBlock}
            updateBlock={updateBlock}
            tableStates={tableStates}
            setTableStates={setTableStates}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductDescriptionEditor;
