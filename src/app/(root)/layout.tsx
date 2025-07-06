import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex h-screen">
      Sidebar
      <section className="flex h-full flex-1 flex-col">
        移动导航 标题
        <div className="main-content">{children}</div>
      </section>
    </main>
  );
};

export default Layout;
