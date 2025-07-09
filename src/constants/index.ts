//导航栏菜单
export const navItems = [
  {
    name: "Dashboard",
    icon: "../assets/icons/dashboard.svg",
    url: "/",
  },
  {
    name: "Documents",
    icon: "../assets/icons/documents.svg",
    url: "/documents",
  },
  {
    name: "Images",
    icon: "../assets/icons/images.svg",
    url: "/images",
  },
  {
    name: "Media",
    icon: "../assets/icons/video.svg",
    url: "/media",
  },
  {
    name: "Others",
    icon: "../assets/icons/others.svg",
    url: "/others",
  },
];
//操作下拉菜单项
export const actionsDropdownItems = [
  {
    label: "Rename",
    icon: "../assets/icons/edit.svg",
    value: "rename",
  },
  {
    label: "Details",
    icon: "../assets/icons/info.svg",
    value: "details",
  },
  {
    label: "Share",
    icon: "../assets/icons/share.svg",
    value: "share",
  },
  {
    label: "Download",
    icon: "../assets/icons/download.svg",
    value: "download",
  },
  {
    label: "Delete",
    icon: "../assets/icons/delete.svg",
    value: "delete",
  },
];

//排序类型
export const sortTypes = [
  {
    label: "Date created (newest)",
    value: "$createdAt-desc",
  },
  {
    label: "Created Date (oldest)",
    value: "$createdAt-asc",
  },
  {
    label: "Name (A-Z)",
    value: "name-asc",
  },
  {
    label: "Name (Z-A)",
    value: "name-desc",
  },
  {
    label: "Size (Highest)",
    value: "size-desc",
  },
  {
    label: "Size (Lowest)",
    value: "size-asc",
  },
];

//头像占位符URL,其他地方要想使用要在next.config.js中配置
export const avatarPlaceholderUrl =
  "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg";
//最大文件大小
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

// ===============图标路径常量===============
// 定义文件类型
export type FileType = "document" | "image" | "video" | "audio" | "other";

// 定义返回类型
export interface FileTypeResult {
  extension: string;
  type: FileType;
}

// 统一的文件类型配置
interface FileTypeConfig {
  type: FileType;
  icon: string;
}
const ICON_PATHS = {
  PDF: "../assets/icons/file-pdf.svg",
  DOC: "../assets/icons/file-doc.svg",
  DOCX: "../assets/icons/file-docx.svg",
  TXT: "../assets/icons/file-txt.svg",
  CSV: "../assets/icons/file-csv.svg",
  DOCUMENT: "../assets/icons/file-document.svg",
  IMAGE: "../assets/icons/file-image.svg",
  SVG: "../assets/icons/file-svg.svg",
  VIDEO: "../assets/icons/file-video.svg",
  AUDIO: "../assets/icons/file-audio.svg",
  OTHER: "../assets/icons/file-other.svg",
};

// 文件扩展名到配置的完整映射
export const fileTypeConfigs: Record<string, FileTypeConfig> = {
  // 文档类型
  pdf: { type: "document", icon: ICON_PATHS.PDF },
  doc: { type: "document", icon: ICON_PATHS.DOC },
  docx: { type: "document", icon: ICON_PATHS.DOCX },
  txt: { type: "document", icon: ICON_PATHS.TXT },
  csv: { type: "document", icon: ICON_PATHS.CSV },
  xlsx: { type: "document", icon: ICON_PATHS.DOCUMENT },
  xls: { type: "document", icon: ICON_PATHS.DOCUMENT },
  ppt: { type: "document", icon: ICON_PATHS.DOCUMENT },
  pptx: { type: "document", icon: ICON_PATHS.DOCUMENT },
  rtf: { type: "document", icon: ICON_PATHS.DOCUMENT },
  odt: { type: "document", icon: ICON_PATHS.DOCUMENT },

  // 图片类型
  jpg: { type: "image", icon: ICON_PATHS.IMAGE },
  jpeg: { type: "image", icon: ICON_PATHS.IMAGE },
  png: { type: "image", icon: ICON_PATHS.IMAGE },
  gif: { type: "image", icon: ICON_PATHS.IMAGE },
  svg: { type: "image", icon: ICON_PATHS.SVG },
  webp: { type: "image", icon: ICON_PATHS.IMAGE },
  bmp: { type: "image", icon: ICON_PATHS.IMAGE },
  ico: { type: "image", icon: ICON_PATHS.IMAGE },
  tiff: { type: "image", icon: ICON_PATHS.IMAGE },
  tif: { type: "image", icon: ICON_PATHS.IMAGE },

  // 视频类型
  mp4: { type: "video", icon: ICON_PATHS.VIDEO },
  avi: { type: "video", icon: ICON_PATHS.VIDEO },
  mkv: { type: "video", icon: ICON_PATHS.VIDEO },
  mov: { type: "video", icon: ICON_PATHS.VIDEO },
  wmv: { type: "video", icon: ICON_PATHS.VIDEO },
  flv: { type: "video", icon: ICON_PATHS.VIDEO },
  webm: { type: "video", icon: ICON_PATHS.VIDEO },
  m4v: { type: "video", icon: ICON_PATHS.VIDEO },
  "3gp": { type: "video", icon: ICON_PATHS.VIDEO },
  ogv: { type: "video", icon: ICON_PATHS.VIDEO },

  // 音频类型
  mp3: { type: "audio", icon: ICON_PATHS.AUDIO },
  wav: { type: "audio", icon: ICON_PATHS.AUDIO },
  aac: { type: "audio", icon: ICON_PATHS.AUDIO },
  flac: { type: "audio", icon: ICON_PATHS.AUDIO },
  ogg: { type: "audio", icon: ICON_PATHS.AUDIO },
  wma: { type: "audio", icon: ICON_PATHS.AUDIO },
  m4a: { type: "audio", icon: ICON_PATHS.AUDIO },
  opus: { type: "audio", icon: ICON_PATHS.AUDIO },
  mpeg: { type: "audio", icon: ICON_PATHS.AUDIO },
  aiff: { type: "audio", icon: ICON_PATHS.AUDIO },
  alac: { type: "audio", icon: ICON_PATHS.AUDIO },
};

// 默认图标映射
export const defaultIcons: Record<FileType, string> = {
  document: ICON_PATHS.DOCUMENT,
  image: ICON_PATHS.IMAGE,
  video: ICON_PATHS.VIDEO,
  audio: ICON_PATHS.AUDIO,
  other: ICON_PATHS.OTHER,
};
