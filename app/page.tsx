import NavBar from "@/app/ui/nav-bar";
import Header from "@/app/ui/Header";
import NavBarWrapper from "@/app/ui/nav-bar-wrapper";

export default function Home() {
  return (
    <div className="h-screen flex flex-row">
      <NavBarWrapper />
      <main className="h-screen w-full bg-gray-700">
        <div className={"flex justify-center items-center h-16"}>
          <Header />
        </div>
      </main>
    </div>
  );
}
