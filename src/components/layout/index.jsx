"use client";
import { useAuth } from "@/hooks/use-auth";
import { fetcherClient } from "@/lib/api/axios-client";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { SWRConfig } from "swr";
import { getCookie } from "react-use-cookie";
import Header from "@/components/widget/header"
import ModalLogin from "@/modules/auth/screen/login";
import { LiveblocksProvider, RoomProvider } from "@liveblocks/react/suspense";
let mount = false;
const publicApiKey = "pk_prod_2oVxL3i1hs4YnjgBRzAvH3-G9GLo1e2HWjVS7NUf3oPEsn1mpfJVpkaHuguE4VMC";
const Wrap = ({ children }) => {
    const { isLogin } = useAuth();

    return (
        <LiveblocksProvider publicApiKey={publicApiKey} initialPresence={{ profile: "", id: "", avatar: "" }}>
            <SWRConfig
                value={{
                    revalidateIfStale: false,
                    revalidateOnFocus: false,
                    fetcher: fetcherClient,
                }}
            >
                <TooltipProvider>
                    <InitAuthen />
                    <ModalLogin />
                    <div className="text-primary bg-[url(/images/background.png)] bg-contain text-left overflow-hidden min-h-[100vh] flex flex-col">
                        <Header />
                        <div className="bg-white/40 flex-1 relative text-gray-700">
                            {children}
                        </div>
                    </div>
                </TooltipProvider>
            </SWRConfig>
        </LiveblocksProvider>
    );
};

const InitAuthen = () => {
    const { profile, getProfile, mutate } = useAuth();
    useEffect(() => {
        const auth_token = getCookie("auth_token");
        if (!auth_token) mutate(null, { revalidate: false });
        if (auth_token && !profile?.id && !mount) getProfile();
        mount = true;
    }, []);
    return null;
};

export default Wrap;
