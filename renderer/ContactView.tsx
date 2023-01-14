import React from "react";

export default function ContactView({ hidden }: { hidden: boolean }) {
    console.log("ContactView mounted!");
    console.log({ hidden });

    return (
        <>
            {!hidden && (
                <div>
                    <a
                        className="hover:text-slate-700"
                        href="mailto:moubah.info@gmail.com"
                    >
                        moubah.info@gmail.com
                    </a>
                </div>
            )}
        </>
    );
}
