"use server";

import {
  constructFileUrl,
  getFileType,
  handleError,
  parseStringify,
} from "@/lib/utils";
import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { InputFile } from "node-appwrite/file";
import { appwriteConfig } from "@/lib/appwrite/config";
import { ID, Models, Query } from "node-appwrite";
import { revalidatePath, revalidateTag } from "next/cache";
import { getCurrentUser, uploadUser } from "@/lib/actions/user.actions";
import { FileType } from "@/constants";

export const uploadFile = async ({
  file,
  ownerId,
  accountId,
  path,
  fullName,
}: UploadFileProps) => {
  const { storage, databases } = await createAdminClient();
  try {
    // 转换为输入文件
    const inputFile = InputFile.fromBuffer(file, file.name);
    // 创建文件
    const bucketFile = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      inputFile,
    );
    //上传文件信息持久化
    const fileDocument = {
      type: getFileType(bucketFile.name).type,
      name: bucketFile.name,
      url: constructFileUrl(bucketFile.$id),
      extension: getFileType(bucketFile.name).extension,
      size: bucketFile.sizeOriginal,
      owner: ownerId,
      accountId,
      users: [],
      bucketFileId: bucketFile.$id,
      fullName: fullName,
    };
    const newFile = await databases
      .createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.filesCollectionId,
        ID.unique(),
        fileDocument,
      )
      .catch(async (error: unknown) => {
        //如果文件信息持久化失败，删除已上传的文件
        await storage.deleteFile(appwriteConfig.bucketId, bucketFile.$id);
        handleError(error, "Failed to create file document");
      });
    // 如果传入的 path 是 /file/s.jpg，无论它之后变成什么完整的 URL（如 https://ad/asdf/adsf/adsf），
    // 调用 revalidatePath(path) 可以根据 path 的值刷新对应页面的缓存，
    // 这样用户在上传文件后访问该 path 时能看到最新内容
    revalidatePath(path);
    return parseStringify(newFile);
  } catch (error) {
    handleError(error, "Upload file Failed");
  }
};

//上传头像
export const uploadAvatar = async ({
  file,
  ownerId,
  accountId,
  path,
  fullName,
}: UploadFileProps) => {
  const { storage, databases } = await createAdminClient();
  try {
    // 转换为输入文件
    const inputFile = InputFile.fromBuffer(file, file.name);
    // 创建文件
    const bucketFile = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      inputFile,
    );
    //上传文件信息持久化
    const fileDocument = {
      type: getFileType(bucketFile.name).type,
      name: bucketFile.name,
      url: constructFileUrl(bucketFile.$id),
      extension: getFileType(bucketFile.name).extension,
      size: bucketFile.sizeOriginal,
      owner: ownerId,
      accountId,
      users: [],
      bucketFileId: bucketFile.$id,
      fullName: fullName,
    };
    const newFile = await databases
      .createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.filesCollectionId,
        ID.unique(),
        fileDocument,
      )
      .catch(async (error: unknown) => {
        //如果文件信息持久化失败，删除已上传的文件
        await storage.deleteFile(appwriteConfig.bucketId, bucketFile.$id);
        handleError(error, "Failed to create file document");
      });

    if (!newFile) {
      throw new Error("Failed to create file document");
    }

    // 更新user表中的头像信息
    await uploadUser({ url: newFile.url, userId: ownerId, path });
    revalidatePath(path);
    return parseStringify(newFile);
  } catch (error) {
    handleError(error, "Upload file Failed");
  }
};

//获取文件
export const getFiles = async ({
  types = [],
  searchText = "",
  sort = "$createdAt-desc",
  limit = 20,
}: GetFilesProps) => {
  const { databases } = await createAdminClient();
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error("No user found");
    }
    const query = createQueries(currentUser, types, searchText, sort, limit);
    const files = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      query,
    );
    return parseStringify(files);
  } catch (error) {
    handleError(error, "Failed to get files");
  }
};
//查询数据
const createQueries = (
  currentUser: Models.Document,
  types: FileType[],
  searchText: string,
  sort: string,
  limit?: number,
) => {
  const query = [
    Query.or([
      Query.equal("owner", [currentUser.$id]),
      Query.contains("users", [currentUser.email]),
    ]),
  ];
  // 文件类型条件
  if (types.length > 0) {
    query.push(Query.equal("type", types));
  }
  //搜索
  if (searchText) {
    query.push(Query.contains("name", searchText));
  }
  //排序
  if (sort) {
    console.log("------========");
    console.log(sort);
    const [sortBy, orderBy] = sort.split("-");
    if (sortBy && orderBy) {
      query.push(
        orderBy === "asc" ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy),
      );
    }
  }
  //分页
  if (limit) {
    query.push(Query.limit(limit));
  }
  return query;
};
//文件重命名
export const renameFile = async ({
  fileId,
  name,
  extension,
  path,
}: RenameFileProps) => {
  const { databases } = await createAdminClient();
  try {
    const newName = `${name}.${extension}`;
    const updateFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
      {
        name: newName,
      },
    );
    revalidatePath(path);
    return parseStringify(updateFile);
  } catch (error) {
    handleError(error, "Failed to rename file");
  }
};

interface UpdateFileUsersProps {
  fileId: string;
  emails: string[];
  path: string;
}

//共享文件
export const updateFileUsers = async ({
  fileId,
  emails,
  path,
}: UpdateFileUsersProps) => {
  const { databases } = await createAdminClient();
  try {
    const updateFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
      {
        users: emails,
      },
    );
    revalidatePath(path);
    return parseStringify(updateFile);
  } catch (error) {
    handleError(error, "File sharing failed");
  }
};

// 文件删除功能
interface DeleteFileUsersProps {
  fileId: string;
  bucketFileId: string;
  path: string;
}
export const deleteFile = async ({
  fileId,
  bucketFileId,
  path,
}: DeleteFileUsersProps) => {
  const { databases, storage } = await createAdminClient();
  try {
    const deleteFile = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
    );
    if (deleteFile) {
      await storage.deleteFile(appwriteConfig.bucketId, bucketFileId);
    }
    revalidatePath(path);
    return parseStringify({ status: "success" });
  } catch (error) {
    handleError(error, "File sharing failed");
  }
};

// 总文件空间使用
export async function getTotalSpaceUsed() {
  try {
    const { databases } = await createSessionClient();
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User is not authenticated.");

    const files = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      [Query.equal("owner", [currentUser.$id])],
    );

    const totalSpace = {
      image: { size: 0, latestDate: "" },
      document: { size: 0, latestDate: "" },
      video: { size: 0, latestDate: "" },
      audio: { size: 0, latestDate: "" },
      other: { size: 0, latestDate: "" },
      used: 0,
      all: 2 * 1024 * 1024 * 1024 /* 2GB available bucket storage */,
    };

    files.documents.forEach((file) => {
      const fileType = file.type as FileType;
      totalSpace[fileType].size += file.size;
      totalSpace.used += file.size;

      if (
        !totalSpace[fileType].latestDate ||
        new Date(file.$updatedAt) > new Date(totalSpace[fileType].latestDate)
      ) {
        totalSpace[fileType].latestDate = file.$updatedAt;
      }
    });

    return parseStringify(totalSpace);
  } catch (error) {
    handleError(error, "Error calculating total space used:, ");
  }
}
