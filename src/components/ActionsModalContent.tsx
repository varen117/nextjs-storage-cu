import React, { useState, useEffect } from "react";
import { Models } from "node-appwrite";
import Thumbnail from "@/components/Thumbnail";
import FormattedDateTime from "@/components/FormattedDateTime";
import { convertFileSize, formatDateTime } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Props {
  file: Models.Document;
}

interface ShareInputProps {
  file: Models.Document;
  onInputChange: React.Dispatch<React.SetStateAction<string[]>>;
  onRemove: (email: string) => Promise<boolean>;
}

//缩略图
const ImageThumbnail = ({ file }: Props) => (
  <div className="file-details-thumbnail">
    <Thumbnail type={file.type} extension={file.extension} url={file.url} />
    <div className="flex flex-col">
      <p className="subtitle-2 mb-1 text-left">{file.name}</p>
      <FormattedDateTime date={file.$createdAt} className="caption" />
    </div>
  </div>
);
//详情
const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex">
    <p className="file-details-label text-left">{label}</p>
    <p className="file-details-value text-left">{value}</p>
  </div>
);
// detail 详情页
export const ActionsModalContent = ({ file }: Props) => {
  return (
    <>
      <ImageThumbnail file={file} />
      <div className="space-y-4 px-2 pt-2">
        <DetailRow label="Format:" value={file.extension} />
        <DetailRow label="Size:" value={convertFileSize(file.size)} />
        <DetailRow label="Owner:" value={file.fullName} />
        <DetailRow label="Last edit:" value={formatDateTime(file.$updatedAt)} />
      </div>
    </>
  );
};
//share详情页
export const ShareInput = ({
  file,
  onInputChange,
  onRemove,
}: ShareInputProps) => {
  const [shareUsers, setShareUsers] = useState<string[]>([...file.users]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 同步本地状态到父组件
  useEffect(() => {
    onInputChange(shareUsers);
  }, [shareUsers, onInputChange]);

  // 验证邮箱格式
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 添加新的分享用户
  const addShareUsers = () => {
    if (!inputValue.trim()) return;

    const newEmails = inputValue
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email && isValidEmail(email))
      .filter((email) => !shareUsers.includes(email)); // 去重

    if (newEmails.length > 0) {
      setShareUsers((prevUsers) => [...prevUsers, ...newEmails]);
      setInputValue(""); // 清空输入框
    }
  };

  // 处理Enter键添加
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addShareUsers();
    }
  };

  // 移除用户
  const handleRemoveUser = async (email: string) => {
    setIsLoading(true);
    try {
      const success = await onRemove(email);
      if (success) {
        setShareUsers((prevUsers) =>
          prevUsers.filter((user) => user !== email),
        );
      }
    } catch (error) {
      console.error("Failed to remove user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ImageThumbnail file={file} />
      <div className="share-wrapper">
        <p className="subtitle-2 pl-1 text-light-100">
          Share {file.name} with others
        </p>

        {/* 邮箱输入区域 */}
        <div className="flex gap-2 mb-3 items-center">
          <Input
            className="share-input-field flex-1"
            type="email"
            placeholder="Enter email address (separate multiple with commas)"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            type="button"
            onClick={addShareUsers}
            disabled={!inputValue.trim()}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Add email"
          >
            <Image
              src="/assets/icons/upload.svg"
              alt="add"
              width={18}
              height={18}
              className="opacity-60 hover:opacity-100 transition-opacity"
            />
          </button>
        </div>

        <div className="pt-4">
          <div className="flex justify-between">
            <p className="subtitle-2 text-light-100">Share with</p>
            <p className="subtitle-2 text-light-100">
              {shareUsers.length} users
            </p>
          </div>

          <ul className="pt-2 space-y-2">
            {shareUsers.map((email: string) => (
              <li
                key={email}
                className="flex items-center justify-between gap-2 p-2 bg-gray-50 rounded"
              >
                <p className="subtitle-2 flex-1 truncate">{email}</p>
                <Button
                  onClick={() => handleRemoveUser(email)}
                  className="share-remove-user"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Image
                      src="/assets/icons/loader.svg"
                      alt="loading"
                      width={20}
                      height={20}
                      className="animate-spin"
                    />
                  ) : (
                    <Image
                      src="/assets/icons/remove.svg"
                      alt="remove"
                      width={20}
                      height={20}
                      className="remove-icon"
                    />
                  )}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
