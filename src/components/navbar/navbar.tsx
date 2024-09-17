"use client";

import { LoginButton } from "../auth/login-button";
import { LibraryBig } from "lucide-react";

export const Navbar = () => {
  return (
    <div className="bg-transparent py-3 px-6 flex flex-row items-center justify-between">
      <div className="flex flex-row gap-2">
        <LibraryBig size={24} strokeWidth={2} />
        <p className="font-bold">fc-pinterest</p>
      </div>
      <LoginButton />
    </div>
  );
};
