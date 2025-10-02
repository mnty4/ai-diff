import retryIcon from "@/public/retry.svg";
import Image from "next/image";

export default function TweakFieldError({
  errorMsg,
  onRetry,
}: { errorMsg?: string; onRetry?: () => void } = {}) {
  return (
    <div className="bg-gray-900 rounded-xl h-124 w-116 p-4 flex flex-col gap-4 justify-center items-center">
      <span>{errorMsg || "Something went wrong..."}</span>
      <div
        className={
          "hover:rotate-12 hover:scale-110 transition-transform duration-300 ease-in-out cursor-pointer"
        }
        onClick={onRetry}
      >
        <Image src={retryIcon} alt={"Retry button."} width={32} height={32} />
      </div>
    </div>
  );
}
