"use server";

import {
  constructFileUrl,
  getFileType,
  handleError,
  parseStringify,
} from "@/lib/utils";
import { createAdminClient } from "@/lib/appwrite";
import { InputFile } from "node-appwrite/file";
import { appwriteConfig } from "@/lib/appwrite/config";
import { ID, Models, Query } from "node-appwrite";
import { revalidatePath, revalidateTag } from "next/cache";
import { getCurrentUser } from "@/lib/actions/user.actions";

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

//获取文件
export const getFiles = async () => {
  const { databases } = await createAdminClient();
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error("No user found");
    }
    const query = createQueries(currentUser);
    const files = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      query,
    );
    console.log(parseStringify(files));
    return parseStringify(files);
  } catch (error) {
    handleError(error, "Failed to get files");
  }
};
//查询数据
const createQueries = (currentUser: Models.Document) => {
  const query = [
    Query.or([
      Query.equal("owner", [currentUser.$id]),
      Query.contains("users", [currentUser.email]),
    ]),
  ];
  // 复杂查询，条件，排序等
  return query;
};
