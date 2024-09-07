"use client"
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../ui/button-hero";
import { cn } from "@/lib/utils";
import { mode } from "@/lib/config";
import { useRouter } from 'next/navigation'

let isPlaying = false;
const listHaveANiceDay = ["/have-a-nice-day.png", "/have-a-nice-day-1.png", "/have-a-nice-day-2.png"];

const GroupButtonHero = () => {
  // const {profile} = useAuth();
  const navigate = useRouter();
  const onClick = () => {
    return navigate.push(-1);
  };
  return (
    <div className="flex flex-col flex-wrap md:flex-row items-center gap-6 mt-6 md:mt-16">
      <Button className="whitespace-nowrap" variant="default" size="default" onClick={onClick}>
        Quay về đặt món
      </Button>
    </div>
  );
};
const HeroHeader = ({ title = "REPORT", description = "Nội dụng report" }) => {
  const [play, setPlay] = useState(false);
  useEffect(() => {
    const audio = document.getElementById("audio");
    audio.volumn = 0.5;
    document.addEventListener("click", function () {
      if (isPlaying || mode === "development") return;
      isPlaying = true;
      setPlay(true);
      audio.play();
    });
  }, []);
  const onClick = () => {
    const audio = document.getElementById("audio");
    if (play) audio.pause();
    else audio.play();
    setPlay(!play);
  };

  const imgActive = useMemo(() => listHaveANiceDay[Math.floor(Math.random() * listHaveANiceDay.length)], []);

  return (
    <div className="relative flex items-center justify-center md:pt-0 ">
      <img
        className="w-full h-git md:h-full object-cover aspect-square md:aspect-[4.5/1]"
        src="/images/hero.png"
        alt=""
      />

      <div className="absolute root-wrapper w-full">
        <div className="flex flex-col-reverse gap-10 md:flex-row items-center justify-between relative">
          <div className="text-left">
            <h1 className="text-[20px] md:text-3xl font-bold text-black text-left">{title}</h1>
            <div className="mt-6  text-gray-700 hidden md:block pr-40">{description}</div>
            <GroupButtonHero />
          </div>
          <div className="relative">
            <img className="w-[512px] aspect-[512/256] object-contain" src={"/images" + imgActive} alt="" />
          </div>

          <img
            onClick={onClick}
            className={cn(
              "w-12 h-12 absolute top-0 right-0 cursor-pointer hover:shadow-button rounded-full",
              play ? "animate-spin" : "",
            )}
            src="/images/audio.png"
            alt=""
          />
          <audio id="audio">
            <source src="/images/audio.mp3" type="audio/mpeg" />
          </audio>
        </div>
      </div>
    </div>
  );
};

export default HeroHeader;
