import React, { useEffect, useState } from "react";
import CustomListbox from "../components/Listbox";
import { VideoQuality } from "../../main/utils/enum";
import { Trans } from "@lingui/macro";

export default function SettingsView({ hidden }: { hidden: boolean }) {
    const [selectedQuality, setSelectedQuality] = useState<VideoQuality>();

    useEffect(() => {
        const updateSelectedQuality = async () => {
            const quality = await window.mainApi.getUserPrefQuality();
            setSelectedQuality(quality);
        };

        updateSelectedQuality();
    }, []);

    useEffect(() => {
        if (selectedQuality) {
            window.mainApi.setUserPrefQuality(selectedQuality);
        }
    }, [selectedQuality]);

    return (
        <>
            {!hidden && (
                <div className="flex h-full w-full flex-col p-10">
                    {/* Header */}
                    <h1 className="my-1 text-4xl">
                        <Trans>Settings</Trans>
                    </h1>
                    <div className="font-roboto font-thin opacity-70">
                        <Trans>Manage your settings and preferences here</Trans>
                    </div>

                    {/* Divider */}
                    <div className="bg-base-500 my-6 h-[0.5px] w-full opacity-50"></div>

                    {/* Video settings */}
                    <div className="flex gap-10">
                        <div>
                            <Trans>Video quality</Trans>
                            <div className="font-roboto text-sm font-thin opacity-70">
                                <Trans>Choose your default video quality</Trans>
                            </div>
                        </div>
                        <div className="w-40">
                            <CustomListbox
                                enumList={VideoQuality}
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
