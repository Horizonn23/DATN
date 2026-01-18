import { User } from "@/types/user";
import { Group, ActionIcon, Tooltip } from "@mantine/core";
import { FiEye, FiEdit, FiTrash } from "react-icons/fi";

interface UserTableActionsProps {
  user: User;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (userId: string | number) => void;
}

export default function UserTableActions({
  user,
  onView,
  onEdit,
  onDelete,
}: UserTableActionsProps) {
  return (
    <Group gap="xs">
      <Tooltip label="View User Details">
        <ActionIcon
          variant="light"
          color="blue"
          onClick={(e) => {
            e.stopPropagation();
            onView(user);
          }}
        >
          <FiEye />
        </ActionIcon>
      </Tooltip>
      <Tooltip label="Edit User">
        <ActionIcon
          variant="light"
          color="orange"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(user);
          }}
        >
          <FiEdit />
        </ActionIcon>
      </Tooltip>
      <Tooltip label="Delete User">
        <ActionIcon
          variant="light"
          color="red"
          onClick={(e) => {
            e.stopPropagation();
            if (user.id !== undefined) {
              onDelete(user.id);
            }
          }}
        >
          <FiTrash />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
}
