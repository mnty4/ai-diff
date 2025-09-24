"use client";
import NavBar from "@/app/ui/nav-bar";
import clsx from "clsx";
import { useState } from "react";

export default function LayoutWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [showNavBar, setShowNavBar] = useState<boolean>(true);
  return (
    <div className="h-screen flex flex-row bg-gray-700">
      <NavBar showNavBar={showNavBar} setShowNavBar={setShowNavBar} />
      <div
        className={clsx([
          "h-screen w-full flex flex-col items-center",
          "transition-all duration-200 ease-in",
          showNavBar ? "ml-64" : "ml-0",
        ])}
      >
        {children}
      </div>
    </div>
  );
}
