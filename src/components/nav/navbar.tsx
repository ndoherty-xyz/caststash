"use client";

import Link from "next/link";
import { LoginButton } from "../auth/login-button";
import { Squirrel } from "lucide-react";
import { Search } from "./search";
import { useWindowWidth } from "@react-hook/window-size";

export const Navbar = () => {
  const windowWidth = useWindowWidth();
  const isSmallWindow = windowWidth < 640;

  return (
    <>
      <div className="backdrop-blur-3xl bg-white/90 dark:bg-stone-950/90 flex flex-col w-full fixed z-10">
        <div className="dark:bg-stone-950/90 border-b border-stone-300/25 dark:border-stone-400/20 py-3 px-3.5 sm:px-6 flex flex-row items-center justify-between w-full">
          <Link href="/">
            <div className="flex flex-row gap-2 items-center">
              <Squirrel size={24} strokeWidth={2} />
              <p className="font-bold">CastStash</p>
            </div>
          </Link>
          {!isSmallWindow ? <Search /> : null}

          <LoginButton />
        </div>
        {isSmallWindow ? (
          <div className="dark:bg-stone-950/90 border-b h-[60px] border-stone-300/25 dark:border-stone-400/20 py-3 px-3.5 sm:px-6 flex flex-row items-center w-full">
            <Search fullWidth />
          </div>
        ) : null}
      </div>
      <div style={{ height: isSmallWindow ? 130 : 65 }} />
    </>
  );
};
