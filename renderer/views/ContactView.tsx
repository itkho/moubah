import React from "react";

export default function ContactView({ hidden }: { hidden: boolean }) {
    console.log("ContactView rendered!");

    return (
        <>
            {!hidden && (
                <div className="flex h-full w-full items-center justify-center">
                    <a
                        className="rounded bg-neutral-400 p-4 text-neutral-700 duration-200 hover:bg-neutral-500 hover:text-neutral-300"
                        href="mailto:moubah.info@gmail.com"
                    >
                        moubah.info@gmail.com
                    </a>
                </div>
            )}
        </>
    );
}
