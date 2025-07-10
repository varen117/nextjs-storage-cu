import React from "react";
import { Models } from "node-appwrite";
import Link from "next/link";
import Thumbnail from "@/components/Thumbnail";
import { convertFileSize, convertFileToUrl } from "@/lib/utils";
import FormattedDateTime from "@/components/FormattedDateTime";
interface Props {
  key: string;
  file: Models.Document;
}
const Card = ({ key, file }: Props) => {
  return (
    <Link href={file.url} target="_blank" className="file-card" key={key}>
      <div className="flex justify-between">
        {/*添加缩略图*/}
        <Thumbnail
          type={file.type}
          extension={file.extension}
          // url={"file.url"}
          url={""}
          className="!size-20"
          imageClassName="!size-11"
        />
        {/*  添加操作*/}
        <div className="flex flex-col items-end justify-between">
          下拉菜单...
          <p className="body-1">{convertFileSize(file.size)}</p>
        </div>
      </div>
      {/* 文件名 */}
      <div className="file-card-details">
        <p className="subtitle-2 line-clamp-1">{file.name}</p>
        <FormattedDateTime
          date={file.$createdAt}
          className="body-2 text-light-100"
        />
        <p className="capitalize line-clamp-1 text-light-100">
          By: {file.fullName}
        </p>
      </div>
    </Link>
  );
};

export default Card;
