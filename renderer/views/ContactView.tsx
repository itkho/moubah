import React from "react";

export default function ContactView({ hidden }: { hidden: boolean }) {
    console.log("ContactView rendered!");

    return (
        <>
            {!hidden && (
                <div className="h-full w-full flex justify-center items-center">
                    <a
                        className="p-4 rounded bg-neutral-400 hover:bg-neutral-700 hover:text-neutral-400"
                        href="mailto:moubah.info@gmail.com"
                    >
                        moubah.info@gmail.com
                    </a>
                </div>
            )}
        </>
    );
}
