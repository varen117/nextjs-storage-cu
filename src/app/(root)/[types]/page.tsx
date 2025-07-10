import React from "react";
import Sort from "@/components/Sort";
import { getFiles } from "@/lib/actions/file.actions";
import { parseStringify } from "@/lib/utils";
import { Models } from "node-appwrite";
import Card from "@/components/Card";

/**
 * 创建动态路由
 * @param params
 * @constructor
 */
const Page = async ({ params }: { params: Promise<{ types: string }> }) => {
  const types = ((await params)?.types as string) || "";
  // 加 await 和不加的区别：
  // 1. 加 await：getFiles() 是一个异步函数，返回 Promise。加 await 会等待 getFiles() 执行完毕，拿到真正的数据对象 files。
  // 2. 不加 await：files 只是一个 Promise 对象，还没有真正的数据，后续代码直接用 files.documents 会报错或拿不到数据。
  // 只有加了 await，才能拿到 getFiles() 返回的实际数据，否则只是一个 Promise。
  const files = await getFiles();
  return (
    <div className="page-container">
      <section className="w-full">
        {/*标题*/}
        <h1 className="h1 capitalize">{types}</h1>
        {/*文件总大小*/}
        <div className="total-size-section">
          <p className="body-1">
            Total:<span className="h5">0 MB</span>
          </p>
          <div className="sort-container">
            <p className="body-1 hidden sm:block text-light-200">Sort by:</p>
            <Sort />
          </div>
        </div>
      </section>
      {files.total > 0 ? (
        <section className="file-list">
          {files.documents.map((file: Models.Document) => (
            <Card file={file} />
          ))}
        </section>
      ) : (
        <p className="empty-list">{files.documents}--No files uploaded</p>
      )}
    </div>
  );
};

export default Page;
