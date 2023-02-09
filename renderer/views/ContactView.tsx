import React from "react";

export default function ContactView({ hidden }: { hidden: boolean }) {
    console.log("ContactView rendered!");

    return (
        <>
            {!hidden && (
                <div className="bg-background flex h-full w-full items-center justify-center">
                    <a
                        className="bg-neutral-200 hover:text-neutral-700 text-neutral-600 hover:bg-neutral-300 rounded p-4 duration-200"
                        href="mailto:moubah.info@gmail.com"
                    >
                        moubah.info@gmail.com
                    </a>
                </div>
            )}
        </>
    );
}
