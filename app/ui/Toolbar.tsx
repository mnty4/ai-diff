import { ReactNode } from "react";

export default function Toolbar({ children }: { children: ReactNode }) {
  return (
    <div className={"bg-gray-600 rounded-tl-xl rounded-tr-xl p-2"}>
      {children}
    </div>
  );
}
