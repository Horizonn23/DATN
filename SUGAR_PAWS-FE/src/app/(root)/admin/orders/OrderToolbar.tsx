import { Button, Text } from "@mantine/core";
import { FaTrash, FaDollarSign, FaFileExport } from "react-icons/fa";

interface OrderToolbarProps {
  selectedOrderIds: number[];
  onBulkDelete: () => void;
  onMarkAsPaid: () => void;
  onExportSelected: () => void;
  isMarkingAsPaid?: boolean;
}

export default function OrderToolbar({
  selectedOrderIds,
  onBulkDelete,
  onMarkAsPaid,
  onExportSelected,
  isMarkingAsPaid = false,
}: OrderToolbarProps) {
  const selectedCount = selectedOrderIds.length;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {selectedCount > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 mr-4">
          <Text size="sm" fw={600} c="blue">
            {selectedCount} order(s) selected
          </Text>
        </div>
      )}
      <Button
        color="green"
        variant="light"
        onClick={onMarkAsPaid}
        disabled={selectedCount === 0}
        loading={isMarkingAsPaid}
        leftSection={<FaDollarSign />}
        size="sm"
        className="hover:shadow-md transition-shadow"
      >
        Mark as Paid ({selectedCount})
      </Button>
      <Button
        color="blue"
        variant="light"
        onClick={onExportSelected}
        disabled={selectedCount === 0}
        leftSection={<FaFileExport />}
        size="sm"
        className="hover:shadow-md transition-shadow"
      >
        Export Selected
      </Button>
    </div>
  );
}
