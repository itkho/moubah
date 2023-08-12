import React, { useEffect, useState } from "react";
import CustomListbox from "../components/Listbox";
import { VideoQuality } from "../../main/utils/enum";

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
                <div className="flex h-full w-full flex-col p-5">
                    <h1 className="text-3xl">Settings</h1>
                    <div className="text-sm">
                        Manage your settings and preferences here
                    </div>
                    <div className="divider"></div>
                    <div className="">Video</div>
                    <div className="">Default quality:</div>

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
            )}
        </>
    );
}
