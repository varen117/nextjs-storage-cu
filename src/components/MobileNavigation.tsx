"use client";

import FileUploader from "@/components/FileUploader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navItems } from "@/constants";
import { signOutUser } from "@/lib/actions/user.actions";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
interface Props {
  fullName: string;
  avatar: string;
  email: string;
  accountId: string;
  $id: string;
}
const MobileNavigation = ({
  fullName,
  avatar,
  email,
  accountId,
  $id: ownerId,
}: Props) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="mobile-header">
      <Image
        src="../assets/icons/logo-full-brand.svg"
        alt="logo"
        width={120}
        height={52}
        className="h-auto"
      />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <Image
            src="../assets/icons/menu.svg"
            alt="Search"
            width={30}
            height={30}
          />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              <div className="header-user">
                <Image
                  src={avatar}
                  alt="avatar"
                  height={44}
                  width={44}
                  className="header-user-avatar"
                />
                <div className="sm:hidden lg:block">
                  <p className="subtitle-2 capitalize">{fullName}</p>
                  <p className="caption">{email}</p>
                </div>
              </div>
              <Separator className="mb-4 bg-light-200" />
            </SheetTitle>
            <SheetDescription>
              <nav className="mobile-nav">
                <ul className="mobile-nav-list">
                  {navItems.map(({ name, icon, url }) => (
                    <Link key={name} href={url} className="lg:w-full">
                      <li
                        className={cn(
                          "mobile-nav-item",
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
                        <p>{name}</p>
                      </li>
                    </Link>
                  ))}
                </ul>
              </nav>
              <Separator className="my-5 bg-light-200/20" />
              <div className="flex flex-col justify-between gap-5 pb-5">
                <FileUploader
                  ownerId={ownerId}
                  accountId={accountId}
                  fullName={fullName}
                />
                <Button
                  type="submit"
                  className="mobile-sign-out-button"
                  onClick={async () => await signOutUser()}
                >
                  <Image
                    src="../assets/icons/logout.svg"
                    alt="logo"
                    width={24}
                    height={24}
                  />
                  <p>Logout</p>
                </Button>
              </div>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default MobileNavigation;
