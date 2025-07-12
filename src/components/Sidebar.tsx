"use client";

import { navItems } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AvatarUploader from "@/components/AvatarUploader";

interface Props {
  fullName: string;
  avatar: string;
  email: string;
  $id: string;
  accountId: string;
}

const Sidebar = ({
  fullName,
  avatar,
  email,
  $id: ownerId,
  accountId,
}: Props) => {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <Link href="/">
        <Image
          src="/assets/icons/logo-full-brand.svg"
          alt="logo"
          width={160}
          height={50}
          className="hidden lg:block h-auto max-w-[160px]"
        />
        <Image
          src="/assets/icons/logo-brand.svg"
          alt="logo"
          width={52}
          height={52}
          className="lg:hidden h-auto max-w-[52px]"
        />
      </Link>
      <nav className="sidebar-nav">
        <ul className="flex flex-1 flex-col gap-6">
          {navItems.map(({ name, icon, url }) => (
            <Link key={name} href={url} className="lg:w-full">
              <li
                className={cn(
                  "sidebar-nav-item",
                  pathname === url && "shad-active",
                )}
              >
                <Image
                  src={icon}
                  alt={name}
                  width={24}
                  height={24}
                  className={cn(
                    "nav-icon",
                    pathname === url && "nav-icon-active",
                  )}
                />
                <p className="hidden lg:block">{name}</p>
              </li>
            </Link>
          ))}
        </ul>
      </nav>

      <div className="w-full">
        <Image
          src="/assets/images/files-2.png"
          alt="files illustration"
          width={506}
          height={418}
          className="w-full h-auto"
        />
      </div>

      <div className="sidebar-user-info">
        {/*<Image*/}
        {/*  src={avatar}*/}
        {/*  alt="Avatar"*/}
        {/*  width={44}*/}
        {/*  height={44}*/}
        {/*  unoptimized={isExternalAvatar}*/}
        {/*  className="sidebar-user-avatar rounded-full object-cover"*/}
        {/*  onClick={updateUserAvatar}*/}
        {/*/>*/}
        <AvatarUploader
          ownerId={ownerId}
          accountId={accountId}
          fullName={accountId}
          avatar={avatar}
        />
        <div className="hidden lg:block">
          <p className="subtitle-2 capitalize">{fullName}</p>
          <p className="caption">{email}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
