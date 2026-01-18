import React from "react";
import { Group, Select, Button, Textarea, TextInput } from "@mantine/core";
import TableEditor from "./TableEditor";
import { BLOCK_TYPES } from "./constants";

export type DescBlock =
  | { type: "paragraph"; value: string }
  | { type: "heading"; value: string }
  | { type: "quote"; value: string }
  | { type: "table"; value: string };

interface BlockEditorProps {
  block: DescBlock;
  index: number;
  changeBlockType: (idx: number, type: DescBlock["type"]) => void;
  removeBlock: (idx: number) => void;
  updateBlock: (idx: number, value: string) => void;
  tableStates: Record<number, string[][]>;
  setTableStates: React.Dispatch<
    React.SetStateAction<Record<number, string[][]>>
  >;
}

const BlockEditor: React.FC<BlockEditorProps> = ({
  block,
  index,
  changeBlockType,
  removeBlock,
  updateBlock,
  tableStates,
  setTableStates,
}) => {
  // Table editing functions
  const renderTableEditor = (idx: number) => {
    const data = tableStates[idx] || [[""]];
    const updateCell = (rowIdx: number, colIdx: number, value: string) => {
      setTableStates((prev) => ({
        ...prev,
        [idx]: prev[idx].map((row, r) =>
          r === rowIdx
            ? row.map((cell, c) => (c === colIdx ? value : cell))
            : row,
        ),
      }));
    };
    const addRow = () => {
      setTableStates((prev) => ({
        ...prev,
        [idx]: [
          ...(prev[idx] || []),
          Array(prev[idx]?.[0]?.length || 1).fill(""),
        ],
      }));
    };
    const addCol = () => {
      setTableStates((prev) => ({
        ...prev,
        [idx]: (prev[idx] || []).map((row) => [...row, ""]),
      }));
    };
    const removeRow = (rowIdx: number) => {
      setTableStates((prev) => ({
        ...prev,
        [idx]: prev[idx].filter((_, r) => r !== rowIdx),
      }));
    };
    const removeCol = (colIdx: number) => {
      setTableStates((prev) => ({
        ...prev,
        [idx]: (prev[idx] || []).map((row) =>
          row.filter((_, c) => c !== colIdx),
        ),
      }));
    };
    return (
      <TableEditor
        data={data}
        updateCell={updateCell}
        addRow={addRow}
        addCol={addCol}
        removeRow={removeRow}
        removeCol={removeCol}
      />
    );
  };

  return (
    <div className="border rounded p-2 bg-gray-50 relative">
      <Group className="mb-1 gap-1">
        <Select
          data={BLOCK_TYPES}
          value={block.type}
          onChange={(v) => v && changeBlockType(index, v as DescBlock["type"])}
          size="xs"
          style={{ width: 120 }}
        />
        <Button
          size="xs"
          color="red"
          variant="subtle"
          onClick={() => removeBlock(index)}
        >
          Delete
        </Button>
      </Group>
      {block.type === "paragraph" && (
        <Textarea
          placeholder="Enter paragraph text..."
          value={block.value}
          onChange={(e) => updateBlock(index, e.target.value)}
          autosize
          minRows={2}
        />
      )}
      {block.type === "heading" && (
        <TextInput
          placeholder="Enter heading..."
          value={block.value}
          onChange={(e) => updateBlock(index, e.target.value)}
        />
      )}
      {block.type === "quote" && (
        <Textarea
          placeholder="Enter quote..."
          value={block.value}
          onChange={(e) => updateBlock(index, e.target.value)}
          autosize
          minRows={2}
        />
      )}
      {block.type === "table" && renderTableEditor(index)}
    </div>
  );
};

export default BlockEditor;
