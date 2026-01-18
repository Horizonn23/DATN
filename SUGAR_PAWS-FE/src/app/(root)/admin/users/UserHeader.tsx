import { Button, Group, Title, Text } from "@mantine/core";
import { FaSync, FaFileExport } from "react-icons/fa";

interface UserHeaderProps {
  isLoading: boolean;
  onRefresh: () => void;
  onExport: () => void;
}

export default function UserHeader({
  isLoading,
  onRefresh,
  onExport,
}: UserHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <Title order={1} className="text-gray-800 font-bold text-3xl mb-2">
          👥 User Management
        </Title>
        <Text size="md" c="dimmed" className="text-gray-600">
          Manage and track all users with ease
        </Text>
      </div>
      <Group gap="sm">
        <Button
          variant="outline"
          leftSection={<FaSync />}
          onClick={onRefresh}
          loading={isLoading}
          size="md"
          className="border-blue-200 hover:bg-blue-50"
        >
          Refresh
        </Button>
        <Button
          variant="gradient"
          gradient={{ from: "blue", to: "cyan" }}
          leftSection={<FaFileExport />}
          onClick={onExport}
          size="md"
        >
          Export Data
        </Button>
      </Group>
    </div>
  );
}
