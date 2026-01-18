"use client";

import React from "react";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

interface AdminProviderProps {
  children: React.ReactNode;
}

const AdminProvider = React.memo<AdminProviderProps>(({ children }) => {
  return (
    <MantineProvider
      defaultColorScheme="light"
      theme={{
        primaryColor: "pink",
      }}
    >
      {children}
    </MantineProvider>
  );
});

AdminProvider.displayName = "AdminProvider";

export default AdminProvider;
