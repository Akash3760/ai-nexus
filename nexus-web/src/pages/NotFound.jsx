import { Link }
    from "react-router-dom";

import { Button }
    from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">

            <div className="w-full max-w-xl rounded-3xl border bg-background p-10 text-center shadow-lg">

                <h1 className="text-7xl font-bold">
                    404
                </h1>

                <h2 className="mt-4 text-2xl font-semibold">
                    Page Not Found
                </h2>

                <p className="mt-3 text-muted-foreground">
                    The page you are
                    looking for does not
                    exist or may have
                    been moved.
                </p>

                <div className="mt-8 flex justify-center gap-4">

                    <Button asChild>
                        <Link to="/">
                            Go Home
                        </Link>
                    </Button>

                    <Button
                        variant="outline"
                        asChild
                    >
                        <Link
                            to="/dashboard"
                        >
                            Dashboard
                        </Link>
                    </Button>

                </div>

            </div>

        </div>
    );
}