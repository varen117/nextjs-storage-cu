"use server"; // 确保在服务端运行

import { Account, Avatars, Client, Databases, Storage } from "node-appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { cookies } from "next/headers";

export const createSessionClient = async () => {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId);

  const session = (await cookies()).get("appwrite_session");
  if (!session || !session.value) {
    throw new Error("Appwrite session cookie not found");
  }
  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
    get database() {
      return new Databases(client);
    },
  };
};

/**
 * 具有管理员级别权限的客户端实例来管理整个appwrite项目，
 * 我们在执行创建用户、删除用户、更新用户等操作时需要使用管理员权限。
 * 管理数据库，或更高级别的访问权限时在服务器上使用它
 */
export const createAdminClient = async () => {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId)
    .setKey(appwriteConfig.secretKey);
  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
    get avatars() {
      return new Avatars(client);
    },
  };
};
