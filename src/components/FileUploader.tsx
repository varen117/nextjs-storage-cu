"use client";

import Thumbnail from "@/components/Thumbnail";
import { Button } from "@/components/ui/button";
import { MAX_FILE_SIZE } from "@/constants";
import { cn, convertFileToUrl, getFileType } from "@/lib/utils";
import Image from "next/image";
import { MouseEvent, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

interface Props {
  ownerId: string;
  accountId: string;
  className?: string;
}

const FileUploader = ({ ownerId, accountId, className }: Props) => {
  const onDrop = useCallback((acceptedFiles: any) => {
    // 追加有效文件到现有文件列表，统一处理所有验证
    setFiles((prevFiles) => {
      const existingFileNames = prevFiles.map((f) => f.name);
      const validNewFiles: File[] = [];

      acceptedFiles.forEach((file: File) => {
        // 检查文件大小
        if (file.size > MAX_FILE_SIZE) {
          // 显示错误提示
          toast("File too large", {
            description: (
              <span>
                <strong>{file.name}</strong> is too large. Max file size is
                50MB.
              </span>
            ),
            style: {
              background: "#FA7275",
              borderRadius: 20,
            },
            classNames: {
              closeButton: "true",
              description: "!text-white",
              title: "!text-white !font-bold",
            },
          });
          return; // 跳过这个文件
        }

        // 检查重复文件（以第一次上传的为准）
        if (existingFileNames.includes(file.name)) {
          return; // 跳过重复文件
        }

        // 文件有效，添加到列表
        validNewFiles.push(file);
      });

      return [...prevFiles, ...validNewFiles];
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const [files, setFiles] = useState<File[]>([]);

  const handleRemoveFile = (
    e: MouseEvent<HTMLImageElement>,
    fileName: string
  ) => {
    // 阻止事件冒泡，防止点击删除按钮时触发父级的上传区域点击事件
    e.stopPropagation();
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  return (
    <div {...getRootProps()} className="cursor-pointer">
      <input {...getInputProps()} />
      <Button type="button" className={cn("uploader-button")}>
        <Image
          src="/assets/icons/upload.svg"
          alt="logo"
          width={24}
          height={24}
        />
        <p>Upload</p>
      </Button>
      {files.length > 0 && (
        <ul className="uploader-preview-list">
          <h4 className="h4 text-light-100">Uploading</h4>
          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name);
            return (
              <li
                key={`${file.name}-${index}`}
                className="uploader-preview-item"
              >
                <div className="flex items-center gap-3">
                  <Thumbnail
                    type={type}
                    extension={extension}
                    url={convertFileToUrl(file)}
                  />
                  <div className="preview-item-name">
                    {file.name}
                    <Image
                      src="/assets/icons/file-loader.gif"
                      alt="loader"
                      width={80}
                      height={26}
                    />
                  </div>
                </div>
                <Image
                  src="/assets/icons/remove.svg"
                  alt="remove"
                  width={24}
                  height={24}
                  onClick={(e) => handleRemoveFile(e, file.name)}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default FileUploader;
