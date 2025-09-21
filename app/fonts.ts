import { Inter } from "next/font/google";
import localFont from "next/font/local";
export const baseFont = Inter({ subsets: ["latin"] });
export const titleFont = localFont({
  src: "../public/fonts/consolas.ttf",
});
