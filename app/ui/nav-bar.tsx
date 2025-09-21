import { ReactElement, ReactNode } from "react";
import Image from "next/image";
import menuClose from "@/public/menu-close.svg";

export default function NavBar({ handleClose }: { handleClose: () => void }) {
  return (
    <nav className="w-64 bg-gray-800 flex flex-col">
      <div className="w-full flex justify-end">
        <button
          className="m-2 h-12 w-12 flex justify-center items-center"
          style={{ cursor: "pointer" }}
          onClick={handleClose}
        >
          <Image src={menuClose} alt="Close menu." height="32" width="32" />
        </button>
      </div>
    </nav>
  );
}
