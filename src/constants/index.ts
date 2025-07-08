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
