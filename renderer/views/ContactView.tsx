import React from "react";

export default function ContactView({ hidden }: { hidden: boolean }) {
    console.log("ContactView rendered!");

    return (
        <>
            {!hidden && (
                <div className="flex h-full w-full items-center justify-center">
                    <a
                        className="bg-base-200 hover:text-base-700 text-base-600 hover:bg-base-300 rounded p-4 duration-200"
                        href="mailto:moubah.info@gmail.com"
                    >
                        moubah.info@gmail.com
                    </a>
                </div>
            )}
        </>
    );
}
