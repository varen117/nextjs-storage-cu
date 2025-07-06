"use server"; //可以确保在服务端运行
import { createAdminClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { ID, Query } from "node-appwrite";
import { parseStringify } from "@/lib/utils";
import { cookies } from "next/headers";

export const createAccount = async ({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) => {
  const exisitingUser = await getUserByEmail(email);
  const accountIdString = await sendEmailOTP({ email });
  if (!accountIdString) {
    throw new Error("Failed to send email OTP");
  }

  // 将字符串转换为整数（如果需要存储为整数）
  const accountId = parseInt(accountIdString, 10);
  if (isNaN(accountId)) {
    throw new Error("Invalid account ID format");
  }

  //用户不存在
  if (!exisitingUser) {
    const { databases } = await createAdminClient();
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      {
        fullName,
        email,
        accountId, // 现在是整数
        avatar:
          "https://upload.wikimedia.org/wikipedia/commons/9/9e/Male_Avatar.jpg",
      },
    );
  }
  return parseStringify({ accountId });
};

const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient();
  const result = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal("email", [email])],
  );
  return result.total > 0 ? result.documents[0] : null;
};

export const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient();
  try {
    const session = await account.createEmailToken(ID.unique(), email);
    return session.userId;
  } catch (error) {
    handleError(error, "Error sending email OTP");
  }
};

//记录错误日志
const handleError = (error: unknown, message: string) => {
  console.log(error);
  throw error;
};

export const signInUser = async ({ email }: { email: string }) => {
  return "";
};

export const verifySecret = async ({
  accountId,
  password,
}: {
  accountId: string;
  password: string;
}) => {
  try {
    const { account } = await createAdminClient();
    const session = await account.createSession(accountId, password);
    (await cookies()).set("appwrite_session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    handleError(error, "Error verifying secret");
  }
};
