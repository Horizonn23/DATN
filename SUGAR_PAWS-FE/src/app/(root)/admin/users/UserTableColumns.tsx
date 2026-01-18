import { User } from "@/types/user";
import { type MRT_ColumnDef } from "mantine-react-table";
import { Text, Tooltip, Badge, Group, ActionIcon } from "@mantine/core";
import { FiEye, FiEdit, FiTrash } from "react-icons/fi";

interface UserTableColumnsProps {
  onEditUser: (user: User) => void;
  onViewUser: (user: User) => void;
  onDeleteUser: (userId: string | number) => void;
}

export const createUserTableColumns = ({
  onEditUser,
  onViewUser,
  onDeleteUser,
}: UserTableColumnsProps): MRT_ColumnDef<User>[] => [
  {
    accessorKey: "id",
    header: "ID",
    size: 80,
    Cell: ({ cell }) => {
      const value = cell.getValue<string | number>();
      const idString = String(value);
      return (
        <Text fw={500} c="blue" className="text-center">
          #{idString.slice(-6)}
        </Text>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    size: 150,
    Cell: ({ cell }) => {
      const value = cell.getValue<string>();
      return (
        <Tooltip label={value} position="top-start">
          <Text fw={500} lineClamp={2} className="cursor-help">
            {value}
          </Text>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    size: 200,
    Cell: ({ cell }) => {
      const value = cell.getValue<string>();
      return (
        <Tooltip label={value} position="top-start">
          <Text fw={500} lineClamp={1} className="cursor-help">
            {value}
          </Text>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "username",
    header: "Username",
    size: 150,
    Cell: ({ cell }) => {
      const value = cell.getValue<string>();
      return <Text fw={500}>{value}</Text>;
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
    size: 150,
    Cell: ({ cell }) => {
      const value = cell.getValue<string | null>();
      return value ? (
        <Text fw={500}>{value}</Text>
      ) : (
        <Text c="dimmed" fs="italic">
          Not provided
        </Text>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    size: 100,
    Cell: ({ cell }) => {
      const value = cell.getValue<string>();
      return (
        <Badge
          color={value === "ADMIN" ? "purple" : "green"}
          variant="light"
          size="sm"
        >
          {value}
        </Badge>
      );
    },
  },
  {
    accessorKey: "gender",
    header: "Gender",
    size: 100,
    Cell: ({ cell }) => {
      const value = cell.getValue<string | null>();

      if (!value) {
        return (
          <Text c="dimmed" fs="italic">
            Not specified
          </Text>
        );
      }

      const getGenderBadgeProps = (gender: string) => {
        switch (gender.toLowerCase()) {
          case "male":
            return { color: "blue", label: "Male" };
          case "female":
            return { color: "pink", label: "Female" };
          case "other":
            return { color: "grape", label: "Other" };
          default:
            return { color: "gray", label: gender };
        }
      };

      const { color, label } = getGenderBadgeProps(value);

      return (
        <Badge color={color} variant="light" size="sm">
          {label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "isVerified",
    header: "Verified",
    size: 100,
    Cell: ({ cell }) => {
      const value = cell.getValue<boolean>();
      return (
        <Badge color={value ? "green" : "red"} variant="light" size="sm">
          {value ? "Yes" : "No"}
        </Badge>
      );
    },
  },
  {
    id: "birthdate",
    header: "Date of Birth",
    size: 150,
    Cell: ({ row }) => {
      const { dayOfBirth, monthOfBirth, yearOfBirth } = row.original;
      if (!dayOfBirth || !monthOfBirth || !yearOfBirth) {
        return (
          <Text c="dimmed" fs="italic">
            Not provided
          </Text>
        );
      }
      return (
        <Text fw={500}>
          {dayOfBirth}/{monthOfBirth}/{yearOfBirth}
        </Text>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    size: 150,
    Cell: ({ row }) => (
      <Group gap="xs">
        <Tooltip label="View User Details">
          <ActionIcon
            variant="light"
            color="blue"
            onClick={(e) => {
              e.stopPropagation();
              onViewUser(row.original);
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
              onEditUser(row.original);
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
              if (row.original.id !== undefined) {
                onDeleteUser(row.original.id);
              }
            }}
          >
            <FiTrash />
          </ActionIcon>
        </Tooltip>
      </Group>
    ),
    enableSorting: false,
  },
];
