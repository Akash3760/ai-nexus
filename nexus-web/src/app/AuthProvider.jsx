import { useEffect } from "react";

import useAuthStore from "@/store/authStore";
import { getProfile } from "@/services/authService";

export default function AuthProvider({
    children,
}) {
    const { setUser } =
        useAuthStore();

    useEffect(() => {
        const initAuth =
            async () => {
                const token =
                    localStorage.getItem(
                        "access"
                    );

                if (!token) return;

                try {
                    const user =
                        await getProfile();

                    setUser(user);
                } catch {
                    localStorage.removeItem(
                        "access"
                    );

                    localStorage.removeItem(
                        "refresh"
                    );
                }
            };

        initAuth();
    }, [setUser]);

    return children;
}