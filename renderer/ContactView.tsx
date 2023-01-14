import React from "react";

export default function ContactView({ hidden }: { hidden: boolean }) {
    console.log("ContactView mounted!");
    console.log({ hidden });

    return <>{!hidden && <div>CONTACT VIEW</div>}</>;
}
