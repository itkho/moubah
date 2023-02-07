import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/solid";
import React, { Dispatch, Fragment, SetStateAction } from "react";

export default function CustomListbox<T>({
    prefixText,
    enumList,
    selectedEnum,
    setSelectedEnum,
}: {
    prefixText: string;
    enumList: any;
    selectedEnum: T;
    setSelectedEnum: Dispatch<SetStateAction<T>>;
}) {
    return (
        <Listbox value={selectedEnum} onChange={setSelectedEnum}>
            <div className="relative mt-1">
                <Listbox.Button className="relative w-full rounded-lg bg-neutral-50 py-2 pl-3 text-left text-sm shadow-md">
                    <span className="text-neutral-500">{prefixText}</span>
                    <span className="truncate">{`${selectedEnum}`}</span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon
                            className="h-5 w-5 text-neutral-400"
                            aria-hidden="true"
                        />
                    </span>
                </Listbox.Button>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Listbox.Options className="absolute z-10 mt-1 w-full overflow-auto rounded-md bg-neutral-50 py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5">
                        {Object.entries(enumList).map(([key, value]) => {
                            return (
                                <Listbox.Option
                                    key={key}
                                    className={({ active }) =>
                                        `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                            active
                                                ? "bg-lime-100 text-lime-900"
                                                : "text-neutral-900"
                                        }`
                                    }
                                    value={value}
                                >
                                    {({ selected }) => (
                                        <>
                                            <span
                                                className={`block truncate ${
                                                    selected
                                                        ? "font-medium"
                                                        : "font-normal"
                                                }`}
                                            >
                                                {value}
                                            </span>
                                            {selected && (
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-lime-600">
                                                    <CheckIcon
                                                        className="h-5 w-5"
                                                        aria-hidden="true"
                                                    />
                                                </span>
                                            )}
                                        </>
                                    )}
                                </Listbox.Option>
                            );
                        })}
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>
    );
}
