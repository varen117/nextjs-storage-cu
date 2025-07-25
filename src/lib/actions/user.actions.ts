"use server"; //可以确保在服务端运行
import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { ID, Query, Account, Client } from "node-appwrite";
import {
  constructFileUrl,
  getFileType,
  handleError,
  parseStringify,
} from "@/lib/utils";
import { cookies } from "next/headers";
import { avatarPlaceholderUrl } from "@/constants";
import { redirect } from "next/navigation";
import { InputFile } from "node-appwrite/file";
import { revalidatePath } from "next/cache";

export const createAccount = async ({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) => {
  const existingUser = await getUserByEmail(email);
  const accountId = await sendEmailOTP({ email });
  if (!accountId) {
    throw new Error("Failed to send email OTP");
  }

  //用户不存在
  if (!existingUser) {
    const { databases } = await createAdminClient();
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      {
        fullName,
        email,
        accountId,
        avatar: avatarPlaceholderUrl,
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

export const getCurrentUser = async () => {
  const { databases, account } = await createSessionClient();
  const result = await account.get();
  const user = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal("accountId", result.$id)],
  );
  if (user.total > 0) {
    return parseStringify(user.documents[0]);
  }
  return null;
};
//注销用户
export const signOutUser = async () => {
  try {
    const client = new Client();
    const account = new Account(client);

    await account.deleteSession("current");
    (await cookies()).delete("appwrite_session");
  } catch (error) {
    handleError(error, "error to sign out user");
  } finally {
    redirect("/sign-in");
  }
};
//用户登陆
export const signInUser = async ({ email }: { email: string }) => {
  try {
    //通过邮箱获取用户信息
    const existingUser = await getUserByEmail(email);
    // Send OTP
    if (existingUser) {
      await sendEmailOTP({ email });
      return parseStringify({
        accountId: existingUser.accountId,
      });
    }
    return parseStringify({ accountId: null, error: "User not found" });
  } catch (error) {
    handleError(error, "Error verifying email");
  }
};

interface UploadFileProps {
  url: string;
  userId: string;
  path: string;
}

//修改头像
export const uploadUser = async ({ url, userId, path }: UploadFileProps) => {
  const { databases } = await createAdminClient();
  try {
    const updateUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      userId,
      {
        avatar: url,
      },
    );
    revalidatePath(path);
    return parseStringify(updateUser);
  } catch (error) {
    handleError(error, "Failed to update avatar");
  }
};
