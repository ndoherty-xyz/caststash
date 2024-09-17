"use client";
import { NeynarAuthButton } from "@neynar/react";
import { LoginButton } from "../auth/login-button";

export const Navbar = () => {
  return (
    <div className="bg-transparent p-4 flex flex-row justify-between">
      <p>fc-pinterest</p>
      <LoginButton />
    </div>
  );
};
