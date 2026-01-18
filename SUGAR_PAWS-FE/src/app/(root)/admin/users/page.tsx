"use client";

import { useGetAllUsers } from "@/hooks/queries/useUser";
import { User } from "@/types/user";
import { useState } from "react";
import { Button, Title, Box, LoadingOverlay, Paper, Text } from "@mantine/core";
import { FaTimes, FaSync } from "react-icons/fa";
import UserTableWrapper from "./UserTableWrapper";
import AddUserModal from "./AddUserModal";
import EditUserModal from "./EditUserModal";
import UserHeader from "./UserHeader";

export default function UserAdminPage() {
  const { getAllUsers } = useGetAllUsers();
  const { data: users, isLoading, isError, refetch } = getAllUsers;
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

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

  const handleAddUser = () => {
    setAddUserOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditUserOpen(true);
  };

  const handleViewUser = (user: User) => {
    console.log("View user details", user);
  };

  const handleDeleteUser = (userId: string | number) => {
    console.log("Delete user", userId);
  };

  const handleExport = () => {
    console.log("Export users functionality");
  };

  const handleBulkDelete = () => {
    console.log("Bulk delete");
  };

  const handleRefresh = () => {
    refetch();
  };

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
              onClick={() => refetch()}
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      {/* Header Section */}
      <div className="mb-6">
        <UserHeader
          isLoading={isLoading}
          onRefresh={handleRefresh}
          onExport={handleExport}
        />
      </div>

      <Box pos="relative">
        <LoadingOverlay
          visible={isLoading}
          loaderProps={{ size: "lg", color: "blue" }}
          className="rounded-xl"
        />
        <UserTableWrapper
          users={users}
          isLoading={isLoading}
          isError={isError}
          onRefetch={refetch}
          onAddUser={handleAddUser}
          onEditUser={handleEditUser}
          onViewUser={handleViewUser}
          onDeleteUser={handleDeleteUser}
          onExport={handleExport}
          onBulkDelete={handleBulkDelete}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
        />
      </Box>

      <AddUserModal open={addUserOpen} onClose={() => setAddUserOpen(false)} />
      <EditUserModal
        open={editUserOpen}
        onClose={() => {
          setEditUserOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />
    </div>
  );
}
