import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  defaultIcons,
  FileType,
  fileTypeConfigs,
  FileTypeResult,
} from "../constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseStringify(value: unknown) {
  return JSON.parse(JSON.stringify(value));
}

/**
 * 获取文件类型和扩展名
 * @param fileName 文件名
 * @returns 包含扩展名和类型的对象
 */
export const getFileType = (fileName: string): FileTypeResult => {
  const extension = fileName.split(".").pop()?.toLowerCase() || "";
  const config = fileTypeConfigs[extension];

  return {
    extension,
    type: config?.type || "other",
  };
};

/**
 * 获取文件图标路径
 * @param extension 文件扩展名
 * @param type 文件类型（可选，如果不提供会根据扩展名推断）
 * @returns 图标文件路径
 */
export const getFileIcon = (
  extension: string | undefined,
  type?: FileType | string
): string => {
  if (!extension) {
    return defaultIcons[type as FileType] || defaultIcons.other;
  }

  const normalizedExtension = extension.toLowerCase();
  const config = fileTypeConfigs[normalizedExtension];

  if (config) {
    return config.icon;
  }

  // 如果没有找到特定扩展名的配置，使用类型默认图标
  return defaultIcons[type as FileType] || defaultIcons.other;
};

/**
 * 构建 Appwrite 文件访问 URL
 * @param bucketFileId 存储桶文件ID
 * @returns 完整的文件访问URL
 */
export const constructFileUrl = (bucketFileId: string): string => {
  return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET}/files/${bucketFileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`;
};

/**
 * 将本地文件对象转换为临时访问 URL
 * @param file 文件对象
 * @returns 临时URL
 */
export const convertFileToUrl = (file: File): string =>
  URL.createObjectURL(file);

/**
 * 获取支持的文件扩展名列表
 * @param type 可选的文件类型过滤
 * @returns 扩展名数组
 */
export const getSupportedExtensions = (type?: FileType): string[] => {
  if (!type) {
    return Object.keys(fileTypeConfigs);
  }

  return Object.entries(fileTypeConfigs)
    .filter(([, config]) => config.type === type)
    .map(([ext]) => ext);
};

/**
 * 检查文件是否为支持的类型
 * @param fileName 文件名
 * @param allowedTypes 允许的文件类型数组（可选）
 * @returns 是否支持该文件类型
 */
export const isSupportedFileType = (
  fileName: string,
  allowedTypes?: FileType[]
): boolean => {
  const { type } = getFileType(fileName);

  if (!allowedTypes) {
    return type !== "other";
  }

  return allowedTypes.includes(type);
};
