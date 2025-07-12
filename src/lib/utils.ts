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
  type?: FileType | string,
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
  return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET}/files/${bucketFileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
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
  allowedTypes?: FileType[],
): boolean => {
  const { type } = getFileType(fileName);

  if (!allowedTypes) {
    return type !== "other";
  }

  return allowedTypes.includes(type);
};

//记录错误日志
export const handleError = (error: unknown, message: string) => {
  throw error;
};
// 处理文件大小转换
export const convertFileSize = (sizeInBytes: number, digits?: number) => {
  if (sizeInBytes < 1024) {
    return sizeInBytes + " Bytes"; // Less than 1 KB, show in Bytes
  } else if (sizeInBytes < 1024 * 1024) {
    const sizeInKB = sizeInBytes / 1024;
    return sizeInKB.toFixed(digits || 1) + " KB"; // Less than 1 MB, show in KB
  } else if (sizeInBytes < 1024 * 1024 * 1024) {
    const sizeInMB = sizeInBytes / (1024 * 1024);
    return sizeInMB.toFixed(digits || 1) + " MB"; // Less than 1 GB, show in MB
  } else {
    const sizeInGB = sizeInBytes / (1024 * 1024 * 1024);
    return sizeInGB.toFixed(digits || 1) + " GB"; // 1 GB or more, show in GB
  }
};

//时间处理工具
export const formatDateTime = (isoString: string | null | undefined) => {
  if (!isoString) return "—";

  const date = new Date(isoString);

  // Get hours and adjust for 12-hour format
  let year = date.getFullYear();
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? " pm" : " am";

  // Convert hours to 12-hour format
  hours = hours % 12 || 12;

  // Format the time and date parts
  const time = `${hours}:${minutes.toString().padStart(2, "0")}${period}`;
  const day = date.getDate();
  const monthNames = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  const month = monthNames[date.getMonth()];

  return `${year}-${month}-${day} ${time} `;
};

//文件下载
export const constructDownloadUrl = (bucketFileId: string) => {
  return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET}/files/${bucketFileId}/download?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
};

/**
 * 根据路由参数获取对应的文件类型数组
 * @param type 路由参数（如: documents, images, media, others）
 * @returns 对应的文件类型数组
 */
export const getFileTypesParams = (type: string): FileType[] => {
  // 规范化输入参数，移除可能的前后空格和特殊字符
  const normalizedType = type?.toLowerCase().trim();

  switch (normalizedType) {
    case "documents":
      return ["document"];
    case "images":
      return ["image"];
    case "media":
      return ["video", "audio"];
    case "others":
      return ["other"];
    case "": // 空字符串或根路径
    case "dashboard":
    case "all":
      return ["document", "image", "video", "audio", "other"]; // 返回所有类型
    default:
      // 如果传入的是单个文件类型，检查是否有效
      if (
        ["document", "image", "video", "audio", "other"].includes(
          normalizedType,
        )
      ) {
        return [normalizedType as FileType];
      }
      // 默认返回所有类型，确保不会因为未知路由参数导致空结果
      return ["document", "image", "video", "audio", "other"];
  }
};
