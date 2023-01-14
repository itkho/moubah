import React, { useEffect, useRef, useState } from "react";
import {
    MagnifyingGlassIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
} from "@heroicons/react/24/solid";

export default function SearchView({ hidden }: { hidden: boolean }) {
    console.log("SearchView mounted!");
    console.log({ hidden });

    const [query, setQuery] = useState();
    // const input = useRef<HTMLInputElement>(null);

    function search() {
        // console.log(input.current?.value);
        console.log(query);
    }

    function onChange(e: any) {
        console.log(e.target.value);
        setQuery(e.target.value);
    }

    return (
        <>
            {!hidden && (
                <div className="h-full flex flex-col justify-between items-center">
                    <div className="flex my-10 w-1/3">
                        <input
                            className="grow outline-none p-1 border-2 rounded-l border-gray-2 bg-gray-1"
                            // ref={input}
                            value={query}
                            onChange={onChange}
                            type="search"
                        />
                        <button
                            className="p-1 border-2 rounded-r border-gray-2 bg-gray-2"
                            onClick={search}
                        >
                            <MagnifyingGlassIcon className="h-4 stroke-current stroke-1 text-background" />
                        </button>
                    </div>

                    {true && (
                        <>
                            <div className="flex">
                                <div>
                                    <ArrowLeftIcon className="h-10" />
                                </div>
                                <div>
                                    <div>
                                        <div>Title</div>
                                        <div>Duration</div>
                                        <div>Author</div>
                                    </div>
                                    <div>
                                        <img src="" alt="Thumbnail" />
                                    </div>
                                </div>
                                <div>
                                    <ArrowRightIcon className="h-10" />
                                </div>
                            </div>
                            <div className="">
                                <button className="my-10 p-3 bg-gray-1 hover:bg-gray-2 hover:text-gray-1 rounded">
                                    🔇 Remove background music
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
}
