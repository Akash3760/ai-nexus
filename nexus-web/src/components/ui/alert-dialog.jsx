"use client";

import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

import { cn } from "@/lib/utils";

const AlertDialog = AlertDialogPrimitive.Root;

const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

const AlertDialogPortal = AlertDialogPrimitive.Portal;

const AlertDialogOverlay = React.forwardRef(
    ({ className, ...props }, ref) => (
        <AlertDialogPrimitive.Overlay
            ref={ref}
            className={cn(
                "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out",
                className
            )}
            {...props}
        />
    )
);

AlertDialogOverlay.displayName =
    AlertDialogPrimitive.Overlay.displayName;

const AlertDialogContent = React.forwardRef(
    ({ className, ...props }, ref) => (
        <AlertDialogPortal>
            <AlertDialogOverlay />
            <AlertDialogPrimitive.Content
                ref={ref}
                className={cn(
                    "fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-background p-6 shadow-lg duration-200",
                    className
                )}
                {...props}
            />
        </AlertDialogPortal>
    )
);

AlertDialogContent.displayName =
    AlertDialogPrimitive.Content.displayName;

const AlertDialogHeader = ({
    className,
    ...props
}) => (
    <div
        className={cn(
            "flex flex-col space-y-2 text-center sm:text-left",
            className
        )}
        {...props}
    />
);

const AlertDialogFooter = ({
    className,
    ...props
}) => (
    <div
        className={cn(
            "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
            className
        )}
        {...props}
    />
);

const AlertDialogTitle = React.forwardRef(
    ({ className, ...props }, ref) => (
        <AlertDialogPrimitive.Title
            ref={ref}
            className={cn(
                "text-lg font-semibold",
                className
            )}
            {...props}
        />
    )
);

AlertDialogTitle.displayName =
    AlertDialogPrimitive.Title.displayName;

const AlertDialogDescription = React.forwardRef(
    ({ className, ...props }, ref) => (
        <AlertDialogPrimitive.Description
            ref={ref}
            className={cn(
                "text-sm text-muted-foreground",
                className
            )}
            {...props}
        />
    )
);

AlertDialogDescription.displayName =
    AlertDialogPrimitive.Description.displayName;

const AlertDialogAction = React.forwardRef(
    ({ className, ...props }, ref) => (
        <AlertDialogPrimitive.Action
            ref={ref}
            className={cn(
                "inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                className
            )}
            {...props}
        />
    )
);

AlertDialogAction.displayName =
    AlertDialogPrimitive.Action.displayName;

const AlertDialogCancel = React.forwardRef(
    ({ className, ...props }, ref) => (
        <AlertDialogPrimitive.Cancel
            ref={ref}
            className={cn(
                "mt-2 inline-flex h-10 items-center justify-center rounded-md border bg-background px-4 py-2 text-sm font-medium hover:bg-muted sm:mt-0",
                className
            )}
            {...props}
        />
    )
);

AlertDialogCancel.displayName =
    AlertDialogPrimitive.Cancel.displayName;

export {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogPortal,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel,
};