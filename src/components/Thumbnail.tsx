import Image from "next/image";
import { file } from "zod/v4-mini";
import { cn, getFileIcon } from "../lib/utils";

// 带问号的字段表示该属性是可选的，不带问号的字段是必填的
interface Props {
  type: string; // 必填字段，必须传递
  extension: string; // 必填字段，必须传递
  url?: string; // 可选字段，可以不传递
  imageClassName?: string;
  className?: string;
}

const Thumbnail = ({
  type,
  extension,
  url = "",
  imageClassName,
  className,
}: Props) => {
  const isImage = type === "image" && extension !== "svg";
  const isExternalUrl = url.startsWith("http") || url.startsWith("https");
  
  return (
    <figure className={cn("thumbnail", className)}>
      <Image
        src={isImage ? url : getFileIcon(extension, type)}
        alt="thumbnail"
        width={100}
        height={100}
        // 对于外部图片URL（如Appwrite），禁用优化以避免认证问题
        unoptimized={isImage && isExternalUrl}
        // cn函数用于合并多个className字符串，并自动去除无效或重复的类名
        // 用法：cn(基础类名, 可选类名, 条件类名)
        // 这里将基础样式、外部传入的imageClassName和isImage为true时的"thumbnail-image"合并
        className={cn(
          "size-8 object-contain", // 基础样式
          imageClassName, // 外部传入的图片样式
          isImage && "thumbnail-image" // 仅当isImage为true时添加该类
        )}
      />
    </figure>
  );
};

export default Thumbnail;
