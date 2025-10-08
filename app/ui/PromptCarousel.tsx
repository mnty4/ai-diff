import useEmblaCarousel from "embla-carousel-react";
import PromptField from "@/app/ui/PromptField";
import { useCallback, useEffect, useState } from "react";
import leftArrow from "@/public/left-arrow.svg";
import rightArrow from "@/public/right-arrow.svg";
import Image from "next/image";
import clsx from "clsx";
import { EmblaCarouselType, EmblaEventType } from "embla-carousel";
import { Prompt, Version } from "@/app/lib/definitions";
import PromptFieldSkeleton from "@/app/ui/PromptFieldSkeleton";
import TweakField from "@/app/ui/TweakField";
import TweakFieldError from "@/app/ui/tweak-field-error";

export default function PromptCarousel({
  prompt,
  onUpdatePrompt,
  onUpdateVersion,
  onSelectSlide,
  branchKey,
  onRetry,
}: {
  prompt: Prompt;
  onUpdatePrompt?: (prompt: string) => void;
  onUpdateVersion?: (value: Version) => void;
  onSelectSlide?: (index: number) => void;
  branchKey?: string;
  onRetry?: (index: number) => void;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    containScroll: false,
  });
  const [hideLeftButton, setHideLeftButton] = useState(true);
  const [hideRightButton, setHideRightButton] = useState(true);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // const handleSlidesInView = useCallback(
  //   (emblaApi: EmblaCarouselType, eventName: EmblaEventType) => {
  //     if (emblaApi) {
  //       setHideLeftButton(!emblaApi.canScrollPrev());
  //       setHideRightButton(!emblaApi.canScrollNext());
  //     }
  //   },
  //   [],
  // );
  const handleSelect = useCallback(() => {
    if (emblaApi) {
      // console.log(emblaApi.selectedScrollSnap());
      setHideLeftButton(!emblaApi.canScrollPrev());
      setHideRightButton(!emblaApi.canScrollNext());
      const index = emblaApi.selectedScrollSnap();
      onSelectSlide?.(index);
    }
  }, [emblaApi, onSelectSlide]);

  useEffect(() => {
    if (emblaApi) {
      // console.log(emblaApi.scrollProgress());
      // console.log(emblaApi.slideNodes()); // Access API

      // emblaApi.on("slidesInView", handleSlidesInView);
      emblaApi.on("reInit", handleSelect).on("select", handleSelect);
    }
  }, [emblaApi, handleSelect]);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }
    if (prompt.versions.length > 0) {
      emblaApi.reInit({
        align: "start",
      });
    }
    requestAnimationFrame(() => {
      emblaApi.scrollTo(prompt.versions.length);
    });
  }, [emblaApi, branchKey, prompt.versions.length]);

  return (
    <div className="embla relative">
      <div
        className="embla__viewport w-[100vw] px-[10vw] overflow-hidden"
        ref={emblaRef}
      >
        <div className="embla__container ml-4">
          {/*<div className="embla__slide">*/}
          {/*  <div className="w-112"></div>*/}
          {/*</div>*/}
          <div
            key={prompt.id}
            className={clsx([
              "embla__slide h-[60vh] flex-[0_0_100%] md:flex-[0_0_50%] pr-4",
            ])}
          >
            <PromptField
              prompt={prompt.prompt}
              onUpdatePrompt={onUpdatePrompt}
            />
          </div>
          {prompt.versions.map((version, index) => (
            <div
              key={version.id}
              className={clsx([
                "embla__slide h-[60vh] flex-[0_0_100%] md:flex-[0_0_50%] pr-4",
              ])}
            >
              {version.status === "loading" && <PromptFieldSkeleton />}
              {version.status === "error" && (
                <TweakFieldError
                  onRetry={() => onRetry?.(index)}
                  errorMsg={version.errorMsg}
                />
              )}
              {version.status === "ready" && (
                <TweakField version={version} onUpdateTweak={onUpdateVersion} />
              )}
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        className={clsx([
          "embla__prev rounded-full bg-white",
          "absolute top-1/2 -translate-y-1/2 left-[5vw] -translate-x-1/2",
          "hover:scale-110 transition duration-200 ease-in cursor-pointer",
          hideLeftButton ? "opacity-0 pointer-events-none" : "opacity-100",
        ])}
        onClick={scrollPrev}
      >
        <Image src={leftArrow} alt={"Left arrow."} width={40} height={40} />
      </button>
      <button
        type="button"
        className={clsx([
          "embla__next rounded-full bg-white",
          "absolute top-1/2 -translate-y-1/2 right-[5vw] translate-x-1/2",
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
