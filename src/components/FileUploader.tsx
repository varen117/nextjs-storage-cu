"use client";

import Thumbnail from "@/components/Thumbnail";
import { Button } from "@/components/ui/button";
import { MAX_FILE_SIZE } from "@/constants";
import { uploadFile } from "@/lib/actions/file.actions";
import { cn, convertFileToUrl, getFileType } from "@/lib/utils";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MouseEvent, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

interface Props {
  ownerId: string;
  accountId: string;
  fullName: string;
}

const FileUploader = ({ ownerId, accountId, fullName }: Props) => {
  const path = usePathname();
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    async (acceptedFiles: any) => {
      // 先验证和收集所有有效文件
      const existingFileNames = files.map((f) => f.name);
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

      // 如果没有有效文件，直接返回
      if (validNewFiles.length === 0) {
        return;
      }

      // 先将有效文件添加到UI中显示
      setFiles((prevFiles) => [...prevFiles, ...validNewFiles]);

      try {
        // 并行上传所有有效文件，等待所有上传完成
        const uploadPromises = validNewFiles.map((file) =>
          uploadFile({ file, ownerId, accountId, path, fullName }),
        );
        // 这样做的最主要原因是：需要等所有文件都上传完成后，才能统一处理上传结果（如移除已上传文件、显示成功或失败的提示），
        // 保证UI和数据状态与所有上传操作的最终结果保持一致，避免部分文件上传未完成时就提前更新界面或提示用户。
        const uploadResults = await Promise.all(uploadPromises);

        // 所有上传完成后，从UI中移除成功上传的文件
        setFiles((prevFiles) => {
          const successfullyUploadedFileNames = validNewFiles
            .filter((_, index) => uploadResults[index]) // 只保留上传成功的文件
            .map((file) => file.name);

          return prevFiles.filter(
            (file) => !successfullyUploadedFileNames.includes(file.name),
          );
        });

        // 显示成功提示
        const successCount = uploadResults.filter(Boolean).length;
        if (successCount > 0) {
          toast.success(`Successfully uploaded ${successCount} file(s)`, {
            style: {
              background: "#3DD9B3",
              borderRadius: 20,
            },
            classNames: {
              description: "!text-white",
              title: "!text-white !font-bold",
            },
          });
        }

        // 如果有失败的上传，显示错误提示
        const failureCount = validNewFiles.length - successCount;
        if (failureCount > 0) {
          toast.error(`Failed to upload ${failureCount} file(s)`, {
            style: {
              background: "#FA7275",
              borderRadius: 20,
            },
            classNames: {
              description: "!text-white",
              title: "!text-white !font-bold",
            },
          });
        }
      } catch (error) {
        console.error("Upload error:", error);

        // 上传失败，移除所有刚添加的文件
        setFiles((prevFiles) => {
          const newFileNames = validNewFiles.map((file) => file.name);
          return prevFiles.filter((file) => !newFileNames.includes(file.name));
        });

        // 显示错误提示
        toast.error("Upload failed", {
          description: "Please try again later.",
          style: {
            background: "#FA7275",
            borderRadius: 20,
          },
          classNames: {
            description: "!text-white",
            title: "!text-white !font-bold",
          },
        });
      }
    },
    [ownerId, accountId, path],
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleRemoveFile = (
    e: MouseEvent<HTMLImageElement>,
    fileName: string,
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
                      unoptimized //unoptimized 跳过优化 - 直接显示原始 GIF
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
