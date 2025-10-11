import { titleFont } from "@/app/fonts";

export default function Header() {
  return (
    <header>
      <span className={`${titleFont.className} text-3xl font-bold`}>
        Tweak.ai
      </span>
    </header>
  );
}
