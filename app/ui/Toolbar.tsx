import { ReactNode } from "react";

export default function Toolbar({ children }: { children: ReactNode }) {
  return (
    <div className={"bg-transparent rounded-xl rounded-tr-xl p-1"}>
      {children}
    </div>
  );
}
