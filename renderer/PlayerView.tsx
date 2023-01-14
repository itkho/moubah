import React from "react";

export default function PlayerView({ hidden }: { hidden: boolean }) {
    console.log("PlayerView mounted!");
    console.log({ hidden });

    return <>{!hidden && <div>PLAYER VIEW</div>}</>;
}
