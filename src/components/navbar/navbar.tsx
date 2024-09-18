"use client";

import Link from "next/link";
import { LoginButton } from "../auth/login-button";
import { LibraryBig } from "lucide-react";

export const Navbar = () => {
  return (
    <>
      <div className="backdrop-blur-3xl bg-[#ffffff5f] py-3 px-6 flex flex-row items-center justify-between w-full fixed z-50">
        <Link href="/">
          <div className="flex flex-row gap-2">
            <LibraryBig size={24} strokeWidth={2} />
            <p className="font-bold">fc-pinterest</p>
          </div>
        </Link>

        <LoginButton />
      </div>
      <div style={{ height: 60 }} />
    </>
  );
};
