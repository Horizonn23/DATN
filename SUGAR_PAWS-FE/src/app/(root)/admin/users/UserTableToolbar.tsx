import { Button } from "@mantine/core";
import { FaUser } from "react-icons/fa";

interface UserTableToolbarProps {
  onAddUser: () => void;
  onExport: () => void;
  onBulkDelete: () => void;
  selectedCount: number;
}

export default function UserTableToolbar({
  onAddUser,
  onExport,
  onBulkDelete,
  selectedCount,
}: UserTableToolbarProps) {
  return (
    <div className="flex gap-2">
      <Button
        color="green"
        onClick={onAddUser}
        leftSection={<FaUser />}
        size="sm"
      >
        Add User
      </Button>
      <Button
        color="blue"
        variant="light"
        onClick={onExport}
        size="sm"
        disabled={selectedCount === 0}
      >
        Export Selected
      </Button>
      <Button
        color="red"
        variant="light"
        onClick={onBulkDelete}
        size="sm"
        disabled={selectedCount === 0}
      >
        Delete Selected ({selectedCount})
      </Button>
    </div>
  );
}
