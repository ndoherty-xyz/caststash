"use client";

import Link from "next/link";
import { LoginButton } from "../auth/login-button";
import { Squirrel } from "lucide-react";

export const Navbar = () => {
  return (
    <>
      <div className="backdrop-blur-3xl bg-white/90 dark:bg-stone-950/90 border-b border-stone-300/25 dark:border-stone-400/20 py-3 px-6 flex flex-row items-center justify-between w-full fixed z-10">
        <Link href="/">
          <div className="flex flex-row gap-2 items-center">
            <Squirrel size={24} strokeWidth={2} />
            <p className="font-bold">CastStash</p>
          </div>
        </Link>

        <LoginButton />
      </div>
      <div style={{ height: 60 }} />
    </>
  );
};
