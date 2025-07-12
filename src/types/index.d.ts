interface UploadFileProps {
  file: File;
  ownerId: string;
  accountId: string;
  path: string;
  fullName: string;
}

declare interface ActionType {
  label: string;
  icon: string;
  value: string;
}

declare interface RenameFileProps {
  fileId: string;
  name: string;
  extension: string;
  path: string;
}

declare interface GetFilesProps {
  types: FileType[];
  searchText?: string;
  sort?: string;
  limit?: number;
}
