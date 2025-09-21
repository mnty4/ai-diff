"use client";

import { useState } from "react";
import NavBar from "@/app/ui/nav-bar";
import Image from "next/image";
import menuHamburger from "@/public/menu-hamburger.svg";

export default function NavBarWrapper() {
  const [showNavBar, setShowNavBar] = useState<boolean>(false);
  if (showNavBar) {
    return <NavBar handleClose={() => setShowNavBar(false)} />;
  }
  return (
    <button
      className="fixed top-0 left-0 z-50 flex justify-center items-center h-12 w-12 m-2"
      style={{ cursor: "pointer" }}
      onClick={() => setShowNavBar(true)}
    >
      <Image src={menuHamburger} alt="Open menu." height="32" width="32" />
    </button>
  );
}
