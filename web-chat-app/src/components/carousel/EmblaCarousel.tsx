import React from "react";
import { EmblaOptionsType } from "embla-carousel";
import {
  PrevButton,
  NextButton,
  usePrevNextButtons,
} from "./EmblaCarouselArrowButtons";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { Button } from "../ui/button";

type PropType = {
  slides: { content: string; onClick: Function }[];
  options?: EmblaOptionsType;
  active?: number;
};

const EmblaCarousel: React.FC<PropType> = ({ slides, options, active = 0 }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <section className="embla relative">
      <Button
        onClick={onPrevButtonClick}
        disabled={prevBtnDisabled}
        className="rounded-full absolute z-10 -left-5 top-[50%] -translate-y-[50%] opacity-30 cursor-pointer hover:opacity-80 text-[0.5rem] p-1"
        variant={"no_style"}
        size={"icon"}
      >
        <ArrowLeftIcon></ArrowLeftIcon>
      </Button>

      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((slide, index) => (
            <div className="embla__slide" key={index}>
              <Button
                className={`embla__slide__content  text-black ${
                  active == index
                    ? "bg-gray-200"
                    : "cursor-pointer hover:bg-gray-200"
                }`}
                variant={"outline"}
                disabled={active == index}
              >
                {slide.content}
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Button
        onClick={onNextButtonClick}
        disabled={nextBtnDisabled}
        className="rounded-full absolute z-10 -right-5 top-[50%] -translate-y-[50%] opacity-30 cursor-pointer hover:opacity-80 text-[0.5rem] p-1"
        variant={"outline"}
        size={"no_style"}
      >
        <ArrowRightIcon></ArrowRightIcon>
      </Button>
    </section>
  );
};

export default EmblaCarousel;
