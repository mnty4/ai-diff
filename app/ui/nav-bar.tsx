import Image from "next/image";
import menuClose from "@/public/menu-close.svg";
import clsx from "clsx";
import createSvg from "@/public/create.svg";
import Link from "next/link";
import menuHamburger from "@/public/menu-hamburger.svg";

export default function NavBar({
  showNavBar,
  setShowNavBar,
}: {
  showNavBar: boolean;
  setShowNavBar: (showNavBar: boolean) => void;
}) {
  return (
    <>
      <div
        className={clsx([
          "fixed h-full flex z-51",
          "transition duration-200 ease-in",
          showNavBar ? "translate-x-0" : "-translate-x-full",
        ])}
      >
        <nav className="w-64 bg-gray-800 flex flex-col gap-2">
          <div className="w-full flex justify-end">
            <button
              className={clsx([
                "group m-2 h-12 w-12 flex justify-center items-center",
              ])}
              style={{ cursor: "pointer" }}
              onClick={() => setShowNavBar(false)}
            >
              <Image
                src={menuClose}
                alt="Close menu."
                height="32"
                width="32"
                className="group-hover:animate-[bounceFromRest_1s_infinite]"
              />
            </button>
          </div>
          <div className="flex flex-col items-center gap-4">
            <Link
              href="/create"
              className={
                "bg-white m-1 rounded-lg px-4 py-2 text-black flex items-center gap-2 hover:scale-110 transition duration-200 ease-in"
              }
            >
              <span>Create</span>
              <Image src={createSvg} alt="Plus icon." height={24} width={24} />
            </Link>
            <Link
              href="/prompts"
              className="p-1 hover:scale-110 transition duration-200 ease-in"
            >
              Prompts
            </Link>
            <Link
              href="/variables"
              className="p-1 hover:scale-110 transition duration-200 ease-in"
            >
              Variables
            </Link>
          </div>
        </nav>
      </div>
      <button
        className={clsx([
          "group fixed top-0 left-0 z-50 flex justify-center items-center w-12 h-12 m-2",
        ])}
        style={{ cursor: "pointer" }}
        onClick={() => setShowNavBar(true)}
      >
        <Image
          src={menuHamburger}
          alt="Open menu."
          height="32"
          width="32"
          className="group-hover:animate-[bounceFromRest_1s_infinite]"
        />
      </button>
    </>
  );
}
