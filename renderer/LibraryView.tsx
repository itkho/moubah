import React from "react";

export default function LibraryView({ hidden }: { hidden: boolean }) {
    console.log("LibraryView mounted!");
    console.log({ hidden });

    return <>{!hidden && <div>LIBRARY VIEW</div>}</>;
}
