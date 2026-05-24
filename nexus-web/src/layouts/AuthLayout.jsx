import { Outlet }
    from "react-router-dom";

export default function
    AuthLayout() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">

            <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl border bg-background shadow-xl lg:grid-cols-2">

                {/* Left Side */}
                <div className="hidden flex-col justify-center bg-primary p-12 text-primary-foreground lg:flex">

                    <h1 className="text-5xl font-bold">
                        AI Nexus
                    </h1>

                    <p className="mt-4 text-lg opacity-90">
                        Build, manage and
                        scale intelligent
                        AI systems.
                    </p>

                </div>

                {/* Right Side */}
                <div className="flex items-center justify-center p-8">

                    <div className="w-full max-w-md">
                        <Outlet />
                    </div>

                </div>

            </div>

        </div>
    );
}