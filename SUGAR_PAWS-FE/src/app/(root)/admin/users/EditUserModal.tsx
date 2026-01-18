import React, { useEffect } from "react";
import {
  Modal,
  TextInput,
  PasswordInput,
  Button,
  Group,
  Select,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useUpdateUser } from "@/hooks/queries/useUser";
import { User } from "@/types/user";

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

interface UserUpdateData {
  email?: string;
  name?: string;
  username?: string;
  password?: string;
  role?: "USER" | "ADMIN";
  phoneNumber?: string | null;
  gender?: string | null;
  dayOfBirth?: number | null;
  monthOfBirth?: number | null;
  yearOfBirth?: number | null;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  open,
  onClose,
  user,
}) => {
  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      username: "",
      password: "",
      role: "USER" as "USER" | "ADMIN",
      phoneNumber: "",
      gender: "",
      dayOfBirth: "",
      monthOfBirth: "",
      yearOfBirth: "",
    },
    validate: {
      email: (value: string) =>
        /^\S+@\S+$/.test(value) ? null : "Please enter a valid email",
      name: (value: string) => (value ? null : "Please enter name"),
      username: (value: string) => (value ? null : "Please enter username"),
      role: (value: string) => (value ? null : "Please select a role"),
    },
  });

  const updateUser = useUpdateUser();

  // Reset form when user changes
  useEffect(() => {
    if (user && open) {
      form.setValues({
        email: user.email || "",
        name: user.name || "",
        username: user.username || "",
        password: "",
        role: user.role || "USER",
        phoneNumber: user.phoneNumber || "",
        gender: user.gender || "",
        dayOfBirth: user.dayOfBirth?.toString() || "",
        monthOfBirth: user.monthOfBirth?.toString() || "",
        yearOfBirth: user.yearOfBirth?.toString() || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, open]);

  const handleSubmit = async (values: typeof form.values) => {
    if (!user?.id) return;

    try {
      // Create update data, excluding password if empty
      const updateData: UserUpdateData = {
        email: values.email,
        name: values.name,
        username: values.username,
        role: values.role,
        phoneNumber: values.phoneNumber || null,
        gender: values.gender || null,
        dayOfBirth: values.dayOfBirth ? Number(values.dayOfBirth) : null,
        monthOfBirth: values.monthOfBirth ? Number(values.monthOfBirth) : null,
        yearOfBirth: values.yearOfBirth ? Number(values.yearOfBirth) : null,
      };

      // Only include password if it's not empty
      if (values.password.trim()) {
        updateData.password = values.password;
      }

      await updateUser.mutateAsync({ id: user.id, data: updateData });
      onClose();
    } catch {
      // Could show error notification here if needed
    }
  };

  return (
    <Modal opened={open} onClose={onClose} title="Edit User" centered size="lg">
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
          placeholder="Leave empty to keep current password"
          mt="md"
          {...form.getInputProps("password")}
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
        <TextInput
          label="Phone Number"
          placeholder="Enter phone number"
          mt="md"
          {...form.getInputProps("phoneNumber")}
        />
        <Select
          label="Gender"
          placeholder="Select gender"
          data={[
            { value: "Male", label: "Male" },
            { value: "Female", label: "Female" },
            { value: "Other", label: "Other" },
          ]}
          mt="md"
          {...form.getInputProps("gender")}
        />
        <Group grow mt="md">
          <TextInput
            label="Day of Birth"
            placeholder="Day (1-31)"
            type="number"
            min="1"
            max="31"
            {...form.getInputProps("dayOfBirth")}
          />
          <TextInput
            label="Month of Birth"
            placeholder="Month (1-12)"
            type="number"
            min="1"
            max="12"
            {...form.getInputProps("monthOfBirth")}
          />
          <TextInput
            label="Year of Birth"
            placeholder="Year"
            type="number"
            min="1900"
            max={new Date().getFullYear()}
            {...form.getInputProps("yearOfBirth")}
          />
        </Group>
        <Group justify="flex-end" mt="xl">
          <Button variant="default" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit" loading={updateUser.status === "pending"}>
            Update
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default EditUserModal;
