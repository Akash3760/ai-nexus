export default function FloatingTextarea({
    label,
    value,
    onChange,
    onKeyDown,
    name,
    rows = 6,
    placeholder = " ",
}) {
    const hasValue = value?.trim().length > 0;

    return (
        <div className="relative">
            <textarea
                name={name}
                value={value}
                rows={rows}
                placeholder={placeholder}
                onChange={onChange}
                onKeyDown={onKeyDown}
                className="
                    peer
                    min-h-36
                    w-full
                    resize-none
                    rounded-2xl
                    border
                    border-border
                    bg-background
                    px-4
                    pt-6
                    pb-4
                    text-base
                    outline-none
                    transition-all
                    duration-200

                    focus:border-cyan-500
                    focus:ring-2
                    focus:ring-cyan-500/20
                "
            />

            <label
                className={`
                    pointer-events-none
                    absolute
                    left-4
                    bg-background
                    px-1
                    transition-all
                    duration-200

                    ${hasValue
                        ? "-top-2 text-xs text-cyan-500"
                        : "top-4 text-base text-muted-foreground"
                    }

                    peer-focus:-top-2
                    peer-focus:text-xs
                    peer-focus:text-cyan-500
                `}
            >
                {label}
            </label>
        </div>
    );
}