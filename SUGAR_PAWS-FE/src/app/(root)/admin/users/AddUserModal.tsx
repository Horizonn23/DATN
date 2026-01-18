import React from "react";
import {
  Modal,
  TextInput,
  PasswordInput,
  Button,
  Group,
  Select,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCreateUser } from "@/hooks/queries/useUser";

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ open, onClose }) => {
  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      username: "",
      password: "",
      role: "USER" as "USER" | "ADMIN",
    },
    validate: {
      email: (value: string) =>
        /^\S+@\S+$/.test(value) ? null : "Please enter a valid email",
      name: (value: string) => (value ? null : "Please enter name"),
      username: (value: string) => (value ? null : "Please enter username"),
      password: (value: string) => (value ? null : "Please enter password"),
      role: (value: string) => (value ? null : "Please select a role"),
    },
  });

  const createUser = useCreateUser();

  const handleSubmit = async (values: typeof form.values) => {
    try {
      await createUser.mutateAsync(values);
      form.reset();
      onClose();
    } catch {
      // Could show error notification here if needed
    }
  };

  return (
    <Modal opened={open} onClose={onClose} title="Create New User" centered>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Email"
          placeholder="Enter email"
          type="email"
          {...form.getInputProps("email")}
          required
        />
        <TextInput
          label="Name"
          placeholder="Enter name"
          mt="md"
          {...form.getInputProps("name")}
          required
        />
        <TextInput
          label="Username"
          placeholder="Enter username"
          mt="md"
          {...form.getInputProps("username")}
          required
        />
        <PasswordInput
          label="Password"
          placeholder="Enter password"
          mt="md"
          {...form.getInputProps("password")}
          required
        />
        <Select
          label="Role"
          placeholder="Select role"
          data={[
            { value: "USER", label: "User" },
            { value: "ADMIN", label: "Admin" },
          ]}
          mt="md"
          {...form.getInputProps("role")}
          required
        />
        <Group justify="flex-end" mt="xl">
          <Button variant="default" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit" loading={createUser.status === "pending"}>
            Create
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default AddUserModal;
