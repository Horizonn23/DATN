import React from "react";
import { Button } from "@mantine/core";

interface TableEditorProps {
  data: string[][];
  updateCell: (rowIdx: number, colIdx: number, value: string) => void;
  addRow: () => void;
  addCol: () => void;
  removeRow: (rowIdx: number) => void;
  removeCol: (colIdx: number) => void;
}

const TableEditor: React.FC<TableEditorProps> = ({
  data,
  updateCell,
  addRow,
  addCol,
  removeRow,
  removeCol,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="border border-gray-300 w-full mb-2">
        <tbody>
          {data.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {row.map((cell, colIdx) => (
                <td key={colIdx} className="border p-1">
                  <input
                    className="border px-1 py-0.5 w-24"
                    value={cell}
                    onChange={(e) => updateCell(rowIdx, colIdx, e.target.value)}
                  />
                  {rowIdx === 0 && data[0].length > 1 && (
                    <button
                      type="button"
                      className="ml-1 text-xs text-red-500"
                      onClick={() => removeCol(colIdx)}
                      title="Remove column"
                    >
                      ×
                    </button>
                  )}
                </td>
              ))}
              {row.length > 0 && (
                <td>
                  <button
                    type="button"
                    className="text-xs text-red-500"
                    onClick={() => removeRow(rowIdx)}
                    title="Remove row"
                  >
                    ×
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex gap-2 mb-2">
        <Button size="xs" variant="light" onClick={addRow} type="button">
          + Row
        </Button>
        <Button size="xs" variant="light" onClick={addCol} type="button">
          + Column
        </Button>
      </div>
    </div>
  );
};

export default TableEditor;
