import React from "react";
import LocalVideoItem from "./components/LocalVideoItem";
import { useLocalVideo } from "./context/LocalVideoContext";

export default function LibraryView({ hidden }: { hidden: boolean }) {
    console.log("LibraryView mounted!");

    const { localVideos } = useLocalVideo();

    return (
        <>
            {!hidden && (
                <div className="h-80 mx-2 my-10 px-8 overflow-auto">
                    {localVideos.length ? (
                        localVideos.map((video) => (
                            <LocalVideoItem video={video} />
                        ))
                    ) : (
                        <div className="text-center">
                            No video to watch yet...
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
