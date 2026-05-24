import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

import useAuthStore from "@/store/authStore";
import {
    login,
    getProfile,
} from "@/services/authService";

export default function Login() {
    const navigate =
        useNavigate();

    const { setUser } =
        useAuthStore();

    const [formData,
        setFormData] =
        useState({
            email: "",
            password: "",
        });

    const [loading,
        setLoading] =
        useState(false);

    const [error,
        setError] =
        useState("");

    const handleChange =
        (e) => {
            setFormData(
                (prev) => ({
                    ...prev,
                    [e.target.name]:
                        e.target.value,
                })
            );
        };

    const handleLogin =
        async () => {
            try {
                setLoading(true);
                setError("");

                // Login
                await login(
                    formData
                );

                // Get profile
                const user =
                    await getProfile();

                // Save user in Zustand
                setUser(user);

                // Redirect
                navigate(
                    "/dashboard"
                );

            } catch (err) {
                setError(
                    err.response?.data
                        ?.detail ||
                    "Login failed"
                );
            } finally {
                setLoading(false);
            }
        };

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md rounded-xl border p-6 shadow-md">

                <h1 className="mb-6 text-2xl font-bold">
                    Login
                </h1>

                {error && (
                    <p className="mb-4 text-red-500">
                        {error}
                    </p>
                )}

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={
                        formData.email
                    }
                    onChange={
                        handleChange
                    }
                    className="mb-3 w-full rounded-md border p-3"
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={
                        formData.password
                    }
                    onChange={
                        handleChange
                    }
                    className="mb-4 w-full rounded-md border p-3"
                />

                <Button
                    onClick={
                        handleLogin
                    }
                    className="w-full"
                    disabled={
                        loading
                    }
                >
                    {loading
                        ? "Logging in..."
                        : "Login"}
                </Button>
            </div>
        </div>
    );
}