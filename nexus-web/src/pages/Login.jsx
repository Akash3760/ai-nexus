import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import FloatingInput from "@/components/common/FloatingInput";
import PasswordInput from "@/components/common/PasswordInput";

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

    const clearEmail =
        () => {

            setFormData(
                (prev) => ({
                    ...prev,
                    email: "",
                })
            );

        };

    const handleLogin =
        async () => {

            if (
                !formData.email ||
                !formData.password
            ) {
                return;
            }

            try {

                setLoading(true);
                setError("");

                await login(
                    formData
                );

                const user =
                    await getProfile();

                setUser(user);

                const recentEmails =
                    JSON.parse(
                        localStorage.getItem(
                            "recentEmails"
                        )
                    ) || [];

                if (
                    !recentEmails.includes(
                        formData.email
                    )
                ) {

                    recentEmails.unshift(
                        formData.email
                    );

                    localStorage.setItem(
                        "recentEmails",
                        JSON.stringify(
                            recentEmails.slice(
                                0,
                                5
                            )
                        )
                    );

                }

                navigate(
                    "/dashboard"
                );

            } catch (err) {

                setError(
                    err.response?.data?.detail ||
                    "Invalid email or password."
                );

            } finally {

                setLoading(false);

            }

        };

    const handleKeyDown =
        (e) => {

            if (
                e.key === "Enter"
            ) {
                handleLogin();
            }

        };

    const isFormValid =
        formData.email.trim() &&
        formData.password.trim();

    return (
        <div>

            <h2 className="text-3xl font-bold">
                Welcome Back
            </h2>

            <p className="mt-2 text-muted-foreground">
                Sign in to access your AI workspace and
                manage your files, workflows, and intelligent tools.
            </p>

            {error && (

                <div
                    className="
                    mt-6
                    rounded-xl
                    border
                    border-destructive/20
                    bg-destructive/10
                    p-3
                    text-sm
                    text-destructive
                "
                >
                    {error}
                </div>

            )}

            <div className="mt-8 space-y-6">

                <FloatingInput
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    onClear={clearEmail}
                    onKeyDown={handleKeyDown}
                />

                <PasswordInput
                    label="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                />

            </div>

            <Button
                onClick={handleLogin}
                disabled={
                    loading ||
                    !isFormValid
                }
                className="
                mt-8
                h-14
                w-full
                rounded-xl
                text-base
            "
            >
                {loading ? (
                    <>
                        <Loader2
                            className="
                            mr-2
                            h-4
                            w-4
                            animate-spin
                        "
                        />

                        Signing In...
                    </>
                ) : (
                    "Sign In"
                )}
            </Button>

            <p className="mt-6 text-center text-sm text-muted-foreground">

                Don't have an account?

                {" "}

                <Link
                    to="/register"
                    className="
                    font-medium
                    text-cyan-500
                    hover:underline
                "
                >
                    Create Account
                </Link>

            </p>

        </div>
    );

}
