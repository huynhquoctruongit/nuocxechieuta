"use client"
import { useEffect, useState } from "react";
import { Button } from "@/components/common/button-hero.jsx";
import { PresentationChartBarIcon } from "@heroicons/react/24/outline";
import OCRComponent from "@/modules/order/screen";
import { mode } from "@/lib/config";
import useSWR from "swr";
import { useParams } from 'next/navigation'
import Link from "next/link"
import { LoadingPage } from "@/components/widget/loading";
import { cn } from "@/lib/utils";
import { useCompany } from "@/hooks/use-company";
import { useAuth } from "@/hooks/use-auth";
import { useOdersIsNotPaid } from "@/hooks/use-order";
import AxiosClient from "@/lib/api/axios-client";
import ModalRemind from "@/modules/order/components/remind";
import EditCompany from "@/modules/order/screen/config";
import MarqueeChat from "@/modules/chat/screen/real-chat";
import useMessage from "@/modules/chat/helper/use-message";
import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense";
import BoxCursor from "@/modules/order/components/box-cursor";

const GroupButtonHero = () => {
    const onScroll = () => {
        const menu = document.getElementById("menu");
        menu.scrollIntoView({ behavior: "smooth" });
    };
    return (
        <div className="flex flex-col flex-wrap md:flex-row items-center gap-6 mt-6 md:mt-16">
            <Button className="whitespace-nowrap" variant="default" size="default" onClick={onScroll}>
                Lết xuống menu
            </Button>

            <Link href="/report?week=this_week" className="text-[#218d7f] hover:text-[#34756c]">
                <Button
                    variant="outline"
                    size="default"
                    className="flex whitespace-nowrap items-center gap-2 border-[1px] border-[#188E7E]"
                >
                    <PresentationChartBarIcon className="w-4 h-4" />
                    Báo cáo
                </Button>
            </Link>
        </div>
    );
};

let isPlaying = false;
const listHaveANiceDay = ["/have-a-nice-day.png", "/have-a-nice-day-1.png", "/have-a-nice-day-2.png"];
const Order = () => {
    const { company } = useCompany();
    const [play, setPlay] = useState(false);
    const { profile } = useAuth();
    useEffect(() => {
        const audio = document.getElementById("audio");
        audio.volumn = 0.5;
        document.addEventListener("click", function () {
            if (isPlaying || mode === "development") return;
            isPlaying = true;
            setPlay(true);
            audio.play();
        });
        if (profile.company !== company?.id) {
            AxiosClient.patch("/users/me", { company: company?.id });
        }
    }, []);
    const onClick = () => {
        const audio = document.getElementById("audio");
        if (play) audio.pause();
        else audio.play();
        setPlay(!play);
    };

    const imgActive = listHaveANiceDay[Math.floor(Math.random() * listHaveANiceDay.length)];

    return (
        <div>
            <EditCompany />
            <div className="">
                <MarqueeChat />
                <div className="-translate-y-1.5 relative flex items-center justify-center md:pt-0 ">
                    <img className="w-full absolute top-0 left-0 h-full object-cover" src="/images/hero.png" alt="" />

                    <div className="root-wrapper w-full py-20">
                        <div className="flex flex-col-reverse gap-10 md:flex-row items-center justify-between relative">
                            <div className="text-left">
                                <h1 className="text-[20px] md:text-3xl font-bold text-black text-center md:text-left">{company?.name}</h1>
                                <h6 className="italic mt-2 text-gray-400 text-center md:text-left">{company?.address}</h6>
                                <div className="mt-6 text-gray-700 hidden md:block pr-40 text-center md:text-left">{company?.description}</div>
                                <GroupButtonHero />
                            </div>
                            <div className="relative">
                                <img className="w-[512px] aspect-[512/256] object-cover" src={"/images" + imgActive} alt="" />
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
            </div>

            <OCRComponent />
            <ModalRemind />
        </div>
    );
};

const Wrap = () => {
    const { providerId, companyId } = useParams();
    const { data: provider, isLoading: isLoadingProvider } = useSWR("/items/bulk_food_provider/" + providerId);
    const { data: company, isLoading: isLoadingCompany } = useSWR("/items/company/" + companyId);
    const { isLoading: isLoadingOrderHistory } = useOdersIsNotPaid();
    const { isLoading: isLoadingUseCompany } = useCompany();
    const { isLoading: isLoadingMessage } = useMessage();
    const existProvider = provider?.data;
    const existCompany = company?.data;
    if (isLoadingCompany || isLoadingProvider || isLoadingOrderHistory || isLoadingUseCompany || isLoadingMessage)
        return <LoadingPage />;
    if (!existProvider || !existCompany)
        return (
            <div className="text-center h-screen flex items-center justify-center text-3xl">
                Không tồn tại nhà hàng hoặc nhà cung cấp
            </div>
        );
    return (
        <>
            <RoomProvider id={companyId}>
                <ClientSideSuspense fallback={<LoadingPage />}>
                    <BoxCursor>
                        <Order />
                    </BoxCursor>
                </ClientSideSuspense>
            </RoomProvider>
        </>
    );
};

export default Wrap;
