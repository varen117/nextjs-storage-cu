import FileUploader from "@/components/FileUploader";
import Search from "@/components/Search";
import { Button } from "@/components/ui/button";
import { signOutUser } from "@/lib/actions/user.actions";
import Image from "next/image";
interface Props {
  userId: string;
  accountId: string;
  fullName: string;
}
const Header = ({ userId, accountId, fullName }: Props) => {
  return (
    <header className="header">
      <Search />
      <div className="header-wrapper">
        <FileUploader
          ownerId={userId}
          accountId={accountId}
          fullName={fullName}
        />

        <form
          action={async () => {
            //React19的新功能，处理看似客户端操作的服务端功能，加上"use server"后这段代码会在服务端执行
            "use server";
            await signOutUser();
          }}
        >
          <Button type="submit" className="sign-out-button">
            <Image
              src="../assets/icons/logout.svg"
              alt="logo"
              width={24}
              height={24}
              className="w-6"
            />
          </Button>
        </form>
      </div>
    </header>
  );
};

export default Header;
