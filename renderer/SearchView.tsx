import React, { useRef, useState } from "react";

export default function SearchView({ hidden }: { hidden: boolean }) {
    console.log("SearchView mounted!");
    console.log({ hidden });

    const [query, setQuery] = useState();
    const input = useRef<HTMLInputElement>(null);

    function search() {
        console.log(input.current?.value);
    }

    function onChange(e: any) {
        console.log(e.target.value);
        setQuery(e.target.value);
    }

    return (
        <>
            {!hidden && (
                <div>
                    <input
                        ref={input}
                        value={query}
                        onChange={onChange}
                        type="search"
                    />
                    <button onClick={search}>Search</button>
                </div>
            )}
        </>
    );
}
