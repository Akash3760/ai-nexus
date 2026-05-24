import useAuthStore
    from "@/store/authStore";

export default function Dashboard() {
    const { user } =
        useAuthStore();

    return (
        <div className="rounded-2xl border bg-background p-6 shadow-sm">

            <h1 className="text-3xl font-bold">
                AI Nexus Dashboard
            </h1>

            <p className="mt-3 text-muted-foreground">
                Welcome back,
                {" "}
                <span className="font-medium text-foreground">
                    {
                        user?.username
                    }
                </span>
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

                <div className="rounded-xl border p-5">
                    <h2 className="font-semibold">
                        Profile
                    </h2>

                    <p className="mt-2 text-sm text-muted-foreground">
                        {
                            user?.email
                        }
                    </p>
                </div>

                <div className="rounded-xl border p-5">
                    <h2 className="font-semibold">
                        AI Agents
                    </h2>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Coming soon
                    </p>
                </div>

                <div className="rounded-xl border p-5">
                    <h2 className="font-semibold">
                        Workspace
                    </h2>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Coming soon
                    </p>
                </div>

            </div>
        </div>
    );
}