import { X } from "lucide-react";

export default function FloatingInput({
    label,
    value,
    onChange,
    onKeyDown,
    name,
    type = "text",
    onClear,
}) {

    const getSuggestion = () => {

        if (type !== "email")
            return "";

        if (!value)
            return "";

        const recentEmails =
            JSON.parse(
                localStorage.getItem(
                    "recentEmails"
                )
            ) || [];

        const match =
            recentEmails.find(
                email =>
                    email
                        .toLowerCase()
                        .startsWith(
                            value.toLowerCase()
                        )
            );

        return match || "";
    };

    const suggestion =
        getSuggestion();


    return (
        <div className="relative">

            {suggestion &&
                suggestion !== value && (

                    <div
                        className="
                        pointer-events-none
                        absolute
                        inset-0

                        flex
                        items-center

                        px-4
                        pt-5

                        text-base
                        leading-none

                        whitespace-nowrap
                        overflow-hidden
                    "
                    >
                        <span className="
                                invisible
                                font-inherit
                            ">
                            {value}
                        </span>

                        <span className="
                                font-inherit
                                text-muted-foreground/35
                            ">
                            {
                                suggestion.slice(
                                    value.length
                                )
                            }
                        </span>
                    </div>

                )}

            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                autoComplete="off"
                placeholder=" "
                onKeyDown={(e) => {

                    if (
                        e.key === "Tab" &&
                        suggestion
                    ) {

                        e.preventDefault();

                        onChange({
                            target: {
                                name,
                                value: suggestion,
                            },
                        });

                        return;
                    }

                    onKeyDown?.(e);

                }}
                className="
                    peer
                    h-14
                    w-full
                    rounded-xl
                    border
                    border-border
                    bg-background
                    px-4
                    pt-5
                    outline-none
                    transition
                    focus:border-cyan-500
                "
            />

            <label
                className="
                    pointer-events-none
                    absolute
                    left-4
                    top-4
                    bg-background
                    px-1
                    text-muted-foreground
                    transition-all

                    peer-focus:-top-2
                    peer-focus:text-xs
                    peer-focus:text-cyan-500

                    peer-[&:not(:placeholder-shown)]:-top-2
                    peer-[&:not(:placeholder-shown)]:text-xs
                "
            >
                {label}
            </label>

            {value && onClear && (
                <button
                    type="button"
                    onClick={onClear}
                    className="
                        absolute
                        right-4
                        top-1/2
                        -translate-y-1/2
                        text-muted-foreground
                        transition-colors
                        hover:text-foreground
                    "
                >
                    <X size={18} />
                </button>
            )}

        </div>
    );
}