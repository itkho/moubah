import React, { useEffect, useState } from "react";
import CustomListbox from "../components/Listbox";
import { VideoQuality } from "../../main/utils/enum";
import { Trans } from "@lingui/macro";

function transQuality(quality: VideoQuality) {
    return quality;
}

export default function SettingsView({ hidden }: { hidden: boolean }) {
    const [selectedQuality, setSelectedQuality] = useState<VideoQuality>(
        VideoQuality.p720
    );

    useEffect(() => {
        const updateSelectedQuality = async () => {
            const quality = await window.mainApi.getUserPrefQuality();
            console.log(quality);
            setSelectedQuality(quality);
        };

        updateSelectedQuality();
    }, []);

    useEffect(() => {
        window.mainApi.setUserPrefQuality(selectedQuality);
    }, [selectedQuality]);

    return (
        <>
            {!hidden && (
                <div className="flex h-full w-full flex-col p-7">
                    {/* Header */}
                    <h1 className="my-1 text-3xl font-black">
                        <Trans>Settings</Trans>
                    </h1>
                    <div className="font-roboto font-thin opacity-70">
                        <Trans>Manage your settings and preferences here</Trans>
                        here
                    </div>

                    {/* Divider */}
                    <div className="bg-base-500 my-6 h-[0.5px] w-full opacity-50"></div>

                    {/* Video settings */}
                    <div className="flex gap-10">
                        <div>
                            <div className="font-bold">
                                <Trans>Video quality</Trans>
                            </div>
                            <div className="font-roboto text-sm font-thin opacity-70">
                                <Trans>Choose your default video quality</Trans>
                            </div>
                        </div>
                        <div className="w-40">
                            <CustomListbox
                                prefixText=""
                                enumList={VideoQuality}
                                transEnum={transQuality}
                                selectedEnum={selectedQuality}
                                setSelectedEnum={setSelectedQuality}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
