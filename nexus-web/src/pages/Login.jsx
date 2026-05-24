import { Button } from "@/components/ui/button";

import useAuthStore from "@/store/authStore";

export default function Login() {
    const { setUser } =
        useAuthStore();

    const handleLogin = () => {
        setUser({
            name: "Akash",
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center">
            <Button onClick={handleLogin}>
                Fake Login
            </Button>
        </div>
    );
}