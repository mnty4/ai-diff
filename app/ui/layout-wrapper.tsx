"use client";
import NavBar from "@/app/ui/nav-bar";
import clsx from "clsx";
import { useState } from "react";

export default function LayoutWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [showNavBar, setShowNavBar] = useState<boolean>(false);
  return (
    <div className="h-[100dvh] w-full flex flex-row bg-gray-700">
      <NavBar showNavBar={showNavBar} setShowNavBar={setShowNavBar} />
      <div
        className={clsx([
          "h-full w-full flex flex-col items-center",
          "transition-all duration-200 ease-in",
          showNavBar ? "md:pl-64" : "md:pl-0",
        ])}
      >
        {children}
      </div>
    </div>
  );
}
