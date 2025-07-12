"use client";

import Thumbnail from "@/components/Thumbnail";
import { Button } from "@/components/ui/button";
import { MAX_FILE_SIZE } from "@/constants";
import { uploadAvatar, uploadFile } from "@/lib/actions/file.actions";
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
  avatar: string;
}

const AvatarUploader = ({ ownerId, accountId, fullName, avatar }: Props) => {
  const path = usePathname();
  const [files, setFiles] = useState<File[]>([]);
  const isExternalAvatar =
    avatar.startsWith("http") || avatar.startsWith("https");
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

      // 并行上传所有有效文件，等待所有上传完成
      const uploadPromises = validNewFiles.map((file) =>
        uploadAvatar({ file, ownerId, accountId, path, fullName }).then(
          (uploadedFile) => {
            if (uploadedFile) {
              setFiles((prevFiles) =>
                prevFiles.filter((f) => f.name !== file.name),
              );
            }
          },
        ),
      );
      // 这样做的最主要原因是：需要等所有文件都上传完成后，才能统一处理上传结果（如移除已上传文件、显示成功或失败的提示），
      // 保证UI和数据状态与所有上传操作的最终结果保持一致，避免部分文件上传未完成时就提前更新界面或提示用户。
      const uploadResults = await Promise.all(uploadPromises);
      if (uploadPromises.length > 0) {
        toast.success(`Successfully uploaded ${uploadPromises.length} file(s)`);
      }
    },
    [ownerId, accountId, path],
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleRemoveFile = (
    e: MouseEvent<HTMLButtonElement>,
    fileName: string,
  ) => {
    // 阻止事件冒泡，防止点击删除按钮时触发父级的上传区域点击事件
    e.stopPropagation();
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  return (
    <div {...getRootProps()} className="cursor-pointer">
      <input {...getInputProps()} />
      <Image
        src={avatar}
        alt="Avatar"
        width={44}
        height={44}
        unoptimized={isExternalAvatar}
        className="sidebar-user-avatar rounded-full object-cover cursor-pointer"
      />

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
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Thumbnail
                    type={type}
                    extension={extension}
                    url={convertFileToUrl(file)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </span>
                      <div className="flex-shrink-0">
                        <Image
                          src="/assets/icons/file-loader.gif"
                          alt="uploading"
                          width={80}
                          height={26}
                          unoptimized
                          className="w-auto h-4 sm:h-5 md:h-6 max-w-[80px]"
                          style={{
                            objectFit: "contain",
                          }}
                          onError={(e) => {
                            // 如果GIF加载失败，显示文本
                            e.currentTarget.style.display = "none";
                            const fallback =
                              e.currentTarget.parentElement?.querySelector(
                                ".fallback-text",
                              );
                            if (fallback) {
                              (fallback as HTMLElement).style.display =
                                "inline-block";
                            }
                          }}
                        />
                        <span className="fallback-text hidden text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
                          Uploading...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleRemoveFile(e, file.name)}
                  className="flex-shrink-0 p-2 hover:opacity-80 transition-opacity rounded-full hover:bg-gray-100"
                  aria-label={`Remove ${file.name}`}
                >
                  <Image
                    src="/assets/icons/remove.svg"
                    alt="remove"
                    width={20}
                    height={20}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default AvatarUploader;
