import { Loader2, Trash2, AlertTriangle } from "lucide-react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function DeleteFileDialog({
    open,
    onOpenChange,
    file,
    onConfirm,
    loading = false,
}) {
    return (
        <AlertDialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <AlertDialogContent className="sm:max-w-md">
                <AlertDialogHeader>
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                        <AlertTriangle className="h-7 w-7 text-red-600" />
                    </div>

                    <AlertDialogTitle className="text-center text-xl font-semibold">
                        Delete File
                    </AlertDialogTitle>

                    <div className="mt-3 space-y-3 text-center">
                        <AlertDialogDescription>
                            Are you sure you want to permanently delete this file?
                        </AlertDialogDescription>

                        <div className="rounded-md bg-muted px-3 py-2 font-semibold text-foreground break-all">
                            {file?.original_filename ||
                                file?.filename ||
                                file?.name ||
                                "this file"}
                        </div>

                        <div className="text-sm text-muted-foreground">
                            This action cannot be undone.
                        </div>
                    </div>
                </AlertDialogHeader>

                <AlertDialogFooter className="mt-6">
                    <AlertDialogCancel disabled={loading}>
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                        disabled={loading}
                        onClick={(e) => {
                            e.preventDefault();
                            onConfirm?.();
                        }}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete File
                            </>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}