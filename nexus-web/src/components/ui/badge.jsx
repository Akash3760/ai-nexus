import * as React from "react";

function Badge({
    className = "",
    variant = "default",
    children,
    ...props
}) {
    const variants = {
        default:
            "bg-primary text-primary-foreground",

        secondary:
            "bg-secondary text-secondary-foreground",

        outline:
            "border border-border bg-transparent text-foreground",

        destructive:
            "bg-destructive text-destructive-foreground",
    };

    return (
        <span
            className={`
                inline-flex
                items-center
                rounded-full
                px-2.5
                py-0.5
                text-xs
                font-semibold
                transition-colors
                ${variants[variant] || variants.default}
                ${className}
            `}
            {...props}
        >
            {children}
        </span>
    );
}

export { Badge };