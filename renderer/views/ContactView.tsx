import React from "react";

export default function ContactView({ hidden }: { hidden: boolean }) {
    console.log("ContactView mounted!");
    console.log({ hidden });

    return (
        <>
            {!hidden && (
                <div className="h-full w-full flex justify-center items-center">
                    <a
                        className="p-4 rounded bg-gray-1 hover:bg-gray-2 hover:text-gray-1"
                        href="mailto:moubah.info@gmail.com"
                    >
                        moubah.info@gmail.com
                    </a>
                </div>
            )}
        </>
    );
}
