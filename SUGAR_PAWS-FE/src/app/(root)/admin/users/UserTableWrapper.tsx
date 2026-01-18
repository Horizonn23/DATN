import { User } from "@/types/user";
import { Title, Text, Button, Paper, Box, LoadingOverlay } from "@mantine/core";
import { FaSync, FaTimes } from "react-icons/fa";
import UserTable from "./UserTable";

interface UserTableWrapperProps {
  users: User[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onRefetch: () => void;
  onAddUser: () => void;
  onEditUser: (user: User) => void;
  onViewUser: (user: User) => void;
  onDeleteUser: (userId: string | number) => void;
  onExport: () => void;
  onBulkDelete: () => void;
  rowSelection: Record<string, boolean>;
  onRowSelectionChange: (selection: Record<string, boolean>) => void;
}

export default function UserTableWrapper({
  users,
  isLoading,
  isError,
  onRefetch,
  onAddUser,
  onEditUser,
  onViewUser,
  onDeleteUser,
  onExport,
  onBulkDelete,
  rowSelection,
  onRowSelectionChange,
}: UserTableWrapperProps) {
  // Show loading screen for initial load
  if (isLoading && !users) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
          <Title order={3} className="text-gray-700 mb-2">
            Loading Users...
          </Title>
          <Text c="dimmed">Please wait while we fetch the latest data</Text>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8">
        <Paper
          p="xl"
          shadow="md"
          className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200"
        >
          <div className="text-center">
            <div className="bg-red-500 text-white p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FaTimes size={24} />
            </div>
            <Title order={3} className="text-red-600 mb-2">
              Error loading users data
            </Title>
            <Text size="sm" c="dimmed" mb="md">
              We encountered an issue while fetching the users. Please try
              again.
            </Text>
            <Button
              variant="filled"
              color="red"
              onClick={onRefetch}
              leftSection={<FaSync />}
            >
              Retry
            </Button>
          </div>
        </Paper>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Box pos="relative">
        <LoadingOverlay
          visible={isLoading}
          loaderProps={{ size: "lg", color: "blue" }}
          className="rounded-xl"
        />
        <Paper
          shadow="xl"
          p="lg"
          className="bg-white rounded-xl border border-gray-100 overflow-hidden"
        >
          <div className="mb-4">
            <Title order={3} className="text-gray-700 font-semibold mb-2">
              👥 Users Data Table
            </Title>
            <Text size="sm" c="dimmed">
              View, filter, and manage all users
            </Text>
          </div>
          <UserTable
            users={users || []}
            onAddUser={onAddUser}
            onEditUser={onEditUser}
            onViewUser={onViewUser}
            onDeleteUser={onDeleteUser}
            onExport={onExport}
            onBulkDelete={onBulkDelete}
            rowSelection={rowSelection}
            onRowSelectionChange={onRowSelectionChange}
          />
        </Paper>
      </Box>
    </div>
  );
}
