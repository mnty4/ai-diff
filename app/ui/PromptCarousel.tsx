import useEmblaCarousel from "embla-carousel-react";
import PromptField from "@/app/ui/PromptField";
import { useEffect } from "react";

export default function PromptCarousel({ prompts }: { prompts: string[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({});

  useEffect(() => {
    if (emblaApi) {
      console.log(emblaApi.slideNodes()); // Access API
    }
  }, [emblaApi]);

  return (
    <div className="embla" ref={emblaRef}>
      {/*<div className="embla__viewport">*/}
      <div className="embla__container w-[100vw]">
        <div className="embla__slide">
          <div className="w-116 h-124"></div>
        </div>
        {prompts.map((prompt, index) => (
          <div key={index} className="embla__slide mx-8">
            <PromptField prompt={prompt} />
          </div>
        ))}
        <div className="embla__slide">
          <div className="w-116 h-124"></div>
        </div>
      </div>
      {/*</div>*/}
    </div>
  );
}
