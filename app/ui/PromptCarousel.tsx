import useEmblaCarousel from "embla-carousel-react";
import PromptField from "@/app/ui/PromptField";
import { useCallback, useEffect, useState } from "react";
import leftArrow from "@/public/left-arrow.svg";
import rightArrow from "@/public/right-arrow.svg";
import Image from "next/image";
import clsx from "clsx";
import { EmblaCarouselType, EmblaEventType } from "embla-carousel";

export default function PromptCarousel({ prompts }: { prompts: string[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel();
  const [hideLeftButton, setHideLeftButton] = useState(true);
  const [hideRightButton, setHideRightButton] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const handleSlidesInView = useCallback(
    (emblaApi: EmblaCarouselType, eventName: EmblaEventType) => {
      if (emblaApi) {
        setHideLeftButton(!emblaApi.canScrollPrev());
        setHideRightButton(!emblaApi.canScrollNext());
      }
    },
    [],
  );

  useEffect(() => {
    if (emblaApi) {
      console.log(emblaApi.scrollProgress());
      console.log(emblaApi.slideNodes()); // Access API
      emblaApi.on("slidesInView", handleSlidesInView);
    }
  }, [emblaApi, handleSlidesInView]);

  return (
    <div className="embla relative">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container w-[100vw]">
          <div className="embla__slide">
            <div className="w-112"></div>
          </div>
          {prompts.map((prompt, index) => (
            <div key={index} className="embla__slide mx-12">
              <PromptField prompt={prompt} />
            </div>
          ))}
          <div className="embla__slide">
            <div className="w-112"></div>
          </div>
        </div>
      </div>
      <button
        className={clsx([
          "embla__prev rounded-full bg-white",
          "absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-72",
          "hover:scale-110 transition duration-200 ease-in cursor-pointer",
          hideLeftButton ? "opacity-0 pointer-events-none" : "opacity-100",
        ])}
        onClick={scrollPrev}
      >
        <Image src={leftArrow} alt={"Left arrow."} width={40} height={40} />
      </button>
      <button
        className={clsx([
          "embla__next rounded-full bg-white",
          "absolute top-1/2 -translate-y-1/2 right-1/2 translate-x-72",
          "hover:scale-110 transition duration-200 ease-in cursor-pointer",
          hideRightButton ? "opacity-0 pointer-events-none" : "opacity-100",
        ])}
        onClick={scrollNext}
      >
        <Image src={rightArrow} alt={"Right arrow."} width={40} height={40} />
      </button>
    </div>
  );
}
