import React from "react";
import Sidebar from "@/components/Sidebar";
import MobileNavigation from "@/components/MobileNavigation";
import Header from "@/components/Header";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  //获取当前用户
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return redirect("/sign-in");
  }
  return (
    <main className="flex h-screen">
      <Sidebar {...currentUser} />
      <section className="flex h-full flex-1 flex-col">
        <MobileNavigation {...currentUser} />
        <Header
          userId={currentUser.$id}
          accountId={currentUser.accountId}
          fullName={currentUser.fullName}
        />
        <div className="main-content">{children}</div>
      </section>
      <Toaster />
    </main>
  );
};

export default Layout;
