import React, { use } from "react";

/**
 * 创建动态路由
 * @param params
 * @constructor
 */
const Page = async ({ params }: { params: Promise<{ types: string }> }) => {
  const types = ((await params)?.types as string) || "";
  return (
    <div className="page-container">
      <section className="w-full">
        <h1 className="h1 capitalize">{types}</h1>
      </section>
    </div>
  );
};

export default Page;
