import React from "react";
import AccountSidebar from "@/components/user/AccountSidebar";

const AccountLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col md:flex-row gap-8 md:gap-12 max-w-6xl mx-auto py-10 px-4 md:px-8">
      <div className="w-full md:w-1/4">
        <AccountSidebar />
      </div>
      <main className="flex-1 w-full">{children}</main>
    </div>
  );
};

export default AccountLayout;
